import { interpolate, spring } from "remotion";
import { CameraShotType, CharacterExpression, CharacterPose } from "../cartoon/types";
import { ActionBeat } from "../types";

export interface ResolvedSceneAnimationState {
  // Active beat information
  activeBeatIndex: number;
  beatProgress: number; // 0.0 to 1.0 within active beat
  actionName: string;
  target: string;
  description: string;

  // Character Kinematics
  pose: CharacterPose;
  expression: CharacterExpression;
  armProgress: number; // 0.0 to 1.0 continuous arm reach/lift
  headTilt: number;
  gaze: { x: number; y: number };
  bodyLean: number;
  characterScale: number;
  characterX: number;
  characterY: number;

  // Reactive Prop States (Cause & Effect)
  phoneOnDesk: boolean;
  phoneVibrating: boolean;
  mugLifted: boolean;
  laptopAlert: boolean;
  clockRinging: boolean;

  // Dynamic Camera Transform
  cameraShot: CameraShotType;
  cameraTransform: {
    scale: number;
    x: number;
    y: number;
    shakeIntensity: number;
  };
}

interface ActionInterpreterParams {
  actionSequence?: ActionBeat[];
  defaultAction?: string;
  defaultExpression?: string;
  defaultShotType?: string;
  defaultCameraMotion?: string;
  environment?: string;
  props?: string[];
  sceneLocalFrame: number;
  sceneDurationFrames: number;
  fps: number;
}

/**
 * ActionInterpreter evaluates structured action beats from the AI Director
 * and resolves smooth, continuous kinematics and cause-and-effect prop reactions.
 */
