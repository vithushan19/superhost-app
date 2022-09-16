/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dancingScript': ['Dancing Script', 'sans-serif'],
        'cinzel': ['Cinzel', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'playfairDisplay': ['Playfair Display', 'serif'],
        'greatVibes': ['Great Vibes', 'sans-serif'],
        'merriweather': ['Merriweather', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'kalam': ['Kalam', 'sans-serif'],
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  darkMode: 'class'
}
