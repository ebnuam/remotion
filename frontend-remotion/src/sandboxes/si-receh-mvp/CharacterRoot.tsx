/**
 * SI RECEH - CharacterRoot Component
 * Container maintaining exact 2:3 aspect ratio (1024 x 1536) for the character rig,
 * handling root pivot transforms, squash & stretch, and debug guides.
 */
import React from "react";
import { DebugOverlay } from "./Placeholders";
import { MASTER_CANVAS, PIVOTS } from "./types";

export interface CharacterRootProps {
  scale?: number;
  position?: [number, number]; // [offsetX, offsetY] in pixels
  debugMode?: boolean;
  children: React.ReactNode;
}

export const CharacterRoot: React.FC<CharacterRootProps> = ({
  scale = 1,
  position = [0, 0],
  debugMode = false,
  children,
}) => {
  const [posX, posY] = position;

  return (
    <div
      style={{
        position: "relative",
        width: MASTER_CANVAS.width,
        height: MASTER_CANVAS.height,
        transformOrigin: PIVOTS.root.css,
        transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
        pointerEvents: "none",
      }}
    >
      {/* Character layer stack */}
      {children}

      {/* Debug overlays (pivots, baseline, canvas bounding box) */}
      {debugMode && <DebugOverlay />}
    </div>
  );
};
