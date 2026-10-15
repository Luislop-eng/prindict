import { useRef } from "react";
import {
  THEMES,
  FONTS,
  FONT_SCALE_MIN,
  FONT_SCALE_MAX,
  applyTheme,
  fontStack,
  type StyleConfig,
} from "../engine/appearance";

interface Props {
  style: StyleConfig;
  onChange: (s: StyleConfig) => void;
  onClose: () => void;
}

const labelCls = "font-body text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500";

/** Pannello "Personalizza": tema, font, colori, immagine di sfondo. */
export function Customize({ style, onChange, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const setColor = (key: "bg" | "fg" | "accent", value: string) =>
    onChange({ ...style, [key]: value, themeId: "custom" });

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // BUG 14 fix: valida la dimensione del file per evitare di salvare un data
    // URL enorme in localStorage (limite ~5MB). 2MB è un compromesso ragionevole
    // per una foto di sfondo su 1080p.
    const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_IMAGE_BYTES) {
      alert("Immagine troppo grande (max 2 MB). Usa un'immagine più piccola o comprimila.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange({ ...style, bgImage: String(reader.result) });
    reader.readAsDataURL(file);
    e.target.value = ""; // permette di ricaricare lo stesso file
  };

  return (
    <div className="absolute inset-0 z-30 flex justify-end bg-black/30" onClick={onClose}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-sm flex-col gap-7 overflow-y-auto border-l-2 border-ink bg-white px-6 py-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-black uppercase tracking-tight">Personalizza</h2>
          <button
            onClick={onClose}
            className="border-2 border-ink px-3 py-1 font-body text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-white"
          >
            Chiudi
          </button>
        </div>

        {/* Tema */}
        <section className="flex flex-col gap-2.5">
          <span className={labelCls}>Tema</span>
          <div className="grid grid-cols-4 gap-2">
            {THEMES.map((t) => {
              const active = style.themeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChange(applyTheme(style, t.id))}
                  title={t.label}
                  className={
                    "flex aspect-square flex-col items-center justify-center gap-1 border-2 " +
                    (active ? "border-accent" : "border-ink/15 hover:border-ink")
                  }
                  style={{ backgroundColor: t.bg }}
                >
                  <span className="text-lg font-black leading-none" style={{ color: t.accent }}>
                    A
                  </span>
                  <span
                    className="h-1 w-5"
                    style={{ backgroundColor: t.fg, opacity: 0.7 }}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Font */}
        <section className="flex flex-col gap-2.5">
          <span className={labelCls}>Font</span>
          <div className="grid grid-cols-2 gap-2">
            {FONTS.map((font) => {
              const active = style.fontId === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => onChange({ ...style, fontId: font.id })}
                  className={
                    "border-2 px-3 py-2.5 text-left text-lg leading-none " +
                    (active ? "border-accent bg-accent/5" : "border-ink/15 hover:border-ink")
                  }
                  style={{ fontFamily: fontStack(font.id), fontWeight: 800 }}
                >
                  {font.label}
                </button>
              );
            })}
          </div>
          <label className="mt-1 flex flex-col gap-1.5">
            <span className={labelCls}>
              Grandezza testo — {Math.round((style.fontScale ?? 1) * 100)}%
            </span>
            <input
              type="range"
              min={FONT_SCALE_MIN}
              max={FONT_SCALE_MAX}
              step={0.05}
              value={style.fontScale ?? 1}
              onChange={(e) => onChange({ ...style, fontScale: Number(e.target.value) })}
              className="accent-accent"
            />
            <span className="font-body text-[10px] text-neutral-400">
              Le parole troppo lunghe vengono comunque rimpicciolite in automatico per stare dentro la cornice.
            </span>
          </label>
        </section>

        {/* Colori */}
        <section className="flex flex-col gap-2.5">
          <span className={labelCls}>Colori</span>
          <div className="flex flex-col gap-2">
            <ColorRow label="Sfondo" value={style.bg} onChange={(v) => setColor("bg", v)} />
            <ColorRow label="Testo" value={style.fg} onChange={(v) => setColor("fg", v)} />
            <ColorRow label="Evidenzia" value={style.accent} onChange={(v) => setColor("accent", v)} />
          </div>
          <button
            onClick={() => onChange({ ...style, numberAccent: !style.numberAccent })}
            className="mt-1 flex items-center gap-2 self-start"
          >
            <span className="flex h-5 w-9 items-center border-2 border-ink bg-white p-0.5">
              <span
                className={`h-3 w-3 bg-ink transition-transform ${style.numberAccent ? "translate-x-4" : ""}`}
              />
            </span>
            <span className="font-body text-[11px] font-bold uppercase tracking-widest text-ink">
              Numeri colorati
            </span>
          </button>
        </section>

        {/* Immagine di sfondo */}
        <section className="flex flex-col gap-2.5">
          <span className={labelCls}>Immagine di sfondo</span>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="hidden" />
          {style.bgImage ? (
            <div className="flex flex-col gap-3">
              <div
                className="h-28 w-full border-2 border-ink bg-cover bg-center"
                style={{ backgroundImage: `url(${style.bgImage})` }}
                aria-hidden
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 border-2 border-ink px-3 py-2 font-body text-xs font-bold uppercase tracking-widest hover:bg-neutral-100"
                >
                  Sostituisci
                </button>
                <button
                  onClick={() => onChange({ ...style, bgImage: null })}
                  className="flex-1 border-2 border-ink px-3 py-2 font-body text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-white"
                >
                  Rimuovi
                </button>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Velo leggibilità — {Math.round(style.scrim * 100)}%</span>
                <input
                  type="range"
                  min={0}
                  max={0.8}
                  step={0.05}
                  value={style.scrim}
                  onChange={(e) => onChange({ ...style, scrim: Number(e.target.value) })}
                  className="accent-accent"
                />
              </label>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-ink/40 px-4 py-6 font-body text-xs font-bold uppercase tracking-widest text-neutral-500 hover:border-ink hover:text-ink"
            >
              ⬆ Carica una foto su cui parlare
            </button>
          )}
        </section>
      </aside>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between border-2 border-ink/15 px-3 py-2">
      <span className="font-body text-xs font-bold uppercase tracking-widest text-ink">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-body text-[11px] uppercase tracking-wide text-neutral-400">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer border border-ink/20 bg-white p-0.5"
        />
      </span>
    </label>
  );
}
