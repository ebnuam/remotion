/**
 * SI RECEH - HeadGroup Component
 * Wraps HairBack, HeadBase, FacialFeatures, and HairFront with neck pivot head-tilt.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { AssetLayer } from "./AssetLayer";
import { FacialFeatures } from "./FacialFeatures";
import { PlaceholderHairBack, PlaceholderHairFront, PlaceholderHeadBase } from "./Placeholders";
import { Expression, PIVOTS, Z_INDEX } from "./types";

export interface HeadGroupProps {
  expression?: Expression;
  isSpeaking?: boolean;
  useInlinePlaceholders?: boolean;
}

export const HeadGroup: React.FC<HeadGroupProps> = ({
  expression = "neutral",
  isSpeaking = false,
  useInlinePlaceholders = true,
}) => {
  const frame = useCurrentFrame();

  // Subtle head tilt from neck pivot (50% 44.2%)
  const headTiltDeg = Math.sin(frame * 0.06) * 2.5;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transformOrigin: PIVOTS.head.css,
        transform: `rotate(${headTiltDeg}deg)`,
      }}
    >
      {/* 1. Hair Back (Z-Index: 1) */}
      <AssetLayer
        assetName="sr_hair_back.png"
        zIndex={Z_INDEX.hairBack}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderHairBack />}
      />

      {/* 2. Head Base (Z-Index: 9) */}
      <AssetLayer
        assetName="sr_head_base.png"
        zIndex={Z_INDEX.headBase}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderHeadBase />}
      />

      {/* 3. Facial Features (Z-Index: 10 - 13, 15) */}
      <FacialFeatures expression={expression} isSpeaking={isSpeaking} useInlinePlaceholders={useInlinePlaceholders} />

      {/* 4. Hair Front Bangs (Z-Index: 14) */}
      <AssetLayer
        assetName="sr_hair_front.png"
        zIndex={Z_INDEX.hairFront}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderHairFront />}
      />
    </div>
  );
};
