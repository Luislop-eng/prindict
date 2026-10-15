import { useRef } from "react";
import { motion } from "framer-motion";
import type { DisplayDirective } from "../engine/types";
import { FORMATS, type FormatId } from "../engine/formats";
import { type StyleConfig, fontStack, luminance } from "../engine/appearance";
import { useShrinkToFit } from "../hooks/useShrinkToFit";

interface Props {
  directive: DisplayDirective;
  style: StyleConfig;
  format: FormatId;
}

// Dimensione del font in cqmin (relativa alla cornice). Minimal: testo normale
// più contenuto; il numero/parola-chiave esplode più grande.
function fontCqmin(text: string, isNumber: boolean, factor: number): number {
  const len = (text || "parla").length;
  let base: number;
  if (len <= 3) base = 23;
  else if (len <= 7) base = 16.5;
  else if (len <= 12) base = 12;
  else if (len <= 18) base = 9;
  else base = 7.5;
  if (isNumber) base *= 1.4; // il numero resta protagonista, il resto è minimal
  return base * factor;
}

// Animazioni differenziate: il numero "scatta" con blur-in (punchy/premium),
// la frase entra con un fade morbido dal basso (minimal).
const numberAnim = {
  initial: { opacity: 0, scale: 0.72, filter: "blur(12px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  transition: { type: "spring" as const, stiffness: 620, damping: 22, mass: 0.5 },
};
const phraseAnim = {
  initial: { opacity: 0, y: 10, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.16, ease: "easeOut" as const },
};

export function StageScreen({ directive, style, format }: Props) {
  const f = FORMATS[format];
  const isNumber = directive.kind === "number";
  const baseSize = fontCqmin(directive.text, isNumber, f.fontFactor) * (style.fontScale ?? 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useShrinkToFit(
    {
      texts: directive.text ? [directive.text] : [],
      baseSize,
      fontFamily: fontStack(style.fontId),
      fontWeight: isNumber ? 900 : 800,
    },
    containerRef,
  );
  const anim = isNumber ? numberAnim : phraseAnim;
  const emojiSize = Math.min(size * 0.95, 20);

  // Il testo prende il colore di evidenziazione sui numeri/parole-chiave isolate
  // (se attivo); altrimenti il colore testo del tema.
  const textColor = isNumber && style.numberAccent ? style.accent : style.fg;

  // Velo sopra l'immagine: scuro se il testo è chiaro, chiaro se il testo è scuro.
  // Serve a tenere il testo leggibile su qualunque foto.
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

      <div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqmin] px-[8%]">
        {directive.emoji && (
          <motion.span
            key={directive.emoji}
            initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 18, mass: 0.5 }}
            className="block leading-none"
            style={{ fontSize: `${emojiSize}cqmin` }}
            aria-hidden
          >
            {directive.emoji}
          </motion.span>
        )}
        <motion.span
          key={directive.text || "_empty_"}
          initial={anim.initial}
          animate={anim.animate}
          transition={anim.transition}
          className="block max-w-full text-center leading-[0.92]"
          style={{
            fontFamily: fontStack(style.fontId),
            color: textColor,
            fontSize: `${size}cqmin`,
            fontWeight: isNumber ? 900 : 800,
            letterSpacing: "-0.04em",
            wordBreak: "break-word",
          }}
        >
          {directive.text ? (
            directive.text
          ) : (
            <span style={{ color: style.fg, opacity: 0.2 }}>parla…</span>
          )}
        </motion.span>
      </div>
    </div>
  );
}
