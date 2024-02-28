/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }
    },
  },
  plugins: [],
};
