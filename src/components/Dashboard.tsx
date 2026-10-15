import { Logo } from "./Logo";

interface Props {
  onOpenCreator: () => void;
}

/**
 * Home della piattaforma (sistema Kinetic Minimalist).
 * Due aree: Creator & Editing (attiva) · Presentazioni live (in arrivo).
 */
export function Dashboard({ onOpenCreator }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {/* Nav */}
      <header className="flex items-center justify-between border-b-2 border-ink px-6 py-4 md:px-16">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden font-body text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500 md:block">
            La tua voce diventa testo. Dal vivo.
          </span>
        </div>
        <button
          onClick={onOpenCreator}
          className="bg-ink px-5 py-2.5 font-body text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent"
        >
          Inizia
        </button>
      </header>

      {/* Corpo */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:px-16">
        <h1 className="font-display text-6xl font-black leading-[0.9] tracking-tightest md:text-8xl">
          Scegli modalità.
        </h1>
        <div className="mt-4 h-1 w-24 bg-accent" />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Creator & Editing — attiva */}
          <button
            onClick={onOpenCreator}
            className="group relative flex flex-col overflow-hidden bg-ink p-8 text-left text-white transition-transform hover:-translate-y-1"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center bg-accent text-2xl">🎬</div>
            <span className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Studio attivo
            </span>
            <h2 className="mt-2 font-display text-3xl font-black leading-none tracking-tight">
              Creator &amp; Editing
            </h2>
            <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-neutral-300">
              Trasforma la voce in clip tipografiche per i social. Karaoke, numeri formattati, emoji,
              registrazione e re-render dallo script corretto.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-widest">
              Apri
              <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
            </span>
          </button>

          {/* Presentazioni live — in arrivo */}
          <div className="relative flex cursor-not-allowed flex-col border-2 border-dashed border-neutral-300 p-8 text-neutral-400">
            <span className="absolute right-6 top-6 bg-neutral-200 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-600">
              In arrivo
            </span>
            <div className="mb-6 flex h-12 w-12 items-center justify-center bg-neutral-100 text-2xl">🎤</div>
            <span className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Bloccato
            </span>
            <h2 className="mt-2 font-display text-3xl font-black leading-none tracking-tight text-neutral-500">
              Presentazioni live
            </h2>
            <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-neutral-400">
              Uno schermo che reagisce a chi parla, per palco e proiettore. Multi-device, in tempo
              reale. Arriverà più avanti.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-widest text-neutral-400">
              Presto 🔒
            </span>
          </div>
        </div>
      </main>

      {/* Marquee cinetico */}
      <div className="overflow-hidden border-y-2 border-ink py-3">
        <div className="marquee-track font-display text-2xl font-black uppercase tracking-tight text-neutral-200">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              Trascrizione in tempo reale&nbsp;·&nbsp;Clip per i social&nbsp;·&nbsp;La tua voce diventa
              testo&nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col gap-2 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-16">
        <Logo size="sm" />
        <p className="font-body text-[11px] uppercase tracking-widest text-neutral-400">
          Presto disponibile come web app e app · Chrome desktop consigliato
        </p>
      </footer>
    </div>
  );
}
