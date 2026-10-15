// Registro delle lingue supportate da Prindict.
// Aggiungere una lingua = creare il suo file Locale e registrarlo qui.
import type { Locale } from "./types";
import { it } from "./it";
import { en } from "./en";
import { es } from "./es";

export type { Locale } from "./types";

export const LOCALES: Record<string, Locale> = { it, en, es };

// Ordine mostrato nel selettore lingua dell'UI.
export const LOCALE_LIST: Locale[] = [it, en, es];

export const DEFAULT_LOCALE = "it";

export function getLocale(id: string): Locale {
  return LOCALES[id] ?? LOCALES[DEFAULT_LOCALE];
}
