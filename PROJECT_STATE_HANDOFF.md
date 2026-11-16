# KONSISTENSI & STATUS PROYEK REMOTION SHORTS (HANDOFF DOCUMENT)
**Terakhir Diperbarui:** 16 November 2026  
**Workspace:** `C:\Users\USER\Documents\REMOTION\frontend-remotion`  
**Output Directory:** `D:\remotion_output`  
**Temp Directory:** `D:\remotion_tmp` (Wajib di-set untuk proteksi Drive C)

---

## 1. RINGKASAN ARSITEKTUR & DEPENDENSI TERKUNCI

- **Runtime & Framework:** Node.js v24.22.1, Remotion 4.0.543, React 18, React Three Fiber (R3F), Three.js `0.161.0` (save-exact, TIDAK BOLEH diubah/di-upgrade).
- **GPU & Rendering Flag:** Wajib menggunakan `--gl=angle` dan `--concurrency=1` untuk stabilitas WebGL ANGLE di Windows.
- **ToneMapping Mode:** `ToneMappingMode.ACES_FILMIC` (di `postprocessing`).
- **Template Baseline Asli:** `D:\claude-animated-shorts` (TIDAK BOLEH diubah). Sandbox bridge ada di `src/sandboxes/bridge/` dan entry test di `src/sandboxes/test_entry.tsx` (`BridgeShort`).

---

## 2. PROYEK 1: CHANNEL "KOK ISO YO?" (KOK BISA YA?)
*Genre: Fakta Sains Populer, Eksperimen 3D, Storytelling & Punchline Komedi.*

### A. Karakter Utama: Mas Iso
- **Visual:** Presenter pemuda kacamata bulat, rambut cokelat berantakan, rompi toska/teal, kemeja krem, celana cokelat. Model sheet resmi: `mas_iso_character_model_sheet_v2_1794761169893.jpg`.
- **Aset Sprite Bersih:** Terletak di `frontend-remotion/public/assets/kok_iso_yo/`:
  - `mas_iso_front.png`, `mas_iso_front_headless.png` (untuk artikulasi kepala swap)
  - `mas_iso_34.png` (pose berdiri 3/4)
  - `head_deadpan.png` (kepala datar/sayu punchline)
  - `head_curious.png` (kepala penasaran)

### B. Video Pilot 01: "Kenapa Es Batu Bisa Mengapung?" (STATUS: SELESAI 100%)
- **Output:** `D:\remotion_output\kok_iso_yo_pilot_01.mp4` (1.9 MB, 8.00 detik / 240 frame @ 30 FPS, resolusi 540×960).
- **Struktur 3-Shot:**
  - **Shot 1 (0–2s):** Establishing lab sains 3D, meja kayu, gelas kaca berisi air & es batu terapung, Mas Iso pose 3/4. VO: *"Kok es batu bisa mengapung?"*.
  - **Shot 2 (2–6s):** Zoom macro ke kisi molekul H₂O 3D (atom oksigen & hidrogen) yang meregang membentuk struktur kristal heksagonal berongga saat membeku. VO: *"Saat membeku, air mengembang. Susunannya lebih renggang, jadi massa jenisnya turun."*.
  - **Shot 3 (6–8s):** Cutback ke Mas Iso melihat gelas, lalu memutar kepala deadpan ke kamera dengan SFX pop kartun. VO: *"Dingin-dingin malah makan tempat!"*.
- **Audio Pipeline:** VO Edge-TTS `id-ID-ArdiNeural`, custom BGM marimba 120 BPM, custom SFX whoosh, ice clink, punchline pop.
- **Entrypoint Sandbox:** `src/sandboxes/kok-iso-yo-pilot/entry.tsx` (ID: `KokIsoYoPilot01`).

---

## 3. PROYEK 2: CHANNEL "OTAK RECEH"
*Genre: Overthinking Gen-Z, Komedi Situasional Sehari-hari, Relatable.*

### A. Karakter Utama: Si Receh
- **Identitas:** Pemuda kepala besar asimetris (bean-shaped), rambut hitam berantakan, mata sayu berkantung, hoodie mustard yellow (`#E5A93B`), sweatpants abu-abu gelap (`#2D3142`), outline hitam tebal hand-drawn.
- **Aset & Dokumen:**
  - Model Sheet: `si_receh_character_design_sheet_v2_1794758182096.jpg`
  - Spesifikasi Teknis: `SI_RECEH_CHARACTER_DESIGN_SHEET.md`
- **Sandbox Terisolasi:** `src/sandboxes/si-receh-mvp/`
- **Sample Script JSON:** Tersedia di `sample_scripts/`:
  - `otak_receh_sample.json`
  - `otak_receh_tidur_memalukan.json`
  - `otak_receh_waktu_cepat.json`

---

## 4. STANDAR COMMAND EKSEKUSI RENDER LOKAL

### Render Still (Frame Tunggal):
```cmd
cmd /c "set TEMP=D:\remotion_tmp& set TMP=D:\remotion_tmp& cd /d C:\Users\USER\Documents\REMOTION\frontend-remotion& .\node_modules\.bin\remotion.cmd still <entry.tsx> <CompositionId> <output.jpg> --frame=<frame_no> --gl=angle"
```

### Render Video MP4:
```cmd
cmd /c "set TEMP=D:\remotion_tmp& set TMP=D:\remotion_tmp& cd /d C:\Users\USER\Documents\REMOTION\frontend-remotion& .\node_modules\.bin\remotion.cmd render <entry.tsx> <CompositionId> <output.mp4> --concurrency=1 --gl=angle"
```

---

## 5. REKOMENDASI TAHAPAN SELANJUTNYA
1. **Memproduksi Pilot 02 Kok Iso Yo?** (Topik baru sains unik / fenomena sehari-hari, menggunakan aset 3D & Mas Iso yang sudah matang).
2. **Memproduksi Pilot 01 Otak Receh** (Mengembangkan animasi 2.5D Si Receh berdasarkan naskah di `sample_scripts/`).
3. **Pipeline Automasi Batch:** Menghubungkan template dengan data JSON naskah untuk generate audio & video secara semi-otomatis.
