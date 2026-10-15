/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Anybody", "system-ui", "sans-serif"],
        body: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0a", // nero strutturale
        paper: "#f9f9f9", // sfondo editoriale
        accent: "#2d5bff", // blu elettrico (primario/attivo)
        rec: "#e0231a", // rosso registrazione
        pro: "#f5c518", // oro badge PRO
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
