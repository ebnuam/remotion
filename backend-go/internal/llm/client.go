package llm

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"video-factory/internal/channel"
	"video-factory/internal/config"
	"video-factory/internal/script"

	openai "github.com/sashabaranov/go-openai"
)

type LLMClient struct {
	client         *openai.Client
	fallbackClient *openai.Client
	model          string
}

func NewLLMClient(cfg *config.Config) *LLMClient {
	clientConfig := openai.DefaultConfig(cfg.LLMAPIKey)
	clientConfig.BaseURL = cfg.LLMBaseURL

	var fallbackClient *openai.Client
	if strings.Contains(cfg.LLMAPIKey, "#") {
		baseKey := strings.Split(cfg.LLMAPIKey, "#")[0]
		fbConfig := openai.DefaultConfig(baseKey)
		fbConfig.BaseURL = cfg.LLMBaseURL
		fallbackClient = openai.NewClientWithConfig(fbConfig)
	}

	return &LLMClient{
		client:         openai.NewClientWithConfig(clientConfig),
		fallbackClient: fallbackClient,
		model:          cfg.LLMModel,
	}
}

// GenerateScript prompts AGYBridge to produce a structured video script tailored to the channel's visual identity
func (l *LLMClient) GenerateScript(ctx context.Context, ch *channel.ChannelConfig, topic string) (*script.ScriptData, error) {
	ctx, cancel := context.WithTimeout(ctx, 120*time.Second)
	defer cancel()

	styleGuide := "Cinematic 2D Motion Graphics"
	themeColor := "#FF7A00"
	if ch.VisualIdentity != nil {
		if st := ch.VisualIdentity.Style; st != "" {
			styleGuide = st
		}
		if pal := ch.VisualIdentity.Palette; pal != nil && pal["primary"] != "" {
			themeColor = pal["primary"]
		}
	}

	systemPrompt := fmt.Sprintf(`Kamu adalah Tim Sutradara Terpadu: AI Story Director & AI Visual Director kelas dunia untuk video vertikal viral (Shorts / Reels / TikTok).
Channel ID: %s
Channel Name: %s
Language: %s
Niche: %s
Tone: %s
Visual Style Identity: %s
Duration Target: %d detik

PERAN 1: AI STORY DIRECTOR
- Rancang struktur narasi bertempo cepat (3-5 detik per beat).
- Bangun alur: Hook provokatif (Beat 1) -> Eskalasi konflik psikologis sehari-hari (Beat 2-3) -> Puncak masalah / twist lucu (Beat 4-5) -> Payoff & Punchline cerdas (Beat akhir).
- Kalimat narasi ('text') harus padat, lugas, santai, dan berbobot (maksimal 12-18 kata per adegan).

PERAN 2: AI VISUAL DIRECTOR (DYNAMIC 2.5D STORYTELLING)
Video ini BUKAN slideshow membosankan dan BUKAN pencocokan kata-kunci statis!
Kamu menyutradarai setiap frame seperti film animasi pendek:
1. 'composition': Pilih komposisi yang dinamis dan bervariasi:
   - "character_action": Karakter animasi beraksi di lingkungan (misal: duduk bengong, scrolling HP, rebahan, ngetik panik).
   - "macro_inspection": Close-up dramatis pada objek/properti penting (jam dinding mepet 23:58, layar HP menyala notif 99+, kalender deadline).
   - "visual_metaphor": Metafora konseptual kartun (baterai dopamin terisi kilat, otak berkacamata santai, timbangan dilema, grafik melonjak).
   - "split_comparison": Split perbandingan (Rencana jam 8 malam vs Realita jam 2 pagi).
2. 'shot_type': "wide", "medium", "close_up", "macro", "reaction".
3. 'camera_motion': "zoom_punch", "dramatic_pull", "shake_punch", "pan_left", "pan_right", "slow_drift".
4. 'character_action': "sitting_bored", "sitting_phone", "lying_bed", "sitting_typing_panic", "shocked", "celebrating".
5. 'expression': "bored", "relaxed", "shocked", "panic", "smug".
6. 'environment': "bedroom_night", "office_desk", "cafe", "abstract_dopamine".
7. 'props': Array objek konkret seperti ["laptop", "smartphone", "clock", "coffee_cup", "calendar"].
8. 'headline_line1' & 'headline_line2': Teks judul tebal kapital yang menonjol dan langsung terbaca dalam 1 detik.
9. 'action_sequence' (SANGAT PENTING UNTUK ADENGAN BERAKSI):
   Setiap adegan berdurasi 4-5 detik BUKAN gambar diam! Untuk adegan (terutama 'character_action'), sutradarai minimal 3 tahapan aksi berurutan ('action_sequence') dengan perkembangan visual yang jelas:
   - Beat 1: Keadaan awal (start_progress: 0.0, duration_progress: 0.35), misal: duduk santai scrolling HP, expression: "relaxed".
   - Beat 2: Interaksi objek / kesadaran (start_progress: 0.35, duration_progress: 0.35), misal: meraih cangkir kopi / menoleh ke jam / HP bergetar, expression: "alert" atau "curious", prop_interaction: "phone_buzz" atau "lift_mug".
   - Beat 3: Reaksi klimaks / perubahan pose (start_progress: 0.70, duration_progress: 0.30), misal: tersentak kaget tangan memegang kepala atau buru-buru ngetik, pose: "startled_hands" atau "sitting_typing_panic", expression: "shocked" atau "panic", camera_movement: "zoom_in" atau "shake".

ATURAN KOMPOSISI SINEMATIK (SANGAT PENTING):
1. Setiap video berdurasi 15 detik (4 adegan) WAJIB memiliki MINIMAL 3 JENIS 'composition' BERBEDA!
   Contoh urutan beat dinamis:
   - Beat 1: "character_action" (Karakter bosan di depan laptop, shot_type: "medium")
   - Beat 2: "macro_inspection" (Close-up smartphone +99 notif ATAU jam dinding alarm 23:58, shot_type: "macro")
   - Beat 3: "visual_metaphor" (Baterai dopamin instan 100%% ATAU timbangan dilema, shot_type: "medium")
   - Beat 4: "character_action" (Ngetik panik brutal dengan lampu darurat merah, shot_type: "reaction") ATAU "split_comparison" (Rencana vs Realita)
2. Variasikan 'shot_type' di setiap adegan: berganti antara "medium", "macro", "reaction", dan "wide".
3. Variasikan 'camera_motion': "zoom_punch", "dramatic_pull", "shake_punch", "slow_drift".
4. 'props' harus berisi objek konkret yang relevan dengan narasi (contoh: ["laptop", "coffee_cup"], ["smartphone", "notification"], ["dopamine_battery", "lightning"], ["alarm_clock", "sweat"]).

ATURAN OUTPUT:
- Jika durasi target ~15 detik: Buat tepat 4 adegan tajam.
- Jika durasi target ~30-60 detik: Buat antara 8 hingga 12 adegan dinamis.
- Kembalikan HANYA format JSON valid tanpa backtick markdown codeblock.

FORMAT JSON:
{
  "title": "Judul Menarik Singkat",
  "hook": "Kalimat pembuka hook 3 detik pertama",
  "narration": "Gabungan lengkap teks narasi seluruh adegan",
  "punchline": "Kalimat penutup punchline / pesan inti yang berkesan",
  "theme_color": "%s",
  "scenes": [
    {
      "index": 1,
      "text": "Kalimat narasi singkat adegan 1 (10-15 kata).",
      "tag": "PSIKOLOGI HARIAN / KASUS #1 / FAKTA UNIK",
      "headline_line1": "HEADLINE BARIS 1 TEBAL KAPITAL",
      "headline_line2": "HEADLINE BARIS 2 WARNA AKSEN",
      "visual_intent": "Tujuan visual dramatis sutradara untuk adegan ini",
      "composition": "character_action",
      "shot_type": "medium",
      "camera_angle": "eye_level",
      "camera_motion": "zoom_punch",
      "environment": "bedroom_night",
      "character_action": "sitting_bored",
      "expression": "bored",
      "props": ["laptop", "coffee_cup"],
      "action_sequence": [
        {
          "beat_index": 1,
          "start_progress": 0.0,
          "duration_progress": 0.35,
          "target": "character",
          "action": "sitting_phone",
          "pose": "sitting_phone",
          "expression": "relaxed",
          "prop_interaction": "holding_phone",
          "camera_movement": "drift",
          "description": "Karakter santai scrolling medsos"
        },
        {
          "beat_index": 2,
          "start_progress": 0.35,
          "duration_progress": 0.35,
          "target": "props",
          "action": "glance_clock",
          "pose": "reach_prop",
          "expression": "alert",
          "prop_interaction": "phone_buzz",
          "camera_movement": "pan_props",
          "description": "HP bergetar notif dan karakter melirik jam dinding"
        },
        {
          "beat_index": 3,
          "start_progress": 0.70,
          "duration_progress": 0.30,
          "target": "character",
          "action": "startle",
          "pose": "startled_hands",
          "expression": "panic",
          "prop_interaction": "laptop_alert",
          "camera_movement": "zoom_in",
          "description": "Karakter tersentak panik melihat waktu sudah mepet"
        }
      ],
      "foreground": "meja dengan cangkir kopi mengepul",
      "midground": "karakter menopang dagu menatap layar laptop",
      "background": "dinding kamar malam dengan jendela bulan",
      "visual_cue": "procrastination_desk",
      "visual": "Karakter menopang dagu menatap laptop dengan bosan",
      "sound_cue": "whoosh"
    }
  ],
  "sources": []
}`, ch.ID, ch.DisplayName, ch.Language, ch.Niche, ch.Tone, styleGuide, ch.DurationTargetSeconds, themeColor)

	if len(ch.EditorialRules) > 0 {
		systemPrompt += "\nAturan Khusus:\n- " + strings.Join(ch.EditorialRules, "\n- ")
	}

	userPrompt := fmt.Sprintf("Topik: %s\nBuat naskah dan sutradarai animasi visual kartun sesuai format JSON.", topic)

	req := openai.ChatCompletionRequest{
		Model: l.model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: systemPrompt,
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: userPrompt,
			},
		},
		Temperature: 0.7,
	}

	resp, err := l.client.CreateChatCompletion(ctx, req)
	if err != nil && l.fallbackClient != nil && (strings.Contains(err.Error(), "credentials") || strings.Contains(err.Error(), "500")) {
		log.Println("[WARN] Account credential error on AGYBridge proxy. Retrying with active bridge session...")
		resp, err = l.fallbackClient.CreateChatCompletion(ctx, req)
	}
	if err != nil {
		return nil, fmt.Errorf("AGYBridge request failed: %w", err)
	}

	if len(resp.Choices) == 0 {
		return nil, fmt.Errorf("empty response received from AGYBridge")
	}

	rawContent := strings.TrimSpace(resp.Choices[0].Message.Content)

	// Clean markdown code blocks if the model wrapped output in ```json ... ```
	cleaned := rawContent
	if strings.HasPrefix(cleaned, "```") {
		lines := strings.Split(cleaned, "\n")
		if len(lines) >= 2 {
			lines = lines[1:]
			if len(lines) > 0 && strings.HasPrefix(strings.TrimSpace(lines[len(lines)-1]), "```") {
				lines = lines[:len(lines)-1]
			}
			cleaned = strings.TrimSpace(strings.Join(lines, "\n"))
		}
	}

	var scriptData script.ScriptData
	if err := json.Unmarshal([]byte(cleaned), &scriptData); err != nil {
		return nil, fmt.Errorf("failed to parse AI JSON response: %w\nRaw content: %s", err, rawContent)
	}

	scriptData.ChannelID = ch.ID
	scriptData.Topic = topic

	if err := script.ValidateScript(&scriptData); err != nil {
		return nil, fmt.Errorf("script validation failed: %w", err)
	}

	return &scriptData, nil
}
