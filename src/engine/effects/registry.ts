// Registry degli effetti cinetici della modalità Turbo.
// Ogni effetto sfrutta un meccanismo di attenzione preciso (psychNote). Le
// animazioni concrete (framer-motion) vivono in TurboStage, che fa lo switch
// su `id`; qui stanno i metadati, la categoria e il modo di render.

export type EffectId = "none" | "explode" | "rise" | "fall" | "grow" | "shake" | "isolate";

export type EffectCategory = "action" | "isolate" | "mood" | "neutral";

export interface EffectDef {
  id: EffectId;
  label: string;
  category: EffectCategory;
  psychNote: string; // perché cattura l'attenzione
  perLetter: boolean; // true = anima le lettere singolarmente
}

export const EFFECTS: Record<EffectId, EffectDef> = {
  none: {
    id: "none",
    label: "Normale",
    category: "neutral",
    psychNote: "Entrata morbida: tiene il ritmo senza rubare la scena.",
    perLetter: false,
  },
  explode: {
    id: "explode",
    label: "Esplode",
    category: "action",
    psychNote: "Movimento improvviso e divergente: il sistema visivo pre-attentivo scatta verso ciò che esplode.",
    perLetter: true,
  },
  rise: {
    id: "rise",
    label: "Sale",
    category: "action",
    psychNote: "Moto verso l'alto = associazione positiva (su = meglio); l'occhio segue la traiettoria.",
    perLetter: false,
  },
  fall: {
    id: "fall",
    label: "Crolla",
    category: "action",
    psychNote: "Caduta improvvisa: gravità percepita, segnala perdita/calo, crea tensione.",
    perLetter: false,
  },
  grow: {
    id: "grow",
    label: "Enorme",
    category: "action",
    psychNote: "Scala = importanza: ciò che diventa grande viene letto come dominante.",
    perLetter: false,
  },
  shake: {
    id: "shake",
    label: "Agita",
    category: "mood",
    psychNote: "Vibrazione ad alta frequenza = arousal/urgenza; il corpo legge l'agitazione come emozione forte.",
    perLetter: false,
  },
  isolate: {
    id: "isolate",
    label: "Isola",
    category: "isolate",
    psychNote: "Effetto Von Restorff: l'elemento isolato e diverso dagli altri si fissa nella memoria.",
    perLetter: false,
  },
};
