import { forwardRef, useEffect, useRef } from "react";
import { type FormatId } from "../engine/formats";
import { RENDER_DIMS, drawStage, type RenderItem } from "../engine/canvasRenderer";
import { fontFamilyName, type StyleConfig } from "../engine/appearance";
import type { StageItem } from "../engine/stageItems";

interface Props {
  items: StageItem[];
  emoji?: string;
  style: StyleConfig;
  format: FormatId;
  /** Durante la registrazione il canvas deve ridisegnarsi sempre (BUG 15). */
  recording?: boolean;
}

/**
 * Palco renderizzato su <canvas>: una sola fonte di verità per ciò che si vede
 * e per ciò che si registra (canvas.captureStream → niente cattura schermo).
 * Tiene il tempo di comparsa di ogni token (per chiave) così l'animazione di
 * entrata parte quando il token appare e poi resta ferma.
 */
export const CanvasStage = forwardRef<HTMLCanvasElement, Props>(function CanvasStage(
  { items, emoji, style, format, recording = false },
  ref,
) {
  const innerRef = useRef<HTMLCanvasElement | null>(null);
  const setRefs = (el: HTMLCanvasElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
  };

  // Stato "vivo" letto dal loop RAF (evita di ricreare il loop a ogni render).
  const stateRef = useRef({ items, emoji, style, format, recording });
  stateRef.current = { items, emoji, style, format, recording };

  const spawnRef = useRef<Map<string, number>>(new Map());
  const emojiSpawnRef = useRef<{ key: string; t: number } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Carica l'immagine di sfondo quando cambia.
  useEffect(() => {
    if (!style.bgImage) {
      imgRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
    };
    img.src = style.bgImage;
  }, [style.bgImage]);

  // I web font usati solo nel canvas non vengono scaricati finché il DOM non li
  // usa: li carichiamo esplicitamente e forziamo un redraw quando arrivano,
  // altrimenti la clip potrebbe uscire con il font di fallback.
  const fontEpochRef = useRef(0);
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    const family = fontFamilyName(style.fontId);
    const bump = () => {
      fontEpochRef.current++;
    };
    Promise.all([
      document.fonts.load(`800 64px "${family}"`),
      document.fonts.load(`900 64px "${family}"`),
    ])
      .then(bump)
      .catch(() => {
        /* offline: resta il fallback */
      });
    document.fonts.addEventListener("loadingdone", bump);
    return () => document.fonts.removeEventListener("loadingdone", bump);
  }, [style.fontId]);

  useEffect(() => {
    let raf = 0;
    // BUG 15 fix: traccia lo stato dell'ultimo frame per saltare il redraw
    // quando nulla è cambiato (palco vuoto, animazioni completate). Risparmio
    // CPU/GPU notevole su laptop a batteria.
    let lastSig = "";
    let idleFrames = 0;
    const loop = () => {
      const cv = innerRef.current;
      const { items, emoji, style, format, recording } = stateRef.current;
      if (cv) {
        const ctx = cv.getContext("2d");
        if (ctx) {
          const now = performance.now();
          const spawn = spawnRef.current;
          const live = new Set(items.map((i) => i.key));
          // pulisci chiavi sparite, registra nuove
          for (const k of spawn.keys()) if (!live.has(k)) spawn.delete(k);
          const renderItems: RenderItem[] = items.map((i) => {
            let t = spawn.get(i.key);
            if (t === undefined) {
              t = now;
              spawn.set(i.key, now);
            }
            return { text: i.text, effectId: i.effectId, age: (now - t) / 1000 };
          });

          let emojiAge: number | undefined;
          if (emoji) {
            if (!emojiSpawnRef.current || emojiSpawnRef.current.key !== emoji) {
              emojiSpawnRef.current = { key: emoji, t: now };
            }
            emojiAge = (now - emojiSpawnRef.current.t) / 1000;
          } else {
            emojiSpawnRef.current = null;
          }

          // Signature del frame: se il contenuto e gli age (arrotondati) sono
          // identici al frame precedente, skip del redraw.
          const maxAge = renderItems.reduce((m, i) => Math.max(m, i.age), 0);
          const sig = `${items.map((i) => i.key).join(",")}|${emoji ?? ""}|${maxAge.toFixed(2)}|${style.bg}|${style.fg}|${style.accent}|${style.fontId}|${style.fontScale}|${style.scrim}|${style.bgImage?.length ?? 0}|${format}|${fontEpochRef.current}|${imgRef.current ? 1 : 0}`;

          // Salta il redraw se: stesso contenuto, animazioni completate (>2s su
          // tutti i token), e nessun emoji nuovo. Dopo ~120 frame idle a 60fps
          // (2s), smettiamo di ridisegnare finché qualcosa non cambia.
          const allSettled = renderItems.every((i) => i.age > 2) && (!emojiAge || emojiAge > 2);
          if (sig === lastSig && allSettled) {
            idleFrames++;
          } else {
            idleFrames = 0;
            lastSig = sig;
          }

          const skipped = !recording && idleFrames >= 5;
          if (!skipped) {
            drawStage(ctx, {
              items: renderItems,
              emoji,
              emojiAge,
              style,
              format,
              bgImage: imgRef.current,
              width: cv.width,
              height: cv.height,
            });
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dims = RENDER_DIMS[format];
  return (
    <canvas
      ref={setRefs}
      width={dims.w}
      height={dims.h}
      className="block h-full w-full"
      style={{ display: "block" }}
    />
  );
});
