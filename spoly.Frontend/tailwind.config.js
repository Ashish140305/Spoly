/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can add your custom colors, fonts, and animations here
      colors: {
        customBlue: '#1fb6ff',
      }
    },
  },
  plugins: [],
}