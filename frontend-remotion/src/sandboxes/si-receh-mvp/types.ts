/**
 * SI RECEH - PRODUCTION ASSET SPECIFICATION (V2.0 - REVISED)
 * Types & Constants for Si Receh MVP Scaffold
 */

export type Expression = "neutral" | "confused" | "panic" | "cynical" | "laughing";
export type Gesture = "idle" | "pointing" | "facepalm";
export type Pose = "standing" | "walking" | "sitting";

export interface SiRecehCharacterProps {
  expression?: Expression;
  gesture?: Gesture;
  pose?: Pose;
  isSpeaking?: boolean;
  scale?: number;
  position?: [number, number]; // [offsetX, offsetY] in canvas pixels
  debugMode?: boolean; // Shows pivot crosshairs and bounding boxes
  useInlinePlaceholders?: boolean; // When true, renders SVG placeholders rather than external PNG files
}

export const MASTER_CANVAS = {
  width: 1024,
  height: 1536,
  aspectRatio: 2 / 3,
  baselineY: 1450,
  centerX: 512,
} as const;

/**
 * Standard Pivot Specifications (Spec V2, Section 5)
 * Based on 1024 x 1536 canvas
 */
export const PIVOTS = {
  root: { x: 512, y: 1450, css: "50% 94.4%" },
  torsoAndHead: { x: 512, y: 960, css: "50% 62.5%" },
  head: { x: 512, y: 680, css: "50% 44.2%" },
  armLeft: { x: 390, y: 730, css: "38.1% 47.5%" },
  armRight: { x: 634, y: 730, css: "61.9% 47.5%" },
  handLeft: { x: 350, y: 980, css: "34.2% 63.8%" },
  handRight: { x: 674, y: 980, css: "65.8% 63.8%" },
  legLeft: { x: 450, y: 1020, css: "43.9% 66.4%" },
  legRight: { x: 574, y: 1020, css: "56.1% 66.4%" },
  eyeLeft: { x: 445, y: 490, css: "43.5% 31.9%" },
  eyeRight: { x: 579, y: 490, css: "56.5% 31.9%" },
  mouth: { x: 512, y: 584, css: "50% 38.0%" },
} as const;

/**
 * Layer Hierarchy (Z-Order 1 to 17) (Spec V2, Section 4)
 */
export const Z_INDEX = {
  hairBack: 1,
  armRight: 2,
  handRight: 3,
  legRight: 4,
  hoodieHood: 5,
  pelvis: 6,
  legLeft: 7,
  hoodieBody: 8,
  headBase: 9,
  eyebags: 10,
  mouth: 11,
  eyes: 12,
  eyebrows: 13,
  hairFront: 14,
  fxSweat: 15,
  armLeft: 16,
  handLeft: 17,
  debugOverlay: 99,
} as const;

/**
 * Palette HEX Codes
 */
export const PALETTE = {
  hoodie: "#E5A93B",
  sweatpants: "#2D3142",
  skin: "#FBE3C5",
  hair: "#1A1A1D",
  outline: "#111111",
  eyebags: "#E2C1A4",
  mouthInside: "#A34141",
  white: "#FFFFFF",
  sweatDrop: "#74C0FC",
} as const;
