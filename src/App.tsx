import { useEffect, useMemo, useRef, useState } from "react";
import { useSpeech } from "./hooks/useSpeech";
import { useRecorder } from "./hooks/useRecorder";
import { decide } from "./engine/displayEngine";
import { FORMATS, type FormatId } from "./engine/formats";
import { CanvasStage } from "./components/CanvasStage";
import { Controller } from "./components/Controller";
import { ReviewRender } from "./components/ReviewRender";
import { Dashboard } from "./components/Dashboard";
import { BrowserCheck } from "./components/BrowserCheck";
import { getLocale, DEFAULT_LOCALE } from "./engine/locales";
import { turboTokens } from "./engine/effects/turboEngine";
import { directiveToItems } from "./engine/stageItems";
import { loadStyle, saveStyle, type StyleConfig } from "./engine/appearance";

type View = "dashboard" | "creator";
type Mode = "controller" | "stage" | "review";

export default function App() {
  const [lang, setLang] = useState<string>(DEFAULT_LOCALE);
  const locale = getLocale(lang);
  const { interim, finals, listening, supported, start, stop, reset } = useSpeech(locale.speechLang);
  const rec = useRecorder();
  const stageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<View>("dashboard");
  const [style, setStyle] = useState<StyleConfig>(() => loadStyle());
  const [format, setFormat] = useState<FormatId>("vertical");
  const [emojiOn, setEmojiOn] = useState(true);
  const [turbo, setTurbo] = useState(false);
  const [mode, setMode] = useState<Mode>("controller");
  // UI immediata: rec.start() è async (mic) → senza questo il tasto Stop resta nascosto.
  const [takeActive, setTakeActive] = useState(false);
  const [reviewScript, setReviewScript] = useState("");

  useEffect(() => saveStyle(style), [style]);

  const WINDOW_SIZE = 4;

  const directive = useMemo(() => {
    const ended = interim.trim() === "" && finals.length > 0;
    const src = interim || finals[finals.length - 1] || "";
    return decide(src, ended, WINDOW_SIZE, emojiOn, lang);
  }, [interim, finals, emojiOn, lang]);

  const tokens = useMemo(() => {
    const src = interim || finals[finals.length - 1] || "";
    return turboTokens(src, getLocale(lang), WINDOW_SIZE);
  }, [interim, finals, lang]);

  const stageItems = turbo ? tokens : directiveToItems(directive);
  const stageEmoji = turbo ? undefined : directive.emoji;
  const scriptText = finals.join(" ").trim();
  const recording = takeActive || rec.state === "recording";

  useEffect(() => {
    if (rec.state === "preview" || rec.state === "idle") setTakeActive(false);
  }, [rec.state]);

  const enterStage = () => {
    stop();
    rec.discard();
    reset();
    setTakeActive(false);
    setMode("stage");
  };

  const exitStage = () => {
    stop();
    rec.stop();
    rec.discard();
    setTakeActive(false);
    setMode("controller");
  };

  const enterReview = (script: string) => {
    stop();
    rec.discard();
    setTakeActive(false);
    setReviewScript(script);
    setMode("review");
  };

  const startTake = async () => {
    stop();
    reset();
    setTakeActive(true);
    const ok = await rec.start(stageCanvasRef.current, { audio: true });
    if (!ok) {
      setTakeActive(false);
      return;
    }
    start();
  };

  const stopTake = () => {
    stop();
    rec.stop();
    setTakeActive(false);
  };

  const retake = () => {
    rec.discard();
    reset();
    setTakeActive(false);
  };

  useEffect(() => {
    if (mode !== "stage") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitStage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (view === "dashboard") {
    return <Dashboard onOpenCreator={() => setView("creator")} />;
  }

  if (!supported) return <BrowserCheck onBack={() => setView("dashboard")} />;

  if (mode === "review") {
    return (
      <ReviewRender
        format={format}
        style={style}
        emojiOn={emojiOn}
        lang={lang}
        turbo={turbo}
        initialScript={reviewScript}
        onExit={() => setMode("controller")}
      />
    );
  }

  if (mode === "stage") {
    const f = FORMATS[format];
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-ink">
        <div
          style={{
            width: `min(100vw, calc(100vh * ${f.ratio}))`,
            height: `min(100vh, calc(100vw / ${f.ratio}))`,
          }}
        >
          <CanvasStage
            ref={stageCanvasRef}
            items={stageItems}
            emoji={stageEmoji}
            style={style}
            format={format}
            recording={recording}
          />
        </div>

        <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
          <span className={`h-2 w-2 rounded-full ${recording ? "animate-pulse bg-rec" : "bg-white/30"}`} />
          {recording ? "Sto registrando" : "Pronto"}
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 text-right font-body text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          Prindict
          <br />
          {f.label}
        </div>

        {rec.state !== "preview" && (
          <button
            onClick={exitStage}
            className="absolute right-5 top-5 border-2 border-white/30 px-3 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-white/70 transition-colors hover:bg-white/10"
          >
            ✕ Esci
          </button>
        )}

        {rec.error && (
          <div className="absolute left-1/2 top-5 -translate-x-1/2 font-body text-xs text-rec">{rec.error}</div>
        )}

        {rec.state !== "preview" && (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            {!recording ? (
              <button
                onClick={startTake}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-rec text-white transition-transform hover:scale-105"
                aria-label="Registra"
              >
                <span className="h-6 w-6 rounded-full bg-white" />
              </button>
            ) : (
              <button
                onClick={stopTake}
                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white transition-transform hover:scale-105"
                aria-label="Stop"
              >
                <span className="h-6 w-6 bg-white" />
              </button>
            )}
            <span className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
              {!recording ? "Registra (voce + video)" : "Stop"}
            </span>
          </div>
        )}

        {rec.state === "preview" && rec.videoUrl && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/95 p-6">
            <video
              src={rec.videoUrl}
              controls
              autoPlay
              loop
              className="max-h-[68vh] max-w-full border border-white/10 shadow-2xl"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={rec.download}
                className="bg-white px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-accent hover:text-white"
              >
                ⬇ Scarica clip
              </button>
              {scriptText && (
                <button
                  onClick={() => enterReview(scriptText)}
                  className="flex items-center gap-2 bg-ink px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent"
                >
                  Rivedi script
                  <span className="bg-pro px-1.5 py-0.5 text-[10px] font-black text-ink">PRO</span>
                </button>
              )}
              <button
                onClick={retake}
                className="border-2 border-white/30 px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/10"
              >
                ↺ Rifai
              </button>
              <button
                onClick={exitStage}
                className="border-2 border-white/30 px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/10"
              >
                ✕ Esci
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Controller
      listening={listening}
      style={style}
      format={format}
      directive={directive}
      tokens={tokens}
      turbo={turbo}
      onStart={start}
      onStop={stop}
      emojiOn={emojiOn}
      lang={lang}
      scriptAvailable={scriptText.length > 0}
      onStyleChange={setStyle}
      onToggleEmoji={() => setEmojiOn((v) => !v)}
      onToggleTurbo={() => setTurbo((v) => !v)}
      onSetLang={setLang}
      onSetFormat={setFormat}
      onRecord={enterStage}
      onReview={() => enterReview(scriptText)}
      onBack={() => setView("dashboard")}
    />
  );
}
