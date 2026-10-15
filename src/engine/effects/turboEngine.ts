// Motore Turbo: trasforma il testo live (o uno script) in uno stream di TOKEN
// animati. Riusa la logica esistente (riempitivi, numeri) e assegna a ogni
// parola un effetto dal registry in base ai trigger della lingua.
//
// Governatore del gusto: per ogni stream lascia al massimo MAX_STRONG effetti
// "forti" (i più recenti vincono), il resto torna neutro. Evita che ogni parola
// si muova → la clip respira invece di fare rumore.

import { parseNumberPhrase } from "../numbers";
import { cleanWord, lookupKeys } from "../text";
import type { Locale } from "../locales/types";
import type { EffectId } from "./registry";
import { EFFECTS } from "./registry";

export interface Token {
  text: string;
  effectId: EffectId;
  // Posizione ASSOLUTA della parola nel discorso (non nella finestra): è la
  // chiave stabile di React/framer. Così parole uguali ("il… il") non collidono
  // e una parola non viene rimontata quando la finestra scorre → niente saltelli.
  key: string;
}

const MAX_STRONG = 2; // max effetti forti contemporanei per beat (taste governor)

const clean = cleanWord;

// Cerca l'effetto trigger provando le chiavi candidate (gestisce l'elisione,
// es. "l'esplode" → "esplode"). Prima chiave che matcha vince.
function triggerEffect(word: string, locale: Locale): EffectId | undefined {
  for (const k of lookupKeys(word)) {
    const e = locale.turboTriggers[k];
    if (e) return e as EffectId;
  }
  return undefined;
}

// Cerca trigger multi-parola (bigram/trigram). Ritorna l'effetto e quante parole
// consuma, oppure undefined. Es. "alle stelle" → { effect: "rise", consume: 2 }
function triggerMultiWord(words: string[], start: number, locale: Locale): { effect: EffectId; consume: number } | undefined {
  // Prova 4-word poi 3-word poi 2-word (più lungo = più specifico).
  for (const len of [4, 3, 2]) {
    if (start + len > words.length) continue;
    const phrase = words.slice(start, start + len).join(" ");
    const e = locale.turboTriggers[phrase];
    if (e) return { effect: e as EffectId, consume: len };
  }
  return undefined;
}

function makeToken(word: string, locale: Locale, idx: number, override?: EffectId): Token {
  const effectId = override ?? triggerEffect(word, locale) ?? "none";
  return { text: word, effectId, key: `w${idx}` };
}

/**
 * Frena il numero di effetti "forti" simultanei: tiene gli ultimi MAX_STRONG,
 * gli altri tornano a "none". "isolate" (i numeri) non conta come forte: è già
 * raro e voluto.
 */
function applyTasteGovernor(tokens: Token[]): Token[] {
  const strongIdx = tokens
    .map((t, i) => ({ i, strong: t.effectId !== "none" && t.effectId !== "isolate" }))
    .filter((x) => x.strong)
    .map((x) => x.i);

  if (strongIdx.length <= MAX_STRONG) return tokens;

  const keep = new Set(strongIdx.slice(-MAX_STRONG));
  return tokens.map((t, i) =>
    keep.has(i) || t.effectId === "none" || t.effectId === "isolate"
      ? t
      : { ...t, effectId: "none" as EffectId },
  );
}

/**
 * Testo → token Turbo (finestra scorrevole, niente accumulo).
 * - toglie i riempitivi della lingua
 * - se in coda c'è un numero "vero", lo isola (effetto "isolate")
 * - assegna gli effetti d'azione/emozione dai trigger, poi applica il governatore
 *
 * `overrides`: mappa parola-pulita → effetto forzato (usata dal ritocco PRO).
 */
export function turboTokens(
  text: string,
  locale: Locale,
  windowSize = 4,
  overrides?: Record<string, EffectId>,
): Token[] {
  const all = text
    .trim()
    .split(/\s+/)
    .filter((w) => w && !locale.fillers.has(clean(w)));
  if (!all.length) return [];

  const words = all.slice(-windowSize);
  const base = all.length - words.length; // offset assoluto della finestra
  const ov = (w: string) => overrides?.[clean(w)];

  // Numero in coda (fino a 3 parole): si isola formattato.
  for (let k = Math.min(3, words.length); k >= 1; k--) {
    const phrase = words.slice(words.length - k).join(" ");
    const res = parseNumberPhrase(phrase, locale.numbers, locale.numberLocale);
    if (res) {
      const hasDigit = /\d/.test(phrase);
      const decorated = /[%€$£]/.test(res.text) || res.text.includes(",") || res.text.includes(".");
      if (res.value >= 10 || hasDigit || decorated) {
        const head = words.slice(0, words.length - k);
        const tokens = head.map((w, i) => makeToken(w, locale, base + i, ov(w)));
        tokens.push({ text: res.text, effectId: "isolate", key: `n${base + head.length}` });
        return applyTasteGovernor(tokens);
      }
    }
  }

  // Generazione token con supporto multi-parola: cerca prima bigram/trigram
  // nei trigger, poi fallback su parola singola.
  const tokens: Token[] = [];
  let i = 0;
  while (i < words.length) {
    const ov = overrides?.[clean(words[i])];
    // 1. Prova trigger multi-parola (es. "alle stelle" → rise)
    const mw = triggerMultiWord(words, i, locale);
    if (mw) {
      tokens.push({ text: words[i], effectId: mw.effect, key: `w${base + i}` });
      // Parole successive consumate dal trigger multi-parola → neutre
      for (let j = 1; j < mw.consume; j++) {
        tokens.push({ text: words[i + j], effectId: "none", key: `w${base + i + j}` });
      }
      i += mw.consume;
      continue;
    }
    // 2. Override manuale PRO
    if (ov) {
      tokens.push({ text: words[i], effectId: ov, key: `w${base + i}` });
      i++;
      continue;
    }
    // 3. Trigger parola singola
    tokens.push(makeToken(words[i], locale, base + i));
    i++;
  }
  return applyTasteGovernor(tokens);
}

// Riesporta i metadati per comodità dei consumatori.
export { EFFECTS };
