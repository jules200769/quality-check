/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E8E4DD",
        accent: "#E63B2E",
        background: "#F5F3EE",
        dark: "#111111",
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        drama: ['"DM Serif Display"', 'serif'],
        data: ['"Space Mono"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'], // Set default sans to Space Grotesk
      },
      transitionTimingFunction: {
        'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}