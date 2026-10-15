import type { Locale } from "./types";

export const en: Locale = {
  id: "en",
  label: "English",
  flag: "🇬🇧",
  speechLang: "en-US",
  numberLocale: "en-US",

  // Spoken fillers removed so only real words hit the screen.
  fillers: new Set([
    "um", "uh", "uhm", "er", "erm", "ah", "hmm", "mhm", "like", "basically",
    "actually", "literally", "kinda", "sorta", "anyway", "well",
  ]),

  emoji: {
    // === MONEY / MARKET / BUSINESS ===
    money: "💰", cash: "💵", dollars: "💵", dollar: "💵", euro: "💶", euros: "💶",
    billion: "💰", billions: "💰", million: "💰", millions: "💰", thousand: "💰",
    rich: "🤑", wealth: "💰", profit: "💰", revenue: "💰", earn: "💰", earns: "💰",
    value: "💎", market: "📊", cost: "💸", costs: "💸", price: "🏷️", pay: "💳",
    invest: "📈", investing: "📈", bank: "🏦", loan: "📋", mortgage: "🏠",
    debt: "📉", taxes: "🧾", discount: "🏷️", deal: "💼", business: "💼",
    startup: "🚀", company: "🏢", contract: "📝", sign: "✍️", store: "🏪",
    // === GROWTH / DROP ===
    growth: "📈", grow: "🚀", grows: "📈", rise: "📈", rising: "📈", up: "📈",
    boom: "💥", explodes: "💥", record: "🏆", doubles: "📈", surge: "📈",
    crash: "📉", crashes: "📉", drop: "📉", drops: "📉", falls: "📉", down: "📉", lose: "📉",
    // === TIME ===
    time: "⏰", today: "📅", tomorrow: "📅", yesterday: "📅", years: "📆", year: "📆",
    days: "📆", day: "📆", hours: "⏰", hour: "⏰", now: "⚡", fast: "⚡",
    always: "♾️", never: "🚫", week: "🗓️", month: "🗓️", minute: "⏱️",
    // === INTENSITY ===
    huge: "🌋", insane: "🤯", crazy: "🤯", incredible: "🤯", amazing: "🤯",
    fire: "🔥", bomb: "💣", best: "🔝", better: "👍", worse: "👎",
    // === WORLD / PEOPLE ===
    world: "🌍", people: "👥", everyone: "🙌", everybody: "🙌", work: "💼",
    home: "🏠", america: "🇺🇸", england: "🏴", uk: "🇬🇧",
    family: "👨‍👩‍👧‍👦", friends: "🤝", friend: "🤝", team: "🤝", group: "👥",
    // === THOUGHT / ATTENTION ===
    idea: "💡", think: "🤔", genius: "🧠", brain: "🧠", attention: "⚠️",
    important: "❗", secret: "🤫", truth: "👀", look: "👀", watch: "👀",
    // === DOUBT ===
    maybe: "🤷", guess: "🤷", whatever: "🤷", perhaps: "🤷",
    // === EMOTION ===
    love: "❤️", hate: "😡", fear: "😱", happy: "😄", sad: "😢", laugh: "😂",
    angry: "😠", stress: "😰", calm: "😌", tired: "😴", surprised: "😲",
    // === TECH / SOCIAL ===
    ai: "🤖", robot: "🤖", internet: "🌐", phone: "📱", social: "📱",
    video: "🎬", photo: "📸", computer: "💻", laptop: "💻", screen: "🖥️",
    keyboard: "⌨️", mouse: "🖱️", app: "📱", code: "💻", program: "⚙️",
    algorithm: "🤖", data: "📊", server: "🗄️", cloud: "☁️", email: "📧",
    instagram: "📸", insta: "📸", tiktok: "🎵", youtube: "▶️",
    facebook: "👍", whatsapp: "💬", telegram: "✈️", twitter: "🐦",
    linkedin: "💼", netflix: "🎬", spotify: "🎵", google: "🔍",
    amazon: "📦", apple: "🍎", microsoft: "🪟", chatgpt: "🤖", openai: "🤖",
    // === SPORTS ===
    soccer: "⚽", football: "⚽", ball: "⚽", goal: "⚽", basketball: "🏀",
    tennis: "🎾", swim: "🏊", swimming: "🏊", run: "🏃", running: "🏃",
    bike: "🚴", cycling: "🚴", boxing: "🥊", gym: "🏋️", workout: "🏋️",
    // === FOOD / DRINKS ===
    pizza: "🍕", pasta: "🍝", coffee: "☕", wine: "🍷", beer: "🍺",
    water: "💧", bread: "🍞", meat: "🥩", fish: "🐟", icecream: "🍦",
    cake: "🍰", chocolate: "🍫", fruit: "🍎", banana: "🍌",
    tomato: "🍅", cheese: "🧀", breakfast: "🥐", lunch: "🍽️", dinner: "🍽️",
    restaurant: "🍴", burger: "🍔", salad: "🥗",
    // === TRAVEL / PLACES ===
    travel: "✈️", plane: "✈️", fly: "✈️", train: "🚆", car: "🚗",
    road: "🛣️", hotel: "🏨", vacation: "🏖️", beach: "🏖️", sea: "🏖️",
    mountain: "🏔️", snow: "❄️", lake: "🏞️", forest: "🌲", nature: "🌿",
    park: "🏞️", city: "🏙️", town: "🏘️", office: "🏢", school: "🏫",
    hospital: "🏥", church: "⛪", stadium: "🏟️",
    // === MUSIC / ENTERTAINMENT ===
    music: "🎵", song: "🎵", concert: "🎤", guitar: "🎸", piano: "🎹",
    drums: "🥁", microphone: "🎤", party: "🎉", dance: "💃", club: "🪩",
    dj: "🎧", podcast: "🎙️", movie: "🎬", film: "🎬", cinema: "🎦",
    // === CRYPTO / FINANCE ===
    bitcoin: "₿", btc: "₿", ethereum: "Ξ", crypto: "🪙", blockchain: "🔗",
    nft: "🖼️", mining: "⛏️", token: "🪙", wallet: "👛",
    // === HEALTH / BODY ===
    health: "💊", doctor: "👨‍⚕️", medicine: "💊", heart: "❤️",
    head: "🧠", eyes: "👀", hands: "✋",
    // === WEATHER / NATURE ===
    rain: "🌧️", rainy: "🌧️", sun: "☀️", sunny: "☀️", clouds: "☁️",
    wind: "💨", storm: "⛈️",
    // (snow already defined in travel section) (cloud already defined in tech section)
    hot: "🥵", cold: "🥶", summer: "☀️", winter: "❄️", spring: "🌸",
    fall: "🍂", autumn: "🍂", tree: "🌳", flower: "🌷", animals: "🐾",
    dog: "🐕", cat: "🐈", lion: "🦁", eagle: "🦅", horse: "🐎",
    // === GOALS / SUCCESS ===
    win: "🏆", winning: "🏆", victory: "🏆", success: "🚀", future: "🚀",
    dream: "💭", wish: "🌟", hope: "🌈", courage: "💪",
    // === STOP / OK ===
    stop: "🛑", danger: "⚠️", problem: "⚠️", perfect: "👌", exactly: "✅", right: "✅", ok: "👌",
  },

  numbers: {
    concatenated: false,
    conjunction: /\sand\s/g,
    decimalWord: /\s+(point)\s+/,
    percentSuffix: /(\s*per\s*cent|percent|%)$/,
    currency: { suffix: /(\s*dollars?|\$)$/, prefix: /^\$\s*/, symbol: "$", place: "prefix" },
    dict: {
      zero: { value: 0 }, oh: { value: 0 }, one: { value: 1 }, two: { value: 2 },
      three: { value: 3 }, four: { value: 4 }, five: { value: 5 }, six: { value: 6 },
      seven: { value: 7 }, eight: { value: 8 }, nine: { value: 9 },
      ten: { value: 10 }, eleven: { value: 11 }, twelve: { value: 12 }, thirteen: { value: 13 },
      fourteen: { value: 14 }, fifteen: { value: 15 }, sixteen: { value: 16 },
      seventeen: { value: 17 }, eighteen: { value: 18 }, nineteen: { value: 19 },
      twenty: { value: 20 }, thirty: { value: 30 }, forty: { value: 40 }, fifty: { value: 50 },
      sixty: { value: 60 }, seventy: { value: 70 }, eighty: { value: 80 }, ninety: { value: 90 },
      hundred: { value: 100, scale: 100 }, thousand: { value: 1000, scale: 1000 },
      million: { value: 1000000, scale: 1000000 }, millions: { value: 1000000, scale: 1000000 },
      billion: { value: 1000000000, scale: 1000000000 }, billions: { value: 1000000000, scale: 1000000000 },
    },
  },

  turboTriggers: {
    // action: the text performs the verb
    explode: "explode", explodes: "explode", boom: "explode", bomb: "explode", blast: "explode",
    burst: "explode", bursts: "explode", erupt: "explode", erupts: "explode", detonate: "explode",
    destroys: "explode", shatters: "explode", shatter: "explode", obliterate: "explode",
    rise: "rise", rises: "rise", soars: "rise", grows: "rise", grow: "rise", up: "rise", climbs: "rise",
    doubles: "rise", triples: "rise", surges: "rise", surge: "rise", skyrockets: "rise", launches: "rise",
    rockets: "rise", "to the moon": "rise",
    crash: "fall", crashes: "fall", falls: "fall", drop: "fall", drops: "fall", down: "fall", sinks: "fall",
    plunges: "fall", plunge: "fall", collapses: "fall", vanishes: "fall",
    crumbles: "fall", evaporates: "fall", "goes up in smoke": "fall",
    huge: "grow", giant: "grow", massive: "grow", enormous: "grow", big: "grow",
    colossal: "grow", gigantic: "grow", immense: "grow", tremendous: "grow",
    monumental: "grow", towering: "grow", staggering: "grow",
    // intensity / emotion → agitation
    crazy: "shake", insane: "shake", amazing: "shake", incredible: "shake", shocking: "shake", rage: "shake",
    furious: "shake", madness: "shake", terrible: "shake", frightening: "shake", outrageous: "shake",
    blazing: "shake", scorching: "shake", explosive: "shake",
  },
};
