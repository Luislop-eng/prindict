import { Logo } from "./Logo";

interface Props {
  onBack?: () => void;
}

/** Avviso mostrato quando la Web Speech API non è disponibile (es. Safari/Firefox). */
export function BrowserCheck({ onBack }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-5 bg-paper p-6 text-center text-ink">
      <Logo />
      <h1 className="font-display text-4xl font-black tracking-tight">Browser non supportato</h1>
      <p className="font-body text-neutral-600">
        Prindict usa la <strong>Web Speech API</strong> per la trascrizione vocale, che funziona in
        modo affidabile su <strong>Chrome</strong> (o Edge) desktop.
      </p>
      <p className="font-body text-sm text-neutral-500">
        Apri questa pagina in Chrome per usare il karaoke vocale.
      </p>
      {onBack && (
        <button
          onClick={onBack}
          className="border-2 border-ink px-5 py-2.5 font-body text-xs font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          ← Torna alla dashboard
        </button>
      )}
    </div>
  );
}
