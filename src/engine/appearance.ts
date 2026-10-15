// Sistema di personalizzazione dell'aspetto del palco: temi, font, colori e
// immagine di sfondo. Tutto client-side; lo stato viene salvato in localStorage
// così le preferenze restano tra le sessioni.

export interface FontDef {
  id: string;
  label: string;
  family: string; // nome famiglia "nudo" (per canvas: ctx.font)
  stack: string; // CSS font-family
}

// Font display (heavy) per le caption cinetiche. Inclusi nella build: vedi src/fonts.ts.
export const FONTS: FontDef[] = [
  { id: "anybody", label: "Anybody", family: "Anybody", stack: '"Anybody", system-ui, sans-serif' },
  { id: "archivo", label: "Archivo Black", family: "Archivo Black", stack: '"Archivo Black", system-ui, sans-serif' },
  { id: "anton", label: "Anton", family: "Anton", stack: '"Anton", system-ui, sans-serif' },
  { id: "bebas", label: "Bebas Neue", family: "Bebas Neue", stack: '"Bebas Neue", system-ui, sans-serif' },
  { id: "oswald", label: "Oswald", family: "Oswald", stack: '"Oswald", system-ui, sans-serif' },
  { id: "montserrat", label: "Montserrat", family: "Montserrat", stack: '"Montserrat", system-ui, sans-serif' },
  { id: "space", label: "Space Grotesk", family: "Space Grotesk", stack: '"Space Grotesk", system-ui, sans-serif' },
  { id: "poppins", label: "Poppins", family: "Poppins", stack: '"Poppins", system-ui, sans-serif' },
];

export function fontStack(id: string): string {
  return (FONTS.find((f) => f.id === id) ?? FONTS[0]).stack;
}

export function fontFamilyName(id: string): string {
  return (FONTS.find((f) => f.id === id) ?? FONTS[0]).family;
}

export interface ThemeDef {
  id: string;
  label: string;
  bg: string; // colore sfondo
  fg: string; // colore testo (frasi)
  accent: string; // colore parole-chiave / numeri isolati
}

// Temi preset. "accent" colora numeri e parole-chiave isolate → più colore a schermo.
export const THEMES: ThemeDef[] = [
  { id: "light", label: "Bianco", bg: "#ffffff", fg: "#0a0a0a", accent: "#2d5bff" },
  { id: "dark", label: "Nero", bg: "#000000", fg: "#ffffff", accent: "#4d7cff" },
  { id: "nocturne", label: "Notte", bg: "#14110f", fg: "#f4ede4", accent: "#f5a524" },
  { id: "acid", label: "Acid", bg: "#0a0a0a", fg: "#ffffff", accent: "#c6ff00" },
  { id: "cream", label: "Crema", bg: "#f3ead8", fg: "#1a1410", accent: "#d2691e" },
  { id: "ocean", label: "Oceano", bg: "#0b2e4f", fg: "#ffffff", accent: "#36d1dc" },
  { id: "magenta", label: "Neon", bg: "#160a18", fg: "#ffffff", accent: "#ff2d95" },
  { id: "mint", label: "Menta", bg: "#eafff4", fg: "#0a1f17", accent: "#00b66c" },
];

export function getTheme(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export interface StyleConfig {
  themeId: string; // id preset oppure "custom"
  bg: string;
  fg: string;
  accent: string;
  fontId: string;
  numberAccent: boolean; // true = i numeri/parole-chiave usano il colore accent
  bgImage: string | null; // data URL dell'immagine personale
  scrim: number; // 0..1 velo sopra l'immagine per la leggibilità del testo
  fontScale: number; // moltiplicatore manuale della grandezza testo (0.6–1.6)
}

export const DEFAULT_STYLE: StyleConfig = {
  themeId: "light",
  bg: "#ffffff",
  fg: "#0a0a0a",
  accent: "#2d5bff",
  fontId: "anybody",
  numberAccent: true,
  bgImage: null,
  scrim: 0.35,
  fontScale: 1,
};

// Limiti del moltiplicatore manuale della grandezza testo.
export const FONT_SCALE_MIN = 0.6;
export const FONT_SCALE_MAX = 1.6;

/** Applica un tema preset, mantenendo font, immagine e altre scelte. */
export function applyTheme(style: StyleConfig, themeId: string): StyleConfig {
  const t = getTheme(themeId);
  return { ...style, themeId, bg: t.bg, fg: t.fg, accent: t.accent };
}

// Luminanza percepita di un colore #rrggbb → serve a scegliere un velo
// scuro o chiaro sotto un testo chiaro o scuro.
export function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  // BUG 11 fix: se il colore non è hex valido (es. rgb(), nome CSS), ritorna
  // 0.5 (neutro) invece di 0 (che sceglierebbe sempre velo scuro).
  if (!m) return 0.5;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const STORAGE_KEY = "prindict.style";

export function loadStyle(): StyleConfig {
  if (typeof localStorage === "undefined") return DEFAULT_STYLE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STYLE;
    const parsed = JSON.parse(raw) as Partial<StyleConfig>;
    // BUG 12 fix: clampa fontScale ai limiti validi. Se il valore salvato è
    // undefined (style pre-aggiunta) o fuori range, usa il default.
    const fontScale = parsed.fontScale != null
      ? Math.min(Math.max(parsed.fontScale, FONT_SCALE_MIN), FONT_SCALE_MAX)
      : DEFAULT_STYLE.fontScale;
    return { ...DEFAULT_STYLE, ...parsed, fontScale };
  } catch {
    return DEFAULT_STYLE;
  }
}

export function saveStyle(style: StyleConfig): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(style));
  } catch {
    /* quota/privacy: ignorabile */
  }
}
