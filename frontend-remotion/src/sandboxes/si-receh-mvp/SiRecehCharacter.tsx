/**
 * SI RECEH - Main Character Component (MVP Scaffold)
 * Production-ready 2D Cutout Rig based on Spec V2 & Design Sheet V2.
 */
import React from "react";
import { BodyGroup } from "./BodyGroup";
import { CharacterRoot } from "./CharacterRoot";
import { SiRecehCharacterProps } from "./types";

export const SiRecehCharacter: React.FC<SiRecehCharacterProps> = ({
  expression = "neutral",
  gesture = "idle",
  pose = "standing",
  isSpeaking = false,
  scale = 1,
  position = [0, 0],
  debugMode = false,
  useInlinePlaceholders = true,
}) => {
  return (
    <CharacterRoot scale={scale} position={position} debugMode={debugMode}>
      <BodyGroup
        expression={expression}
        gesture={gesture}
        pose={pose}
        isSpeaking={isSpeaking}
        useInlinePlaceholders={useInlinePlaceholders}
      />
    </CharacterRoot>
  );
};
