/**
 * SVG Placeholders for Si Receh MVP
 * Renders vector placeholder layers at master canvas resolution 1024 x 1536.
 * All layers share exact 1024 x 1536 canvas coordinates for pixel-perfect stacking.
 */
import React from "react";
import { Expression, Gesture, PALETTE } from "./types";

const STROKE_WIDTH = 12;

export const PlaceholderHairBack: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Hair silhouette behind head */}
    <path
      d="M 330 450 C 310 320, 420 220, 520 220 C 620 220, 720 320, 700 460 C 720 540, 710 630, 680 680 C 620 720, 560 740, 512 740 C 440 740, 390 710, 340 660 C 315 600, 320 520, 330 450 Z"
      fill={PALETTE.hair}
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
    />
  </svg>
);

export const PlaceholderArmRight: React.FC<{ gesture?: Gesture }> = ({ gesture }) => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      {/* Right sleeve (character's right / viewer's right, slightly behind body) */}
      <path
        d="M 610 730 C 640 740, 670 780, 680 840 C 690 890, 685 940, 674 980 C 645 980, 620 950, 615 900 C 605 840, 600 780, 610 730 Z"
        fill={PALETTE.hoodie}
        stroke={PALETTE.outline}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PlaceholderHandRight: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Right hand tucked or relaxed near pocket */}
    <ellipse cx="674" cy="995" rx="32" ry="24" fill={PALETTE.skin} stroke={PALETTE.outline} strokeWidth={STROKE_WIDTH} />
  </svg>
);

export const PlaceholderLegRight: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Right leg sweatpant + shoe */}
    <path
      d="M 545 1010 C 560 1010, 605 1010, 615 1030 C 610 1130, 615 1250, 605 1370 C 565 1370, 545 1360, 540 1370 C 535 1250, 540 1130, 545 1010 Z"
      fill={PALETTE.sweatpants}
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
    {/* Right shoe */}
    <path
      d="M 535 1370 C 535 1370, 620 1370, 625 1390 C 630 1420, 625 1450, 615 1450 C 565 1450, 530 1450, 525 1430 Z"
      fill="#1A1A1D"
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
    />
    {/* Shoe sole */}
    <line x1="525" y1="1448" x2="625" y2="1448" stroke="#FFFFFF" strokeWidth={6} />
  </svg>
);

export const PlaceholderHoodieHood: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Hood resting behind neck */}
    <path
      d="M 400 710 C 440 680, 584 680, 624 710 C 630 750, 620 780, 512 790 C 404 780, 394 750, 400 710 Z"
      fill="#D4962A"
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
  </svg>
);

export const PlaceholderPelvis: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Pelvis sweatpants base */}
    <path
      d="M 420 990 C 420 990, 604 990, 604 990 C 610 1020, 590 1070, 512 1080 C 434 1070, 414 1020, 420 990 Z"
      fill={PALETTE.sweatpants}
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
  </svg>
);

export const PlaceholderLegLeft: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Left leg sweatpant + shoe */}
    <path
      d="M 410 1010 C 425 1010, 475 1010, 485 1030 C 480 1130, 485 1250, 475 1370 C 435 1370, 415 1360, 410 1370 C 400 1250, 405 1130, 410 1010 Z"
      fill={PALETTE.sweatpants}
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
    {/* Left shoe */}
    <path
      d="M 400 1370 C 400 1370, 490 1370, 495 1390 C 500 1420, 495 1450, 485 1450 C 435 1450, 395 1450, 390 1430 Z"
      fill="#1A1A1D"
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
    />
    {/* Shoe sole */}
    <line x1="390" y1="1448" x2="495" y2="1448" stroke="#FFFFFF" strokeWidth={6} />
  </svg>
);

export const PlaceholderHoodieBody: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Oversized hoodie torso */}
    <path
      d="M 400 730 C 440 710, 584 710, 624 730 C 650 780, 660 880, 650 1010 C 600 1025, 424 1025, 374 1010 C 364 880, 374 780, 400 730 Z"
      fill={PALETTE.hoodie}
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
    {/* Kangaroo pocket */}
    <path
      d="M 420 890 C 450 880, 574 880, 604 890 C 614 960, 600 990, 590 1000 C 560 1005, 464 1005, 434 1000 C 424 990, 410 960, 420 890 Z"
      fill="#D4962A"
      stroke={PALETTE.outline}
      strokeWidth={8}
    />
    {/* Hoodie drawstrings */}
    <path d="M 480 740 Q 485 800, 475 830" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M 544 740 Q 539 800, 549 830" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" />
  </svg>
);

