// Item del palco: la forma comune che il CanvasStage sa disegnare. I token Turbo
// (turboEngine) sono già di questa forma; qui convertiamo anche la direttiva
// della modalità normale, così canvas è l'unico renderer per entrambe.

import type { DisplayDirective } from "./types";
import type { EffectId } from "./effects/registry";

export interface StageItem {
  text: string;
  effectId: EffectId;
  key: string;
}

export function directiveToItems(d: DisplayDirective): StageItem[] {
  if (!d.text) return [];
  if (d.kind === "number") {
    return [{ text: d.text, effectId: "isolate", key: `num-${d.text}` }];
  }
  return d.text
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => ({ text: w, effectId: "none" as EffectId, key: `p${i}-${w}` }));
}
