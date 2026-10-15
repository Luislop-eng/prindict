import type { Locale } from "./types";

export const it: Locale = {
  id: "it",
  label: "Italiano",
  flag: "🇮🇹",
  speechLang: "it-IT",
  numberLocale: "it-IT",

  // Riempitivi del parlato: tolti così solo le parole vere occupano lo schermo.
  // Lista conservativa (niente "no", "allora", "aspetta": possono contare).
  fillers: new Set([
    "ehm", "eh", "uhm", "uh", "mmm", "mmh", "cioè", "cioe", "tipo", "diciamo",
    "praticamente", "insomma", "ecco", "niente", "appunto",
  ]),

  emoji: {
    // === SOLDI / MERCATO / BUSINESS ===
    soldi: "💰", soldo: "💰", euro: "💶", dollari: "💵", dollaro: "💵",
    miliardi: "💰", miliardo: "💰", milioni: "💰", milione: "💰", mila: "💰",
    ricco: "🤑", ricchi: "🤑", ricchezza: "💰", guadagno: "💰", guadagna: "💰",
    guadagnare: "💰", profitto: "💰", fatturato: "💰", valore: "💎", mercato: "📊",
    costo: "💸", costa: "💸", prezzo: "🏷️", pagare: "💳", investire: "📈",
    banca: "🏦", prestito: "📋", mutuo: "🏠", debito: "📉", tasse: "🧾",
    sconto: "🏷️", affari: "💼", business: "💼", startup: "🚀",
    società: "🏢", impresa: "🏢", contratto: "📝", firma: "✍️", negozio: "🏪",
    // === CRESCITA / CALO ===
    crescita: "📈", cresce: "📈", crescere: "🚀", aumenta: "📈", aumento: "📈",
    sale: "📈", boom: "💥", esplode: "💥", record: "🏆", raddoppia: "📈",
    crollo: "📉", crolla: "📉", scende: "📉", cala: "📉", perde: "📉",
    // === TEMPO ===
    tempo: "⏰", oggi: "📅", domani: "📅", ieri: "📅", anni: "📆", anno: "📆",
    giorni: "📆", giorno: "📆", ore: "⏰", ora: "⏰", subito: "⚡", veloce: "⚡",
    sempre: "♾️", mai: "🚫", settimana: "🗓️", mese: "🗓️", minuto: "⏱️",
    // === INTENSITÀ ===
    forte: "🔥", fortissimo: "🔥", pazzesco: "🤯", assurdo: "🤯", incredibile: "🤯",
    pazzo: "🤯", bomba: "💣", top: "🔝", meglio: "👍", peggio: "👎", enorme: "🌋",
    // === MONDO / PERSONE ===
    mondo: "🌍", persone: "👥", gente: "👥", tutti: "🙌", italia: "🇮🇹",
    america: "🇺🇸", lavoro: "💼", casa: "🏠",
    famiglia: "👨‍👩‍👧‍👦", amici: "🤝", amico: "🤝", squadra: "🤝", gruppo: "👥",
    // === PENSIERO / ATTENZIONE ===
    idea: "💡", pensa: "🤔", pensare: "🤔", genio: "🧠", cervello: "🧠",
    attenzione: "⚠️", importante: "❗", segreto: "🤫", verità: "👀", guarda: "👀",
    // === DUBBIO ===
    boh: "🤷", mah: "🤷", forse: "🤷", chissà: "🤷",
    // === EMOZIONI ===
    amore: "❤️", odio: "😡", paura: "😱", felice: "😄", triste: "😢", ridere: "😂",
    arrabbiato: "😠", stress: "😰", calmo: "😌", stanco: "😴", sorpreso: "😲",
    // === TECH / SOCIAL ===
    intelligenza: "🤖", robot: "🤖", internet: "🌐", telefono: "📱", social: "📱",
    video: "🎬", foto: "📸", computer: "💻", laptop: "💻", schermo: "🖥️",
    tastiera: "⌨️", mouse: "🖱️", app: "📱", codice: "💻", programma: "⚙️",
    algoritmo: "🤖", dati: "📊", server: "🗄️", cloud: "☁️", email: "📧",
    instagram: "📸", insta: "📸", tiktok: "🎵", youtube: "▶️",
    facebook: "👍", whatsapp: "💬", telegram: "✈️", twitter: "🐦",
    linkedin: "💼", netflix: "🎬", spotify: "🎵", google: "🔍",
    amazon: "📦", apple: "🍎", microsoft: "🪟", chatgpt: "🤖", openai: "🤖",
    // === SPORT ===
    calcio: "⚽", palla: "⚽", gol: "⚽", basket: "🏀", pallacanestro: "🏀",
    tennis: "🎾", nuoto: "🏊", corsa: "🏃", corre: "🏃", correre: "🏃",
    bici: "🚴", ciclismo: "🚴", boxe: "🥊", pugilato: "🥊",
    judo: "🥋", karate: "🥋", palestra: "🏋️", allenamento: "🏋️",
    // === CIBO / BEVANDE ===
    pizza: "🍕", pasta: "🍝", spaghetti: "🍝", caffe: "☕", caffè: "☕",
    vino: "🍷", birra: "🍺", acqua: "💧", pane: "🍞", carne: "🥩",
    pesce: "🐟", gelato: "🍦", dolce: "🍰", cioccolato: "🍫", frutta: "🍎",
    mela: "🍎", banana: "🍌", pomodoro: "🍅", formaggio: "🧀",
    colazione: "🥐", pranzo: "🍽️", cena: "🍽️", ristorante: "🍴",
    // === VIAGGI / LUOGHI ===
    viaggio: "✈️", aereo: "✈️", volare: "✈️", treno: "🚆", macchina: "🚗",
    auto: "🚗", strada: "🛣️", hotel: "🏨", vacanza: "🏖️", mare: "🏖️",
    spiaggia: "🏖️", montagna: "🏔️", neve: "❄️", lago: "🏞️", foresta: "🌲",
    natura: "🌿", parco: "🏞️", città: "🏙️", paese: "🏘️", ufficio: "🏢",
    scuola: "🏫", ospedale: "🏥", chiesa: "⛪", stadio: "🏟️",
    // === MUSICA / INTRATTENIMENTO ===
    musica: "🎵", canzone: "🎵", concerto: "🎤", chitarra: "🎸", piano: "🎹",
    batteria: "🥁", microfono: "🎤", festa: "🎉", party: "🎉", ballare: "💃",
    ballo: "💃", discoteca: "🪩", dj: "🎧", podcast: "🎙️",
    // === CRYPTO / FINANZA ===
    bitcoin: "₿", btc: "₿", ethereum: "Ξ", crypto: "🪙", cripto: "🪙",
    blockchain: "🔗", nft: "🖼️", mining: "⛏️", token: "🪙", wallet: "👛",
    // === SALUTE / CORPO ===
    salute: "💊", medico: "👨‍⚕️", dottore: "👨‍⚕️", medicine: "💊",
    cuore: "❤️", testa: "🧠", occhi: "👀", mani: "✋",
    // === METEO / NATURA ===
    pioggia: "🌧️", piove: "🌧️", sole: "☀️", nuvole: "☁️",
    nuvola: "☁️", vento: "💨", tempesta: "⛈️", nevicata: "❄️",
    caldo: "🥵", freddo: "🥶", estate: "☀️", inverno: "❄️", primavera: "🌸",
    autunno: "🍂", albero: "🌳", fiore: "🌷", animali: "🐾", cane: "🐕",
    gatto: "🐈", leone: "🦁", aquila: "🦅", cavallo: "🐎",
    // === OBIETTIVI / SUCCESSO ===
    vinci: "🏆", vittoria: "🏆", obiettivo: "🎯", successo: "🚀", futuro: "🚀",
    sogno: "💭", desiderio: "🌟", speranza: "🌈", coraggio: "💪",
    // === STOP / OK ===
    basta: "✋", stop: "🛑", pericolo: "⚠️", problema: "⚠️",
    perfetto: "👌", esatto: "✅", giusto: "✅", ok: "👌",
  },

  numbers: {
    concatenated: true,
    conjunction: /\se\s/g,
    decimalWord: /\s*(virgola)\s*/,
    percentSuffix: /(\s*per\s*cento|percento|%)$/,
    currency: { suffix: /(\s*euro|€)$/, prefix: /^€\s*/, symbol: "€", place: "suffix" },
    dict: {
      zero: { value: 0 }, uno: { value: 1 }, un: { value: 1 }, una: { value: 1 },
      due: { value: 2 }, tre: { value: 3 }, "tré": { value: 3 }, quattro: { value: 4 },
      cinque: { value: 5 }, sei: { value: 6 }, sette: { value: 7 }, otto: { value: 8 },
      nove: { value: 9 },
      dieci: { value: 10 }, undici: { value: 11 }, dodici: { value: 12 }, tredici: { value: 13 },
      quattordici: { value: 14 }, quindici: { value: 15 }, sedici: { value: 16 },
      diciassette: { value: 17 }, diciotto: { value: 18 }, diciannove: { value: 19 },
      venti: { value: 20 }, trenta: { value: 30 }, quaranta: { value: 40 }, cinquanta: { value: 50 },
      sessanta: { value: 60 }, settanta: { value: 70 }, ottanta: { value: 80 }, novanta: { value: 90 },
      ventuno: { value: 21 }, ventotto: { value: 28 }, trentuno: { value: 31 }, trentotto: { value: 38 },
      quarantuno: { value: 41 }, quarantotto: { value: 48 }, cinquantuno: { value: 51 }, cinquantotto: { value: 58 },
      sessantuno: { value: 61 }, sessantotto: { value: 68 }, settantuno: { value: 71 }, settantotto: { value: 78 },
      ottantuno: { value: 81 }, ottantotto: { value: 88 }, novantuno: { value: 91 }, novantotto: { value: 98 },
      cento: { value: 100, scale: 100 }, mille: { value: 1000, scale: 1000 }, mila: { value: 1000, scale: 1000 },
      milione: { value: 1000000, scale: 1000000 }, milioni: { value: 1000000, scale: 1000000 },
      miliardo: { value: 1000000000, scale: 1000000000 }, miliardi: { value: 1000000000, scale: 1000000000 },
    },
  },

  turboTriggers: {
    // azione: il testo recita il verbo
    esplode: "explode", esplodere: "explode", esplosione: "explode", boom: "explode", bomba: "explode",
    scoppia: "explode", scoppiare: "explode", scoppio: "explode", detonazione: "explode",
    distrugge: "explode", distruggere: "explode", distrutto: "explode", lacera: "explode",
    sale: "rise", salire: "rise", cresce: "rise", crescere: "rise", aumenta: "rise", vola: "rise", decolla: "rise",
    raddoppia: "rise", triplica: "rise", schizza: "rise", schizzare: "rise", impenna: "rise",
    "alle stelle": "rise",
    crolla: "fall", crollare: "fall", scende: "fall", cade: "fall", cadere: "fall", affonda: "fall",
    sprofonda: "fall", precipita: "fall", rovina: "fall", svanisce: "fall",
    "va in fumo": "fall",
    enorme: "grow", gigante: "grow", grande: "grow", grosso: "grow", immenso: "grow", tantissimo: "grow",
    colossale: "grow", smisurato: "grow", mastodontico: "grow", spropositato: "grow",
    gigantesco: "grow", titanico: "grow", monumentale: "grow",
    // intensità / emozione → agitazione
    pazzesco: "shake", assurdo: "shake", incredibile: "shake", fortissimo: "shake", choc: "shake",
    rabbia: "shake", urlo: "shake", scioccante: "shake", furioso: "shake", folle: "shake",
    terribile: "shake", spaventoso: "shake", tremendo: "shake", scandaloso: "shake",
    brucia: "shake", infuocato: "shake", rovente: "shake",
  },
};
