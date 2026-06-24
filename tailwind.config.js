/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './popup/**/*.{js,jsx,html}',
    './newtab/**/*.{js,jsx,html}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode — green & white
        sakeenah: {
          50: '#f3faf4',
          100: '#e1f3e4',
          200: '#bfe5c6',
          300: '#8fce9d',
          400: '#5bb070',
          500: '#3a9352',
          600: '#2a7640',
          700: '#235e35',
          800: '#1f4b2d',
          900: '#1a3e26',
        },
        // Dark mode — blue & dark
        layl: {
          50: '#eef4fb',
          100: '#d7e6f5',
          200: '#a9c9e8',
          300: '#73a5d4',
          400: '#477fbb',
          500: '#2f63a0',
          600: '#234c80',
          700: '#1c3c66',
          800: '#142a4a',
          900: '#0b1830',
          950: '#060f1d',
        },
        gold: {
          400: '#d4af37',
          500: '#c19a2e',
        },
      },
      fontFamily: {
        arabic: ['Lateef', 'Amiri', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pulse-ring': { '0%': { transform: 'scale(0.95)', opacity: 0.7 }, '70%': { transform: 'scale(1.1)', opacity: 0 }, '100%': { transform: 'scale(0.95)', opacity: 0 } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