export const PlaceholderHeadBase: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Bean-shaped head outline + ears + small nose */}
    {/* Left ear */}
    <circle cx="340" cy="520" r="32" fill={PALETTE.skin} stroke={PALETTE.outline} strokeWidth={STROKE_WIDTH} />
    {/* Right ear */}
    <circle cx="684" cy="520" r="32" fill={PALETTE.skin} stroke={PALETTE.outline} strokeWidth={STROKE_WIDTH} />
    {/* Main Bean Head */}
    <path
      d="M 360 440 C 350 320, 440 250, 512 250 C 584 250, 674 320, 664 440 C 654 560, 644 650, 594 690 C 544 720, 480 720, 430 690 C 380 650, 370 560, 360 440 Z"
      fill={PALETTE.skin}
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
    {/* Minimalist nose */}
    <path d="M 512 525 L 518 545 L 508 547" stroke={PALETTE.outline} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlaceholderEyeBags: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Dark tired eye bags under both eyes */}
    <path d="M 415 515 Q 445 535, 475 515" stroke={PALETTE.eyebags} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M 549 515 Q 579 535, 609 515" stroke={PALETTE.eyebags} strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);

export const PlaceholderEyeLeft: React.FC<{ expression?: Expression; blinkScaleY?: number }> = ({ expression, blinkScaleY = 1 }) => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      <g style={{ transformOrigin: "445px 490px", transform: `scaleY(${blinkScaleY})` }}>
        {expression === "panic" ? (
          // Wide open circular eye
          <circle cx="445" cy="490" r="28" fill="#FFFFFF" stroke={PALETTE.outline} strokeWidth={8}>
            <circle cx="445" cy="490" r="10" fill={PALETTE.outline} />
          </circle>
        ) : expression === "laughing" ? (
          // >< eye
          <path d="M 425 480 L 450 495 L 425 510" stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : expression === "confused" ? (
          // Looking to side
          <g>
            <path d="M 418 495 C 418 475, 472 475, 472 495 C 472 510, 418 510, 418 495 Z" fill="#FFFFFF" stroke={PALETTE.outline} strokeWidth={8} />
            <circle cx="435" cy="495" r="9" fill={PALETTE.outline} />
          </g>
        ) : expression === "cynical" ? (
          // Smug / squinting side eye
          <g>
            <path d="M 420 500 Q 445 485, 470 500" stroke={PALETTE.outline} strokeWidth={8} fill="none" strokeLinecap="round" />
            <circle cx="455" cy="495" r="8" fill={PALETTE.outline} />
          </g>
        ) : (
          // Neutral / tired half-lidded eye
          <g>
            <ellipse cx="445" cy="495" rx="26" ry="20" fill="#FFFFFF" stroke={PALETTE.outline} strokeWidth={8} />
            <circle cx="445" cy="497" r="11" fill={PALETTE.outline} />
            {/* Upper tired eyelid */}
            <path d="M 419 488 Q 445 496, 471 488" stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
};

export const PlaceholderEyeRight: React.FC<{ expression?: Expression; blinkScaleY?: number }> = ({ expression, blinkScaleY = 1 }) => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      <g style={{ transformOrigin: "579px 490px", transform: `scaleY(${blinkScaleY})` }}>
        {expression === "panic" ? (
          <circle cx="579" cy="490" r="28" fill="#FFFFFF" stroke={PALETTE.outline} strokeWidth={8}>
            <circle cx="579" cy="490" r="10" fill={PALETTE.outline} />
          </circle>
        ) : expression === "laughing" ? (
          <path d="M 599 480 L 574 495 L 599 510" stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : expression === "confused" ? (
          <g>
            <path d="M 552 495 C 552 475, 606 475, 606 495 C 606 510, 552 510, 552 495 Z" fill="#FFFFFF" stroke={PALETTE.outline} strokeWidth={8} />
            <circle cx="569" cy="495" r="9" fill={PALETTE.outline} />
          </g>
        ) : expression === "cynical" ? (
          <g>
            <path d="M 554 500 Q 579 485, 604 500" stroke={PALETTE.outline} strokeWidth={8} fill="none" strokeLinecap="round" />
            <circle cx="589" cy="495" r="8" fill={PALETTE.outline} />
          </g>
        ) : (
          <g>
            <ellipse cx="579" cy="495" rx="26" ry="20" fill="#FFFFFF" stroke={PALETTE.outline} strokeWidth={8} />
            <circle cx="579" cy="497" r="11" fill={PALETTE.outline} />
            <path d="M 553 488 Q 579 496, 605 488" stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
};

export const PlaceholderEyebrows: React.FC<{ expression?: Expression }> = ({ expression }) => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      {expression === "panic" ? (
        // Raised high slanted eyebrows
        <g stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round">
          <path d="M 420 440 Q 445 425, 470 445" />
          <path d="M 554 445 Q 579 425, 604 440" />
        </g>
      ) : expression === "confused" ? (
        // One eyebrow raised high, one neutral
        <g stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round">
          <path d="M 420 435 Q 445 420, 470 435" />
          <path d="M 554 460 Q 579 465, 604 460" />
        </g>
      ) : expression === "cynical" ? (
        // Furrowed cynical eyebrows
        <g stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round">
          <path d="M 420 455 L 470 468" />
          <path d="M 554 468 L 604 455" />
        </g>
      ) : (
        // Normal horizontal relaxed eyebrows
        <g stroke={PALETTE.outline} strokeWidth={9} fill="none" strokeLinecap="round">
          <path d="M 420 458 Q 445 452, 470 458" />
          <path d="M 554 458 Q 579 452, 604 458" />
        </g>
      )}
    </svg>
  );
};

export const PlaceholderMouth: React.FC<{ expression?: Expression; isSpeaking?: boolean }> = ({ expression, isSpeaking }) => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      {isSpeaking ? (
        // Speaking mouth animation
        <ellipse cx="512" cy="584" rx="28" ry="22" fill={PALETTE.mouthInside} stroke={PALETTE.outline} strokeWidth={8} />
      ) : expression === "panic" ? (
        // Screaming mouth
        <ellipse cx="512" cy="590" rx="34" ry="42" fill={PALETTE.mouthInside} stroke={PALETTE.outline} strokeWidth={8} />
      ) : expression === "laughing" ? (
        // Wide open D smile
        <path d="M 470 575 Q 512 630, 554 575 Z" fill={PALETTE.mouthInside} stroke={PALETTE.outline} strokeWidth={8} strokeLinejoin="round" />
      ) : expression === "confused" ? (
        // Wavy squiggly mouth
        <path d="M 480 585 Q 496 575, 512 585 Q 528 595, 544 585" stroke={PALETTE.outline} strokeWidth={8} fill="none" strokeLinecap="round" />
      ) : expression === "cynical" ? (
        // Smirk mouth
        <path d="M 490 588 Q 520 592, 540 578" stroke={PALETTE.outline} strokeWidth={8} fill="none" strokeLinecap="round" />
      ) : (
        // Neutral straight line mouth
        <path d="M 485 585 L 539 585" stroke={PALETTE.outline} strokeWidth={8} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};

export const PlaceholderHairFront: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Messy black bangs covering parts of upper forehead */}
    <path
      d="M 360 400 C 370 330, 430 270, 512 270 C 594 270, 654 330, 664 400 C 650 430, 620 440, 590 410 C 560 445, 530 450, 500 420 C 470 455, 430 445, 400 410 C 380 435, 365 425, 360 400 Z"
      fill={PALETTE.hair}
      stroke={PALETTE.outline}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
  </svg>
);

export const PlaceholderFxSweat: React.FC = () => (
  <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
    {/* Sweat drop on right forehead */}
    <path
      d="M 640 430 C 640 430, 655 450, 655 460 C 655 470, 645 478, 638 478 C 631 478, 621 470, 621 460 C 621 450, 640 430, 640 430 Z"
      fill={PALETTE.sweatDrop}
      stroke={PALETTE.outline}
      strokeWidth={6}
    />
  </svg>
);

export const PlaceholderArmLeft: React.FC<{ gesture?: Gesture }> = ({ gesture }) => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      {/* Left arm sleeve (viewer's left / character's left, in front) */}
      <path
        d="M 414 730 C 384 740, 354 780, 344 840 C 334 890, 339 940, 350 980 C 379 980, 404 950, 409 900 C 419 840, 424 780, 414 730 Z"
        fill={PALETTE.hoodie}
        stroke={PALETTE.outline}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PlaceholderHandLeft: React.FC<{ gesture?: Gesture }> = ({ gesture }) => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
      {gesture === "pointing" ? (
        // Pointing hand finger gesture
        <g>
          <ellipse cx="350" cy="980" rx="30" ry="24" fill={PALETTE.skin} stroke={PALETTE.outline} strokeWidth={STROKE_WIDTH} />
          <path d="M 330 980 L 270 960" stroke={PALETTE.outline} strokeWidth={14} strokeLinecap="round" />
        </g>
      ) : gesture === "facepalm" ? (
        // Hand over face
        <path
          d="M 460 480 C 450 450, 470 420, 500 420 C 530 420, 540 450, 530 480 Z"
          fill={PALETTE.skin}
          stroke={PALETTE.outline}
          strokeWidth={STROKE_WIDTH}
        />
      ) : (
        // Relaxed hand
        <ellipse cx="350" cy="995" rx="32" ry="24" fill={PALETTE.skin} stroke={PALETTE.outline} strokeWidth={STROKE_WIDTH} />
      )}
    </svg>
  );
};

