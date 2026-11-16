/**
 * SI RECEH - AssetLayer Component
 * Handles layer stacking, z-index, pivot transformations, and PNG/SVG placeholder fallback.
 */
import React, { useState } from "react";
import { Img, staticFile } from "remotion";

export interface AssetLayerProps {
  assetName: string;
  zIndex: number;
  transformOrigin?: string;
  transform?: string;
  opacity?: number;
  useInlinePlaceholders?: boolean;
  placeholderElement?: React.ReactNode;
}

export const AssetLayer: React.FC<AssetLayerProps> = ({
  assetName,
  zIndex,
  transformOrigin = "50% 50%",
  transform,
  opacity = 1,
  useInlinePlaceholders = true,
  placeholderElement,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex,
    transformOrigin,
    transform,
    opacity,
    pointerEvents: "none",
  };

  // If using inline placeholders or if image failed to load, render SVG placeholder
  if (useInlinePlaceholders || imgFailed) {
    return <div style={containerStyle}>{placeholderElement}</div>;
  }

  return (
    <div style={containerStyle}>
      <Img
        src={staticFile(`assets/character/si-receh/${assetName}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
        onError={() => setImgFailed(true)}
      />
    </div>
  );
};
