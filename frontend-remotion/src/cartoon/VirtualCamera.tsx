import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraShotType } from "./types";

interface VirtualCameraProps {
  shotType: CameraShotType;
  customTransform?: {
    scale?: number;
    x?: number;
    y?: number;
    shakeIntensity?: number;
  };
  children: React.ReactNode;
}

interface CameraTransform {
  scale: number;
  x: number;
  y: number;
  shakeIntensity: number;
}

export const SHOT_PRESETS: Record<CameraShotType, CameraTransform> = {
  WIDE_ROOM: {
    scale: 1.05,
    x: 0,
    y: 0,
    shakeIntensity: 0,
  },
  MEDIUM_DESK: {
    scale: 1.25,
    x: 80,
    y: -260,
    shakeIntensity: 0,
  },
  CLOSEUP_PHONE: {
    scale: 1.45,
    x: 90,
    y: -340,
    shakeIntensity: 0,
  },
  CLOSEUP_CLOCK: {
    scale: 1.95,
    x: -360,
    y: 390,
    shakeIntensity: 0,
  },
  REACTION_FACE: {
    scale: 1.85,
    x: 0,
    y: -300,
    shakeIntensity: 8,
  },
  MEDIUM_PANIC: {
    scale: 1.3,
    x: 80,
    y: -270,
    shakeIntensity: 12,
  },
};

export const VirtualCamera: React.FC<VirtualCameraProps> = ({
  shotType,
  customTransform,
  children,
}) => {
  const frame = useCurrentFrame();

  const preset = SHOT_PRESETS[shotType] || SHOT_PRESETS.WIDE_ROOM;
  const scale = customTransform?.scale ?? preset.scale;
  const x = customTransform?.x ?? preset.x;
  const y = customTransform?.y ?? preset.y;
  const shakeIntensity = customTransform?.shakeIntensity ?? preset.shakeIntensity;

  // High-frequency comic camera shake during panic / shock
  const shakeX =
    shakeIntensity > 0
      ? Math.sin(frame * 2.7) * shakeIntensity
      : 0;
  const shakeY =
    shakeIntensity > 0
      ? Math.cos(frame * 3.1) * (shakeIntensity * 0.8)
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: "#0F172A",
      }}
    >
      <div
        style={{
          width: 1080,
          height: 1920,
          position: "absolute",
          transformOrigin: "540px 960px",
          transform: `scale(${scale}) translate(${x + shakeX}px, ${y + shakeY}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
