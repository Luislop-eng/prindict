# Prindict

**Your voice becomes kinetic text, live.** Talk, and the words you say appear on screen as big, bold, animated captions — numbers formatted, filler words removed, emoji added. Record the result as a ready-to-post clip in 9:16, 1:1 or 16:9.

Everything runs in your browser: no server, no account, no API keys.

🇮🇹 [Leggi in italiano](README.it.md)

---

## Features

- **Live karaoke captions** — a sliding window of the last few words, rendered big and bold as you speak.
- **Smart formatting, rule-based** — spoken numbers become digits (`two hundred fifty thousand` → `250,000`, `novanta per cento` → `90%`), currencies get their symbol, fillers (“uhm”, “like”, “cioè”…) disappear, sentences get a full stop on pauses.
- **Contextual emoji** — ~200 keywords per language, including multi-word matches (toggle on/off).
- **Turbo mode ⚡** — the text *acts out* what you say: “explodes” bursts letter by letter, “rises” moves up, numbers get isolated and highlighted. A “taste governor” caps strong effects per beat so it never gets noisy.
- **Three languages** — Italian, English, Spanish (speech recognition, numbers, fillers, emoji, Turbo triggers). Adding one is a single file — see [CONTRIBUTING](CONTRIBUTING.md).
- **One-click recording** — the stage is drawn on a `<canvas>` and recorded with `MediaRecorder` together with your microphone. No screen-share dialog, no black bars, exact 1080×1920 / 1920×1080 / 1080×1080 output.
- **Review & re-render** — fix transcription mistakes in the script, then regenerate a clean, voice-less clip with stable beats (great as an overlay in CapCut / Premiere).
- **Customize** — 8 themes, 8 display fonts, custom colors, your own background image, text size slider. Saved locally.

## Requirements

| | |
|---|---|
| **Browser** | **Chrome or Edge, desktop.** Prindict relies on the Web Speech API, which other browsers either lack (Firefox) or implement unreliably (Safari). Unsupported browsers get a clear notice. |
| **Context** | `https://` or `http://localhost` (microphone access requires a secure context). |
| **Node.js** | ≥ 20.19 (only to build / develop). |

## Quick start

```bash
git clone https://github.com/Luislop-eng/prindict.git
cd prindict
npm install
npm run dev
```

Open <http://localhost:5173> in Chrome, click **Inizia → Anteprima**, allow the microphone, and start talking.

To record: **Registra clip** → red button → talk → stop → **Scarica clip**.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests (Vitest) |
| `npm run typecheck` | TypeScript only |

## Deploy

`dist/` is a fully static site — host it anywhere that serves HTTPS (GitHub Pages, Netlify, Vercel, Cloudflare Pages, any web server). Assets use relative paths, so it also works from a sub-folder.

**GitHub Pages:** this repo ships a workflow (`.github/workflows/deploy-pages.yml`). Enable it once under *Settings → Pages → Source: GitHub Actions*; every push to `main` then publishes the app.

## Privacy

Prindict has no backend and stores nothing remotely: your settings and background image live in your browser's `localStorage`, and recorded clips stay on your machine until you download them.

**However**, speech recognition is provided by the browser. In Chrome, the Web Speech API sends microphone audio to Google's servers to transcribe it. Keep that in mind before using Prindict for sensitive content.

UI fonts are loaded from Google Fonts.

## Known limitations

- **Clips are `.webm` (VP9 + Opus).** Chrome's `MediaRecorder` can't mux microphone audio into MP4, so WebM is used to keep the voice. QuickTime / macOS Preview can't open WebM — play it in Chrome or VLC. Instagram, TikTok, YouTube and most editors accept it. MP4 export (e.g. via `ffmpeg.wasm`) is a welcome contribution.
- WebM files from `MediaRecorder` have no duration in their header, so some players can't seek until the file is re-muxed.
- Chrome stops recognition after long silences; Prindict restarts it automatically, but a word may occasionally be missed right at the restart.
- The app UI is in Italian (the captions support IT/EN/ES). UI translations are welcome.
- The “Presentazioni live” card on the dashboard is a placeholder for a future mode.

## How it works

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a tour of the code: speech hook → display engine → Turbo engine → canvas renderer → recorder.

Stack: React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Vitest.

## Contributing

Issues and pull requests are welcome — read [CONTRIBUTING.md](CONTRIBUTING.md) first. Security issues: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 Luigi Loperfido
