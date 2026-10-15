import { useCallback, useRef, useState } from "react";

export type RecState = "idle" | "recording" | "preview";

export interface UseRecorder {
  supported: boolean;
  state: RecState;
  videoUrl: string | null;
  error: string | null;
  start: (canvas: HTMLCanvasElement | null, opts?: { audio?: boolean }) => Promise<boolean>;
  stop: () => void;
  download: () => void;
  discard: () => void;
}

// Con audio: WebM+Opus muxa meglio canvas+mic in Chrome. Senza audio: MP4 preferito.
function pickMime(withAudio: boolean): string {
  const candidates = withAudio
    ? [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
        "video/mp4;codecs=h264,aac",
        "video/mp4",
      ]
    : [
        "video/mp4;codecs=h264,aac",
        "video/mp4",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ];
  if (typeof MediaRecorder !== "undefined") {
    for (const m of candidates) {
      if (MediaRecorder.isTypeSupported(m)) return m;
    }
  }
  return "video/webm";
}

const extFor = (mime: string) => (mime.includes("mp4") ? "mp4" : "webm");

/**
 * Registrazione DIRETTA dal canvas del palco: niente cattura schermo, niente
 * dialog di condivisione, niente bande nere. Cattura i pixel che disegniamo noi
 * (canvas.captureStream) e ci aggiunge la voce del microfono. Al termine:
 * anteprima → scarica o rifai.
 */
