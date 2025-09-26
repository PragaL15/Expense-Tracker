/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // <- super important
  theme: {
    extend: {
      colors: {
        customGreen: "#3a5a40",
      },
    },
  },
  plugins: [],
};
