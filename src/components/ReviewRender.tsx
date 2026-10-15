import { useEffect, useRef, useState } from "react";
import { useRecorder } from "../hooks/useRecorder";
import { decide } from "../engine/displayEngine";
import { FORMATS, type FormatId } from "../engine/formats";
import { CanvasStage } from "./CanvasStage";
import { getLocale } from "../engine/locales";
import { turboTokens } from "../engine/effects/turboEngine";
import { directiveToItems, type StageItem } from "../engine/stageItems";
import type { StyleConfig } from "../engine/appearance";

interface Props {
  format: FormatId;
  style: StyleConfig;
  emojiOn: boolean;
  lang: string;
  turbo: boolean;
  initialScript: string;
  onExit: () => void;
}

interface Beat {
  text: string;
  ended: boolean;
  holdMs: number;
}

/**
 * Spezza lo script in "beat" stabili: gruppi di parole mostrati fermi, non una
 * finestra che scorre di continuo. Si chiude un beat sulla punteggiatura oppure
 * a `maxWords`. I beat più lunghi restano a schermo più a lungo (no overlap).
 */
function chunkIntoBeats(script: string, maxWords = 4): Beat[] {
  const words = script.trim().split(/\s+/).filter(Boolean);
  const beats: Beat[] = [];
  let cur: string[] = [];

  const flush = (ended: boolean) => {
    if (!cur.length) return;
    const wc = cur.length;
    beats.push({ text: cur.join(" "), ended, holdMs: Math.min(2200, 650 + 230 * wc) });
    cur = [];
  };

  for (const w of words) {
    cur.push(w);
    if (/[.!?…]$/.test(w)) flush(true);
    else if (cur.length >= maxWords) flush(false);
  }
  flush(true);
  return beats;
}

/**
 * Modalità PRO: rivedi lo script trascritto, correggi i refusi, rigenera la clip
 * dal testo corretto. Video senza voce (solo testo animato): ideale come overlay
 * in CapCut/Premiere.
 */
export function ReviewRender({ format, style, emojiOn, lang, turbo, initialScript, onExit }: Props) {
  const f = FORMATS[format];
  const rec = useRecorder();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number | null>(null);

  const [script, setScript] = useState(initialScript);
  const [generating, setGenerating] = useState(false);
  const [items, setItems] = useState<StageItem[]>([]);
  const [emoji, setEmoji] = useState<string | undefined>(undefined);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  // A fine generazione (anteprima pronta) o se il recorder si ferma per errore,
  // usciamo dallo stato "generating": altrimenti l'UI resterebbe bloccata.
  useEffect(() => {
    if (generating && rec.state !== "recording" && (rec.state === "preview" || rec.error)) {
      clearTimer();
      setGenerating(false);
    }
  }, [generating, rec.state, rec.error]);

  const genera = async () => {
    const beats = chunkIntoBeats(script);
    if (!beats.length) return;

    setGenerating(true);
    setItems([]);
    setEmoji(undefined);

    const ok = await rec.start(canvasRef.current, { audio: false });
    if (!ok) {
      setGenerating(false);
      return;
    }

    let bi = 0;
    const playBeat = () => {
      if (bi >= beats.length) {
        timerRef.current = window.setTimeout(() => rec.stop(), 600);
        return;
      }
      const b = beats[bi];
      bi++;
      if (turbo) {
        setItems(turboTokens(b.text, getLocale(lang), 12));
        setEmoji(undefined);
      } else {
        const d = decide(b.text, b.ended, 6, emojiOn, lang);
        setItems(directiveToItems(d));
        setEmoji(d.emoji);
      }
      timerRef.current = window.setTimeout(playBeat, b.holdMs);
    };
    playBeat();
  };

  const exit = () => {
    clearTimer();
    rec.discard();
    onExit();
  };

  const redo = () => {
    clearTimer();
    rec.discard();
    setGenerating(false);
    setItems([]);
    setEmoji(undefined);
  };

  const recording = rec.state === "recording";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ink">
      <div
        style={{
          width: `min(100vw, calc(100vh * ${f.ratio}))`,
          height: `min(100vh, calc(100vw / ${f.ratio}))`,
        }}
      >
        <CanvasStage
          ref={canvasRef}
          items={items}
          emoji={emoji}
          style={style}
          format={format}
          recording={recording}
        />
      </div>

      {!generating && rec.state === "idle" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-black/90 p-6">
          <div className="w-full max-w-xl border-2 border-white/15 bg-neutral-950 p-6">
            <p className="mb-3 flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight text-white">
              Rivedi lo script
              <span className="bg-pro px-1.5 py-0.5 font-body text-[10px] font-black tracking-normal text-ink">
                PRO
              </span>
            </p>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={7}
              className="w-full resize-none border-2 border-white/20 bg-black p-3 font-body text-white outline-hidden focus:border-accent"
              placeholder="Lo script trascritto apparirà qui — correggi i refusi."
            />
            <p className="mt-2 font-body text-xs leading-relaxed text-white/40">
              Correggi gli errori di testo. Il testo scorre in beat stabili (gruppi fermi, niente
              parole che si sovrappongono). Clip senza voce: ideale come overlay in CapCut/Premiere.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={genera}
              className="bg-white px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-accent hover:text-white"
            >
              ▶ Genera clip
            </button>
            <button
              onClick={exit}
              className="border-2 border-white/30 px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {rec.state === "preview" && rec.videoUrl && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/95 p-6">
          <video
            src={rec.videoUrl}
            controls
            autoPlay
            loop
            className="max-h-[64vh] max-w-full border border-white/10 shadow-2xl"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={rec.download}
              className="bg-white px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-accent hover:text-white"
            >
              ⬇ Salva clip
            </button>
            <button
              onClick={redo}
              className="border-2 border-white/30 px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              ↺ Rivedi ancora
            </button>
            <button
              onClick={exit}
              className="border-2 border-white/30 px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              Esci
            </button>
          </div>
        </div>
      )}

      {generating && rec.state === "recording" && (
        <button
          onClick={redo}
          className="absolute right-5 top-5 border-2 border-white/30 px-3 py-1.5 font-body text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors hover:bg-white/10"
        >
          ✕ Annulla
        </button>
      )}

      {rec.error && (
        <div className="absolute left-1/2 top-5 -translate-x-1/2 font-body text-xs text-rec">{rec.error}</div>
      )}
    </div>
  );
}