export function useRecorder(): UseRecorder {
  const supported =
    typeof HTMLCanvasElement !== "undefined" &&
    typeof HTMLCanvasElement.prototype.captureStream === "function" &&
    typeof MediaRecorder !== "undefined";

  const [state, setState] = useState<RecState>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef<string>("video/webm");
  const urlRef = useRef<string | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const canvasStreamRef = useRef<MediaStream | null>(null);
  // Flag: la registrazione è stata abbandonata mentre getUserMedia era ancora
  // pendente (timeout o stop dell'utente). Serve a fermare il mic che arriva tardi.
  const abandonedRef = useRef(false);

  // Ferma e libera ogni track attivo (canvas + microfono). Idempotente.
  const stopAllTracks = useCallback(() => {
    canvasStreamRef.current?.getTracks().forEach((t) => t.stop());
    canvasStreamRef.current = null;
    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;
  }, []);

  const start = useCallback(
    async (canvas: HTMLCanvasElement | null, opts?: { audio?: boolean }): Promise<boolean> => {
      const withAudio = opts?.audio !== false;
      setError(null);
      if (!supported) {
        setError("Registrazione non supportata in questo browser.");
        return false;
      }
      if (!canvas) {
        setError("Palco non pronto.");
        return false;
      }
      let canvasStream: MediaStream | null = null;
      try {
        abandonedRef.current = false;
        canvasStream = canvas.captureStream(30);
        canvasStreamRef.current = canvasStream;
        const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

        // Aggiungi la voce dal microfono (solo in modalità live).
        // IMPORTANTE: getUserMedia può restare appeso (permesso, contesa col
        // riconoscimento vocale). Con un timeout la registrazione parte comunque
        // (eventualmente senza audio) → il tasto Stop appare sempre.
        if (withAudio) {
          let timedOut = false;
          try {
            // BUG 1 fix: non scartiamo la promise di getUserMedia. Se arriva DOPO
            // il timeout, fermiamo subito il mic (o lo aggiungiamo se ancora utile).
            const micPromise = navigator.mediaDevices.getUserMedia({ audio: true });
            micPromise
              .then((late) => {
                // Se siamo già oltre il timeout o la registrazione è stata
                // abbandonata, il mic tardivo va fermato per non lasciare la
                // luce accesa / risorsa appesa.
                // NB: niente controllo su recRef qui — questo handler gira PRIMA che
                // il recorder venga creato, e fermerebbe il mic appena concesso
                // (clip muta). Il caso "in tempo" è gestito dopo il race.
                if (timedOut || abandonedRef.current) {
                  late.getTracks().forEach((t) => t.stop());
                }
              })
              .catch(() => {
                /* permesso negato in ritardo: niente audio */
              });

            const mic = await Promise.race([
              micPromise.catch(() => null),
              new Promise<null>((resolve) =>
                setTimeout(() => {
                  timedOut = true;
                  resolve(null);
                }, 4000),
              ),
            ]);
            if (mic && !abandonedRef.current) {
              micRef.current = mic;
              const a = mic.getAudioTracks()[0];
              if (a) tracks.push(a);
            }
          } catch {
            /* niente microfono: clip senza audio */
          }
        }

        // L'utente potrebbe aver abbandonato durante l'attesa del microfono.
        if (abandonedRef.current) {
          stopAllTracks();
          setState("idle");
          return false;
        }

        const stream = new MediaStream(tracks);
        const mime = pickMime(withAudio);
        mimeRef.current = mime;
        const rec = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 128_000 });
        chunksRef.current = [];

        rec.ondataavailable = (e) => {
          if (e.data && e.data.size) chunksRef.current.push(e.data);
        };
        rec.onstop = () => {
          stopAllTracks();
          const blob = new Blob(chunksRef.current, { type: mime });
          if (urlRef.current) URL.revokeObjectURL(urlRef.current);
          // Niente dati registrati (es. errore immediato): non creare un'anteprima vuota.
          if (blob.size === 0) {
            setState("idle");
            return;
          }
          const url = URL.createObjectURL(blob);
          urlRef.current = url;
          setVideoUrl(url);
          setState("preview");
        };
        // BUG 2 fix: se il recorder fallisce a metà (track ended, suspend, disk
        // full) usciamo dallo stato "recording" e liberiamo le risorse.
        rec.onerror = () => {
          // Dopo un errore il browser emette anche "stop": non trasformare una
          // registrazione rotta in un'anteprima.
          rec.onstop = null;
          stopAllTracks();
          recRef.current = null;
          setError("Registrazione interrotta da un errore.");
          setState("idle");
        };

        recRef.current = rec;
        rec.start(100);
        setState("recording");
        return true;
      } catch {
        // BUG 3 fix: se MediaRecorder o captureStream lanciano, fermiamo i track
        // già aperti (canvas + eventuale mic) per non lasciarli live.
        canvasStream?.getTracks().forEach((t) => t.stop());
        stopAllTracks();
        recRef.current = null;
        setError("Impossibile avviare la registrazione.");
        setState("idle");
        return false;
      }
    },
    [supported, stopAllTracks],
  );

  const stop = useCallback(() => {
    // Segna l'abbandono: se siamo ancora in attesa del microfono (getUserMedia
    // pendente), il mic tardivo verrà fermato invece di restare appeso.
    abandonedRef.current = true;
    const r = recRef.current;
    if (r && r.state !== "inactive") {
      r.stop(); // → onstop libera i track e crea l'anteprima
    } else {
      // Recorder non ancora partito (mic in attesa): libera subito i track.
      stopAllTracks();
    }
  }, [stopAllTracks]);

  const download = useCallback(() => {
    if (!urlRef.current) return;
    const a = document.createElement("a");
    a.href = urlRef.current;
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    a.download = `prindict-${ts}.${extFor(mimeRef.current)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const discard = useCallback(() => {
    // Garantisce che nessun track resti live anche se discard è chiamato fuori
    // dal normale flusso onstop (es. reset prima di entrare nel palco).
    abandonedRef.current = true;
    const r = recRef.current;
    if (r) {
      // Stacca gli handler: un onstop asincrono non deve riaprire l'anteprima
      // (né creare un blob URL orfano) dopo che l'utente ha scartato la clip.
      r.ondataavailable = null;
      r.onstop = null;
      r.onerror = null;
      if (r.state !== "inactive") {
        try {
          r.stop();
        } catch {
          /* noop */
        }
      }
    }
    chunksRef.current = [];
    stopAllTracks();
    recRef.current = null;
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setVideoUrl(null);
    setState("idle");
  }, [stopAllTracks]);

  return { supported, state, videoUrl, error, start, stop, download, discard };
}
