/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tealBlueGradient: {
          button: 'bg-gradient-to-r from-teal-400 to-blue-500',
          hover: 'bg-gradient-to-r from-teal-500 to-blue-600',
        },
        fontFamily: {
          sans: ['Your-Font-Name', 'sans-serif'],
        },
      },
    },
  },
  plugins: [],
}

