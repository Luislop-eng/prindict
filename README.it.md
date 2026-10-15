# Prindict

**La tua voce diventa testo cinetico, dal vivo.** Parli, e le parole compaiono a schermo grandi, bold e animate — numeri formattati, riempitivi rimossi, emoji aggiunte. Registri il risultato come clip pronta per i social in 9:16, 1:1 o 16:9.

Tutto gira nel browser: niente server, niente account, niente chiavi API.

### ▶ [Provala subito — luislop-eng.github.io/prindict](https://luislop-eng.github.io/prindict/)

Non serve installare nulla: apri il link con **Chrome o Edge da computer** e consenti il microfono. Clonare il repo serve solo a chi vuole modificare il codice.

🇬🇧 [Read in English](README.md)

---

## Funzionalità

- **Caption karaoke in tempo reale** — una finestra scorrevole delle ultime parole, grandi e bold mentre parli.
- **Formattazione intelligente, a regole** — i numeri detti diventano cifre (`duecentocinquantamila` → `250.000`, `novanta per cento` → `90%`), le valute prendono il simbolo, i riempitivi (“ehm”, “cioè”, “tipo”…) spariscono, sulle pause arriva il punto.
- **Emoji contestuali** — ~200 parole chiave per lingua, anche espressioni di più parole (attivabili/disattivabili).
- **Modalità Turbo ⚡** — il testo *recita* ciò che dici: “esplode” si frantuma lettera per lettera, “sale” sale, i numeri vengono isolati ed evidenziati. Un “governatore del gusto” limita gli effetti forti per beat.
- **Tre lingue** — italiano, inglese, spagnolo. Aggiungerne una = un solo file (vedi [CONTRIBUTING](CONTRIBUTING.md)).
- **Registrazione con un click** — il palco è disegnato su `<canvas>` e registrato con `MediaRecorder` insieme al microfono. Niente condivisione schermo, niente bande nere, output esatto 1080×1920 / 1920×1080 / 1080×1080.
- **Rivedi & genera** — correggi lo script trascritto e rigenera una clip pulita, senza voce, a beat stabili (perfetta come overlay in CapCut / Premiere).
- **Personalizza** — 8 temi, 8 font, colori personalizzati, immagine di sfondo, grandezza del testo. Salvato in locale.

## Requisiti

- **Chrome o Edge desktop** (serve la Web Speech API; Firefox non la ha, Safari è inaffidabile).
- `https://` oppure `http://localhost` (il microfono richiede un contesto sicuro).
- **Node.js ≥ 20.19** solo per sviluppare/compilare.

## Avvio rapido

```bash
git clone https://github.com/Luislop-eng/prindict.git
cd prindict
npm install
npm run dev
```

Apri <http://localhost:5173> in Chrome → **Inizia → Anteprima**, consenti il microfono e parla.
Per registrare: **Registra clip** → tasto rosso → parla → stop → **Scarica clip**.

Altri comandi: `npm run build` (build di produzione in `dist/`), `npm test`, `npm run preview`.

## Pubblicazione

`dist/` è un sito statico: va bene qualsiasi hosting HTTPS. Per **GitHub Pages** c'è già il workflow: abilitalo una volta in *Settings → Pages → Source: GitHub Actions*.

## Privacy

Prindict non ha backend: impostazioni e immagine di sfondo restano nel `localStorage` del browser, le clip sul tuo computer.
**Però** il riconoscimento vocale lo fa il browser: in Chrome l'audio del microfono viene inviato ai server Google per la trascrizione. I font sono inclusi nell'app (nessuna richiesta a Google Fonts). Nota privacy del sito: [`/privacy.html`](https://luislop-eng.github.io/prindict/privacy.html).

## Limiti noti

- Le clip sono **`.webm`** (VP9 + Opus): Chrome non sa mettere l'audio del microfono in MP4. QuickTime/Anteprima su Mac non aprono il WebM → usa Chrome o VLC; i social lo accettano.
- I WebM di `MediaRecorder` non hanno la durata nell'header: alcuni player non permettono di scorrere.
- L'interfaccia è in italiano (le caption supportano IT/EN/ES).
- La card “Presentazioni live” è un segnaposto per una modalità futura.

## Licenza

[MIT](LICENSE) © 2026 Luigi Loperfido
