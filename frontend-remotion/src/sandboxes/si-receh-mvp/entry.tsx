/**
 * Isolated Remotion Entry Point for Si Receh MVP
 */
import React from "react";
import { Composition, registerRoot } from "remotion";
import { SiRecehScene } from "./SiRecehScene";

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. Local Testing Resolution (540 x 960 @ 30 FPS) */}
      <Composition
        id="SiRecehMVP"
        component={SiRecehScene}
        durationInFrames={300}
        fps={30}
        width={540}
        height={960}
        defaultProps={{
          debugMode: true,
        }}
      />

      {/* 2. Full HD Production Resolution (1080 x 1920 @ 30 FPS) */}
      <Composition
        id="SiRecehMVP-1080p"
        component={SiRecehScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          debugMode: false,
        }}
      />
    </>
  );
};

registerRoot(Root);
