import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { interpretSceneAction } from "../animation/ActionInterpreter";
import { BedroomEnvironment } from "../cartoon/BedroomEnvironment";
import { CartoonCharacter } from "../cartoon/CartoonCharacter";
import { VirtualCamera } from "../cartoon/VirtualCamera";
import { ActionBeat } from "../types";

interface CharacterActionSceneProps {
  actionSequence?: ActionBeat[];
  characterAction?: string;
  expression?: string;
  shotType?: string;
  cameraMotion?: string;
  environment?: string;
  props?: string[];
  headlineLine1?: string;
  headlineLine2?: string;
  visualIntent?: string;
  sceneLocalFrame: number;
  sceneDurationFrames: number;
  themeColor: string;
}

export const CharacterActionScene: React.FC<CharacterActionSceneProps> = ({
  actionSequence,
  characterAction = "sitting_bored",
  expression = "bored",
  shotType = "medium",
  cameraMotion = "zoom_punch",
  environment = "bedroom_night",
  props = [],
  headlineLine1 = "",
  headlineLine2 = "",
  visualIntent = "",
  sceneLocalFrame,
  sceneDurationFrames,
  themeColor,
}) => {
  const { fps } = useVideoConfig();

  // 1. Resolve Dynamic Kinematics & Cause-and-Effect states through Action Interpreter
  const anim = interpretSceneAction({
    actionSequence,
    defaultAction: characterAction,
    defaultExpression: expression,
    defaultShotType: shotType,
    defaultCameraMotion: cameraMotion,
    environment,
    props,
    sceneLocalFrame,
    sceneDurationFrames,
    fps,
  });

  const showForegroundDesk = anim.pose !== "lying_bed" && anim.cameraShot !== "REACTION_FACE";

  // 2. Environment Theme Variation
  const envClean = (environment + " " + visualIntent).toLowerCase();
  const isOffice = envClean.includes("office") || envClean.includes("kantor");
  const isCafe = envClean.includes("cafe") || envClean.includes("kafe") || envClean.includes("kedai");

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0F172A" }}>
      <VirtualCamera shotType={anim.cameraShot} customTransform={anim.cameraTransform}>
        {/* Layer 1: Multi-plane Environment Background */}
        {isOffice ? (
          /* Office Background */
          <svg
            viewBox="0 0 1080 1920"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <rect x="0" y="0" width="1080" height="1350" fill="#1E293B" />
            {/* Office Blinds */}
            {[...Array(16)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 80}
                x2="1080"
                y2={i * 80}
                stroke="#334155"
                strokeWidth="3"
              />
            ))}
            {/* Whiteboard / Bulletin Board */}
            <rect x="180" y="240" width="720" height="420" rx="16" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="8" />
            <text x="540" y="320" textAnchor="middle" fill="#0F172A" fontSize="36" fontWeight="900">
              OFFICE DEADLINE BOARD
            </text>
            <line x1="240" y1="360" x2="840" y2="360" stroke="#CBD5E1" strokeWidth="4" />
          </svg>
        ) : isCafe ? (
          /* Cafe Cozy Background */
          <svg
            viewBox="0 0 1080 1920"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <rect x="0" y="0" width="1080" height="1350" fill="#271B14" />
            {/* Brick Wall Texture */}
            {[...Array(20)].map((_, r) => (
              <line
                key={r}
                x1="0"
                y1={r * 65}
                x2="1080"
                y2={r * 65}
                stroke="#3D2B1F"
                strokeWidth="4"
              />
            ))}
            {/* Cafe Menu Chalkboard */}
            <rect x="220" y="220" width="640" height="440" rx="12" fill="#18181B" stroke="#713F12" strokeWidth="12" />
            <text x="540" y="310" textAnchor="middle" fill="#FACC15" fontSize="42" fontWeight="900">
              ESPRESSO CAFE
            </text>
          </svg>
        ) : (
          /* Bedroom Night Environment (Default for Otak Receh) */
          <BedroomEnvironment
            layer="background"
            isAlarming={anim.laptopAlert || anim.clockRinging}
            clockRinging={anim.clockRinging}
            clockHour={11}
            clockMinute={58}
          />
        )}

        {/* Layer 2: Midground Expressive Character with Continuous Kinematics */}
        <div
          style={{
            position: "absolute",
            left: anim.characterX,
            top: anim.characterY,
            transform: `scale(${anim.characterScale})`,
            transformOrigin: "bottom center",
            zIndex: 10,
          }}
        >
          <CartoonCharacter
            pose={anim.pose}
            expression={anim.expression}
            armProgress={anim.armProgress}
            headTiltAngle={anim.headTilt}
            gazeDirection={anim.gaze}
            bodyLeanAngle={anim.bodyLean}
          />
        </div>

        {/* Layer 3: Foreground Interactive Desk, Glowing Laptop, Coffee Mug */}
        {showForegroundDesk && (
          <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
            <BedroomEnvironment
              layer="foreground"
              isAlarming={anim.laptopAlert || anim.clockRinging}
              phoneOnDesk={anim.phoneOnDesk}
              phoneVibrating={anim.phoneVibrating}
              laptopAlert={anim.laptopAlert}
            />
          </div>
        )}
      </VirtualCamera>
    </AbsoluteFill>
  );
};
