/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cigar: {
          dark: '#1a120b',
          accent: '#c2410c',
          gold: '#d4af37',
          smoke: '#9ca3af',
        }
      }
    },
  },
  plugins: [],
}