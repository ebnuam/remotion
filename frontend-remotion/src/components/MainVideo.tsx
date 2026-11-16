import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CharacterActionScene } from "../compositions/CharacterActionScene";
import { MacroObjectScene } from "../compositions/MacroObjectScene";
import { SplitComparisonScene } from "../compositions/SplitComparisonScene";
import { VisualMetaphorScene } from "../compositions/VisualMetaphorScene";
import { KineticHeadline } from "../motion/KineticHeadline";
import { KineticSubtitle } from "../motion/KineticSubtitle";
import { theme } from "../theme";
import { RenderProps } from "../types";
import { StagedScene } from "./StagedScene";

export const MainVideo: React.FC<RenderProps> = ({
  title,
  theme_color,
  scenes,
  audio_file,
  channel_name,
  channel_id,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const currentTimeSeconds = frame / fps;

  // Determine current active scene based on start_seconds & end_seconds safely
  let activeScene = scenes[0];
  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const start = sc.start_seconds ?? 0;
    const end = sc.end_seconds ?? 0;
    if (currentTimeSeconds >= start && currentTimeSeconds <= end) {
      activeScene = sc;
      break;
    }
    if (i === scenes.length - 1 && currentTimeSeconds > end) {
      activeScene = sc;
    }
  }

  const startSec = activeScene.start_seconds ?? 0;
  const endSec = activeScene.end_seconds ?? (startSec + 4);
  const activeSceneStartFrame = Math.max(0, Math.floor(startSec * fps));
  const activeSceneEndFrame = Math.max(activeSceneStartFrame + 1, Math.floor(endSec * fps));
  const sceneDurationFrames = Math.max(1, activeSceneEndFrame - activeSceneStartFrame);
  const sceneLocalFrame = Math.max(0, frame - activeSceneStartFrame);

  // Dynamic cinematic camera motion per scene beat
  const cameraMotion = (activeScene.camera_motion || activeScene.camera_shot || "zoom_punch").toLowerCase();
  const cameraAngle = (activeScene.camera_angle || "eye_level").toLowerCase();
  const sceneIdx = activeScene.index || 1;

  let zoomStart = 1.02;
  let zoomEnd = 1.12;
  let cameraRotate = 0;
  let perspectiveTiltX = 0;
  let perspectiveTiltY = 0;

  if (cameraMotion.includes("pull")) {
    zoomStart = 1.18;
    zoomEnd = 1.03;
  } else if (cameraMotion.includes("pan") || sceneIdx % 3 === 0) {
    zoomStart = 1.06;
    zoomEnd = 1.10;
    const panDir = cameraMotion.includes("left") ? -1 : 1;
    cameraRotate = interpolate(sceneLocalFrame, [0, sceneDurationFrames], [-1.0 * panDir, 1.0 * panDir], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (cameraMotion.includes("shake")) {
    zoomStart = 1.04;
    zoomEnd = 1.12;
  }

  // Perspective camera angle handling
  if (cameraAngle.includes("low")) {
    perspectiveTiltX = 3.5;
  } else if (cameraAngle.includes("high")) {
    perspectiveTiltX = -3.5;
  } else if (cameraAngle.includes("isometric")) {
    perspectiveTiltY = 3.0;
  }

  const cameraZoom = interpolate(sceneLocalFrame, [0, sceneDurationFrames], [zoomStart, zoomEnd], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene cut entrance impact punch
  const sceneCutPunch = interpolate(sceneLocalFrame, [0, 5, 12], [1.03, 0.99, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalScale = cameraZoom * sceneCutPunch;

  const progressRatio = Math.min(1, Math.max(0, frame / durationInFrames));

  // Determine headline line 1 and line 2
  let headLine1 = activeScene.headline_line1 || "";
  let headLine2 = activeScene.headline_line2 || "";

  if (!headLine1 && !headLine2) {
    if (activeScene.index === 1) {
      const words = title.split(" ");
      const mid = Math.ceil(words.length / 2);
      headLine1 = words.slice(0, mid).join(" ").toUpperCase();
      headLine2 = words.slice(mid).join(" ").toUpperCase();
    } else {
      headLine1 = (activeScene.visual_cue || activeScene.visual || "SCENE").toUpperCase();
      headLine2 = "";
    }
  }

  const tagText =
    activeScene.tag ||
    `${(channel_name || "OTAK RECEH").toUpperCase()} · SCENE #${activeScene.index}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bgDark,
        overflow: "hidden",
        fontFamily: theme.fonts.body,
        perspective: 1200,
        transform: `scale(${finalScale}) rotate(${cameraRotate}deg) rotateX(${perspectiveTiltX}deg) rotateY(${perspectiveTiltY}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* 1. Dynamic Storyboard-Driven Scene Composition Selection */}
      {(() => {
        const hasCustomAsset = Boolean(
          (activeScene.environment_asset && activeScene.environment_asset.trim()) ||
          (activeScene.actor_asset && activeScene.actor_asset.trim())
        );

        // If custom user-uploaded asset is provided, use StagedScene
        if (hasCustomAsset) {
          return (
            <StagedScene
              environmentAsset={activeScene.environment_asset}
              actorAsset={activeScene.actor_asset}
              visualCue={activeScene.visual_cue || activeScene.visual}
              objects={activeScene.objects || []}
              text={activeScene.text}
              sceneIndex={activeScene.index}
              channelId={channel_id || "otak-receh"}
              themeColor={theme_color || "#FF7A00"}
              sceneLocalFrame={sceneLocalFrame}
              sceneDurationFrames={sceneDurationFrames}
            />
          );
        }

        const comp = (activeScene.composition || "").toLowerCase();
        const shot = (activeScene.shot_type || activeScene.camera_shot || "").toLowerCase();
        const propsList = activeScene.props && activeScene.props.length > 0 ? activeScene.props : activeScene.objects || [];

        // Primary: Match by explicit storyboard composition
        if (comp === "macro_inspection" || comp === "macro" || shot === "macro") {
          return (
            <MacroObjectScene
              headlineLine1={headLine1}
              headlineLine2={headLine2}
              visualIntent={activeScene.visual_intent}
              props={propsList}
              objects={activeScene.objects || []}
              text={activeScene.text}
              cameraMotion={activeScene.camera_motion}
              sceneLocalFrame={sceneLocalFrame}
              sceneDurationFrames={sceneDurationFrames}
              themeColor={theme_color || "#FF7A00"}
            />
          );
        }

        if (comp === "visual_metaphor" || comp === "metaphor") {
          return (
            <VisualMetaphorScene
              headlineLine1={headLine1}
              headlineLine2={headLine2}
              visualIntent={activeScene.visual_intent}
              props={propsList}
              objects={activeScene.objects || []}
              text={activeScene.text}
              cameraMotion={activeScene.camera_motion}
              sceneLocalFrame={sceneLocalFrame}
              sceneDurationFrames={sceneDurationFrames}
              themeColor={theme_color || "#FF7A00"}
            />
          );
        }

        if (comp === "split_comparison" || comp === "split" || shot === "split") {
          return (
            <SplitComparisonScene
              headlineLine1={headLine1}
              headlineLine2={headLine2}
              visualIntent={activeScene.visual_intent}
              props={propsList}
              objects={activeScene.objects || []}
              text={activeScene.text}
              sceneLocalFrame={sceneLocalFrame}
              sceneDurationFrames={sceneDurationFrames}
              themeColor={theme_color || "#FF7A00"}
            />
          );
        }

        if (comp === "character_action" || comp === "character" || channel_id === "otak-receh") {
          return (
            <CharacterActionScene
              actionSequence={activeScene.action_sequence}
              characterAction={activeScene.character_action || "sitting_bored"}
              expression={activeScene.expression || "bored"}
              shotType={shot || "medium"}
              cameraMotion={activeScene.camera_motion || "zoom_punch"}
              environment={activeScene.environment || "bedroom_night"}
              props={propsList}
              headlineLine1={headLine1}
              headlineLine2={headLine2}
              visualIntent={activeScene.visual_intent}
              sceneLocalFrame={sceneLocalFrame}
              sceneDurationFrames={sceneDurationFrames}
              themeColor={theme_color || "#FF7A00"}
            />
          );
        }

        // Secondary fallback for other channels (Santri AI / Oddly Known)
        return (
          <StagedScene
            environmentAsset={activeScene.environment_asset}
            actorAsset={activeScene.actor_asset}
            visualCue={activeScene.visual_cue || activeScene.visual}
            objects={activeScene.objects || []}
            text={activeScene.text}
            sceneIndex={activeScene.index}
            channelId={channel_id || "otak-receh"}
            themeColor={theme_color || "#FF7A00"}
            sceneLocalFrame={sceneLocalFrame}
            sceneDurationFrames={sceneDurationFrames}
          />
        );
      })()}

      {/* 2. Top Kinetic Headline with Noir Case Tag & Red Recording Dot */}
      <KineticHeadline
        tagText={tagText}
        line1={headLine1}
        line2={headLine2}
        accentColor={theme_color || theme.colors.goldBright}
        sceneLocalFrame={sceneLocalFrame}
      />

      {/* 3. Kinetic Subtitles with Word-by-Word Karaoke Highlighting */}
      <KineticSubtitle
        text={activeScene.text}
        startFrame={activeSceneStartFrame}
        durationFrames={sceneDurationFrames}
        accentColor={theme_color || theme.colors.goldBright}
      />

      {/* 5. Sleek Bottom Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 80,
          right: 80,
          height: 8,
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          overflow: "hidden",
          zIndex: 40,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressRatio * 100}%`,
            backgroundColor: theme_color || theme.colors.goldBright,
            borderRadius: 8,
            boxShadow: `0 0 16px ${theme_color || theme.colors.goldBright}`,
          }}
        />
      </div>

      {/* 6. Audio Narration (Edge TTS) */}
      {audio_file ? <Audio src={staticFile(audio_file)} /> : null}
    </AbsoluteFill>
  );
};
