# Architecture

Prindict is a single-page React app with **no backend**. The whole pipeline runs in the browser:

```
 microphone
     │
     ▼
 useSpeech  ──(interim + final transcripts)──►  displayEngine.decide()   ─┐
 (Web Speech API)                               effects/turboEngine       │  StageItem[]
                                                (Turbo mode)              │
                                                                          ▼
                                                CanvasStage  ──►  canvasRenderer.drawStage()
                                                     │
                                         canvas.captureStream() + mic
                                                     ▼
                                               useRecorder (MediaRecorder) ──► .webm clip
```

## Folders

| Path | Role |
|---|---|
| `src/App.tsx` | Top-level state and routing: dashboard ↔ creator, and the `controller` / `stage` / `review` modes. |
| `src/hooks/useSpeech.ts` | Wraps the Web Speech API: continuous + interim results, picks the most confident alternative, auto-restarts after Chrome's silence timeout, switches language on the fly. |
| `src/hooks/useRecorder.ts` | Records a `<canvas>` (plus optional microphone) with `MediaRecorder`; preview → download / discard. Careful about releasing every track. |
| `src/engine/displayEngine.ts` | Rule-based “what to show”: last-N-words karaoke window, filler removal, trailing-number isolation, full stop on pauses, emoji. |
| `src/engine/numbers.ts` | Spoken numbers → formatted digits, per locale (concatenated Italian numerals, spaced English/Spanish ones, decimals, %, currency). |
| `src/engine/effects/` | Turbo mode: `registry.ts` lists the effects, `turboEngine.ts` turns words into animated tokens using each locale's trigger words, with a “taste governor” (max 2 strong effects at once). Tests live here. |
| `src/engine/locales/` | One file per language: speech code, fillers, emoji dictionary, number lexicon, Turbo triggers. |
| `src/engine/canvasRenderer.ts` | Deterministic frame renderer (animation = function of each token's age): background/image/scrim, auto-fit font size, word wrapping, per-effect transforms. |
| `src/engine/appearance.ts` | Themes, fonts, colors, background image; persisted in `localStorage`. |
| `src/components/` | UI. `Controller` is the creator workspace (live DOM preview via `StageScreen` / `TurboStage`); `CanvasStage` is the recordable stage; `ReviewRender` re-renders an edited script into a clip. |

## Design choices

- **Canvas, not screen capture.** What you see on the stage is exactly what is recorded — no permission dialog, no cropping, fixed export resolution (`RENDER_DIMS`).
- **Rules, not an LLM.** Everything is deterministic and free to run; no API keys.
- **Stable keys.** Tokens are keyed by their absolute position in the speech, so React/Framer don't remount words while the window slides.
- **Idle redraw skip.** `CanvasStage` stops redrawing when nothing changed and all animations settled — except while recording, where every frame is drawn.

## Adding a language

1. Copy `src/engine/locales/en.ts` to e.g. `fr.ts` and translate every field (`speechLang` must be a BCP-47 code Chrome supports, e.g. `fr-FR`).
2. Register it in `src/engine/locales/index.ts` (`LOCALES` and `LOCALE_LIST`).
3. Add a few cases to `turboEngine.test.ts` and run `npm test`.
