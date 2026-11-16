/**
 * SI RECEH - ArmGroup Component
 * Handles Left Arm (Front, Z: 16-17) and Right Arm (Back, Z: 2-3) with gesture rotations.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { AssetLayer } from "./AssetLayer";
import {
  PlaceholderArmLeft,
  PlaceholderArmRight,
  PlaceholderHandLeft,
  PlaceholderHandRight,
} from "./Placeholders";
import { Gesture, PIVOTS, Z_INDEX } from "./types";

export interface ArmGroupProps {
  side: "left" | "right";
  gesture?: Gesture;
  useInlinePlaceholders?: boolean;
}

export const ArmGroup: React.FC<ArmGroupProps> = ({
  side,
  gesture = "idle",
  useInlinePlaceholders = true,
}) => {
  const frame = useCurrentFrame();

  if (side === "right") {
    // Right Arm (Character's Right / Viewer's Right, behind torso, Z: 2-3)
    const rightArmSway = -Math.sin(frame * 0.08) * 1.5;

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transformOrigin: PIVOTS.armRight.css,
          transform: `rotate(${rightArmSway}deg)`,
        }}
      >
        {/* Right Arm Sleeve (Z: 2) */}
        <AssetLayer
          assetName="sr_arm_right.png"
          zIndex={Z_INDEX.armRight}
          useInlinePlaceholders={useInlinePlaceholders}
          placeholderElement={<PlaceholderArmRight gesture={gesture} />}
        />
        {/* Right Hand Relaxed (Z: 3) */}
        <AssetLayer
          assetName="sr_hand_right_relaxed.png"
          zIndex={Z_INDEX.handRight}
          useInlinePlaceholders={useInlinePlaceholders}
          placeholderElement={<PlaceholderHandRight />}
        />
      </div>
    );
  }

  // Left Arm (Character's Left / Viewer's Left, in front of torso, Z: 16-17)
  let leftArmRotation = Math.sin(frame * 0.08) * 1.5; // Idle subtle breathing sway

  if (gesture === "pointing") {
    leftArmRotation = -65; // Raise arm pointing forward
  } else if (gesture === "facepalm") {
    leftArmRotation = -115; // Arm up to face
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transformOrigin: PIVOTS.armLeft.css,
        transform: `rotate(${leftArmRotation}deg)`,
      }}
    >
      {/* Left Arm Sleeve (Z: 16) */}
      <AssetLayer
        assetName="sr_arm_left.png"
        zIndex={Z_INDEX.armLeft}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderArmLeft gesture={gesture} />}
      />
      {/* Left Hand with gesture variant (Z: 17) */}
      <AssetLayer
        assetName={`sr_hand_left_${gesture}.png`}
        zIndex={Z_INDEX.handLeft}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderHandLeft gesture={gesture} />}
      />
    </div>
  );
};
