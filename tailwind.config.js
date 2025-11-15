// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // اگر فولدر app نداری، مشکلی نیست
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#00B59B",
          600: "#00A089",
          700: "#008A75",
          yellow: "#F9BE2C",
        },
      },
      fontFamily: {
        bnazanin: ["BNazanin", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};