// Tipi condivisi del display engine.
// Fase 1 usa solo "phrase" (testo live). La distinzione "number" serve in Fase 2,
// quando il displayEngine isolerà i numeri prominenti.
export type DisplayKind = "number" | "phrase";

export interface DisplayDirective {
  kind: DisplayKind; // "number" = isolato e gigante; "phrase" = parole correnti
  text: string; // ciò che appare a schermo (breve!)
  emoji?: string; // emoji contestuale mostrata sopra il testo (opzionale)
}
