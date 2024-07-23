/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      utilities: {
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }, 
      scale: {
        '101': '1.01',
      },
    },
  },
  plugins: [
    typography,
  ],
}

