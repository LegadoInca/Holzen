/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          coffee: {
            950: '#0A0300',
            900: '#0F0500',
            800: '#1C0A00',
            700: '#2A1200',
            600: '#3D1F00',
            500: '#5C3010',
            400: '#7A4520',
            300: '#A0612E',
          },
          gold: {
            DEFAULT: '#C8A96E',
            light: '#E0C98A',
            dark: '#9E7D45',
          },
          cream: {
            DEFAULT: '#F5E6D0',
            dark: '#D9C4A8',
          },
        },
        fontFamily: {
          serif: ['"Playfair Display"', 'Georgia', 'serif'],
          sans: ['"Inter"', 'system-ui', 'sans-serif'],
        },
        keyframes: {
          shimmer: {
            '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
            '100%': { transform: 'translateX(250%) skewX(-20deg)' },
          },
        },
        animation: {
          shimmer: 'shimmer 2.2s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  }