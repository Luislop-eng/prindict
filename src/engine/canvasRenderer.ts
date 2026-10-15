// Renderer del palco su <canvas>: disegna sfondo, immagine, velo e testo con gli
// effetti cinetici, frame per frame. È deterministico (animazione in funzione
// dell'età del token) così la stessa clip si può registrare via
// canvas.captureStream() — niente cattura schermo, frame esatto, zero bande nere.

import type { FormatId } from "./formats";
import { FORMATS } from "./formats";
import { type StyleConfig, fontFamilyName, luminance } from "./appearance";
import type { EffectId } from "./effects/registry";

// Risoluzione di export per formato (lato lungo 1920, lato corto 1080).
export const RENDER_DIMS: Record<FormatId, { w: number; h: number }> = {
  vertical: { w: 1080, h: 1920 },
  horizontal: { w: 1920, h: 1080 },
  square: { w: 1080, h: 1080 },
};

export interface RenderItem {
  text: string;
  effectId: EffectId;
  age: number; // secondi dalla comparsa (guida l'animazione)
}

export interface DrawOpts {
  items: RenderItem[];
  emoji?: string;
  emojiAge?: number;
  style: StyleConfig;
  format: FormatId;
  bgImage: HTMLImageElement | null;
  width: number;
  height: number;
}

const DUR = 0.5; // durata entrata (s)
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Offset deterministici dell'esplosione (uguali al DOM → stessa resa).
function scatter(i: number) {
  return {
    dx: (((i * 37) % 7) - 3) * 0.14,
    dy: (((i * 53) % 7) - 3) * 0.14,
    rot: ((((i * 29) % 9) - 4) * 7 * Math.PI) / 180,
  };
}

interface Xform {
  tx: number;
  ty: number;
  scale: number;
  rot: number;
  alpha: number;
}

function wordXform(effect: EffectId, age: number, fontPx: number): Xform {
  const p = clamp01(age / DUR);
  const e = easeOut(p);
  const off = 0.9 * fontPx;
  switch (effect) {
    case "rise":
      return { tx: 0, ty: lerp(off, 0, e), scale: 1, rot: 0, alpha: e };
    case "fall":
      return { tx: 0, ty: lerp(-off, 0, e), scale: 1, rot: 0, alpha: e };
    case "grow":
      return { tx: 0, ty: 0, scale: lerp(0.2, 1, e), rot: 0, alpha: e };
    case "shake": {
      const decay = 1 - p;
      const x = Math.sin(age * 42) * 0.12 * fontPx * decay;
      return { tx: x, ty: 0, scale: 1, rot: 0, alpha: clamp01(age / 0.1) };
    }
    case "isolate":
      return { tx: 0, ty: 0, scale: lerp(0.6, 1.12, e), rot: 0, alpha: e };
    default: // none
      return { tx: 0, ty: lerp(8, 0, e), scale: 1, rot: 0, alpha: e };
  }
}

