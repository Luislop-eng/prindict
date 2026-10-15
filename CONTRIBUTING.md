# Contributing to Prindict

Thanks for helping! Prindict is a small, dependency-light, browser-only app — please keep it that way (no backend, no required API keys).

## Setup

```bash
npm install
npm run dev     # http://localhost:5173 — open it in Chrome desktop
```

Before opening a pull request:

```bash
npm run typecheck
npm test
npm run build
```

If you touched speech, recording or the canvas, also try it for real in Chrome: record a short clip with your voice and play it back.

## Good first contributions

- **A new language** — one file in `src/engine/locales/` (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#adding-a-language)).
- **More emoji / Turbo trigger words** for an existing language.
- **English UI** (the interface text is currently Italian).
- **MP4 export** (e.g. `ffmpeg.wasm`, loaded lazily) for players that can't open WebM.
- New Turbo effects: add the id to `effects/registry.ts`, the animation to `canvasRenderer.ts` and `TurboStage.tsx`.

## Guidelines

- TypeScript strict, functional React components and hooks.
- Keep the engine (`src/engine/`) free of React/DOM so it stays unit-testable.
- One topic per pull request; describe what and why.
- Never commit secrets or `.env` files (the app needs none).

By contributing you agree your work is released under the [MIT License](LICENSE).
