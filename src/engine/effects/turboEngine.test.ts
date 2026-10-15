import { describe, it, expect } from "vitest";
import { turboTokens } from "./turboEngine";
import { getLocale } from "../locales";
import type { EffectId } from "./registry";

// Helper: estrae l'effectId dell'ultimo token non-isolate (la parola-trigger).
function lastEffect(tokens: ReturnType<typeof turboTokens>): EffectId | null {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].effectId !== "isolate") return tokens[i].effectId as EffectId;
  }
  return null;
}

// Helper: trova il token con un dato testo e restituisce il suo effectId.
function effectOf(tokens: ReturnType<typeof turboTokens>, text: string): EffectId | null {
  const t = tokens.find((tk) => tk.text.toLowerCase().replace(/[.,;:!?]+$/g, "") === text.toLowerCase());
  return t ? (t.effectId as EffectId) : null;
}

describe("turboTokens — Italiano (it)", () => {
  const locale = getLocale("it");

  it("esplode → explode", () => {
    const tokens = turboTokens("il mercato esplode", locale);
    expect(effectOf(tokens, "esplode")).toBe("explode");
  });

  it("boom → explode", () => {
    const tokens = turboTokens("boom tutto", locale);
    expect(effectOf(tokens, "boom")).toBe("explode");
  });

  it("scoppia → explode", () => {
    const tokens = turboTokens("scoppia adesso", locale);
    expect(effectOf(tokens, "scoppia")).toBe("explode");
  });

  it("sale → rise", () => {
    const tokens = turboTokens("la borsa sale", locale);
    expect(effectOf(tokens, "sale")).toBe("rise");
  });

  it("vola → rise", () => {
    const tokens = turboTokens("vola alto", locale);
    expect(effectOf(tokens, "vola")).toBe("rise");
  });

  it("crolla → fall", () => {
    const tokens = turboTokens("crolla tutto", locale);
    expect(effectOf(tokens, "crolla")).toBe("fall");
  });

  it("precipita → fall", () => {
    const tokens = turboTokens("precipita giù", locale);
    expect(effectOf(tokens, "precipita")).toBe("fall");
  });

  it("enorme → grow", () => {
    const tokens = turboTokens("enorme successo", locale);
    expect(effectOf(tokens, "enorme")).toBe("grow");
  });

  it("colossale → grow", () => {
    const tokens = turboTokens("colossale", locale);
    expect(effectOf(tokens, "colossale")).toBe("grow");
  });

  it("pazzesco → shake", () => {
    const tokens = turboTokens("pazzesco davvero", locale);
    expect(effectOf(tokens, "pazzesco")).toBe("shake");
  });

  it("furioso → shake", () => {
    const tokens = turboTokens("furioso", locale);
    expect(effectOf(tokens, "furioso")).toBe("shake");
  });

  it("parola neutra → none", () => {
    const tokens = turboTokens("il tavolo", locale);
    expect(lastEffect(tokens)).toBe("none");
  });

  it("numero → isolate", () => {
    const tokens = turboTokens("guadagno duecentomila euro", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("200.000");
  });

  it("percentuale → isolate", () => {
    const tokens = turboTokens("sale del cinquanta per cento", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("50");
    expect(numToken!.text).toContain("%");
  });

  it("valuta euro → isolate con €", () => {
    const tokens = turboTokens("costa novantanove euro", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("99");
    expect(numToken!.text).toContain("€");
  });
});

describe("turboTokens — English (en)", () => {
  const locale = getLocale("en");

  it("explode → explode", () => {
    const tokens = turboTokens("it explodes now", locale);
    expect(effectOf(tokens, "explodes")).toBe("explode");
  });

  it("boom → explode", () => {
    const tokens = turboTokens("boom everything", locale);
    expect(effectOf(tokens, "boom")).toBe("explode");
  });

  it("burst → explode", () => {
    const tokens = turboTokens("burst suddenly", locale);
    expect(effectOf(tokens, "burst")).toBe("explode");
  });

  it("soars → rise", () => {
    const tokens = turboTokens("the stock soars", locale);
    expect(effectOf(tokens, "soars")).toBe("rise");
  });

  it("skyrockets → rise", () => {
    const tokens = turboTokens("skyrockets today", locale);
    expect(effectOf(tokens, "skyrockets")).toBe("rise");
  });

  it("crash → fall", () => {
    const tokens = turboTokens("crash everything", locale);
    expect(effectOf(tokens, "crash")).toBe("fall");
  });

  it("plunges → fall", () => {
    const tokens = turboTokens("plunges down", locale);
    expect(effectOf(tokens, "plunges")).toBe("fall");
  });

  it("huge → grow", () => {
    const tokens = turboTokens("huge success", locale);
    expect(effectOf(tokens, "huge")).toBe("grow");
  });

  it("colossal → grow", () => {
    const tokens = turboTokens("colossal", locale);
    expect(effectOf(tokens, "colossal")).toBe("grow");
  });

  it("crazy → shake", () => {
    const tokens = turboTokens("crazy stuff", locale);
    expect(effectOf(tokens, "crazy")).toBe("shake");
  });

  it("furious → shake", () => {
    const tokens = turboTokens("furious", locale);
    expect(effectOf(tokens, "furious")).toBe("shake");
  });

  it("neutral word → none", () => {
    const tokens = turboTokens("the table", locale);
    expect(lastEffect(tokens)).toBe("none");
  });

  it("number → isolate", () => {
    const tokens = turboTokens("revenue two hundred thousand", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("200,000");
  });

  it("percentage → isolate with %", () => {
    const tokens = turboTokens("up fifty percent", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("50");
    expect(numToken!.text).toContain("%");
  });

  it("currency dollars → isolate with $", () => {
    const tokens = turboTokens("costs ninety nine dollars", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("$");
    expect(numToken!.text).toContain("99");
  });
});

describe("turboTokens — Español (es)", () => {
  const locale = getLocale("es");

  it("explota → explode", () => {
    const tokens = turboTokens("el mercado explota", locale);
    expect(effectOf(tokens, "explota")).toBe("explode");
  });

  it("estalla → explode", () => {
    const tokens = turboTokens("estalla ahora", locale);
    expect(effectOf(tokens, "estalla")).toBe("explode");
  });

  it("boom → explode", () => {
    const tokens = turboTokens("boom todo", locale);
    expect(effectOf(tokens, "boom")).toBe("explode");
  });

  it("sube → rise", () => {
    const tokens = turboTokens("la bolsa sube", locale);
    expect(effectOf(tokens, "sube")).toBe("rise");
  });

  it("dispara → rise", () => {
    const tokens = turboTokens("se dispara", locale);
    expect(effectOf(tokens, "dispara")).toBe("rise");
  });

  it("cae → fall", () => {
    const tokens = turboTokens("cae todo", locale);
    expect(effectOf(tokens, "cae")).toBe("fall");
  });

  it("precipita → fall", () => {
    const tokens = turboTokens("precipita abajo", locale);
    expect(effectOf(tokens, "precipita")).toBe("fall");
  });

  it("enorme → grow", () => {
    const tokens = turboTokens("enorme exito", locale);
    expect(effectOf(tokens, "enorme")).toBe("grow");
  });

  it("colosal → grow", () => {
    const tokens = turboTokens("colosal", locale);
    expect(effectOf(tokens, "colosal")).toBe("grow");
  });

  it("loco → shake", () => {
    const tokens = turboTokens("loco de verdad", locale);
    expect(effectOf(tokens, "loco")).toBe("shake");
  });

  it("furioso → shake", () => {
    const tokens = turboTokens("furioso", locale);
    expect(effectOf(tokens, "furioso")).toBe("shake");
  });

  it("palabra neutra → none", () => {
    const tokens = turboTokens("la mesa", locale);
    expect(lastEffect(tokens)).toBe("none");
  });

  it("número → isolate", () => {
    const tokens = turboTokens("ganancia doscientos mil euros", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("200.000");
  });

  it("porcentaje → isolate con %", () => {
    const tokens = turboTokens("sube cincuenta por ciento", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("50");
    expect(numToken!.text).toContain("%");
  });

  it("moneda euros → isolate con €", () => {
    const tokens = turboTokens("cuesta cincuenta euros", locale);
    const numToken = tokens.find((t) => t.effectId === "isolate");
    expect(numToken).toBeDefined();
    expect(numToken!.text).toContain("50");
    expect(numToken!.text).toContain("€");
  });
});

describe("turboTokens — taste governor", () => {
  const locale = getLocale("it");

  it("massimo 2 effetti forti simultanei", () => {
    // 4 parole-trigger in una finestra di 4: solo le ultime 2 restano forti.
    const tokens = turboTokens("esplode crolla sale cresce", locale, 4);
    const strong = tokens.filter((t) => t.effectId !== "none" && t.effectId !== "isolate");
    expect(strong.length).toBeLessThanOrEqual(2);
  });

  it("isolate non conta come forte", () => {
    // Se c'è un numero isolate + 2 trigger, entrambi i trigger restano.
    const tokens = turboTokens("esplode crolla duecentomila", locale, 4);
    const isolate = tokens.filter((t) => t.effectId === "isolate");
    const strong = tokens.filter((t) => t.effectId !== "none" && t.effectId !== "isolate");
    expect(isolate.length).toBe(1);
    expect(strong.length).toBe(2);
  });
});

describe("turboTokens — fillers rimossi", () => {
  const locale = getLocale("it");

  it("i riempitivi non producono token", () => {
    const tokens = turboTokens("ehm tipo cioè", locale);
    // "tipo" e "cioè" sono fillers → filtrati. "ehm" anche.
    expect(tokens.length).toBe(0);
  });
});

describe("turboTokens — nuovi trigger espansi", () => {
  it("IT: distrugge → explode", () => {
    const tokens = turboTokens("distrugge tutto", getLocale("it"));
    expect(effectOf(tokens, "distrugge")).toBe("explode");
  });

  it("IT: brucia → shake", () => {
    const tokens = turboTokens("brucia tutto", getLocale("it"));
    expect(effectOf(tokens, "brucia")).toBe("shake");
  });

  it("IT: gigantesco → grow", () => {
    const tokens = turboTokens("gigantesco", getLocale("it"));
    expect(effectOf(tokens, "gigantesco")).toBe("grow");
  });

  it("IT: titanico → grow", () => {
    const tokens = turboTokens("titanico", getLocale("it"));
    expect(effectOf(tokens, "titanico")).toBe("grow");
  });

  it("EN: destroys → explode", () => {
    const tokens = turboTokens("destroys everything", getLocale("en"));
    expect(effectOf(tokens, "destroys")).toBe("explode");
  });

  it("EN: blazing → shake", () => {
    const tokens = turboTokens("blazing fast", getLocale("en"));
    expect(effectOf(tokens, "blazing")).toBe("shake");
  });

  it("EN: monumental → grow", () => {
    const tokens = turboTokens("monumental", getLocale("en"));
    expect(effectOf(tokens, "monumental")).toBe("grow");
  });

  it("EN: rockets → rise", () => {
    const tokens = turboTokens("rockets up", getLocale("en"));
    expect(effectOf(tokens, "rockets")).toBe("rise");
  });

  it("ES: destruye → explode", () => {
    const tokens = turboTokens("destruye todo", getLocale("es"));
    expect(effectOf(tokens, "destruye")).toBe("explode");
  });

  it("ES: ardiente → shake", () => {
    const tokens = turboTokens("ardiente", getLocale("es"));
    expect(effectOf(tokens, "ardiente")).toBe("shake");
  });

  it("ES: monumental → grow", () => {
    const tokens = turboTokens("monumental", getLocale("es"));
    expect(effectOf(tokens, "monumental")).toBe("grow");
  });

  it("ES: despega → rise", () => {
    const tokens = turboTokens("despega alto", getLocale("es"));
    expect(effectOf(tokens, "despega")).toBe("rise");
  });
});

describe("turboTokens — trigger multi-parola (bigram)", () => {
  it("IT: 'alle stelle' → rise sulla prima parola", () => {
    const tokens = turboTokens("sale alle stelle", getLocale("it"), 4);
    const alle = tokens.find((t) => t.text === "alle");
    expect(alle).toBeDefined();
    expect(alle!.effectId).toBe("rise");
  });

  it("IT: 'va in fumo' → fall sulla prima parola", () => {
    const tokens = turboTokens("tutto va in fumo", getLocale("it"), 4);
    const va = tokens.find((t) => t.text === "va");
    expect(va).toBeDefined();
    expect(va!.effectId).toBe("fall");
  });

  it("EN: 'to the moon' → rise sulla prima parola", () => {
    const tokens = turboTokens("goes to the moon", getLocale("en"), 4);
    const to = tokens.find((t) => t.text === "to");
    expect(to).toBeDefined();
    expect(to!.effectId).toBe("rise");
  });

  it("EN: 'goes up in smoke' → fall sulla prima parola", () => {
    const tokens = turboTokens("goes up in smoke", getLocale("en"), 5);
    const goes = tokens.find((t) => t.text === "goes");
    expect(goes).toBeDefined();
    expect(goes!.effectId).toBe("fall");
  });

  it("ES: 'a la luna' → rise sulla prima parola", () => {
    const tokens = turboTokens("sube a la luna", getLocale("es"), 4);
    const a = tokens.find((t) => t.text === "a");
    expect(a).toBeDefined();
    expect(a!.effectId).toBe("rise");
  });

  it("ES: 'se desmorona' → fall sulla prima parola", () => {
    const tokens = turboTokens("todo se desmorona", getLocale("es"), 4);
    const se = tokens.find((t) => t.text === "se");
    expect(se).toBeDefined();
    expect(se!.effectId).toBe("fall");
  });
});