export function drawStage(ctx: CanvasRenderingContext2D, opts: DrawOpts): void {
  const { items, emoji, style, format, bgImage, width: W, height: H } = opts;

  // Sfondo.
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = style.bg;
  ctx.fillRect(0, 0, W, H);

  if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
    // cover-fit
    const ir = bgImage.naturalWidth / bgImage.naturalHeight;
    const cr = W / H;
    let dw = W, dh = H, dx = 0, dy = 0;
    if (ir > cr) {
      dh = H;
      dw = H * ir;
      dx = (W - dw) / 2;
    } else {
      dw = W;
      dh = W / ir;
      dy = (H - dh) / 2;
    }
    ctx.drawImage(bgImage, dx, dy, dw, dh);
    const veil = luminance(style.fg) > 0.5 ? "0,0,0" : "255,255,255";
    ctx.fillStyle = `rgba(${veil},${style.scrim})`;
    ctx.fillRect(0, 0, W, H);
  }

  const family = fontFamilyName(style.fontId);
  const min = Math.min(W, H);

  // Placeholder quando non c'è testo.
  if (items.length === 0) {
    const fontPx = 0.13 * min;
    ctx.font = `800 ${fontPx}px "${family}", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = style.fg;
    ctx.fillText("parla…", W / 2, H / 2);
    ctx.globalAlpha = 1;
    return;
  }

  // Dimensione font: meno parole = più grandi (in cqmin → px).
  const chars = items.reduce((n, t) => n + t.text.length, 0);
  const total = chars + items.length;
  let baseCqmin: number;
  if (total <= 6) baseCqmin = 18;
  else if (total <= 12) baseCqmin = 13.5;
  else if (total <= 20) baseCqmin = 10;
  else baseCqmin = 8;
  const factor = FORMATS[format].fontFactor;
  const maxLineW = W * 0.84;
  const minFontPx = 0.04 * min; // floor: leggibile ma contenuto

  // Misura larghezza di un testo a una data font-size (peso 800; isolate un filo più largo).
  const measure = (text: string, isolate: boolean, px: number) => {
    ctx.font = `${isolate ? 900 : 800} ${px}px "${family}", sans-serif`;
    return ctx.measureText(text).width * (isolate ? 1.12 : 1);
  };

  // Calcola fontPx iniziale (con la grandezza manuale scelta dall'utente).
  let fontPx = (baseCqmin / 100) * min * factor * (style.fontScale ?? 1);
  let gap = 0.32 * fontPx;

  // Verifica se ogni singola parola sta dentro maxLineW alla font-size corrente.
  // Se una parola eccede, riduce la font-size (ricerca binaria) finché sta o si hit il floor.
  function anyWordOverflow(px: number): boolean {
    const g = 0.32 * px;
    return items.some((it) => {
      const w = measure(it.text, it.effectId === "isolate", px);
      return w > maxLineW - g;
    });
  }

  if (anyWordOverflow(fontPx)) {
    let lo = minFontPx;
    let hi = fontPx;
    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2;
      if (anyWordOverflow(mid)) hi = mid;
      else lo = mid;
    }
    fontPx = lo;
    gap = 0.32 * fontPx;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Spezza parole che ancora eccedono maxLineW anche alla font-size minima.
  // BUG 13 fix: iterativo con stack invece di ricorsione, per evitare stack
  // depth su parole estreme (es. 200+ char).
  function splitLongWord(text: string, isolate: boolean, px: number): string[] {
    const w = measure(text, isolate, px);
    if (w <= maxLineW) return [text];
    const result: string[] = [];
    const stack: string[] = [text];
    while (stack.length) {
      const s = stack.pop()!;
      const sw = measure(s, isolate, px);
      if (sw <= maxLineW || s.length <= 1) {
        result.push(s);
      } else {
        const mid = Math.ceil(s.length / 2);
        // push in ordine inverso per mantenere l'ordine originale nel result.
        stack.push(s.slice(mid));
        stack.push(s.slice(0, mid));
      }
    }
    return result;
  }

  // Wrapping greedy in righe (con split delle parole troppo lunghe).
  type Placed = { item: RenderItem; w: number };
  const lines: Placed[][] = [];
  let cur: Placed[] = [];
  let curW = 0;
  for (const item of items) {
    const isolate = item.effectId === "isolate";
    const parts = splitLongWord(item.text, isolate, fontPx);
    for (const part of parts) {
      const w = measure(part, isolate, fontPx);
      const add = (cur.length ? gap : 0) + w;
      if (cur.length && curW + add > maxLineW) {
        lines.push(cur);
        cur = [];
        curW = 0;
      }
      cur.push({ item: { ...item, text: part }, w });
      curW += (cur.length > 1 ? gap : 0) + w;
    }
  }
  if (cur.length) lines.push(cur);

  const lineH = fontPx * 1.04;
  const emojiH = emoji ? fontPx * 1.0 : 0;
  const blockH = lines.length * lineH + emojiH;
  let y = (H - blockH) / 2 + lineH / 2 + emojiH;

  // Emoji sopra (modalità normale).
  if (emoji) {
    ctx.font = `${fontPx * 0.9}px sans-serif`;
    ctx.globalAlpha = 1;
    ctx.fillText(emoji, W / 2, (H - blockH) / 2 + emojiH / 2);
  }

  for (const line of lines) {
    const lineW = line.reduce((s, p, i) => s + p.w + (i ? gap : 0), 0);
    let x = (W - lineW) / 2;
    for (const { item, w } of line) {
      const cx = x + w / 2;
      const isolate = item.effectId === "isolate";
      const color = isolate ? style.accent : style.fg;

      if (item.effectId === "explode") {
        drawExplode(ctx, item, cx, y, fontPx, family, color);
      } else {
        const xf = wordXform(item.effectId, item.age, fontPx);
        ctx.save();
        ctx.translate(cx + xf.tx, y + xf.ty);
        ctx.scale(xf.scale, xf.scale);
        ctx.rotate(xf.rot);
        ctx.globalAlpha = clamp01(xf.alpha);
        ctx.fillStyle = color;
        ctx.font = `${isolate ? 900 : 800} ${fontPx}px "${family}", sans-serif`;
        ctx.fillText(item.text, 0, 0);
        ctx.restore();
      }
      x += w + gap;
    }
    y += lineH;
  }
  ctx.globalAlpha = 1;
}

// Esplosione lettera per lettera: scatto divergente che si ricompone.
function drawExplode(
  ctx: CanvasRenderingContext2D,
  item: RenderItem,
  cx: number,
  cy: number,
  fontPx: number,
  family: string,
  color: string,
) {
  const p = clamp01(item.age / 0.55);
  const e = easeOut(p);
  const pulse = Math.sin(p * Math.PI); // 0 → 1 → 0 (scatta e torna)
  ctx.font = `800 ${fontPx}px "${family}", sans-serif`;
  const letters = item.text.split("");
  const widths = letters.map((ch) => ctx.measureText(ch).width);
  const totalW = widths.reduce((s, w) => s + w, 0);
  let lx = cx - totalW / 2;
  for (let i = 0; i < letters.length; i++) {
    const w = widths[i];
    const { dx, dy, rot } = scatter(i);
    const letterCx = lx + w / 2;
    ctx.save();
    ctx.translate(letterCx + dx * fontPx * pulse, cy + dy * fontPx * pulse);
    ctx.scale(0.4 + e * 0.6, 0.4 + e * 0.6);
    ctx.rotate(rot * pulse);
    ctx.globalAlpha = clamp01(e);
    ctx.fillStyle = color;
    ctx.fillText(letters[i], 0, 0);
    ctx.restore();
    lx += w;
  }
}
