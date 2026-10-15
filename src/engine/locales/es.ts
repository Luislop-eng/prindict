import type { Locale } from "./types";

export const es: Locale = {
  id: "es",
  label: "Español",
  flag: "🇪🇸",
  speechLang: "es-ES",
  numberLocale: "es-ES",

  // Muletillas eliminadas para que solo las palabras reales lleguen a la pantalla.
  fillers: new Set([
    "eh", "este", "pues", "bueno", "como", "tipo", "digamos", "entonces",
    "vale", "mmm", "osea", "nada",
  ]),

  emoji: {
    // === DINERO / MERCADO / NEGOCIOS ===
    dinero: "💰", plata: "💵", euros: "💶", euro: "💶", dolares: "💵", dolar: "💵",
    millones: "💰", millon: "💰", mil: "💰", rico: "🤑", riqueza: "💰",
    ganancia: "💰", beneficio: "💰", ingresos: "💰", gana: "💰", valor: "💎",
    mercado: "📊", coste: "💸", cuesta: "💸", precio: "🏷️", pagar: "💳", invertir: "📈",
    banco: "🏦", prestamo: "📋", hipoteca: "🏠", deuda: "📉", impuestos: "🧾",
    descuento: "🏷️", negocio: "💼", empresa: "🏢", startup: "🚀",
    sociedad: "🏢", contrato: "📝", firma: "✍️", tienda: "🏪",
    // === CRECIMIENTO / CAÍDA ===
    crecimiento: "📈", crece: "📈", crecer: "🚀", sube: "📈", aumento: "📈",
    boom: "💥", explota: "💥", record: "🏆", duplica: "📈",
    caida: "📉", cae: "📉", baja: "📉", pierde: "📉",
    // === TIEMPO ===
    tiempo: "⏰", hoy: "📅", manana: "📅", ayer: "📅", anos: "📆", ano: "📆",
    dias: "📆", dia: "📆", horas: "⏰", hora: "⏰", rapido: "⚡", siempre: "♾️", nunca: "🚫",
    semana: "🗓️", mes: "🗓️", minuto: "⏱️",
    // === INTENSIDAD ===
    enorme: "🌋", loco: "🤯", increible: "🤯", brutal: "🔥", fuego: "🔥",
    bomba: "💣", mejor: "👍", peor: "👎", top: "🔝", absurdo: "🤯",
    // === MUNDO / GENTE ===
    mundo: "🌍", gente: "👥", personas: "👥", todos: "🙌", trabajo: "💼",
    casa: "🏠", espana: "🇪�", america: "🇺�",
    familia: "👨‍👩‍👧‍👦", amigos: "🤝", amigo: "🤝", equipo: "🤝", grupo: "👥",
    // === PENSAMIENTO / ATENCIÓN ===
    idea: "💡", piensa: "🤔", pensar: "🤔", genio: "🧠", cerebro: "🧠",
    atencion: "⚠️", importante: "❗", secreto: "🤫", verdad: "👀", mira: "👀",
    // === DUDA ===
    quiza: "🤷", quizas: "🤷", talvez: "🤷",
    // === EMOCIÓN ===
    amor: "❤️", odio: "😡", miedo: "😱", feliz: "😄", triste: "😢", reir: "😂",
    enojado: "😠", estres: "😰", calma: "😌", cansado: "😴", sorprendido: "😲",
    // === TECH / SOCIAL ===
    inteligencia: "🤖", robot: "🤖", internet: "🌐", telefono: "📱", social: "📱",
    video: "🎬", foto: "📸", ordenador: "💻", portatil: "💻", pantalla: "🖥️",
    teclado: "⌨️", raton: "🖱️", app: "📱", codigo: "💻", programa: "⚙️",
    algoritmo: "🤖", datos: "📊", servidor: "🗄️", nube: "☁️", correo: "📧",
    instagram: "📸", insta: "📸", tiktok: "🎵", youtube: "▶️",
    facebook: "👍", whatsapp: "💬", telegram: "✈️", twitter: "🐦",
    linkedin: "💼", netflix: "🎬", spotify: "🎵", google: "🔍",
    amazon: "📦", apple: "🍎", microsoft: "🪟", chatgpt: "🤖", openai: "🤖",
    // === DEPORTES ===
    futbol: "⚽", balon: "⚽", gol: "⚽", baloncesto: "🏀", tenis: "🎾",
    natacion: "🏊", nadar: "🏊", correr: "🏃", carrera: "🏃",
    bici: "🚴", ciclismo: "🚴", boxeo: "🥊", gimnasio: "🏋️", entrenamiento: "🏋️",
    // === COMIDA / BEBIDAS ===
    pizza: "🍕", pasta: "🍝", cafe: "☕", vino: "🍷", cerveza: "🍺",
    agua: "💧", pan: "🍞", carne: "🥩", pescado: "🐟", helado: "🍦",
    pastel: "🍰", chocolate: "🍫", fruta: "🍎", manzana: "🍎", platano: "🍌",
    tomate: "🍅", queso: "🧀", desayuno: "🥐", almuerzo: "🍽️", cena: "🍽️",
    restaurante: "🍴", hamburguesa: "🍔", ensalada: "🥗",
    // === VIAJES / LUGARES ===
    viaje: "✈️", avion: "✈️", volar: "✈️", tren: "🚆", coche: "🚗",
    carretera: "🛣️", hotel: "🏨", vacaciones: "🏖️", playa: "🏖️", mar: "🏖️",
    montana: "🏔️", nieve: "❄️", lago: "🏞️", bosque: "🌲", naturaleza: "🌿",
    parque: "🏞️", ciudad: "🏙️", pueblo: "🏘️", oficina: "🏢", escuela: "🏫",
    hospital: "🏥", iglesia: "⛪", estadio: "🏟️",
    // === MÚSICA / ENTRETENIMIENTO ===
    musica: "🎵", cancion: "🎵", concierto: "🎤", guitarra: "🎸", piano: "🎹",
    bateria: "🥁", microfono: "🎤", fiesta: "🎉", bailar: "💃", baile: "💃",
    discoteca: "🪩", dj: "🎧", podcast: "🎙️", pelicula: "🎬", cine: "🎦",
    // === CRYPTO / FINANZAS ===
    bitcoin: "₿", btc: "₿", ethereum: "Ξ", cripto: "🪙", blockchain: "🔗",
    nft: "🖼️", mineria: "⛏️", token: "🪙", billetera: "👛",
    // === SALUD / CUERPO ===
    salud: "💊", medico: "👨‍⚕️", doctor: "👨‍⚕️", medicina: "💊",
    corazon: "❤️", cabeza: "🧠", ojos: "👀", manos: "✋",
    // === CLIMA / NATURALEZA ===
    lluvia: "🌧️", llueve: "🌧️", sol: "☀️", nubes: "☁️",
    viento: "💨", tormenta: "⛈️", nevada: "❄️",
    calor: "🥵", frio: "🥶", verano: "☀️", invierno: "❄️", primavera: "🌸",
    otono: "🍂", arbol: "🌳", flor: "🌷", animales: "🐾", perro: "🐕",
    gato: "🐈", leon: "🦁", aguila: "🦅", caballo: "🐎",
    // === OBJETIVOS / ÉXITO ===
    ganar: "🏆", victoria: "🏆", objetivo: "🎯", exito: "🚀", futuro: "🚀",
    sueno: "💭", deseo: "🌟", esperanza: "🌈", coraje: "💪",
    // === STOP / OK ===
    basta: "✋", stop: "🛑", peligro: "⚠️", problema: "⚠️",
    perfecto: "👌", exacto: "✅", correcto: "✅", ok: "👌",
  },

  numbers: {
    concatenated: false,
    conjunction: /\sy\s/g,
    decimalWord: /\s+(coma|punto)\s+/,
    percentSuffix: /(\s*por\s*ciento|porciento|%)$/,
    currency: { suffix: /(\s*euros?|€)$/, prefix: /^€\s*/, symbol: "€", place: "suffix" },
    dict: {
      cero: { value: 0 }, uno: { value: 1 }, un: { value: 1 }, una: { value: 1 },
      dos: { value: 2 }, tres: { value: 3 }, cuatro: { value: 4 }, cinco: { value: 5 },
      seis: { value: 6 }, siete: { value: 7 }, ocho: { value: 8 }, nueve: { value: 9 },
      diez: { value: 10 }, once: { value: 11 }, doce: { value: 12 }, trece: { value: 13 },
      catorce: { value: 14 }, quince: { value: 15 }, dieciseis: { value: 16 },
      diecisiete: { value: 17 }, dieciocho: { value: 18 }, diecinueve: { value: 19 },
      veinte: { value: 20 }, veintiuno: { value: 21 }, veintidos: { value: 22 },
      treinta: { value: 30 }, cuarenta: { value: 40 }, cincuenta: { value: 50 },
      sesenta: { value: 60 }, setenta: { value: 70 }, ochenta: { value: 80 }, noventa: { value: 90 },
      cien: { value: 100, scale: 100 }, ciento: { value: 100, scale: 100 },
      doscientos: { value: 200 }, trescientos: { value: 300 }, cuatrocientos: { value: 400 },
      quinientos: { value: 500 }, seiscientos: { value: 600 }, setecientos: { value: 700 },
      ochocientos: { value: 800 }, novecientos: { value: 900 },
      mil: { value: 1000, scale: 1000 },
      millon: { value: 1000000, scale: 1000000 }, millones: { value: 1000000, scale: 1000000 },
    },
  },

  turboTriggers: {
    // acción: el texto representa el verbo
    explota: "explode", explotar: "explode", bomba: "explode", boom: "explode",
    estalla: "explode", estallar: "explode", estallido: "explode", detona: "explode",
    destruye: "explode", destruir: "explode", destrozado: "explode", "hace pedazos": "explode",
    sube: "rise", subir: "rise", crece: "rise", crecer: "rise", aumenta: "rise", vuela: "rise",
    duplica: "rise", triplica: "rise", dispara: "rise", despega: "rise",
    "a la luna": "rise",
    cae: "fall", caer: "fall", baja: "fall", desploma: "fall", hunde: "fall",
    precipita: "fall", se_desploma: "fall", desaparece: "fall",
    "se desmorona": "fall", "se evapora": "fall",
    enorme: "grow", gigante: "grow", grande: "grow", inmenso: "grow",
    colosal: "grow", gigantesco: "grow", tremendo: "grow", descomunal: "grow",
    monumental: "grow", imponente: "grow", asombroso: "grow",
    // intensidad / emoción → agitación
    loco: "shake", increible: "shake", brutal: "shake", impactante: "shake", rabia: "shake",
    furioso: "shake", locura: "shake", terrible: "shake", espantoso: "shake", escandaloso: "shake",
    ardiente: "shake", abrasador: "shake", explosivo: "shake",
  },
};
