/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Important for Tailwind purging
  ],
  theme: {
    extend: {      
      keyframes: {
      'bounce-drop': {
        '0%': { transform: 'translateY(-200%)' },
        '30%': { transform: 'translateY(0)' },
        '45%': { transform: 'translateY(-20%)' },
        '60%': { transform: 'translateY(0)' },
        '70%': { transform: 'translateY(-10%)' },
        '80%': { transform: 'translateY(0)' },
        '90%': { transform: 'translateY(-5%)' },
        '100%': { transform: 'translateY(0)' },
      },
    },
    animation: {
      'bounce-drop': 'bounce-drop 4s ease-out',
    },
  },

  },
  plugins: [],
};
