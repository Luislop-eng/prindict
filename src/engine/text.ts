// Normalizzazione del testo condivisa da tutti i motori (numeri, emoji, Turbo).
// BUG 9 fix: prima ogni modulo aveva la sua `clean()` con regex diverse, quindi
// la stessa parola poteva matchare un dizionario e non un altro. Ora c'è una
// sola fonte di verità.

// Punteggiatura e virgolette/apostrofi da togliere ai BORDI di una parola.
const EDGE_PUNCT = /^[.,;:!?"'`’«»(){}\[\]…]+|[.,;:!?"'`’«»(){}\[\]…]+$/g;

/** Minuscolo + rimozione della punteggiatura ai bordi (non interna). */
export function cleanWord(w: string): string {
  return w.replace(EDGE_PUNCT, "").toLowerCase();
}

/**
 * Chiavi candidate per cercare una parola in un dizionario.
 * Gestisce l'elisione (italiano/spagnolo): "l'idea" → prova anche "idea",
 * "dell'azienda" → prova anche "azienda". La parola pulita resta la prima scelta.
 */
export function lookupKeys(w: string): string[] {
  const c = cleanWord(w);
  const keys = [c];
  const parts = c.split(/['’]/);
  if (parts.length > 1) {
    const tail = parts[parts.length - 1];
    if (tail && tail !== c) keys.push(tail);
  }
  return keys;
}
