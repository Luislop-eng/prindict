import { useRef } from "react";
import { AnimatePresence, motion, type Target, type TargetAndTransition, type Transition } from "framer-motion";
import { FORMATS, type FormatId } from "../engine/formats";
import { type StyleConfig, fontStack, luminance } from "../engine/appearance";
import type { Token } from "../engine/effects/turboEngine";
import { EFFECTS, type EffectId } from "../engine/effects/registry";
import { useShrinkToFit } from "../hooks/useShrinkToFit";

interface Props {
  tokens: Token[];
  style: StyleConfig;
  format: FormatId;
}

// Dimensione della riga in cqmin: meno parole = più grandi. Costante per token:
// l'enfasi (numeri/grow) avviene via transform `scale`, MAI via font-size, così
// il box di layout non cambia e le altre parole non si spostano.
function lineSize(count: number, chars: number, factor: number): number {
  const total = chars + count;
  let base: number;
  if (total <= 6) base = 18;
  else if (total <= 12) base = 13.5;
  else if (total <= 20) base = 10;
  else base = 8;
  return base * factor;
}

// Offset deterministici per l'esplosione (stabili tra i render → niente sfarfallio).
function scatter(i: number) {
  return {
    dx: (((i * 37) % 7) - 3) * 9,
    dy: (((i * 53) % 7) - 3) * 9,
    rot: (((i * 29) % 9) - 4) * 7,
  };
}

const spring: Transition = { type: "spring", stiffness: 520, damping: 20, mass: 0.6 };

type Variant = { initial: Target; animate: TargetAndTransition; transition: Transition };

// Animazioni a livello di parola. Tutte tornano a transform "neutro" (scale/x/y)
// così non alterano il flusso del testo: solo l'enfasi resta come scala.
const WORD_VARIANTS: Record<Exclude<EffectId, "explode">, Variant> = {
  none: {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.18, ease: "easeOut" },
  },
  rise: {
    initial: { opacity: 0, y: 55 },
    animate: { opacity: 1, y: [55, -12, 0] },
    transition: spring,
  },
  fall: {
    initial: { opacity: 0, y: -55 },
    animate: { opacity: 1, y: [-55, 9, 0] },
    transition: spring,
  },
  grow: {
    initial: { opacity: 0, scale: 0.2 },
    animate: { opacity: 1, scale: [0.2, 1.4, 1] },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  shake: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, x: [0, -6, 6, -5, 5, -3, 3, 0], scale: 1 },
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  isolate: {
    // resta leggermente più grande (scale 1.12, transform → niente reflow)
    initial: { opacity: 0, scale: 0.6, filter: "blur(10px)" },
    animate: { opacity: 1, scale: [0.6, 1.28, 1.12], filter: "blur(0px)" },
    transition: { type: "spring", stiffness: 580, damping: 18, mass: 0.5 },
  },
};

/** Una parola: layer esterno = posizione fluida (layout), interno = effetto. */
function TokenView({ token, color, accent }: { token: Token; color: string; accent: string }) {
  const def = EFFECTS[token.effectId];
  const isIsolate = token.effectId === "isolate";
  const inkColor = isIsolate ? accent : color;

  // Layer interno: cambia key con l'effetto così un cambio effetto rianima
  // (l'esterno, keyed per posizione, resta fermo e gestisce solo lo scorrimento).
  let inner;
  if (def.perLetter) {
    inner = (
      <span key="explode" className="inline-flex" style={{ color: inkColor }}>
        {token.text.split("").map((ch, i) => {
          const { dx, dy, rot } = scatter(i);
          return (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, filter: "blur(8px)" }}
              animate={{
                opacity: 1,
                x: [0, dx, 0],
                y: [0, dy, 0],
                rotate: [0, rot, 0],
                scale: [0.4, 1.35, 1],
                filter: "blur(0px)",
              }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.02 }}
            >
              {ch}
            </motion.span>
          );
        })}
      </span>
    );
  } else {
    const v = WORD_VARIANTS[token.effectId as Exclude<EffectId, "explode">] ?? WORD_VARIANTS.none;
    inner = (
      <motion.span
        key={token.effectId}
        className="inline-block"
        style={{ color: inkColor, fontWeight: isIsolate ? 900 : 800 }}
        initial={v.initial}
        animate={v.animate}
        transition={v.transition}
      >
        {token.text}
      </motion.span>
    );
  }

  return (
    <motion.span
      layout
      className="inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      transition={{ layout: { type: "spring", stiffness: 700, damping: 40 } }}
    >
      {inner}
    </motion.span>
  );
}

export function TurboStage({ tokens, style, format }: Props) {
  const f = FORMATS[format];
  const chars = tokens.reduce((n, t) => n + t.text.length, 0);
  const baseSize = lineSize(Math.max(1, tokens.length), chars || 5, f.fontFactor) * (style.fontScale ?? 1);
  const containerRef = useRef<HTMLDivElement>(null);
  // gapEm 0.32 = stesso gap del layout (gap-x-[0.32em]) → misura la riga intera,
  // non solo la parola più lunga (BUG 7).
  const size = useShrinkToFit(
    {
      texts: tokens.map((t) => t.text),
      baseSize,
      fontFamily: fontStack(style.fontId),
      fontWeight: 800,
      gapEm: 0.32,
    },
    containerRef,
  );
  const veil = luminance(style.fg) > 0.5 ? "0,0,0" : "255,255,255";

  return (
    <div
      className="stage-frame relative h-full w-full overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: style.bg }}
    >
      {style.bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${style.bgImage})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(${veil}, ${style.scrim})` }}
            aria-hidden
          />
        </>
      )}

      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-x-[0.32em] gap-y-[0.06em] px-[8%] text-center leading-[0.98]"
        style={{
          fontFamily: fontStack(style.fontId),
          fontSize: `${size}cqmin`,
          letterSpacing: "-0.03em",
          wordBreak: "break-word",
        }}
      >
        {tokens.length === 0 ? (
          <span style={{ color: style.fg, opacity: 0.2, fontWeight: 800 }}>parla…</span>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {tokens.map((t) => (
              <TokenView key={t.key} token={t} color={style.fg} accent={style.accent} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
