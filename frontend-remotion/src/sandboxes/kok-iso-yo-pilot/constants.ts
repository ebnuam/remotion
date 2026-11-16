/**
 * KOK ISO YO? - PILOT 01 CONSTANTS & TIMELINE
 * Title: "Kenapa Es Batu Bisa Mengapung?"
 * Duration: 8.00 seconds = 240 frames @ 30 FPS
 * Resolution: 540 x 960 (9:16 vertical)
 */

export const PILOT_CONFIG = {
  fps: 30,
  durationInFrames: 240, // 8.0 seconds
  width: 540,
  height: 960,
  productionWidth: 1080,
  productionHeight: 1920,
} as const;

export const SHOTS = {
  // Shot 1: Hook (0 - 2s)
  shot1: {
    startFrame: 0,
    endFrame: 60,
    duration: 60,
    voStartFrame: 4,
    voFile: "assets/kok_iso_yo/vo_shot1.mp3",
    caption: "Kok es batu bisa mengapung?",
  },
  // Shot 2: Explanation & Molecular Lattice (2 - 6s)
  shot2: {
    startFrame: 60,
    endFrame: 180,
    duration: 120,
    voStartFrame: 64,
    voFile: "assets/kok_iso_yo/vo_shot2_timed.mp3",
    caption: "Saat membeku, air mengembang. Susunannya lebih renggang, jadi massa jenisnya turun.",
  },
  // Shot 3: Punchline (6 - 8s)
  shot3: {
    startFrame: 180,
    endFrame: 240,
    duration: 60,
    voStartFrame: 186,
    voFile: "assets/kok_iso_yo/vo_shot3.mp3",
    caption: "Dingin-dingin malah makan tempat!",
  },
} as const;

export const AUDIO_TRACKS = {
  bgm: "assets/kok_iso_yo/bgm_kok_iso_yo.wav",
  whoosh: "assets/kok_iso_yo/whoosh.wav",
  iceClink: "assets/kok_iso_yo/ice_clink.wav",
  punchlinePop: "assets/kok_iso_yo/pop_punchline.wav",
} as const;
