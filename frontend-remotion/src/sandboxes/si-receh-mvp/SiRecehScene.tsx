/**
 * SI RECEH - Calibration & Test Scene
 * Renders Si Receh in vertical 9:16 framing (540x960 or 1080x1920)
 * with responsive scaling, neutral background, and automated expression/gesture demo.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SiRecehCharacter } from "./SiRecehCharacter";
import { Expression, Gesture, MASTER_CANVAS, PIVOTS } from "./types";

export interface SiRecehSceneProps {
  debugMode?: boolean;
  forcedExpression?: Expression;
  forcedGesture?: Gesture;
  isSpeaking?: boolean;
}

export const SiRecehScene: React.FC<SiRecehSceneProps> = ({
  debugMode = true,
  forcedExpression,
  forcedGesture,
  isSpeaking,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Dynamic state sequencing across 300 frames (10s)
  // 0 - 59: neutral / idle
  // 60 - 119: confused / idle
  // 120 - 179: panic / pointing
  // 180 - 239: cynical / facepalm
  // 240 - 299: laughing / idle
  let expression: Expression = "neutral";
  let gesture: Gesture = "idle";
  let speaking = false;

  if (forcedExpression) {
    expression = forcedExpression;
  } else {
    if (frame >= 60 && frame < 120) {
      expression = "confused";
      gesture = "idle";
    } else if (frame >= 120 && frame < 180) {
      expression = "panic";
      gesture = "pointing";
      speaking = true;
    } else if (frame >= 180 && frame < 240) {
      expression = "cynical";
      gesture = "facepalm";
    } else if (frame >= 240) {
      expression = "laughing";
      gesture = "idle";
    }
  }

  if (forcedGesture) gesture = forcedGesture;
  if (isSpeaking !== undefined) speaking = isSpeaking;

  // Responsive scale: Character standing height is ~1300px from feet to top of hair.
  // We want the character to fill ~72% of the frame height comfortably.
  const desiredCharacterHeight = height * 0.72;
  const characterPixelSpan = 1300;
  const scale = desiredCharacterHeight / characterPixelSpan;

  // Floor baseline position at 86% of frame height
  const floorY = height * 0.86;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F4F4F6", // Clean light neutral studio background
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Studio Floor / Ground Shadow Horizon */}
      <div
        style={{
          position: "absolute",
          top: floorY,
          left: 0,
          width: "100%",
          bottom: 0,
          backgroundColor: "#E4E4E8",
          borderTop: "2px solid #D2D2D8",
        }}
      />

      {/* Ground Contact Shadow */}
      <div
        style={{
          position: "absolute",
          top: floorY - 14 * scale,
          left: width / 2 - 140 * scale,
          width: 280 * scale,
          height: 36 * scale,
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.12)",
        }}
      />

      {/* Character Wrapper anchored at Feet Baseline */}
      <div
        style={{
          position: "absolute",
          left: width / 2,
          top: floorY,
          width: MASTER_CANVAS.width,
          height: MASTER_CANVAS.height,
          transformOrigin: PIVOTS.root.css, // "50% 94.4%"
          transform: `translate(-50%, -94.4%) scale(${scale})`,
        }}
      >
        <SiRecehCharacter
          expression={expression}
          gesture={gesture}
          isSpeaking={speaking}
          scale={1}
          debugMode={debugMode}
          useInlinePlaceholders={true}
        />
      </div>

      {/* Live State HUD */}
      {debugMode && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            backgroundColor: "rgba(22, 24, 30, 0.88)",
            color: "#FFF",
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: width > 600 ? 17 : 12,
            lineHeight: 1.45,
            borderLeft: "4px solid #E5A93B",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ fontWeight: "bold", color: "#E5A93B", marginBottom: 3 }}>
            SI RECEH MVP SCAFFOLD
          </div>
          <div>
            Frame: <b>{frame}</b> / 300
          </div>
          <div>
            Expression: <span style={{ color: "#74C0FC", fontWeight: "bold" }}>{expression}</span>
          </div>
          <div>
            Gesture: <span style={{ color: "#69DB7C", fontWeight: "bold" }}>{gesture}</span>
          </div>
          <div>Speaking: {speaking ? "true" : "false"}</div>
          <div>
            Resolution: {width}x{height} | Scale: {scale.toFixed(3)}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
