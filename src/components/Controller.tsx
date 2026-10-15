import { useState } from "react";
import { StageScreen } from "./StageScreen";
import { TurboStage } from "./TurboStage";
import { Customize } from "./Customize";
import { Logo } from "./Logo";
import { FORMAT_LIST, FORMATS, type FormatId } from "../engine/formats";
import { LOCALE_LIST } from "../engine/locales";
import type { Token } from "../engine/effects/turboEngine";
import type { StyleConfig } from "../engine/appearance";
import type { DisplayDirective } from "../engine/types";

interface Props {
  listening: boolean;
  style: StyleConfig;
  format: FormatId;
  directive: DisplayDirective;
  tokens: Token[];
  turbo: boolean;
  emojiOn: boolean;
  lang: string;
  onStart: () => void;
  onStop: () => void;
  onStyleChange: (s: StyleConfig) => void;
  onToggleEmoji: () => void;
  onToggleTurbo: () => void;
  onSetLang: (id: string) => void;
  onSetFormat: (f: FormatId) => void;
  onRecord: () => void;
  onReview: () => void;
  scriptAvailable: boolean;
  onBack: () => void;
}

/** Selettore lingua: cambia lingua di ascolto e di resa (numeri, emoji, riempitivi). */
function LangPicker({ lang, onSetLang }: { lang: string; onSetLang: (id: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
        Lingua
      </span>
      <div className="flex">
        {LOCALE_LIST.map((l) => {
          const active = l.id === lang;
          return (
            <button
              key={l.id}
              onClick={() => onSetLang(l.id)}
              title={l.label}
              aria-pressed={active}
              className={
                "border-2 border-ink px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-widest transition-colors -ml-0.5 first:ml-0 " +
                (active ? "bg-ink text-white" : "bg-white text-ink hover:bg-neutral-100")
              }
            >
              {l.flag} {l.id}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Interruttore sharp a due stati (bianco/nero). */
function Toggle({ on, label, value }: { on: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </span>
      <span className="flex h-6 w-11 items-center border-2 border-ink bg-white p-0.5">
        <span className={`h-4 w-4 bg-ink transition-transform ${on ? "translate-x-5" : ""}`} />
      </span>
      <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-ink">{value}</span>
    </div>
  );
}

/** Workspace Creator (sistema Kinetic Minimalist). */
export function Controller({
  listening,
  style,
  format,
  directive,
  tokens,
  turbo,
  emojiOn,
  lang,
  onStart,
  onStop,
  onStyleChange,
  onToggleEmoji,
  onToggleTurbo,
  onSetLang,
  onSetFormat,
  onRecord,
  onReview,
  scriptAvailable,
  onBack,
}: Props) {
  const f = FORMATS[format];
  const [customizeOpen, setCustomizeOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col bg-paper text-ink">
      {/* Header */}
      <header className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
        <button
          onClick={onBack}
          className="font-body text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 hover:text-ink"
        >
          ← Dashboard
        </button>
        <h1 className="font-display text-xl font-black uppercase tracking-tight">Creator</h1>
        <Logo size="sm" showWord={false} />
      </header>

      {/* Workspace */}
      <main className="dot-grid relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6">
        {/* Pill formato */}
        <div className="flex flex-wrap justify-center gap-2">
          {FORMAT_LIST.map((opt) => {
            const active = opt.id === format;
            return (
              <button
                key={opt.id}
                onClick={() => onSetFormat(opt.id)}
                className={
                  "border-2 border-ink px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest transition-colors " +
                  (active ? "bg-ink text-white" : "bg-white text-ink hover:bg-neutral-100")
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Cornice preview con effetto "sticker" */}
        <div className="relative">
          <div className="absolute left-2 top-2 h-full w-full bg-neutral-200" aria-hidden />
          <div
            className="relative border-2 border-ink bg-white"
            // Altezza limitata così la barra controlli (con "Registra clip") resta
            // visibile anche su schermi da laptop senza dover scorrere.
            style={{ aspectRatio: f.aspect, height: "clamp(240px, calc(100vh - 380px), 58vh)" }}
          >
            <div className="absolute left-3 top-3 z-10 flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
            </div>
            {turbo ? (
              <TurboStage tokens={tokens} style={style} format={format} />
            ) : (
              <StageScreen directive={directive} style={style} format={format} />
            )}
            <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap bg-ink px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              Live preview
            </span>
          </div>
        </div>
      </main>

      {/* Barra controlli */}
      <footer className="flex flex-wrap items-center justify-between gap-6 border-t-2 border-ink bg-white px-6 py-5">
        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={onToggleTurbo}
            aria-pressed={turbo}
            className={
              "flex items-center gap-2 border-2 px-4 py-2 font-body text-[11px] font-black uppercase tracking-widest transition-colors " +
              (turbo
                ? "border-accent bg-accent text-white"
                : "border-ink bg-white text-ink hover:bg-ink hover:text-white")
            }
          >
            ⚡ Turbo {turbo ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setCustomizeOpen(true)}
            className="flex items-center gap-2 border-2 border-ink bg-white px-4 py-2 font-body text-[11px] font-bold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-white"
          >
            🎨 Personalizza
          </button>
          <button onClick={onToggleEmoji} aria-label="Attiva emoji">
            <Toggle on={emojiOn} label="Emoji" value={emojiOn ? "On" : "Off"} />
          </button>
          <LangPicker lang={lang} onSetLang={onSetLang} />
        </div>

        {/* Anteprima live (ascolta per vedere gli effetti, senza registrare) */}
        <div className="flex flex-col items-center">
          <button
            onClick={listening ? onStop : onStart}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-white text-ink transition-transform hover:scale-105"
            aria-label={listening ? "Ferma anteprima" : "Anteprima live"}
          >
            {listening ? (
              <span className="h-4 w-4 bg-ink" />
            ) : (
              <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-11 border-y-transparent border-l-ink" />
            )}
          </button>
          <span className="mt-1.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            {listening ? "Ferma" : "Anteprima"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRecord}
            title="Schermo pulito: registra voce + video, poi riascolta e scarichi o rifai"
            className="flex items-center gap-2.5 bg-rec px-6 py-3 font-body text-sm font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
          >
            <span className="h-3 w-3 rounded-full bg-white" />
            Registra clip
          </button>
          <button
            onClick={onReview}
            disabled={!scriptAvailable}
            title={scriptAvailable ? "Rivedi lo script e rigenera la clip" : "Parla un po' per generare lo script"}
            className="flex items-center gap-2 bg-ink px-5 py-3 font-body text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            Rivedi &amp; genera
            <span className="bg-pro px-1.5 py-0.5 text-[10px] font-black text-ink">PRO</span>
          </button>
        </div>
      </footer>

      {customizeOpen && (
        <Customize style={style} onChange={onStyleChange} onClose={() => setCustomizeOpen(false)} />
      )}
    </div>
  );
}
