/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 🚀 THIS IS THE MAGIC FIX. ADD THIS EXACT LINE.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}