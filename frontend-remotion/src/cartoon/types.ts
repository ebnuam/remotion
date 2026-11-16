export type CharacterExpression =
  | "bored"
  | "relaxed"
  | "shocked"
  | "panic"
  | "curious"
  | "alert"
  | "smug";

export type CharacterPose =
  | "sitting_bored"
  | "sitting_phone"
  | "lying_bed"
  | "sitting_typing_panic"
  | "reach_prop"
  | "startled_hands";

export type CameraShotType =
  | "WIDE_ROOM"
  | "MEDIUM_DESK"
  | "CLOSEUP_PHONE"
  | "CLOSEUP_CLOCK"
  | "REACTION_FACE"
  | "MEDIUM_PANIC";

export interface CartoonSceneConfig {
  id: number;
  name: string;
  startFrame: number;
  endFrame: number;
  shotType: CameraShotType;
  pose: CharacterPose;
  expression: CharacterExpression;
  caption?: string;
}
