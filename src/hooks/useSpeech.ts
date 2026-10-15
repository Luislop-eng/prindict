import { useCallback, useEffect, useRef, useState } from "react";

// Cap sugli enunciati conservati: il consumatore usa solo l'ultimo, quindi
// teniamo un piccolo storico per sicurezza ed evitiamo crescita illimitata.
const MAX_FINALS = 10;

export interface UseSpeech {
  interim: string; // testo grezzo live (mentre parli) — il cuore del karaoke
  finals: string[]; // enunciati chiusi dalla Web Speech API
  listening: boolean;
  supported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void; // azzera storico (finals/interim): clip pulita, niente testo vecchio
}

/**
 * Wrapper sulla Web Speech API per il karaoke vocale, multilingua.
 * - `lang` (es. "it-IT", "en-US", "es-ES"): cambia in tempo reale; se stai già
 *   ascoltando, il riconoscimento riparte da solo nella nuova lingua.
 * - continuous + interimResults: le parole arrivano live.
 * - `maxAlternatives`: chiediamo più ipotesi e teniamo quella più affidabile
 *   (confidence più alta) → trascrizione più precisa.
 * - Auto-restart: Chrome interrompe il riconoscimento dopo i silenzi; se vogliamo
 *   ancora ascoltare (wantListeningRef), nell'handler onend riavviamo da soli.
 */
export function useSpeech(lang = "it-IT"): UseSpeech {
  const Ctor =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : undefined;
  const supported = !!Ctor;

  const [interim, setInterim] = useState("");
  const [finals, setFinals] = useState<string[]>([]);
  const [listening, setListening] = useState(false);

  const recRef = useRef<SpeechRecognition | null>(null);
  // Stato "desiderato" dall'utente: serve nell'onend per decidere se riavviare,
  // e per riprendere automaticamente l'ascolto quando si cambia lingua.
  const wantListeningRef = useRef(false);

  useEffect(() => {
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onresult = (ev) => {
      let interimText = "";
      const newFinals: string[] = [];
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) {
          // Tra le alternative tieni quella con confidence più alta: spesso
          // la prima è la migliore, ma non sempre con parlato veloce/rumore.
          let best = res[0];
          for (let a = 1; a < res.length; a++) {
            if ((res[a].confidence ?? 0) > (best.confidence ?? 0)) best = res[a];
          }
          const t = best.transcript.trim();
          if (t) newFinals.push(t);
        } else {
          interimText += res[0].transcript;
        }
      }
      if (newFinals.length) {
        // BUG 5 fix: teniamo solo gli ultimi MAX_FINALS enunciati. Il consumatore
        // usa solo l'ultimo; senza il cap, una sessione lunga farebbe crescere
        // l'array all'infinito (memoria + copie costose ad ogni useMemo).
        setFinals((prev) => [...prev, ...newFinals].slice(-MAX_FINALS));
        setInterim(""); // enunciato chiuso: pulisci il grezzo
      } else {
        setInterim(interimText);
      }
    };

    rec.onend = () => {
      // Riavvio automatico se l'utente vuole ancora ascoltare.
      if (wantListeningRef.current) {
        try {
          rec.start();
        } catch {
          // start() può lanciare se è ancora attivo: ignorabile.
        }
      } else {
        setListening(false);
      }
    };

    rec.onerror = (ev) => {
      // Permesso negato → stop definitivo. Altri errori (no-speech, aborted)
      // sono transitori: lascia che onend gestisca il restart.
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        wantListeningRef.current = false;
        setListening(false);
      }
    };

    recRef.current = rec;

    // Se l'utente stava già ascoltando (es. ha cambiato lingua al volo),
    // riprendi subito con il nuovo riconoscitore.
    if (wantListeningRef.current) {
      setInterim("");
      try {
        rec.start();
      } catch {
        /* già attivo */
      }
    }

    return () => {
      // Stacca gli handler del vecchio recognizer e fermalo SENZA toccare
      // wantListeningRef: così, al cambio lingua, l'effetto successivo riprende.
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.stop();
      } catch {
        /* noop */
      }
      if (recRef.current === rec) recRef.current = null;
    };
  }, [Ctor, lang]);

  const start = useCallback(() => {
    if (!recRef.current) return;
    wantListeningRef.current = true;
    setListening(true);
    setInterim("");
    try {
      recRef.current.start();
    } catch {
      // già in ascolto: ignorabile
    }
  }, []);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    setListening(false);
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
  }, []);

  const reset = useCallback(() => {
    setFinals([]);
    setInterim("");
  }, []);

  return { interim, finals, listening, supported, start, stop, reset };
}
