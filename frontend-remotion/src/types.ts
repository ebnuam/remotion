export interface ActionBeat {
  beat_index?: number;
  start_progress: number; // 0.0 - 1.0 relative to scene start
  duration_progress: number; // duration fraction within scene
  target: string; // "character" | "props" | "camera" | "environment"
  action: string; // e.g. "reach_mug", "glance_clock", "drop_phone", "startle", "type_frantic"
  pose?: string; // e.g. "sitting_phone", "sitting_bored", "reach_prop", "startled_hands", "sitting_typing_panic"
  expression?: string; // e.g. "relaxed", "bored", "curious", "alert", "shocked", "panic"
  prop_interaction?: string; // e.g. "holding_phone", "lift_mug", "phone_buzz", "laptop_alert"
  camera_movement?: string; // e.g. "zoom_in", "pan_props", "shake", "drift"
  description?: string;
}

export interface Scene {
  index: number;
  text: string;
  visual: string;
  visual_cue?: string;
  visual_intent?: string;
  shot_type?: string;
  camera_angle?: string;
  composition?: string;
  environment?: string;
  character_action?: string;
  expression?: string;
  props?: string[];
  action_sequence?: ActionBeat[];
  foreground?: string;
  midground?: string;
  background?: string;
  camera_motion?: string;
  transition?: string;
  environment_asset?: string;
  actor_asset?: string;
  tag?: string;
  headline_line1?: string;
  headline_line2?: string;
  objects?: string[];
  camera_shot?: string;
  sound_cue?: string;
  start_seconds: number;
  end_seconds: number;
}

export interface RenderProps {
  title: string;
  hook: string;
  narration: string;
  punchline: string;
  theme_color: string;
  scenes: Scene[];
  audio_file: string;
  audio_duration: number;
  channel_name: string;
  channel_id: string;
}

export const defaultRenderProps: RenderProps = {
  title: "Kenapa Suka Nunda Deadline?",
  hook: "Deadline besok pagi, tapi jam dua malam malah sibuk bersihin kipas angin?",
  narration: "Contoh narasi default untuk preview Remotion.",
  punchline: "Deadline itu alarm panik, bukan sumber inspirasi!",
  theme_color: "#FF7A00",
  audio_file: "",
  audio_duration: 36.5,
  channel_name: "OtakReceh",
  channel_id: "otak-receh",
  scenes: [
    {
      index: 1,
      text: "Deadline besok pagi, tapi jam dua malam malah sibuk scrolling medsos?",
      visual: "scrolling",
      visual_cue: "scrolling",
      start_seconds: 0.0,
      end_seconds: 8.1,
    },
    {
      index: 2,
      text: "Tenang, ini bukan malas, tapi amigdala otak lagi kabur nyari dopamin!",
      visual: "lazy",
      visual_cue: "lazy",
      start_seconds: 8.1,
      end_seconds: 14.0,
    },
    {
      index: 3,
      text: "Rebahan terus sampai waktu mepet, baru alarm bahaya bunyi keras!",
      visual: "panic",
      visual_cue: "panic",
      start_seconds: 14.0,
      end_seconds: 22.4,
    },
    {
      index: 4,
      text: "Ingat kawan, deadline itu alarm panik, bukan sumber inspirasi!",
      visual: "default",
      visual_cue: "default",
      start_seconds: 22.4,
      end_seconds: 30.1,
    },
  ],
};
