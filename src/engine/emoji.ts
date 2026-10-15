import { lookupKeys } from "./text";

/** Cerca un'emoji tra le ultime parole della finestra (la più recente vince).
 *  Supporta anche match multi-parola (bigram): es. "social media" → 📱. */
export function emojiFor(
  words: string[],
  dict: Record<string, string>,
): string | undefined {
  const tail = words.slice(-5);
  // Prima cerca bigram (più specifico), dalla fine verso l'inizio.
  for (let i = tail.length - 1; i >= 1; i--) {
    const pair = `${tail[i - 1]} ${tail[i]}`;
    const e = dict[pair];
    if (e) return e;
  }
  // Poi cerca parole singole con lookupKeys (gestisce elisione).
  for (let i = tail.length - 1; i >= 0; i--) {
    for (const k of lookupKeys(tail[i])) {
      const e = dict[k];
      if (e) return e;
    }
  }
  return undefined;
}
