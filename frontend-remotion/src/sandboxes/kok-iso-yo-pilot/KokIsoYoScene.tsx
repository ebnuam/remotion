/**
 * KOK ISO YO? - Pilot 01 Main Scene Component
 * Integrates Three.js 2.5D World, Remotion ThreeCanvas,
 * Kinetic Subtitle Overlays, and Multi-track Audio (VO, BGM, SFX).
 */
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { AUDIO_TRACKS, SHOTS } from "./constants";
import { KokIsoYoWorld } from "./KokIsoYoWorld";

// 1. Texture Preloader
const TEXTURE_LIST = [
  "mas_iso_front.png",
  "mas_iso_front_headless.png",
  "mas_iso_34.png",
  "head_curious.png",
  "head_shocked.png",
  "head_deadpan.png",
  "pose_explaining.png",
  "pose_panic.png",
];

const useTextures = () => {
  const [textures, setTextures] = useState<Record<string, THREE.Texture> | null>(null);
  const [handle] = useState(() => delayRender("loading mas iso textures"));

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let count = 0;
    const loaded: Record<string, THREE.Texture> = {};

    TEXTURE_LIST.forEach((name) => {
      loader.load(
        staticFile(`assets/kok_iso_yo/${name}`),
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          loaded[name] = tex;
          count++;
          if (count === TEXTURE_LIST.length) {
            setTextures(loaded);
            continueRender(handle);
          }
        },
        undefined,
        () => {
          count++;
          if (count === TEXTURE_LIST.length) {
            setTextures(loaded);
            continueRender(handle);
          }
        }
      );
    });
  }, [handle]);

  return textures;
};

// 2. Three.js Inner Render Loop
const InnerWorld: React.FC<{ textures: Record<string, THREE.Texture> }> = ({ textures }) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  const world = useMemo(() => new KokIsoYoWorld(textures), [textures]);
  const cam = camera as THREE.PerspectiveCamera;

  // Update world simulation and camera position synchronously before render
  world.update(frame, cam);

  // Postprocessing: ToneMapping (ACES_FILMIC) + Subtle Bloom
  const fx = useMemo(
    () => ({
      bloom: new BloomEffect({ intensity: 0.35, luminanceThreshold: 0.95 }),
      tone: new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }),
    }),
    []
  );

  return (
    <>
      <primitive object={world.root} dispose={null} />
      <EffectComposer multisampling={4}>
        <primitive object={fx.bloom} />
        <primitive object={fx.tone} />
      </EffectComposer>
    </>
  );
};

// 3. Kinetic Subtitle Overlay Component
const KineticSubtitle: React.FC = () => {
  const frame = useCurrentFrame();

  let text = "";
  let highlightWord = "";

  if (frame >= SHOTS.shot1.startFrame && frame < SHOTS.shot1.endFrame) {
    text = "Kok es batu bisa mengapung?";
    highlightWord = "mengapung";
  } else if (frame >= SHOTS.shot2.startFrame && frame < SHOTS.shot2.endFrame) {
    if (frame < 125) {
      text = "Saat membeku, air mengembang...";
      highlightWord = "mengembang";
    } else {
      text = "Susunannya lebih renggang, massa jenisnya turun!";
      highlightWord = "massa jenisnya turun";
    }
  } else if (frame >= SHOTS.shot3.startFrame) {
    text = "Dingin-dingin malah makan tempat!";
    highlightWord = "makan tempat!";
  }

  if (!text) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 20,
        right: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(18, 22, 28, 0.88)",
          border: "2px solid rgba(255, 215, 0, 0.6)",
          padding: "10px 22px",
          borderRadius: 30,
          boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
          textAlign: "center",
          color: "#FFFFFF",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          letterSpacing: 0.3,
        }}
      >
        {text.split(" ").map((word, i) => {
          const isHighlight = highlightWord.toLowerCase().includes(word.toLowerCase());
          return (
            <span
              key={i}
              style={{
                color: isHighlight ? "#FFD166" : "#FFFFFF",
                marginRight: 6,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// 4. Main Exported Scene
export const KokIsoYoScene: React.FC = () => {
  const textures = useTextures();
  const { width, height } = useVideoConfig();

  if (!textures) {
    return <AbsoluteFill style={{ backgroundColor: "#1A2026" }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A2026", overflow: "hidden" }}>
      {/* 3D WebGL Canvas */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <InnerWorld textures={textures} />
      </ThreeCanvas>

      {/* Kinetic Subtitles */}
      <KineticSubtitle />

      {/* Audio Layer 1: Background Music (Looped across 8 seconds) */}
      <Audio src={staticFile(AUDIO_TRACKS.bgm)} volume={0.25} />

      {/* Audio Layer 2: Voice-Over Sequences */}
      <Sequence from={SHOTS.shot1.voStartFrame} durationInFrames={SHOTS.shot1.duration}>
        <Audio src={staticFile(SHOTS.shot1.voFile)} volume={1.0} />
      </Sequence>

      <Sequence from={SHOTS.shot2.voStartFrame} durationInFrames={SHOTS.shot2.duration}>
        <Audio src={staticFile(SHOTS.shot2.voFile)} volume={1.0} />
      </Sequence>

      <Sequence from={SHOTS.shot3.voStartFrame} durationInFrames={SHOTS.shot3.duration}>
        <Audio src={staticFile(SHOTS.shot3.voFile)} volume={1.0} />
      </Sequence>

      {/* Audio Layer 3: Sound Effects (SFX) */}
      {/* SFX: Whoosh into Shot 2 */}
      <Sequence from={56} durationInFrames={15}>
        <Audio src={staticFile(AUDIO_TRACKS.whoosh)} volume={0.45} />
      </Sequence>

      {/* SFX: Ice Clink & Molecular Expansion */}
      <Sequence from={88} durationInFrames={20}>
        <Audio src={staticFile(AUDIO_TRACKS.iceClink)} volume={0.6} />
      </Sequence>

      {/* SFX: Whoosh back to Shot 3 */}
      <Sequence from={176} durationInFrames={15}>
        <Audio src={staticFile(AUDIO_TRACKS.whoosh)} volume={0.45} />
      </Sequence>

      {/* SFX: Comedic Pop on Deadpan Punchline */}
      <Sequence from={188} durationInFrames={15}>
        <Audio src={staticFile(AUDIO_TRACKS.punchlinePop)} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};
