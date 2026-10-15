import type { DisplayDirective } from "./types";
import { parseNumberPhrase } from "./numbers";
import { emojiFor } from "./emoji";
import { getLocale, DEFAULT_LOCALE } from "./locales";
import type { Locale } from "./locales/types";
import { cleanWord } from "./text";

const clean = cleanWord;

/**
 * Cerca un numero pronunciato in coda alla finestra (anche su più parole, es.
 * "due cento cinquanta mila"). Isola solo numeri "veri": >= 10, oppure scritti
 * in cifre, oppure con % / valuta — così "uno", "sei", "tre" (parole comuni) non
 * vengono scambiati per numeri.
 */
function trailingNumber(words: string[], locale: Locale): string | null {
  const max = Math.min(6, words.length);
  for (let k = max; k >= 1; k--) {
    const slice = words.slice(words.length - k);
    const phrase = slice.join(" ");
    const res = parseNumberPhrase(phrase, locale.numbers, locale.numberLocale);
    if (res) {
      const hasDigit = /\d/.test(phrase);
      const decorated = /[%€$£]/.test(res.text) || res.text.includes(",") || res.text.includes(".");
      if (res.value >= 10 || hasDigit || decorated) return res.text;
    }
  }
  return null;
}

/**
 * Da testo live → direttiva di display, nella lingua attiva.
 * - Toglie i riempitivi della lingua.
 * - Se in coda c'è un numero, lo isola formattato (kind:"number").
 * - Altrimenti mostra solo le ultime `windowSize` parole (niente accumulo).
 *
 * `ended` = il segmento è stato finalizzato (l'utente ha fatto una pausa).
 * In quel caso chiudiamo la frase con un punto e maiuscola iniziale.
 */
export function decide(
  text: string,
  ended = false,
  windowSize = 3,
  withEmoji = true,
  localeId: string = DEFAULT_LOCALE,
): DisplayDirective {
  const locale = getLocale(localeId);

  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w && !locale.fillers.has(clean(w)));

  if (words.length === 0) return { kind: "phrase", text: "" };

  const emoji = withEmoji ? emojiFor(words, locale.emoji) : undefined;

  const num = trailingNumber(words, locale);
  if (num) return { kind: "number", text: num, emoji };

  let tail = words.slice(-windowSize).join(" ");
  if (ended && tail) {
    tail = tail.charAt(0).toUpperCase() + tail.slice(1);
    if (!/[.!?…]$/.test(tail)) tail += ".";
  }
  return { kind: "phrase", text: tail, emoji };
}
