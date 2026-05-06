/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // On définit ici les couleurs de la charte AFRILANE
        afrilane: {
          blue: '#0056b3',    // Un beau bleu pro (à ajuster selon le logo)
          white: '#ffffff',   // Blanc pur
          lightGrey: '#f4f4f4', // Gris clair pour les fonds de section
          darkGrey: '#333333',  // Gris foncé pour les textes
        },
      },
    },
  },
  plugins: [],
}