/**
 * Debug overlay with bounding box and crosshairs for pivots
 */
export const DebugOverlay: React.FC = () => {
  return (
    <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
      {/* 1024 x 1536 canvas border */}
      <rect x="2" y="2" width="1020" height="1532" fill="none" stroke="rgba(0, 200, 255, 0.4)" strokeWidth="4" strokeDasharray="16 8" />
      {/* Baseline Y = 1450 */}
      <line x1="0" y1="1450" x2="1024" y2="1450" stroke="rgba(255, 50, 50, 0.6)" strokeWidth="4" strokeDasharray="10 5" />
      <text x="30" y="1440" fill="rgba(255, 50, 50, 0.8)" fontSize="28" fontFamily="monospace">
        BASELINE Y=1450
      </text>
      {/* Center line X = 512 */}
      <line x1="512" y1="0" x2="512" y2="1536" stroke="rgba(0, 200, 255, 0.4)" strokeWidth="3" strokeDasharray="10 5" />
      <text x="520" y="50" fill="rgba(0, 200, 255, 0.8)" fontSize="28" fontFamily="monospace">
        CENTER X=512
      </text>
      {/* Pivot markers (+) */}
      {[
        { name: "Root", x: 512, y: 1450 },
        { name: "Torso+Head", x: 512, y: 960 },
        { name: "Head", x: 512, y: 680 },
        { name: "Arm L", x: 390, y: 730 },
        { name: "Arm R", x: 634, y: 730 },
        { name: "Eye L", x: 445, y: 490 },
        { name: "Eye R", x: 579, y: 490 },
      ].map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r="10" fill="none" stroke="#FF0055" strokeWidth="4" />
          <line x1={p.x - 16} y1={p.y} x2={p.x + 16} y2={p.y} stroke="#FF0055" strokeWidth="4" />
          <line x1={p.x} y1={p.y - 16} x2={p.x} y2={p.y + 16} stroke="#FF0055" strokeWidth="4" />
          <text x={p.x + 14} y={p.y - 10} fill="#FF0055" fontSize="22" fontWeight="bold" fontFamily="monospace">
            {p.name}
          </text>
        </g>
      ))}
      {/* Watermark */}
      <rect x="30" y="80" width="360" height="40" fill="rgba(0,0,0,0.6)" rx="6" />
      <text x="45" y="108" fill="#FFCC00" fontSize="22" fontWeight="bold" fontFamily="sans-serif">
        [MVP SCAFFOLD PLACEHOLDER]
      </text>
    </svg>
  );
};
