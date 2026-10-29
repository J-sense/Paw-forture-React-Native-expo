/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        zen: ["ZenMaruGothic-Regular", "sans-serif"],
        "zen-medium": ["ZenMaruGothic-Medium", "sans-serif"],
        "zen-bold": ["ZenMaruGothic-Bold", "sans-serif"],
        sora: ["Sora-Regular", "sans-serif"],
        "sora-medium": ["Sora-Medium", "sans-serif"],
        "sora-bold": ["Sora-Bold", "sans-serif"],
      },
      colors: {
        'main-bg': '#FEEED6',
        'main-text': '#5D3327',
        cream: '#FEEED6',
        brown: '#5D3327',
        main: {
          bg: '#FEEED6',
          text: '#5D3327',
          DEFAULT: '#FEEED6',
        },
      },
    },
  },
  plugins: [],
}