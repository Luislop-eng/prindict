// Tipi del sistema multilingua.
// Ogni "Locale" descrive come Prindict ascolta e comunica in una lingua:
// codice Web Speech, riempitivi da togliere, dizionario emoji e lessico dei numeri.

export type Scale = 100 | 1000 | 1000000 | 1000000000;

export interface NumberAtom {
  value: number;
  scale?: Scale;
}

export interface NumberLexicon {
  // parola/forma → atomo numerico (es. "cento" → {value:100, scale:100}).
  dict: Record<string, NumberAtom>;
  // true = la lingua "incolla" i numeri (italiano: "duecentocinquanta").
  // false = numeri spaziati (inglese/spagnolo: "two hundred fifty").
  concatenated: boolean;
  // congiunzione da rimuovere prima di analizzare ("e" / "and" / "y").
  conjunction?: RegExp;
  // parola che introduce i decimali ("virgola" / "point" / "coma").
  decimalWord?: RegExp;
  // suffisso percentuale ("per cento" / "percent" / "por ciento" / "%").
  percentSuffix: RegExp;
  // valuta: come riconoscerla e dove va il simbolo.
  currency: {
    suffix?: RegExp; // "euro" / "dollari" detti in coda
    prefix?: RegExp; // "$" / "€" / "£" scritti davanti
    symbol: string;
    place: "prefix" | "suffix";
  };
}

export interface Locale {
  id: string; // "it"
  label: string; // "Italiano"
  flag: string; // "🇮🇹"
  speechLang: string; // codice Web Speech API, es. "it-IT"
  numberLocale: string; // per Intl/toLocaleString, es. "it-IT"
  fillers: Set<string>; // riempitivi del parlato da nascondere
  emoji: Record<string, string>; // parola → emoji contestuale
  numbers: NumberLexicon;
  // Modalità Turbo: parola pronunciata → id effetto cinetico (registry effects).
  // Es. "esplode" → "explode", "sale" → "rise". Vuoto = nessun effetto su quella parola.
  turboTriggers: Record<string, string>;
}
