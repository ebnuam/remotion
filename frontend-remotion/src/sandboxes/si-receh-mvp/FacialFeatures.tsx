/**
 * SI RECEH - FacialFeatures Component
 * Manages Eyes, Eyebrows, Eyebags, Mouth, Extra FX, and isolated Blink/Lip-sync transforms.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { AssetLayer } from "./AssetLayer";
import {
  PlaceholderEyeBags,
  PlaceholderEyeLeft,
  PlaceholderEyeRight,
  PlaceholderEyebrows,
  PlaceholderFxSweat,
  PlaceholderMouth,
} from "./Placeholders";
import { Expression, PIVOTS, Z_INDEX } from "./types";

export interface FacialFeaturesProps {
  expression?: Expression;
  isSpeaking?: boolean;
  useInlinePlaceholders?: boolean;
}

export const FacialFeatures: React.FC<FacialFeaturesProps> = ({
  expression = "neutral",
  isSpeaking = false,
  useInlinePlaceholders = true,
}) => {
  const frame = useCurrentFrame();

  // 1. Isolated Blink calculation (Spec V2, Section 6B)
  // Only blinks on neutral, confused, cynical (not on panic or laughing)
  const canBlink = expression === "neutral" || expression === "confused" || expression === "cynical";
  const blinkCycle = 60; // Every 60 frames (2 seconds at 30fps)
  const blinkFrame = frame % blinkCycle;
  let blinkScaleY = 1;

  if (canBlink && blinkFrame < 4) {
    // 4-frame blink: 1 -> 0.4 -> 0.08 -> 0.5 -> 1
    if (blinkFrame === 0) blinkScaleY = 0.4;
    else if (blinkFrame === 1) blinkScaleY = 0.08;
    else if (blinkFrame === 2) blinkScaleY = 0.08;
    else if (blinkFrame === 3) blinkScaleY = 0.5;
  }

  // 2. Isolated Speaking mouth oscillation
  const mouthScaleY = isSpeaking ? 1 + 0.18 * Math.sin(frame * 0.8) : 1;

  // 3. Eyebags visibility rule (Spec V2, Section 6A)
  const showEyebags = expression === "neutral" || expression === "confused" || expression === "cynical";

  // 4. Extra FX (sweat) visibility rule
  const showSweat = expression === "confused" || expression === "panic";

  return (
    <>
      {/* Eyebags: Independent layer behind eyes, unaffected by blink */}
      {showEyebags && (
        <AssetLayer
          assetName="sr_eyebags.png"
          zIndex={Z_INDEX.eyebags}
          useInlinePlaceholders={useInlinePlaceholders}
          placeholderElement={<PlaceholderEyeBags />}
        />
      )}

      {/* Mouth: Isolated lip-sync scale at mouth pivot */}
      <AssetLayer
        assetName={`sr_mouth_${expression}.png`}
        zIndex={Z_INDEX.mouth}
        transformOrigin={PIVOTS.mouth.css}
        transform={`scaleY(${mouthScaleY})`}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderMouth expression={expression} isSpeaking={isSpeaking} />}
      />

      {/* Left Eye: Isolated blink transform at left eye pivot */}
      <AssetLayer
        assetName={`sr_eye_left_${expression}.png`}
        zIndex={Z_INDEX.eyes}
        transformOrigin={PIVOTS.eyeLeft.css}
        transform={`scaleY(${blinkScaleY})`}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderEyeLeft expression={expression} blinkScaleY={blinkScaleY} />}
      />

      {/* Right Eye: Isolated blink transform at right eye pivot */}
      <AssetLayer
        assetName={`sr_eye_right_${expression}.png`}
        zIndex={Z_INDEX.eyes}
        transformOrigin={PIVOTS.eyeRight.css}
        transform={`scaleY(${blinkScaleY})`}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderEyeRight expression={expression} blinkScaleY={blinkScaleY} />}
      />

      {/* Eyebrows: Expression-based sprite swapping */}
      <AssetLayer
        assetName={`sr_eyebrows_${expression}.png`}
        zIndex={Z_INDEX.eyebrows}
        useInlinePlaceholders={useInlinePlaceholders}
        placeholderElement={<PlaceholderEyebrows expression={expression} />}
      />

      {/* Extra FX (Sweat droplet) */}
      {showSweat && (
        <AssetLayer
          assetName="sr_fx_sweat.png"
          zIndex={Z_INDEX.fxSweat}
          useInlinePlaceholders={useInlinePlaceholders}
          placeholderElement={<PlaceholderFxSweat />}
        />
      )}
    </>
  );
};
