import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lilac: "#d9c7dd", // 217 199 221
        purple: "#5a4060", // 90 64 96
        eggshell: "#d4ab86", // 212 171 134
        sage: "#608268", // 96 130 104
        offwhite: "#fdfced", // 253 252 237
      },
      fontFamily: {
        logo: ["ArchitectsDaughter", "sans-serif"],
        sans: ["Montserrat", "sans-serif"],
        serif: ["Cormorant", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
