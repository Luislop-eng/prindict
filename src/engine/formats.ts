// Formati di output selezionabili. La cornice (aspect-ratio) serve a registrare
// esattamente il riquadro giusto per il social. Il fontFactor ribilancia la
// dimensione del testo in modo estetico per ciascun formato.
export type FormatId = "vertical" | "horizontal" | "square";

export interface FormatDef {
  id: FormatId;
  label: string;
  ratio: number; // larghezza / altezza
  aspect: string; // valore CSS aspect-ratio
  fontFactor: number; // moltiplicatore estetico del font
}

export const FORMATS: Record<FormatId, FormatDef> = {
  vertical: { id: "vertical", label: "Verticale 9:16", ratio: 9 / 16, aspect: "9 / 16", fontFactor: 1.1 },
  horizontal: { id: "horizontal", label: "Orizzontale 16:9", ratio: 16 / 9, aspect: "16 / 9", fontFactor: 0.92 },
  square: { id: "square", label: "Quadrato 1:1", ratio: 1, aspect: "1 / 1", fontFactor: 1.0 },
};

export const FORMAT_LIST: FormatDef[] = [FORMATS.vertical, FORMATS.horizontal, FORMATS.square];
