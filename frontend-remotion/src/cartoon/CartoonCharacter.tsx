import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterExpression, CharacterPose } from "./types";

interface CartoonCharacterProps {
  pose: CharacterPose;
  expression: CharacterExpression;
  isNight?: boolean;
  armProgress?: number;
  headTiltAngle?: number;
  gazeDirection?: { x: number; y: number };
  bodyLeanAngle?: number;
}

export const CartoonCharacter: React.FC<CartoonCharacterProps> = ({
  pose,
  expression,
  isNight = true,
  armProgress = 0,
  headTiltAngle,
  gazeDirection,
  bodyLeanAngle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Natural Breathing & Organic Weight Shifting
  const breathFreq = (frame / fps) * Math.PI * 1.6;
  const breath = Math.sin(breathFreq);
  const breathY = breath * 3; // 3px organic rise and fall
  const shoulderShift = Math.sin(breathFreq * 0.5) * 1.5;

  // 2. Natural Blinking with anticipation (Blink every 75 frames, duration 4 frames)
  const blinkCycle = frame % 75;
  const isBlinking = expression !== "shocked" && blinkCycle >= 0 && blinkCycle <= 4;
  const blinkAmount = isBlinking
    ? interpolate(blinkCycle, [0, 2, 4], [0, 1, 0])
    : 0;

  // 3. Typing Hand Alternating Kinematics
  const leftHandTypingY = Math.sin(frame * 1.4) * 16;
  const rightHandTypingY = Math.cos(frame * 1.4) * 16;

  // 4. Smartphone Scrolling Thumb Motion
  const thumbPhase = (frame % 18) / 18;
  const thumbSwipeY = interpolate(thumbPhase, [0, 0.45, 1], [0, -18, 0]);
  const thumbAngle = interpolate(thumbPhase, [0, 0.45, 1], [-8, -26, -8]);

  // 5. Body Weight Shifting & Panic Shake
  const isPanic = expression === "panic";
  const panicShakeX = isPanic ? Math.sin(frame * 2.8) * 5 : 0;
  const panicShakeY = isPanic ? Math.cos(frame * 3.1) * 4 : 0;

  // Animated sweat drop for shock & panic
  const sweatDropProgress = (frame * 3) % 45;

  // 6. Natural Head Tilt & Eyeball Gaze Direction
  let headTilt = 0;
  let gazeX = 0;
  let gazeY = 0;
  let bodyLean = 0; // Body weight shift angle

  if (headTiltAngle !== undefined) {
    headTilt = headTiltAngle;
  } else if (pose === "sitting_bored") {
    headTilt = 14 + Math.sin(frame * 0.08) * 2;
  } else if (pose === "sitting_phone") {
    headTilt = 16 + Math.sin(frame * 0.1) * 1.5;
  } else if (pose === "lying_bed") {
    headTilt = -18;
  } else if (pose === "sitting_typing_panic") {
    headTilt = Math.sin(frame * 1.8) * 6;
  } else if (pose === "startled_hands") {
    headTilt = Math.sin(frame * 1.2) * 4;
  } else if (pose === "reach_prop") {
    headTilt = 8;
  }

  if (gazeDirection !== undefined) {
    gazeX = gazeDirection.x;
    gazeY = gazeDirection.y;
  } else if (pose === "sitting_bored") {
    gazeX = -4;
    gazeY = 5;
  } else if (pose === "sitting_phone") {
    gazeX = 1;
    gazeY = 7;
  } else if (pose === "lying_bed") {
    gazeX = 0;
    gazeY = -4;
  } else if (pose === "sitting_typing_panic") {
    gazeX = Math.sin(frame * 0.9) * 3;
    gazeY = 3;
  } else if (pose === "startled_hands") {
    gazeX = 0;
    gazeY = 0;
  } else if (pose === "reach_prop") {
    gazeX = 4;
    gazeY = -2;
  }

  if (bodyLeanAngle !== undefined) {
    bodyLean = bodyLeanAngle;
  } else if (pose === "sitting_bored") {
    bodyLean = -2.5;
  } else if (pose === "sitting_phone") {
    bodyLean = 1.5;
  } else if (pose === "lying_bed") {
    bodyLean = 0;
  } else if (pose === "sitting_typing_panic") {
    bodyLean = 3.5;
  } else if (pose === "startled_hands") {
    bodyLean = -2.5;
  } else if (pose === "reach_prop") {
    bodyLean = 3.0;
  }

  return (
    <div
      style={{
        position: "relative",
        width: 540,
        height: 720,
        transform: `translate(${panicShakeX}px, ${panicShakeY}px)`,
        transformOrigin: "bottom center",
      }}
    >
      <svg
        viewBox="0 0 540 720"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Shading Gradients */}
          <linearGradient id="charSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE3C6" />
            <stop offset="50%" stopColor="#FAD3AB" />
            <stop offset="100%" stopColor="#EAB98B" />
          </linearGradient>
          <linearGradient id="charNeckShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2A676" />
            <stop offset="100%" stopColor="#D2925F" />
          </linearGradient>
          <linearGradient id="charHairGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3A2216" />
            <stop offset="60%" stopColor="#25140C" />
            <stop offset="100%" stopColor="#150B06" />
          </linearGradient>
          <linearGradient id="charHoodieMain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="60%" stopColor="#F56500" />
            <stop offset="100%" stopColor="#DD4B00" />
          </linearGradient>
          <linearGradient id="charHoodieDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D84315" />
            <stop offset="100%" stopColor="#BF360C" />
          </linearGradient>
          <linearGradient id="charPhoneGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>

          {/* Soft Filter for sweat and drop shadow */}
          <filter id="charDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ========================================================
            1. LOWER BODY: LEGS & FEET
        ======================================================== */}
        {pose !== "lying_bed" ? (
          <g id="legs-sitting" transform="translate(0, 0)">
            {/* Left Leg (Dark Navy Denim) */}
            <path
              d="M 200 540 L 160 670 L 230 670 L 255 540 Z"
              fill="#1E293B"
            />
            {/* Right Leg */}
            <path
              d="M 285 540 L 310 670 L 380 670 L 340 540 Z"
              fill="#0F172A"
            />
            {/* Pants Folds & Details */}
            <path d="M 175 600 Q 200 610 220 595" stroke="#334155" strokeWidth="4" fill="none" />
            <path d="M 320 600 Q 345 610 365 595" stroke="#1E293B" strokeWidth="4" fill="none" />
          </g>
        ) : (
          /* Stretched legs for lying bed pose */
          <g id="legs-lying" transform="translate(20, 0)">
            <path
              d="M 200 530 L 440 530 L 460 610 L 200 610 Z"
              fill="#1E293B"
            />
            {/* Feet / Clean White Socks */}
            <ellipse cx="465" cy="570" rx="30" ry="22" fill="#F1F5F9" />
            <path d="M 450 550 Q 475 565 470 585" stroke="#CBD5E1" strokeWidth="3" fill="none" />
          </g>
        )}

        {/* ========================================================
            2. TORSO, SHOULDERS & HOODIE
            Pivots at pelvic center (270px, 540px) with weight shift
        ======================================================== */}
        <g
          id="torso-group"
          transform={`translate(0, ${breathY}) rotate(${bodyLean} 270 540)`}
        >
          {/* Back of Collar / Hood Rim (Behind Neck) */}
          <path
            d="M 195 235 Q 270 280 345 235 Q 365 305 270 310 Q 175 305 195 235 Z"
            fill="url(#charHoodieDark)"
          />

          {/* Broad Natural Anatomical Shoulders & Torso Body */}
          <path
            d="M 195 245
               C 145 255, 115 310, 120 400
               L 155 550
               L 385 550
               L 420 400
               C 425 310, 395 255, 345 245
               Q 270 280 195 245 Z"
            fill="url(#charHoodieMain)"
            filter="url(#charDropShadow)"
          />

          {/* Shoulder Seams & Chest Shading */}
          <path
            d="M 160 285 Q 200 350 210 420"
            stroke="#D84315"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 380 285 Q 340 350 330 420"
            stroke="#D84315"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />

          {/* Kangaroo Pocket with Hand Inlets */}
          <path
            d="M 185 450 L 355 450 L 345 530 L 195 530 Z"
            fill="url(#charHoodieDark)"
            opacity="0.75"
          />
          <line x1="185" y1="450" x2="215" y2="500" stroke="#BF360C" strokeWidth="4" strokeLinecap="round" />
          <line x1="355" y1="450" x2="325" y2="500" stroke="#BF360C" strokeWidth="4" strokeLinecap="round" />

          {/* Hoodie Drawstring Cords */}
          <path
            d="M 235 270 Q 230 330 232 360"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="232" cy="363" r="5" fill="#E2E8F0" />

          <path
            d="M 305 270 Q 310 330 308 358"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="308" cy="361" r="5" fill="#E2E8F0" />
        </g>

        {/* ========================================================
            3. HEAD & NECK UNIT (ANCHORED AT C7 VERTEBRA (270, 250))
            Head and Neck move together as ONE seamless biological unit.
        ======================================================== */}
        <g
          id="head-neck-unit"
          transform={`translate(0, ${breathY + 18}) translate(270, 250) rotate(${headTilt + bodyLean}) translate(-270, -250)`}
          style={{ transformOrigin: "270px 250px" }}
        >
          {/* Deep Anatomical Neck extending well past collar down to y:310 */}
          <path
            d="M 232 185 L 228 310 Q 270 325 312 310 L 308 185 Z"
            fill="url(#charSkinGrad)"
          />
          {/* Neck Shadow beneath chin */}
          <path
            d="M 232 185 Q 270 220 308 185 L 308 220 Q 270 250 232 220 Z"
            fill="url(#charNeckShadow)"
          />

          {/* Stylized Cartoon Ears */}
          {/* Left Ear */}
          <ellipse cx="185" cy="155" rx="15" ry="22" fill="url(#charSkinGrad)" />
          <path d="M 188 147 Q 182 155 188 163" stroke="#D2925F" strokeWidth="2.5" fill="none" />
          {/* Right Ear */}
          <ellipse cx="355" cy="155" rx="15" ry="22" fill="url(#charSkinGrad)" />
          <path d="M 352 147 Q 358 155 352 163" stroke="#D2925F" strokeWidth="2.5" fill="none" />

          {/* Solid Anatomical Head Base (Clean jawline, rounded chin) */}
          <path
            d="M 190 140
               C 185 70, 355 70, 350 140
               C 350 195, 320 228, 270 228
               C 220 228, 190 195, 190 140 Z"
            fill="url(#charSkinGrad)"
            filter="url(#charDropShadow)"
          />

          {/* Soft Cheek Blush */}
          <ellipse cx="218" cy="170" rx="18" ry="11" fill="#FF8A80" opacity="0.32" />
          <ellipse cx="322" cy="170" rx="18" ry="11" fill="#FF8A80" opacity="0.32" />

          {/* Cartoon Nose */}
          <path
            d="M 266 155 Q 270 162 276 160"
            stroke="#C07740"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* ========================================================
              FACIAL EXPRESSIONS & EYEBALL GAZE
          ======================================================== */}
          {/* 1. BORED EXPRESSION (Droopy eyelids, looking down at laptop) */}
          {expression === "bored" && (
            <g id="exp-bored">
              {/* Eyebrows: Heavy, slanting down lazily */}
              <path d="M 205 125 Q 235 127 250 132" stroke="#25140C" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M 335 125 Q 305 127 290 132" stroke="#25140C" strokeWidth="6.5" strokeLinecap="round" fill="none" />

              {/* Eyes with directional pupils looking down-left */}
              {blinkAmount < 0.6 ? (
                <>
                  {/* Left Eye */}
                  <g transform="translate(228, 145)">
                    <ellipse cx="0" cy="0" rx="16" ry="18" fill="#FFFFFF" stroke="#25140C" strokeWidth="2.5" />
                    <circle cx={gazeX} cy={gazeY} r="8.5" fill="#25140C" />
                    <circle cx={gazeX + 2.5} cy={gazeY - 2.5} r="3" fill="#FFFFFF" />
                    {/* Sleepy droopy eyelid */}
                    <path d="M -16 -6 Q 0 4 16 -6 L 16 -18 L -16 -18 Z" fill="url(#charSkinGrad)" />
                    <path d="M -16 -6 Q 0 4 16 -6" stroke="#25140C" strokeWidth="3.5" fill="none" />
                  </g>
                  {/* Right Eye */}
                  <g transform="translate(312, 145)">
                    <ellipse cx="0" cy="0" rx="16" ry="18" fill="#FFFFFF" stroke="#25140C" strokeWidth="2.5" />
                    <circle cx={gazeX} cy={gazeY} r="8.5" fill="#25140C" />
                    <circle cx={gazeX + 2.5} cy={gazeY - 2.5} r="3" fill="#FFFFFF" />
                    {/* Sleepy droopy eyelid */}
                    <path d="M -16 -6 Q 0 4 16 -6 L 16 -18 L -16 -18 Z" fill="url(#charSkinGrad)" />
                    <path d="M -16 -6 Q 0 4 16 -6" stroke="#25140C" strokeWidth="3.5" fill="none" />
                  </g>
                </>
              ) : (
                /* Natural Blinking Lines */
                <>
                  <path d="M 212 147 Q 228 153 244 147" stroke="#25140C" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 296 147 Q 312 153 328 147" stroke="#25140C" strokeWidth="5" strokeLinecap="round" fill="none" />
                </>
              )}

              {/* Mouth: Bored crooked squiggly pout */}
              <path
                d="M 252 196 Q 268 198 288 190"
                stroke="#25140C"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* 2. RELAXED EXPRESSION (Sweet smile, happy eyes, looking at phone) */}
          {expression === "relaxed" && (
            <g id="exp-relaxed">
              {/* Eyebrows: Pleasant arched brows */}
              <path d="M 205 120 Q 228 114 250 120" stroke="#25140C" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M 335 120 Q 312 114 290 120" stroke="#25140C" strokeWidth="5.5" strokeLinecap="round" fill="none" />

              {/* Eyes: Happy curved cartoon anime arcs */}
              <path d="M 212 144 Q 228 132 244 144" stroke="#25140C" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M 296 144 Q 312 132 328 144" stroke="#25140C" strokeWidth="5.5" strokeLinecap="round" fill="none" />

              {/* Mouth: Contented smiling mouth with white teeth */}
              <path
                d="M 250 186 Q 270 208 290 186 Z"
                fill="#DC2626"
                stroke="#25140C"
                strokeWidth="3.5"
              />
              <path d="M 256 188 Q 270 195 284 188" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
            </g>
          )}

          {/* 3. SHOCKED EXPRESSION (Reaction shot: huge bugging eyes, jaw dropped O) */}
          {expression === "shocked" && (
            <g id="exp-shocked">
              {/* Eyebrows: Raised high in utter disbelief */}
              <path d="M 198 108 Q 225 90 252 110" stroke="#25140C" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 342 108 Q 315 90 288 110" stroke="#25140C" strokeWidth="7" strokeLinecap="round" fill="none" />

              {/* Eyes: Enormous wide circles with tiny trembling pinhead pupils */}
              <g transform="translate(225, 142)">
                <circle cx="0" cy="0" r="26" fill="#FFFFFF" stroke="#25140C" strokeWidth="4.5" />
                <circle cx={Math.sin(frame * 2) * 1.5} cy="0" r="7" fill="#25140C" />
                <circle cx="2" cy="-2" r="2.5" fill="#FFFFFF" />
              </g>
              <g transform="translate(315, 142)">
                <circle cx="0" cy="0" r="26" fill="#FFFFFF" stroke="#25140C" strokeWidth="4.5" />
                <circle cx={Math.sin(frame * 2) * -1.5} cy="0" r="7" fill="#25140C" />
                <circle cx="2" cy="-2" r="2.5" fill="#FFFFFF" />
              </g>

              {/* Mouth: Tall dramatic gaping "O" gasp with tongue */}
              <ellipse cx="270" cy="198" rx="16" ry="24" fill="#450A0A" stroke="#25140C" strokeWidth="4.5" />
              <ellipse cx="270" cy="212" rx="10" ry="7" fill="#EF4444" />

              {/* Large Shock Sweat Droplet on Brow */}
              <g transform="translate(185, 95)">
                <path
                  d="M 0 0 C -10 14, -10 22, 0 28 C 10 22, 10 14, 0 0 Z"
                  fill="#38BDF8"
                  stroke="#0284C7"
                  strokeWidth="2"
                />
                <circle cx="-3" cy="18" r="2.5" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 4. PANIC EXPRESSION (Distressed slanted brows, screaming mouth, flying sweat) */}
          {expression === "panic" && (
            <g id="exp-panic">
              {/* Eyebrows: Angled sharply inward and up */}
              <path d="M 205 125 L 246 104" stroke="#25140C" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M 335 125 L 294 104" stroke="#25140C" strokeWidth="7.5" strokeLinecap="round" />

              {/* Eyes: Trembling wild distressed eyes */}
              <g transform={`translate(225, 140) translate(${Math.sin(frame * 3) * 2}, 0)`}>
                <ellipse cx="0" cy="0" rx="22" ry="24" fill="#FFFFFF" stroke="#25140C" strokeWidth="4" />
                <circle cx="1" cy="0" r="9" fill="#25140C" />
                <circle cx="3" cy="-3" r="3" fill="#FFFFFF" />
              </g>
              <g transform={`translate(315, 140) translate(${Math.sin(frame * 3) * -2}, 0)`}>
                <ellipse cx="0" cy="0" rx="22" ry="24" fill="#FFFFFF" stroke="#25140C" strokeWidth="4" />
                <circle cx="-1" cy="0" r="9" fill="#25140C" />
                <circle cx="1" cy="-3" r="3" fill="#FFFFFF" />
              </g>

              {/* Mouth: Wide screaming yelling mouth with teeth */}
              <path
                d="M 238 182 Q 270 170 302 182 Q 308 220 270 224 Q 232 220 238 182 Z"
                fill="#581C87"
                stroke="#25140C"
                strokeWidth="4.5"
              />
              <path d="M 246 182 Q 270 176 294 182 L 292 190 Q 270 186 248 190 Z" fill="#FFFFFF" />
              <path d="M 252 220 Q 270 206 288 220 Z" fill="#F43F5E" />

              {/* Multiple Flying Panic Sweat Drops */}
              <g transform={`translate(180, ${90 + sweatDropProgress})`}>
                <path d="M 0 0 C -8 10, -8 16, 0 20 C 8 16, 8 10, 0 0 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
              </g>
              <g transform={`translate(350, ${100 + (sweatDropProgress * 0.9)})`}>
                <path d="M 0 0 C -6 8, -6 14, 0 18 C 6 14, 6 8, 0 0 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
              </g>
            </g>
          )}

          {/* 5. ALERT / CURIOUS EXPRESSION (Questioning brows, observant pupils, parted mouth) */}
          {(expression === "alert" || expression === "curious") && (
            <g id="exp-alert">
              {/* Eyebrows: One raised inquisitively, one slightly furrowed */}
              <path d="M 205 116 Q 235 112 250 120" stroke="#25140C" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M 335 125 Q 305 122 290 128" stroke="#25140C" strokeWidth="6.5" strokeLinecap="round" fill="none" />

              {/* Eyes: Focused observant pupils with reflection */}
              <g transform="translate(228, 145)">
                <ellipse cx="0" cy="0" rx="17" ry="19" fill="#FFFFFF" stroke="#25140C" strokeWidth="3" />
                <circle cx={gazeX} cy={gazeY} r="8.5" fill="#25140C" />
                <circle cx={gazeX + 2.5} cy={gazeY - 2.5} r="3" fill="#FFFFFF" />
              </g>
              <g transform="translate(312, 145)">
                <ellipse cx="0" cy="0" rx="17" ry="19" fill="#FFFFFF" stroke="#25140C" strokeWidth="3" />
                <circle cx={gazeX} cy={gazeY} r="8.5" fill="#25140C" />
                <circle cx={gazeX + 2.5} cy={gazeY - 2.5} r="3" fill="#FFFFFF" />
              </g>

              {/* Small parted mouth of realization */}
              <ellipse cx="270" cy="192" rx="9" ry="11" fill="#450A0A" stroke="#25140C" strokeWidth="3.5" />
              <ellipse cx="270" cy="190" rx="6" ry="6" fill="#EF4444" />
            </g>
          )}

          {/* Detailed Styled Cartoon Hair with highlights & volume */}
          <g id="hair-group">
            <path
              d="M 180 135
                 C 150 75, 185 25, 250 20
                 C 315 15, 380 50, 360 135
                 C 375 110, 365 80, 345 55
                 C 325 30, 265 20, 210 38
                 C 175 55, 160 100, 180 135 Z"
              fill="url(#charHairGrad)"
            />
            {/* Front Bangs Fringe */}
            <path
              d="M 185 105
                 Q 215 80 250 95
                 Q 268 75 295 90
                 Q 318 80 345 100
                 Q 358 110 352 125
                 Q 325 95 305 108
                 Q 285 90 258 112
                 Q 230 95 200 120 Z"
              fill="url(#charHairGrad)"
            />
            {/* Hair Strands Sheen */}
            <path
              d="M 205 55 Q 265 40 325 60"
              stroke="#6B4423"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />
          </g>
        </g>

        {/* ========================================================
            4. ARMS & HANDS (POSE SPECIFIC & ANATOMICALLY ATTACHED)
            Arms originate cleanly from shoulder joints (x:140 & x:400)
        ======================================================== */}
        {/* POSE 1: SITTING BORED (Elbow firmly on desk, hand cupping cheek) */}
        {pose === "sitting_bored" && (
          <g id="arms-bored">
            {/* Left Arm: Shoulder -> Elbow (on desk) -> Forearm -> Hand on Cheek */}
            <path
              d="M 150 280
                 C 100 370, 95 480, 130 510
                 C 155 490, 165 420, 215 285 Z"
              fill="url(#charHoodieMain)"
            />
            {/* Forearm slanting up to support cheek */}
            <path
              d="M 130 510
                 C 145 420, 180 320, 210 240
                 L 235 250
                 C 205 330, 170 430, 155 510 Z"
              fill="url(#charHoodieDark)"
            />
            {/* Hand cupping cheek under jaw */}
            <ellipse cx="215" cy="235" rx="22" ry="18" fill="url(#charSkinGrad)" stroke="#D2925F" strokeWidth="2" />

            {/* Right Arm: Resting along the desk */}
            <path
              d="M 390 280
                 C 440 380, 420 480, 390 515
                 L 340 500
                 C 365 430, 375 360, 345 285 Z"
              fill="url(#charHoodieMain)"
            />
            {/* Right Hand resting flat with fingers */}
            <ellipse cx="400" cy="520" rx="20" ry="15" fill="url(#charSkinGrad)" />
            {/* Relaxed Fingers */}
            <rect x="405" y="515" width="20" height="9" rx="4.5" fill="url(#charSkinGrad)" />
          </g>
        )}

        {/* POSE 2: SITTING PHONE (Holding phone in front of chest, actively scrolling) */}
        {pose === "sitting_phone" && (
          <g id="arms-phone">
            {/* Left Arm: Resting supportively */}
            <path
              d="M 150 280 C 115 370, 130 460, 165 490 L 210 470 C 175 420, 175 350, 195 285 Z"
              fill="url(#charHoodieMain)"
            />
            <ellipse cx="170" cy="495" rx="18" ry="15" fill="url(#charSkinGrad)" />

            {/* Right Arm: Raised holding smartphone */}
            <path
              d="M 390 280 C 440 370, 390 440, 330 445 L 290 415 C 340 370, 360 330, 345 285 Z"
              fill="url(#charHoodieMain)"
            />
            {/* Right Hand gripping phone */}
            <ellipse cx="285" cy="415" rx="24" ry="20" fill="url(#charSkinGrad)" />

            {/* THE SMARTPHONE RIG */}
            <g transform="translate(255, 335) rotate(-8)">
              {/* Phone Case */}
              <rect x="0" y="0" width="75" height="135" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="3" />
              {/* Glowing Active Screen */}
              <rect x="6" y="8" width="63" height="119" rx="8" fill="url(#charPhoneGlow)" opacity="0.95" />
              {/* Screen Feed Cards */}
              <rect x="12" y="18" width="51" height="50" rx="5" fill="#FFFFFF" opacity="0.4" />
              <rect x="12" y="76" width="35" height="7" rx="3" fill="#FFFFFF" opacity="0.7" />
              <rect x="12" y="88" width="45" height="5" rx="2.5" fill="#FFFFFF" opacity="0.5" />

              {/* Hand Thumb actively scrolling */}
              <g transform={`translate(62, ${75 + thumbSwipeY}) rotate(${thumbAngle})`}>
                <rect x="-9" y="-14" width="18" height="30" rx="9" fill="url(#charSkinGrad)" stroke="#D2925F" strokeWidth="2" />
                <ellipse cx="0" cy="12" rx="8" ry="8" fill="#F8B179" />
              </g>
            </g>
          </g>
        )}

        {/* POSE 3: LYING BED (Holding phone horizontally while reclining) */}
        {pose === "lying_bed" && (
          <g id="arms-lying">
            {/* Left Arm raised holding phone corner */}
            <path
              d="M 180 270 Q 140 180 210 150 Q 230 200 220 270 Z"
              fill="url(#charHoodieMain)"
            />
            <ellipse cx="215" cy="150" rx="18" ry="15" fill="url(#charSkinGrad)" />

            {/* Right Arm raised holding phone other corner */}
            <path
              d="M 360 270 Q 400 180 330 150 Q 310 200 320 270 Z"
              fill="url(#charHoodieMain)"
            />
            <ellipse cx="325" cy="150" rx="18" ry="15" fill="url(#charSkinGrad)" />

            {/* Horizontal Phone */}
            <g transform="translate(230, 115)">
              <rect x="0" y="0" width="85" height="55" rx="9" fill="#0F172A" stroke="#334155" strokeWidth="3" />
              <rect x="5" y="5" width="75" height="45" rx="6" fill="url(#charPhoneGlow)" opacity="0.95" />
            </g>
          </g>
        )}

        {/* POSE 4: SITTING TYPING PANIC (Frantic alternating typing arms) */}
        {pose === "sitting_typing_panic" && (
          <g id="arms-panic-typing" transform="translate(0, 35)">
            {/* Left Arm hammering keys */}
            <path
              d="M 150 270 C 100 360, 110 440, 160 455 L 210 440 C 175 390, 180 340, 205 280 Z"
              fill="url(#charHoodieMain)"
            />
            <g transform={`translate(0, ${leftHandTypingY})`}>
              <ellipse cx="225" cy="460" rx="22" ry="16" fill="url(#charSkinGrad)" />
              {/* Articulated Typing Fingers */}
              <circle cx="215" cy="475" r="5" fill="url(#charSkinGrad)" />
              <circle cx="225" cy="478" r="5" fill="url(#charSkinGrad)" />
              <circle cx="235" cy="475" r="5" fill="url(#charSkinGrad)" />
            </g>

            {/* Right Arm hammering keys inversely */}
            <path
              d="M 390 270 C 440 360, 430 440, 380 455 L 330 440 C 365 390, 360 340, 335 280 Z"
              fill="url(#charHoodieMain)"
            />
            <g transform={`translate(0, ${rightHandTypingY})`}>
              <ellipse cx="315" cy="460" rx="22" ry="16" fill="url(#charSkinGrad)" />
              {/* Articulated Typing Fingers */}
              <circle cx="305" cy="475" r="5" fill="url(#charSkinGrad)" />
              <circle cx="315" cy="478" r="5" fill="url(#charSkinGrad)" />
              <circle cx="325" cy="475" r="5" fill="url(#charSkinGrad)" />
            </g>

            {/* Dynamic Speed Lines around typing hands */}
            <line x1="205" y1="435" x2="205" y2="465" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeDasharray="5 3" />
            <line x1="245" y1="440" x2="245" y2="470" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeDasharray="5 3" />
            <line x1="295" y1="440" x2="295" y2="470" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeDasharray="5 3" />
            <line x1="335" y1="435" x2="335" y2="465" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeDasharray="5 3" />
          </g>
        )}

        {/* POSE 5: REACH PROP (Reaching out toward coffee cup, phone, or laptop) */}
        {pose === "reach_prop" && (
          <g id="arms-reach-prop">
            {/* Left Arm: Resting supportively on desk */}
            <path
              d="M 150 280 C 115 370, 130 460, 165 490 L 210 470 C 175 420, 175 350, 195 285 Z"
              fill="url(#charHoodieMain)"
            />
            <ellipse cx="170" cy="495" rx="18" ry="15" fill="url(#charSkinGrad)" />

            {/* Right Arm: Extending forward smoothly according to armProgress */}
            <g transform={`translate(${interpolate(armProgress, [0, 1], [0, 45])}, ${interpolate(armProgress, [0, 1], [0, 20])})`}>
              <path
                d="M 390 280
                   C 430 360, 420 420, 380 460
                   L 330 440
                   C 360 380, 365 330, 345 285 Z"
                fill="url(#charHoodieMain)"
              />
              {/* Reaching Forearm */}
              <path
                d={`M 380 460 Q ${interpolate(armProgress, [0, 1], [400, 430])} ${interpolate(armProgress, [0, 1], [480, 500])} ${interpolate(armProgress, [0, 1], [390, 420])} ${interpolate(armProgress, [0, 1], [500, 525])} L 340 470 Z`}
                fill="url(#charHoodieDark)"
              />
              {/* Reaching Hand with extended grasping fingers */}
              <g transform={`translate(${interpolate(armProgress, [0, 1], [390, 420])}, ${interpolate(armProgress, [0, 1], [500, 525])}) rotate(${interpolate(armProgress, [0, 1], [-10, 25])})`}>
                <ellipse cx="0" cy="0" rx="20" ry="16" fill="url(#charSkinGrad)" />
                {/* Extended fingers reaching forward */}
                <rect x="-4" y="10" width="8" height="18" rx="4" fill="url(#charSkinGrad)" />
                <rect x="6" y="8" width="8" height="20" rx="4" fill="url(#charSkinGrad)" />
                <rect x="16" y="6" width="7" height="17" rx="3.5" fill="url(#charSkinGrad)" />
              </g>
            </g>
          </g>
        )}

        {/* POSE 6: STARTLED HANDS (Sudden shock reflex, hands fly up to cheeks/head) */}
        {pose === "startled_hands" && (
          <g id="arms-startled">
            {/* Left Arm: Shoots up to left cheek */}
            <path
              d="M 150 280 C 90 240, 110 180, 175 220 L 205 250 C 160 230, 140 280, 195 285 Z"
              fill="url(#charHoodieMain)"
            />
            <ellipse cx="185" cy="215" rx="22" ry="18" fill="url(#charSkinGrad)" stroke="#D2925F" strokeWidth="2" />

            {/* Right Arm: Shoots up to right cheek */}
            <path
              d="M 390 280 C 450 240, 430 180, 365 220 L 335 250 C 380 230, 400 280, 345 285 Z"
              fill="url(#charHoodieMain)"
            />
            <ellipse cx="355" cy="215" rx="22" ry="18" fill="url(#charSkinGrad)" stroke="#D2925F" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
