import { useEffect, useLayoutEffect, useState } from "react";

// Canvas singleton riusato per TUTTE le misurazioni del testo (BUG 8 fix):
// evita di allocare un nuovo <canvas> ad ogni iterazione della ricerca binaria
// e ad ogni re-render del parlato live.
let sharedCtx: CanvasRenderingContext2D | null = null;

function getMeasureCtx(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!sharedCtx) {
    sharedCtx = document.createElement("canvas").getContext("2d");
  }
  return sharedCtx;
}

export interface ShrinkConfig {
  // Testo (o testi) da misurare. Per la modalità normale è una stringa; per
  // Turbo passiamo le parole così possiamo misurare la riga, non solo la parola.
  texts: string[];
  baseSize: number; // dimensione iniziale in cqmin
  fontFamily: string;
  fontWeight: number;
  // gapEm: spazio tra le parole in em (Turbo). 0 = misura la parola più lunga.
  gapEm?: number;
  minSize?: number; // floor in cqmin
  maxFrac?: number; // frazione della larghezza utilizzabile (default 0.84)
}

/**
 * Shrink-to-fit deterministico: misura il testo reale via canvas e riduce la
 * dimensione (cqmin) con ricerca binaria finché ogni unità sta entro maxFrac
 * della larghezza del container.
 *
 * Robustezza:
 * - BUG 4: se il container non ha ancora dimensioni (width 0), NON calcola e
 *   resta sulla baseSize, evitando il flash di testo microscopico.
 * - BUG 6: un ResizeObserver ricalcola quando il container cambia dimensione
 *   (resize finestra, cambio formato).
 * - BUG 7 (Turbo): con gapEm misura la larghezza dell'intera riga di parole,
 *   non solo la più lunga.
 */
export function useShrinkToFit(
  cfg: ShrinkConfig,
  containerRef: React.RefObject<HTMLDivElement | null>,
): number {
  const { texts, baseSize, fontFamily, fontWeight, gapEm = 0, minSize = 3, maxFrac = 0.84 } = cfg;
  const [size, setSize] = useState(baseSize);

  // Chiave stabile dei testi per il dependency array (evita ricalcoli inutili).
  const textKey = texts.join("\u0001");

  // useLayoutEffect: misuriamo prima del paint per ridurre il rischio di flash.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) {
      setSize(baseSize);
      return;
    }

    const compute = () => {
      const ctx = getMeasureCtx();
      const rect = el.getBoundingClientRect();
      // BUG 4 fix: senza dimensioni reali non possiamo misurare → niente calcolo.
      if (!ctx || rect.width === 0 || rect.height === 0) return;

      const min = Math.min(rect.width, rect.height);
      const maxW = rect.width * maxFrac;
      if (maxW <= 0) return;

      // Larghezza richiesta a una data dimensione (cqmin).
      // gapEm 0 → misura la parola più larga; gapEm > 0 → misura la riga intera.
      const neededWidth = (cqmin: number): number => {
        const px = (cqmin / 100) * min;
        ctx.font = `${fontWeight} ${px}px ${fontFamily}, sans-serif`;
        if (gapEm > 0) {
          const gapPx = gapEm * px;
          let total = 0;
          for (let i = 0; i < texts.length; i++) {
            total += ctx.measureText(texts[i]).width;
            if (i > 0) total += gapPx;
          }
          // Una singola parola non può comunque superare la larghezza utile.
          const widest = texts.reduce((w, t) => Math.max(w, ctx!.measureText(t).width), 0);
          return Math.max(total, widest);
        }
        return texts.reduce((w, t) => Math.max(w, ctx!.measureText(t).width), 0);
      };

      if (neededWidth(baseSize) <= maxW) {
        setSize(baseSize);
        return;
      }

      // Ricerca binaria: la dimensione più grande che sta entro maxW.
      let lo = minSize;
      let hi = baseSize;
      while (hi - lo > 0.1) {
        const mid = (lo + hi) / 2;
        if (neededWidth(mid) > maxW) hi = mid;
        else lo = mid;
      }
      setSize(lo);
    };

    compute();

    // BUG 6 fix: ricalcola al resize del container.
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => compute());
      ro.observe(el);
    }
    return () => ro?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textKey, baseSize, fontFamily, fontWeight, gapEm, minSize, maxFrac, containerRef]);

  // Se il testo si svuota, torna subito alla base (nessuna misura necessaria).
  useEffect(() => {
    if (texts.length === 0) setSize(baseSize);
  }, [texts.length, baseSize]);

  return size;
}
