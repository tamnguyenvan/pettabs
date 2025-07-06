/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        default: '#ffffff',
        'custom-dark': '#0F1010',
        'custom-hover': '#17181C',
      },
    },
  },
  plugins: [],
  corePlugins: {},
};
