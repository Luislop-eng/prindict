// Parser di numeri detti a voce → cifre formattate, guidato dal lessico della
// lingua attiva (NumberLexicon). Gestisce:
//  - forme concatenate (italiano: "duecentocinquantamila")
//  - forme spaziate (inglese/spagnolo: "two hundred fifty thousand")
//  - percentuali ("per cento" / "percent" / "%")
//  - valuta in prefisso o suffisso ("99 euro" → 99€, "$ venti" → $20)
//  - decimali ("tre virgola cinque" → 3,5)
// Ritorna null quando non è un numero riconoscibile: il chiamante ripiega sul testo.

import type { NumberAtom, NumberLexicon } from "./locales/types";

function scanAtoms(raw: string, lex: NumberLexicon): NumberAtom[] | null {
  let s = raw.toLowerCase().trim();
  if (lex.conjunction) s = s.replace(lex.conjunction, " ");

  if (lex.concatenated) {
    // Italiano: togli gli spazi e scorri carattere per carattere col match più lungo.
    const compact = s.replace(/\s+/g, "");
    const keys = Object.keys(lex.dict).sort((a, b) => b.length - a.length);
    const atoms: NumberAtom[] = [];
    let i = 0;
    while (i < compact.length) {
      let matched = false;
      for (const k of keys) {
        if (compact.startsWith(k, i)) {
          atoms.push(lex.dict[k]);
          i += k.length;
          matched = true;
          break;
        }
      }
      if (!matched) return null;
    }
    return atoms.length ? atoms : null;
  }

  // Lingue spaziate: ogni token deve essere una parola del dizionario.
  const tokens = s.replace(/-/g, " ").split(/\s+/).filter(Boolean);
  const atoms: NumberAtom[] = [];
  for (const t of tokens) {
    const a = lex.dict[t];
    if (!a) return null;
    atoms.push(a);
  }
  return atoms.length ? atoms : null;
}

// Riduce gli atomi a un valore: le scale (100/1000/…) moltiplicano il gruppo
// corrente e fanno avanzare il totale. Logica indipendente dalla lingua.
function reduce(atoms: NumberAtom[]): number {
  let total = 0;
  let current = 0;
  for (const a of atoms) {
    if (a.scale === 100) {
      current = (current === 0 ? 1 : current) * 100;
    } else if (a.scale === 1000) {
      current = (current === 0 ? 1 : current) * 1000;
      total += current;
      current = 0;
    } else if (a.scale === 1000000) {
      current = (current === 0 ? 1 : current) * 1000000;
      total += current;
      current = 0;
    } else if (a.scale === 1000000000) {
      current = (current === 0 ? 1 : current) * 1000000000;
      total += current;
      current = 0;
    } else {
      current += a.value;
    }
  }
  return total + current;
}

// Interpreta una porzione come numero: prima prova le cifre, poi le parole.
function valueOf(part: string, lex: NumberLexicon): number | null {
  const trimmed = part.trim();
  if (!trimmed) return null;
  const compact = trimmed.replace(/\s/g, "");
  if (/^\d[\d.,]*$/.test(compact)) {
    // forma a cifre: punti/virgole sono separatori di migliaia.
    const digits = compact.replace(/[.,]/g, "");
    if (/^\d+$/.test(digits)) return parseInt(digits, 10);
    return null;
  }
  const atoms = scanAtoms(trimmed, lex);
  return atoms ? reduce(atoms) : null;
}

function formatInt(n: number, numberLocale: string): string {
  // Numeri piccoli (anni, conteggi brevi) senza separatore: 1650, 30, 90.
  // Da 10.000 in su si raggruppa secondo la lingua: 250.000 / 250,000.
  return n < 10000 ? String(n) : n.toLocaleString(numberLocale);
}

export interface ParsedNumber {
  text: string; // già formattato e pronto a schermo (es. "250.000", "90%", "99€")
  value: number;
}

/** Prova a interpretare una frase come numero nella lingua data. Null se non lo è. */
export function parseNumberPhrase(
  phrase: string,
  lex: NumberLexicon,
  numberLocale: string,
): ParsedNumber | null {
  let s = phrase.toLowerCase().trim().replace(/[;:!?]+$/g, "");
  let percent = false;
  let currency = false;

  if (lex.percentSuffix.test(s)) {
    percent = true;
    s = s.replace(lex.percentSuffix, "").trim();
  }
  if (lex.currency.suffix && lex.currency.suffix.test(s)) {
    currency = true;
    s = s.replace(lex.currency.suffix, "").trim();
  }
  if (lex.currency.prefix && lex.currency.prefix.test(s)) {
    currency = true;
    s = s.replace(lex.currency.prefix, "").trim();
  }
  // togli eventuale punteggiatura residua a fine stringa
  s = s.replace(/[.,]+$/g, "").trim();
  if (!s) return null;

  let formatted: string;
  let value: number;

  // Decimali: "tre virgola cinque" → parte intera + parte decimale.
  const decMatch = lex.decimalWord ? s.match(lex.decimalWord) : null;
  if (decMatch && decMatch.index !== undefined) {
    const left = s.slice(0, decMatch.index);
    const right = s.slice(decMatch.index + decMatch[0].length);
    const intVal = valueOf(left, lex);
    const fracVal = valueOf(right, lex);
    if (intVal === null || fracVal === null) return null;
    const decSep = (1.1).toLocaleString(numberLocale).replace(/1/g, "");
    formatted = formatInt(intVal, numberLocale) + decSep + String(fracVal);
    value = parseFloat(`${intVal}.${fracVal}`);
  } else {
    const v = valueOf(s, lex);
    if (v === null || Number.isNaN(v)) return null;
    value = v;
    formatted = formatInt(v, numberLocale);
  }

  let text = formatted;
  if (percent) text = `${formatted}%`;
  else if (currency) {
    text =
      lex.currency.place === "prefix"
        ? `${lex.currency.symbol}${formatted}`
        : `${formatted}${lex.currency.symbol}`;
  }
  return { text, value };
}
