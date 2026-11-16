/**
 * SI RECEH - BodyGroup Component
 * Assembles LowerBody (Legs, Pelvis) and UpperBody (Hoodie Torso, Arms, HeadGroup)
 * with waist breathing oscillation.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { ArmGroup } from "./ArmGroup";
import { AssetLayer } from "./AssetLayer";
import { HeadGroup } from "./HeadGroup";
import {
  PlaceholderHoodieBody,
  PlaceholderHoodieHood,
  PlaceholderLegLeft,
  PlaceholderLegRight,
  PlaceholderPelvis,
} from "./Placeholders";
import { Expression, Gesture, PIVOTS, Pose, Z_INDEX } from "./types";

export interface BodyGroupProps {
  expression?: Expression;
  gesture?: Gesture;
  pose?: Pose;
  isSpeaking?: boolean;
  useInlinePlaceholders?: boolean;
}

export const BodyGroup: React.FC<BodyGroupProps> = ({
  expression = "neutral",
  gesture = "idle",
  pose = "standing",
  isSpeaking = false,
  useInlinePlaceholders = true,
}) => {
  const frame = useCurrentFrame();

  // Subtle breathing oscillation on UpperBody from waist pivot (50% 62.5%)
  const breathingScaleY = 1 + 0.012 * Math.sin(frame * 0.08);

  return (
    <>
      {/* ================= LOWER BODY GROUP ================= */}
      {/* Right Leg (Z: 4) */}
      <AssetLayer
        assetName="sr_leg_right.png"
        zIndex={Z_INDEX.legRight}
        transformOrigin={PIVOTS.legRight.css}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderLegRight />}
      />

      {/* Pelvis connector (Z: 6) */}
      <AssetLayer
        assetName="sr_pelvis.png"
        zIndex={Z_INDEX.pelvis}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderPelvis />}
      />

      {/* Left Leg (Z: 7) */}
      <AssetLayer
        assetName="sr_leg_left.png"
        zIndex={Z_INDEX.legLeft}
        transformOrigin={PIVOTS.legLeft.css}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderLegLeft />}
      />

      {/* ================= UPPER BODY GROUP (Breathing Target) ================= */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transformOrigin: PIVOTS.torsoAndHead.css,
          transform: `scaleY(${breathingScaleY})`,
        }}
      >
        {/* Right Arm (Back) (Z: 2-3) */}
        <ArmGroup side="right" gesture={gesture} useInlinePlaceholders={useInlinePlaceholders} />

        {/* Hoodie Hood (Z: 5) */}
        <AssetLayer
          assetName="sr_hoodie_hood.png"
          zIndex={Z_INDEX.hoodieHood}
          useInlinePlaceholders={useInlinePlaceholders}
          placeholderElement={<PlaceholderHoodieHood />}
        />

        {/* Hoodie Torso Body (Z: 8) */}
        <AssetLayer
          assetName="sr_hoodie_body.png"
          zIndex={Z_INDEX.hoodieBody}
          useInlinePlaceholders={useInlinePlaceholders}
          placeholderElement={<PlaceholderHoodieBody />}
        />

        {/* Head Group (Z: 1, 9, 10-15) */}
        <HeadGroup expression={expression} isSpeaking={isSpeaking} useInlinePlaceholders={useInlinePlaceholders} />

        {/* Left Arm (Front) (Z: 16-17) */}
        <ArmGroup side="left" gesture={gesture} useInlinePlaceholders={useInlinePlaceholders} />
      </div>
    </>
  );
};
