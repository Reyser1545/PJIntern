/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'move-right': 'moveRight 10s linear infinite',
        'fadeIn': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        moveRight: {
          '0%': { transform: 'translateX(-100%)' },  // Start completely off-screen to the left
          '100%': { transform: 'translateX(100%)' }, // End completely off-screen to the right
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
      },
    },
  },
  plugins: [],
}
}
