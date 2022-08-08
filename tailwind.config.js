/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dancingScript': ['Dancing Script', 'sans-serif'],
        'cinzel': ['Cinzel', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif']
      }
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}
