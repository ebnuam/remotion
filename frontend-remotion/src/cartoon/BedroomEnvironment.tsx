import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface BedroomEnvironmentProps {
  isAlarming?: boolean; // When true (scenes 3 & 4), clock/room has dramatic pulse
  clockHour?: number;
  clockMinute?: number;
  isNight?: boolean;
  layer?: "all" | "background" | "foreground";
  phoneOnDesk?: boolean;
  phoneVibrating?: boolean;
  laptopAlert?: boolean;
  clockRinging?: boolean;
}

export const BedroomEnvironment: React.FC<BedroomEnvironmentProps> = ({
  isAlarming = false,
  clockHour = 11,
  clockMinute = 58,
  isNight = true,
  layer = "all",
  phoneOnDesk = false,
  phoneVibrating = false,
  laptopAlert = false,
  clockRinging = false,
}) => {
  const frame = useCurrentFrame();

  // Subtle clock second hand tick
  const clockSecondTick = (frame * 6) % 360;

  // Alarming red emergency light pulse in scene 3 & 4
  const alarmPulse = isAlarming
    ? interpolate(Math.sin(frame * 0.25), [-1, 1], [0.12, 0.48])
    : 0;

  // Window star twinkling
  const starTwinkle1 = Math.sin(frame * 0.1) * 0.4 + 0.6;
  const starTwinkle2 = Math.cos(frame * 0.15) * 0.4 + 0.6;

  // Laptop screen flicker/glow
  const laptopGlow = 0.88 + Math.sin(frame * 0.35) * 0.12;

  const showBg = layer === "all" || layer === "background";
  const showFg = layer === "all" || layer === "foreground";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 1080 1920"
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <defs>
          {/* Wall Cozy Night Gradient */}
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#20273D" />
            <stop offset="65%" stopColor="#181E32" />
            <stop offset="100%" stopColor="#111626" />
          </linearGradient>

          {/* Wooden Floor Gradient */}
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#543A26" />
            <stop offset="30%" stopColor="#432D1D" />
            <stop offset="100%" stopColor="#281A10" />
          </linearGradient>

          {/* Wood Desk Gradient */}
          <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8D5B38" />
            <stop offset="40%" stopColor="#784B2B" />
            <stop offset="100%" stopColor="#5C361C" />
          </linearGradient>

          {/* Window Sky Gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#1C2541" />
          </linearGradient>

          {/* Lamp Light Cone */}
          <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#FACC15" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#CA8A04" stopOpacity="0" />
          </linearGradient>

          {/* Bed Blanket Gradient */}
          <linearGradient id="blanketGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Clock Alarm Radial Glow */}
          <radialGradient id="clockAlertGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#DC2626" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================
            BACKGROUND LAYER (Behind Character)
        ======================================================== */}
        {showBg && (
          <g id="layer-background">
            {/* 1. MAIN ROOM WALL */}
            <rect x="0" y="0" width="1080" height="1350" fill="url(#wallGrad)" />

            {/* Wallpaper Stripes */}
            {[...Array(18)].map((_, i) => (
              <line
                key={`stripe-${i}`}
                x1={i * 65}
                y1={0}
                x2={i * 65}
                y2={1350}
                stroke="#2A334E"
                strokeWidth="2.5"
                opacity="0.3"
              />
            ))}

            {/* 2. WINDOW (OUTSIDE NIGHT SKY) */}
            <g transform="translate(100, 180)">
              <rect x="0" y="0" width="340" height="420" rx="16" fill="#2C344E" stroke="#4B5563" strokeWidth="6" />
              <rect x="12" y="12" width="316" height="396" rx="10" fill="url(#skyGrad)" />
              {/* Crescent Moon */}
              <path
                d="M 240 60 A 30 30 0 1 0 280 100 A 24 24 0 1 1 240 60 Z"
                fill="#FEF08A"
              />
              {/* Twinkling Stars */}
              <circle cx="60" cy="80" r="3" fill="#FFFFFF" opacity={starTwinkle1} />
              <circle cx="150" cy="50" r="2.5" fill="#FFFFFF" opacity={starTwinkle2} />
              <circle cx="110" cy="140" r="2" fill="#FFFFFF" opacity={starTwinkle1} />
              <circle cx="210" cy="160" r="3" fill="#FFFFFF" opacity={starTwinkle2} />
              <circle cx="80" cy="240" r="2.5" fill="#FFFFFF" opacity={starTwinkle1} />
              {/* Window Crossbars */}
              <line x1="12" y1="210" x2="328" y2="210" stroke="#374151" strokeWidth="8" />
              <line x1="170" y1="12" x2="170" y2="408" stroke="#374151" strokeWidth="8" />
              {/* Curtains */}
              <path d="M 0 0 C 40 80, 20 280, 50 420 L 0 420 Z" fill="#475569" opacity="0.8" />
              <path d="M 340 0 C 300 80, 320 280, 290 420 L 340 420 Z" fill="#475569" opacity="0.8" />
            </g>

            {/* 3. WALL SHELVES & DECOR */}
            <g transform="translate(540, 240)">
              <rect x="0" y="90" width="360" height="20" rx="4" fill="#6B4423" />
              <rect x="20" y="110" width="20" height="30" fill="#4A2E16" />
              <rect x="320" y="110" width="20" height="30" fill="#4A2E16" />
              {/* Books */}
              <rect x="30" y="20" width="22" height="70" rx="2" fill="#EF4444" />
              <rect x="54" y="10" width="26" height="80" rx="2" fill="#3B82F6" />
              <rect x="82" y="25" width="20" height="65" rx="2" fill="#10B981" />
              <rect x="104" y="15" width="28" height="75" rx="2" fill="#F59E0B" />
              {/* Potted Plant */}
              <ellipse cx="280" cy="88" rx="22" ry="6" fill="#2E1B10" />
              <path d="M 262 90 L 266 50 L 294 50 L 298 90 Z" fill="#D97706" />
              <ellipse cx="280" cy="35" rx="18" ry="12" fill="#22C55E" />
              <ellipse cx="270" cy="40" rx="14" ry="10" fill="#16A34A" />
              <ellipse cx="292" cy="40" rx="14" ry="10" fill="#4ADE80" />
            </g>

            {/* Wall Poster: "DUE TODAY!" */}
            <g transform="translate(560, 420) rotate(-3)">
              <rect x="0" y="0" width="160" height="200" rx="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="4" />
              <rect x="15" y="15" width="130" height="120" fill="#1E293B" />
              <text x="80" y="70" textAnchor="middle" fill="#EF4444" fontSize="32" fontWeight="900" fontFamily="sans-serif">
                DUE
              </text>
              <text x="80" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="800" fontFamily="sans-serif">
                TODAY!
              </text>
              <text x="80" y="170" textAnchor="middle" fill="#1E293B" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                NO SLEEP
              </text>
            </g>

            {/* 4. WALL CLOCK (CRITICAL FOR DEADLINE SHOCK) */}
            <g transform="translate(860, 200)">
              {isAlarming && (
                <circle cx="90" cy="90" r="150" fill="url(#clockAlertGlow)" opacity={alarmPulse * 2} />
              )}
              <circle cx="90" cy="90" r="95" fill={isAlarming ? "#DC2626" : "#E2E8F0"} stroke="#1E293B" strokeWidth="12" />
              <circle cx="90" cy="90" r="82" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
              {[...Array(12)].map((_, idx) => {
                const angle = (idx * 30 * Math.PI) / 180;
                const x1 = 90 + Math.sin(angle) * 65;
                const y1 = 90 - Math.cos(angle) * 65;
                const x2 = 90 + Math.sin(angle) * 75;
                const y2 = 90 - Math.cos(angle) * 75;
                return (
                  <line
                    key={`mark-${idx}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#1E293B"
                    strokeWidth={idx % 3 === 0 ? "5" : "2.5"}
                    strokeLinecap="round"
                  />
                );
              })}
              <text x="90" y="42" textAnchor="middle" fill="#1E293B" fontSize="22" fontWeight="900" fontFamily="sans-serif">12</text>
              <text x="145" y="97" textAnchor="middle" fill="#1E293B" fontSize="20" fontWeight="900" fontFamily="sans-serif">3</text>
              <text x="90" y="152" textAnchor="middle" fill="#1E293B" fontSize="20" fontWeight="900" fontFamily="sans-serif">6</text>
              <text x="35" y="97" textAnchor="middle" fill="#1E293B" fontSize="20" fontWeight="900" fontFamily="sans-serif">9</text>

              {/* Clock Hands pointing to 23:58 */}
              <line
                x1="90"
                y1="90"
                x2={90 + Math.sin(((clockHour * 30 + clockMinute * 0.5) * Math.PI) / 180) * 45}
                y2={90 - Math.cos(((clockHour * 30 + clockMinute * 0.5) * Math.PI) / 180) * 45}
                stroke="#0F172A"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="90"
                y1="90"
                x2={90 + Math.sin(((clockMinute * 6) * Math.PI) / 180) * 62}
                y2={90 - Math.cos(((clockMinute * 6) * Math.PI) / 180) * 62}
                stroke="#DC2626"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="90" cy="90" r="7" fill="#DC2626" />
            </g>

            {/* 5. WOODEN FLOOR */}
            <rect x="0" y="1350" width="1080" height="570" fill="url(#floorGrad)" />
            {[...Array(9)].map((_, i) => (
              <line
                key={`plank-${i}`}
                x1={i * 140 - 20}
                y1={1350}
                x2={i * 180 - 100}
                y2={1920}
                stroke="#21140A"
                strokeWidth="3.5"
                opacity="0.6"
              />
            ))}

            {/* Bedroom Rug */}
            <ellipse cx="540" cy="1560" rx="460" ry="160" fill="#1E293B" opacity="0.8" />
            <ellipse cx="540" cy="1560" rx="440" ry="145" fill="#334155" opacity="0.6" />

            {/* 6. BED (TEMPAT TIDUR) */}
            <g transform="translate(680, 1150)">
              <rect x="0" y="240" width="380" height="180" rx="12" fill="#5C361C" />
              <rect x="20" y="420" width="30" height="60" fill="#382010" />
              <rect x="330" y="420" width="30" height="60" fill="#382010" />
              <rect x="10" y="180" width="360" height="80" rx="18" fill="#F1F5F9" />
              <ellipse cx="90" cy="190" rx="70" ry="35" fill="#E2E8F0" />
              <path
                d="M 120 185 Q 260 170 370 185 L 370 380 Q 240 400 120 380 Z"
                fill="url(#blanketGrad)"
              />
              <path d="M 130 240 Q 240 260 360 230" stroke="#0284C7" strokeWidth="6" fill="none" opacity="0.6" />
              <path d="M 140 310 Q 250 330 360 300" stroke="#0369A1" strokeWidth="6" fill="none" opacity="0.6" />
            </g>

            {/* 7. CHAIR BEHIND DESK */}
            <g transform="translate(240, 1200)">
              <rect x="40" y="-80" width="160" height="220" rx="30" fill="#0F172A" stroke="#334155" strokeWidth="6" />
              <rect x="55" y="-60" width="130" height="180" rx="20" fill="#1E293B" />
              <ellipse cx="120" cy="-115" rx="55" ry="25" fill="#0F172A" />
              <rect x="110" y="240" width="20" height="120" fill="#475569" />
              <path d="M 60 360 L 180 360" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
            </g>

            {/* Desk Legs Behind */}
            <g transform="translate(60, 1180)">
              <rect x="30" y="160" width="36" height="380" rx="6" fill="#4A2E16" />
              <rect x="520" y="160" width="36" height="380" rx="6" fill="#4A2E16" />
              <rect x="30" y="440" width="526" height="24" fill="#382010" />
            </g>
          </g>
        )}

        {/* ========================================================
            FOREGROUND LAYER (In Front of Character)
            Overlaps character's lower waist/arms so they sit BEHIND desk!
        ======================================================== */}
        {showFg && (
          <g id="layer-foreground">
            <g transform="translate(60, 1180)">
              {/* Desk Tabletop (Smooth Solid Wood) */}
              <path
                d="M 10 140 L 580 140 L 560 190 L 30 190 Z"
                fill="url(#deskGrad)"
              />
              <rect x="10" y="170" width="570" height="26" rx="4" fill="#5C361C" />

              {/* Desk Lamp */}
              <g transform="translate(40, -100)">
                <ellipse cx="40" cy="245" rx="28" ry="12" fill="#334155" />
                <path d="M 40 240 Q 30 100 80 50" stroke="#64748B" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M 60 40 L 120 70 L 95 105 L 45 65 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="3" />
                <polygon points="75,85 0,320 340,320 110,95" fill="url(#lampCone)" />
              </g>

              {/* Coffee Mug */}
              <g transform="translate(135, 110)">
                <rect x="0" y="20" width="36" height="42" rx="6" fill="#EF4444" />
                <path d="M 36 28 C 50 28, 50 48, 36 48" stroke="#EF4444" strokeWidth="5" fill="none" />
                <path d="M 14 14 Q 22 4 16 -6" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
              </g>

              {/* Smartphone on desk (reactive prop when character is not holding it) */}
              {phoneOnDesk && (
                <g
                  transform={`translate(185, 125) rotate(${phoneVibrating ? Math.sin(frame * 4) * 5 : 10})`}
                >
                  {/* Phone Case */}
                  <rect x="0" y="0" width="34" height="60" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                  {/* Glowing Screen */}
                  <rect x="3" y="4" width="28" height="52" rx="4" fill="#38BDF8" opacity={phoneVibrating ? (frame % 8 < 4 ? 0.95 : 0.6) : 0.85} />
                  {/* Notification ripple wave if vibrating */}
                  {phoneVibrating && (
                    <>
                      <circle cx="17" cy="30" r={(frame * 2.5) % 30} stroke="#38BDF8" strokeWidth="2" fill="none" opacity={Math.max(0, 1 - ((frame * 2.5) % 30) / 30)} />
                      <circle cx="26" cy="8" r="4.5" fill="#EF4444" />
                    </>
                  )}
                </g>
              )}

              {/* Pen Holder */}
              <g transform="translate(490, 95)">
                <rect x="0" y="35" width="38" height="45" rx="6" fill="#3B82F6" />
                <line x1="12" y1="12" x2="16" y2="40" stroke="#EAB308" strokeWidth="5" strokeLinecap="round" />
                <line x1="26" y1="6" x2="22" y2="40" stroke="#EC4899" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* OPEN LAPTOP ON DESK (Solid, Facing Character) */}
              <g transform="translate(240, 40)">
                {/* Keyboard surface */}
                <path d="M -15 110 L 195 110 L 215 138 L -35 138 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
                <rect x="65" y="120" width="50" height="12" rx="2" fill="#CBD5E1" />
                <rect x="-5" y="112" width="190" height="6" fill="#475569" />

                {/* Laptop Screen Open */}
                <rect x="5" y="-45" width="170" height="150" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="4" />
                <rect
                  x="13"
                  y="-37"
                  width="154"
                  height="134"
                  rx="4"
                  fill={laptopAlert ? "#EF4444" : "#F8FAFC"}
                  opacity={laptopAlert ? (frame % 10 < 5 ? 0.95 : 0.75) : laptopGlow}
                />

                {laptopAlert ? (
                  /* Emergency Alert Screen */
                  <g>
                    <rect x="25" y="-15" width="130" height="25" rx="4" fill="#FFFFFF" />
                    <text x="90" y="3" textAnchor="middle" fill="#EF4444" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                      DEADLINE!
                    </text>
                    <text x="90" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="sans-serif">
                      23:59
                    </text>
                  </g>
                ) : (
                  /* Editor Content Mockup */
                  <g>
                    <rect x="22" y="-25" width="136" height="15" rx="3" fill="#3B82F6" />
                    <rect x="22" y="2" width="100" height="6" rx="2" fill="#94A3B8" />
                    <rect x="22" y="16" width="125" height="6" rx="2" fill="#94A3B8" />
                    <rect x="22" y="30" width="80" height="6" rx="2" fill="#94A3B8" />
                    <rect x="22" y="44" width="115" height="6" rx="2" fill="#94A3B8" />
                    {/* Cursor */}
                    <rect x="106" y="30" width="3" height="8" fill="#EF4444" opacity={(frame % 20) < 10 ? 1 : 0} />
                  </g>
                )}

                {/* Screen Reflection Light Beam */}
                <polygon points="13,97 -35,145 215,145 167,97" fill="#38BDF8" opacity="0.22" />
              </g>
            </g>

            {/* Ambient Dark Night Overlay */}
            <rect
              x="0"
              y="0"
              width="1080"
              height="1920"
              fill="#0B0F19"
              opacity={isNight ? 0.22 : 0}
            />

            {/* Alarming Red Room Strobe */}
            {isAlarming && (
              <rect
                x="0"
                y="0"
                width="1080"
                height="1920"
                fill="#EF4444"
                opacity={alarmPulse * 0.35}
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
