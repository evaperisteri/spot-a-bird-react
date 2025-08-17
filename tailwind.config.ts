import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // theme: {
  //   extend: {
  //     colors: {
  //       lilac: "#d9c7dd",
  //       purple: "#5a4060",
  //       eggshell: "#d4ab86",
  //       sage: "#608268",
  //       offwhite: "#fdfced",
  //     },
  //     fontFamily: {
  //       logo: ["ArchitectsDaughter", "cursive"], // Changed to cursive
  //       sans: ["Montserrat", "sans-serif"],
  //       serif: ["Cormorant", "serif"],
  //     },
  //     boxShadow: {
  //       soft: "0 14px 24px 0 rgb(90 64 96 / 0.15)", // Updated syntax
  //     },
  //     // Add this to ensure base styles are enabled
  //     corePlugins: {
  //       preflight: true,
  //     },
  //   },
  // },
  plugins: [],
};

export default config;