export function interpretSceneAction({
  actionSequence,
  defaultAction = "sitting_bored",
  defaultExpression = "bored",
  defaultShotType = "medium",
  defaultCameraMotion = "zoom_punch",
  environment = "bedroom_night",
  props = [],
  sceneLocalFrame,
  sceneDurationFrames,
  fps,
}: ActionInterpreterParams): ResolvedSceneAnimationState {
  const safeDuration = Number.isFinite(sceneDurationFrames) && sceneDurationFrames > 0
    ? sceneDurationFrames
    : 1;
  const safeFrame = Number.isFinite(sceneLocalFrame) ? sceneLocalFrame : 0;
  const sceneProgress = Math.min(1, Math.max(0, safeFrame / safeDuration));

  // 1. Build or normalize action sequence
  let beats: ActionBeat[] = [];
  if (Array.isArray(actionSequence) && actionSequence.length > 0) {
    const rawBeats = [...actionSequence];
    const n = rawBeats.length;
    beats = rawBeats
      .map((b, idx) => {
        // Validate start_progress: must be a finite number between 0 and 1
        let start = Number.isFinite(b?.start_progress)
          ? Number(b.start_progress)
          : idx / n;
        start = Math.min(1, Math.max(0, start));

        // Validate duration_progress: must be finite and positive, default to 1 / n
        let dur = Number.isFinite(b?.duration_progress) && Number(b.duration_progress) > 0
          ? Number(b.duration_progress)
          : 1.0 / n;
        dur = Math.min(1, Math.max(0.01, dur));

        return {
          ...b,
          beat_index: Number.isFinite(b?.beat_index) ? Number(b.beat_index) : idx + 1,
          start_progress: start,
          duration_progress: dur,
          target: b?.target || "character",
          action: b?.action || defaultAction,
          description: b?.description || "",
        };
      })
      .sort((a, b) => a.start_progress - b.start_progress);
  } else {
    // Fallback: create single continuous beat from top-level storyboard fields
    beats = [
      {
        beat_index: 1,
        start_progress: 0.0,
        duration_progress: 1.0,
        target: "character",
        action: defaultAction,
        pose: defaultAction,
        expression: defaultExpression,
        camera_movement: defaultCameraMotion,
        description: "Default continuous storyboard action",
      },
    ];
  }

  // 2. Locate active beat
  let activeIndex = 0;
  for (let i = 0; i < beats.length; i++) {
    if (sceneProgress >= beats[i].start_progress) {
      activeIndex = i;
    }
  }

  const currentBeat = beats[activeIndex];

  // Calculate local progress inside active beat [0.0 to 1.0]
  const currentStart = Number.isFinite(currentBeat.start_progress)
    ? Math.min(1, Math.max(0, currentBeat.start_progress))
    : 0;
  const beatDur = Number.isFinite(currentBeat.duration_progress) && currentBeat.duration_progress > 0
    ? Math.max(0.01, Math.min(1, currentBeat.duration_progress))
    : Math.max(0.01, 1.0 / beats.length);

  const rawBeatProgress = (sceneProgress - currentStart) / beatDur;
  const beatProgress = Number.isFinite(rawBeatProgress)
    ? Math.min(1, Math.max(0, rawBeatProgress))
    : 0;

  // 3. Smooth spring / ease for transitions between beats
  const localFrameInBeat = safeFrame - currentStart * safeDuration;
  const safeLocalFrame = Number.isFinite(localFrameInBeat) ? Math.max(0, localFrameInBeat) : 0;
  const safeFps = Number.isFinite(fps) && fps > 0 ? fps : 30;
  const transitionSpring = spring({
    frame: safeLocalFrame,
    fps: safeFps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });
  const safeSpring = Number.isFinite(transitionSpring) ? transitionSpring : 1.0;

  // 4. Resolve Character Pose
  let pose: CharacterPose = "sitting_bored";
  const poseCandidate = (currentBeat.pose || currentBeat.action || defaultAction).toLowerCase();

  if (poseCandidate.includes("startle") || poseCandidate.includes("kaget") || poseCandidate.includes("hands_head")) {
    pose = "startled_hands";
  } else if (poseCandidate.includes("reach") || poseCandidate.includes("mug") || poseCandidate.includes("coffee") || poseCandidate.includes("grab")) {
    pose = "reach_prop";
  } else if (poseCandidate.includes("phone") || poseCandidate.includes("scroll") || poseCandidate.includes("medsos")) {
    pose = "sitting_phone";
  } else if (poseCandidate.includes("bed") || poseCandidate.includes("rebahan") || poseCandidate.includes("lying")) {
    pose = "lying_bed";
  } else if (poseCandidate.includes("typing") || poseCandidate.includes("panic") || poseCandidate.includes("rush")) {
    pose = "sitting_typing_panic";
  } else {
    pose = "sitting_bored";
  }

  // 5. Resolve Facial Expression
  let exp: CharacterExpression = "bored";
  const expCandidate = (currentBeat.expression || defaultExpression).toLowerCase();
  if (expCandidate.includes("panic") || expCandidate.includes("panik")) {
    exp = "panic";
  } else if (expCandidate.includes("shock") || expCandidate.includes("kaget") || expCandidate.includes("terkejut")) {
    exp = "shocked";
  } else if (expCandidate.includes("alert") || expCandidate.includes("curious") || expCandidate.includes("menyadari")) {
    exp = "alert";
  } else if (expCandidate.includes("relax") || expCandidate.includes("santai") || expCandidate.includes("smug")) {
    exp = "relaxed";
  } else {
    exp = "bored";
  }

  // 6. Arm articulation progress (smooth interpolation for reach/gestures)
  // For reach_prop: smoothly extend arm forward
  let armProgress = beatProgress;
  if (pose === "reach_prop") {
    armProgress = interpolate(beatProgress, [0, 0.4, 0.8, 1], [0, 1, 1, 0.9], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (pose === "startled_hands") {
    armProgress = interpolate(safeSpring, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // 7. Head tilt & eye gaze direction
  let headTilt = 0;
  let gaze = { x: 0, y: 0 };
  let bodyLean = 0;

  if (pose === "sitting_phone") {
    // Relaxed, head tilted down toward phone
    headTilt = 16 + Math.sin(safeFrame * 0.1) * 1.5;
    gaze = { x: 1, y: 7 };
    bodyLean = 1.5;
  } else if (pose === "reach_prop") {
    // Looking at the prop being reached (e.g. coffee mug or clock)
    headTilt = 8 + interpolate(beatProgress, [0, 0.5], [0, -12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    gaze = { x: 5, y: -4 }; // looking right and slightly up
    bodyLean = 3.0; // leaning forward
  } else if (pose === "startled_hands") {
    // Straight forward eye gaze, wide-eyed shock, body jerk back
    headTilt = Math.sin(safeFrame * 1.2) * 4;
    gaze = { x: 0, y: 1 };
    bodyLean = -2.5; // pulled back in startled reflex
  } else if (pose === "sitting_typing_panic") {
    // Frantic head bobbing, hunched over laptop
    headTilt = Math.sin(safeFrame * 1.8) * 6;
    gaze = { x: Math.sin(safeFrame * 0.9) * 3, y: 3 };
    bodyLean = 4.0;
  } else {
    // sitting_bored
    headTilt = 14 + Math.sin(safeFrame * 0.08) * 2;
    gaze = { x: -4, y: 5 };
    bodyLean = -2.5;
  }

  // 8. Reactive Prop States (Cause & Effect)
  const propInteraction = (currentBeat.prop_interaction || "").toLowerCase();
  const phoneOnDesk = pose !== "sitting_phone" && pose !== "lying_bed";
  const phoneVibrating = propInteraction.includes("buzz") || propInteraction.includes("vibrat") || propInteraction.includes("notif");
  const mugLifted = pose === "reach_prop" && (propInteraction.includes("mug") || propInteraction.includes("coffee") || currentBeat.action.includes("sip"));
  const laptopAlert = propInteraction.includes("laptop") || propInteraction.includes("alarm") || exp === "panic";
  const clockRinging = propInteraction.includes("clock") || propInteraction.includes("alarm") || exp === "panic" || exp === "shocked";

  // 9. Camera framing & dynamic response
  let baseScale = 1.25;
  let baseX = 80;
  let baseY = -260;
  let baseShake = 0;
  let cameraShot: CameraShotType = "MEDIUM_DESK";

  const camMove = (currentBeat.camera_movement || defaultCameraMotion).toLowerCase();

  if (pose === "lying_bed") {
    cameraShot = "WIDE_ROOM";
    baseScale = 1.05;
    baseX = 0;
    baseY = 0;
  } else if (exp === "shocked" || pose === "startled_hands") {
    cameraShot = "REACTION_FACE";
    baseScale = 1.85;
    baseX = 0;
    baseY = -300;
    baseShake = 8;
  } else if (pose === "reach_prop" || camMove.includes("pan_props")) {
    cameraShot = "MEDIUM_DESK";
    // Pan slightly to focus on desk interaction
    baseScale = 1.4;
    baseX = 120;
    baseY = -280;
  } else if (exp === "panic" || pose === "sitting_typing_panic") {
    cameraShot = "MEDIUM_PANIC";
    baseScale = 1.35;
    baseX = 80;
    baseY = -270;
    baseShake = 10;
  }

  // Camera motion continuous interpolation
  if (camMove.includes("zoom") || camMove.includes("punch")) {
    baseScale += interpolate(beatProgress, [0, 1], [0, 0.08], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (camMove.includes("pull")) {
    baseScale -= interpolate(beatProgress, [0, 1], [0, 0.08], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (camMove.includes("drift")) {
    baseX += interpolate(beatProgress, [0, 1], [-15, 15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // 10. Character Root Placement
  let charX = 180;
  let charY = 970;
  let charScale = 1.0;

  if (pose === "lying_bed") {
    charX = 560;
    charY = 1110;
    charScale = 0.95;
  } else if (cameraShot === "REACTION_FACE") {
    charX = 270;
    charY = 1180;
    charScale = 1.15;
  } else if (pose === "sitting_phone") {
    charX = 175;
    charY = 960;
    charScale = 1.02;
  } else if (pose === "reach_prop") {
    charX = 185;
    charY = 965;
    charScale = 1.03;
  } else if (pose === "startled_hands") {
    charX = 200;
    charY = 960;
    charScale = 1.05;
  }

  // Sanitize all output numeric transforms to guarantee no NaN or Infinity
  const safeCharScale = Number.isFinite(charScale) ? charScale : 1.0;
  const safeCharX = Number.isFinite(charX) ? charX : 180;
  const safeCharY = Number.isFinite(charY) ? charY : 970;
  const safeArmProgress = Number.isFinite(armProgress) ? Math.min(1, Math.max(0, armProgress)) : 0;
  const safeHeadTilt = Number.isFinite(headTilt) ? headTilt : 0;
  const safeBodyLean = Number.isFinite(bodyLean) ? bodyLean : 0;
  const safeGazeX = Number.isFinite(gaze?.x) ? gaze.x : 0;
  const safeGazeY = Number.isFinite(gaze?.y) ? gaze.y : 0;
  const safeCameraScale = Number.isFinite(baseScale) ? baseScale : 1.25;
  const safeCameraX = Number.isFinite(baseX) ? baseX : 80;
  const safeCameraY = Number.isFinite(baseY) ? baseY : -260;
  const safeCameraShake = Number.isFinite(baseShake) ? Math.max(0, baseShake) : 0;

  return {
    activeBeatIndex: activeIndex + 1,
    beatProgress,
    actionName: currentBeat.action,
    target: currentBeat.target || "character",
    description: currentBeat.description || "",
    pose,
    expression: exp,
    armProgress: safeArmProgress,
    headTilt: safeHeadTilt,
    gaze: { x: safeGazeX, y: safeGazeY },
    bodyLean: safeBodyLean,
    characterScale: safeCharScale,
    characterX: safeCharX,
    characterY: safeCharY,
    phoneOnDesk,
    phoneVibrating,
    mugLifted,
    laptopAlert,
    clockRinging,
    cameraShot,
    cameraTransform: {
      scale: safeCameraScale,
      x: safeCameraX,
      y: safeCameraY,
      shakeIntensity: safeCameraShake,
    },
  };
}
