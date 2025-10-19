/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite alternate',
        'pulse-correct': 'pulse-correct 0.5s ease',
        'shake': 'shake 0.5s ease',
      },
      keyframes: {
        twinkle: {
          '0%': { opacity: '0.7' },
          '100%': { opacity: '1' },
        },
        'pulse-correct': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 30% 30%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

