package script

import (
	"errors"
	"fmt"
	"strings"
)

type ActionBeat struct {
	BeatIndex        int     `json:"beat_index"`
	StartProgress    float64 `json:"start_progress"`    // 0.0 - 1.0 relative to scene start
	DurationProgress float64 `json:"duration_progress"` // duration fraction within scene
	Target           string  `json:"target"`            // "character", "props", "camera", "environment"
	Action           string  `json:"action"`            // e.g. "reach_mug", "glance_clock", "drop_phone", "startle", "type_frantic"
	Pose             string  `json:"pose,omitempty"`    // "sitting_phone", "sitting_bored", "reach_prop", "startled_hands", "sitting_typing_panic"
	Expression       string  `json:"expression,omitempty"` // "relaxed", "bored", "curious", "alert", "shocked", "panic"
	PropInteraction  string  `json:"prop_interaction,omitempty"` // "holding_phone", "lift_mug", "phone_buzz", "laptop_alert"
	CameraMovement   string  `json:"camera_movement,omitempty"`  // "zoom_in", "pan_props", "shake", "drift"
	Description      string  `json:"description,omitempty"`
}

type Scene struct {
	Index            int          `json:"index"`
	Text             string       `json:"text"`
	Visual           string       `json:"visual"`
	VisualCue        string       `json:"visual_cue,omitempty"`
	VisualIntent     string       `json:"visual_intent,omitempty"`
	ShotType         string       `json:"shot_type,omitempty"`
	CameraAngle      string       `json:"camera_angle,omitempty"`
	Composition      string       `json:"composition,omitempty"`
	Environment      string       `json:"environment,omitempty"`
	CharacterAction  string       `json:"character_action,omitempty"`
	Expression       string       `json:"expression,omitempty"`
	Props            []string     `json:"props,omitempty"`
	ActionSequence   []ActionBeat `json:"action_sequence,omitempty"`
	Foreground       string       `json:"foreground,omitempty"`
	Midground        string       `json:"midground,omitempty"`
	Background       string       `json:"background,omitempty"`
	CameraMotion     string       `json:"camera_motion,omitempty"`
	Transition       string       `json:"transition,omitempty"`
	EnvironmentAsset string       `json:"environment_asset,omitempty"`
	ActorAsset       string       `json:"actor_asset,omitempty"`
	Tag              string       `json:"tag,omitempty"`
	HeadlineLine1    string       `json:"headline_line1,omitempty"`
	HeadlineLine2    string       `json:"headline_line2,omitempty"`
	Objects          []string     `json:"objects,omitempty"`
	CameraShot       string       `json:"camera_shot,omitempty"`
	SoundCue         string       `json:"sound_cue,omitempty"`
	EstimatedSeconds float64      `json:"estimated_seconds,omitempty"`
	StartSeconds     float64      `json:"start_seconds"`
	EndSeconds       float64      `json:"end_seconds"`
}

type ScriptData struct {
	Title      string   `json:"title"`
	Hook       string   `json:"hook"`
	Narration  string   `json:"narration"`
	Punchline  string   `json:"punchline"`
	ThemeColor string   `json:"theme_color"`
	Scenes     []Scene  `json:"scenes"`
	Sources    []string `json:"sources,omitempty"`
	ChannelID  string   `json:"channel_id,omitempty"`
	Topic      string   `json:"topic,omitempty"`
}

// ValidateScript validates that all necessary fields exist and are not empty
func ValidateScript(s *ScriptData) error {
	if s == nil {
		return errors.New("script is nil")
	}
	if strings.TrimSpace(s.Title) == "" {
		return errors.New("script title is empty")
	}
	if strings.TrimSpace(s.Hook) == "" {
		return errors.New("script hook is empty")
	}
	if strings.TrimSpace(s.Narration) == "" {
		return errors.New("script narration is empty")
	}
	if strings.TrimSpace(s.Punchline) == "" {
		return errors.New("script punchline is empty")
	}
	if len(s.Scenes) == 0 {
		return errors.New("script must contain at least one scene")
	}

	for i := range s.Scenes {
		sc := &s.Scenes[i]
		if strings.TrimSpace(sc.Text) == "" {
			return fmt.Errorf("scene %d has empty text", i+1)
		}
		// Synchronize visual and visual_cue
		if sc.Visual == "" && sc.VisualCue != "" {
			sc.Visual = sc.VisualCue
		}
		if sc.VisualCue == "" && sc.Visual != "" {
			sc.VisualCue = sc.Visual
		}
		if strings.TrimSpace(sc.Visual) == "" {
			sc.Visual = "default"
			sc.VisualCue = "default"
		}
	}

	if strings.TrimSpace(s.ThemeColor) == "" {
		s.ThemeColor = "#1e293b" // default dark slate
	}

	return nil
}
