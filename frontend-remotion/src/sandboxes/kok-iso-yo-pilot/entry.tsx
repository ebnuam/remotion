/**
 * Isolated Remotion Entry Point for Kok Iso Yo? Pilot 01
 */
import React from "react";
import { Composition, registerRoot } from "remotion";
import { KokIsoYoScene } from "./KokIsoYoScene";
import { PILOT_CONFIG } from "./constants";

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. Target Pilot Composition (540 x 960 @ 30 FPS, 240 frames = 8 seconds) */}
      <Composition
        id="KokIsoYoPilot01"
        component={KokIsoYoScene}
        durationInFrames={PILOT_CONFIG.durationInFrames}
        fps={PILOT_CONFIG.fps}
        width={PILOT_CONFIG.width}
        height={PILOT_CONFIG.height}
      />

      {/* 2. Full HD Production Composition (1080 x 1920 @ 30 FPS) */}
      <Composition
        id="KokIsoYoPilot01-1080p"
        component={KokIsoYoScene}
        durationInFrames={PILOT_CONFIG.durationInFrames}
        fps={PILOT_CONFIG.fps}
        width={PILOT_CONFIG.productionWidth}
        height={PILOT_CONFIG.productionHeight}
      />
    </>
  );
};

registerRoot(Root);
