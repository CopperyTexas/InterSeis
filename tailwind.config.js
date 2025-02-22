/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: { primary: '#2c55b3' },
      fontFamily: {
        geometria: ['Geometria', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
