/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#055E68',
        secondary: '#62A388',
        background: '#B9D2D2',
        accent: '#343434',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        neutral: '#E0E0E0',
        info: '#2196F3',
      },
    },
  },
  plugins: [],
};
