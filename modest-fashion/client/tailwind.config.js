/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rehman Hosiery brand colors
        primary: {
          50: '#FEF7FA',
          100: '#FCEEF5',
          200: '#FAD8E9',
          300: '#F7B8D7',
          400: '#F889BD',
          500: '#FB5FAB', // Main pink
          600: '#EA559D', // Darker pink
          700: '#D43D86',
          800: '#B02D6B',
          900: '#8A2253',
        },
        secondary: {
          50: '#FEFBFC',
          100: '#FCEEF5',
          200: '#FAD8E9',
          300: '#F7B8D7',
          400: '#EA559D',
          500: '#D43D86',
          600: '#B02D6B',
          700: '#8A2253',
          800: '#6B1A40',
          900: '#4D122E',
        },
        dark: {
          DEFAULT: '#0F172A',
          100: '#454F5E',
          200: '#334155',
          300: '#1E293B',
          400: '#0F172A',
          500: '#140610',
        },
        light: {
          DEFAULT: '#FCEEF5',
          100: '#FFFFFF',
          200: '#FEFBFC',
          300: '#FCEEF5',
          400: '#FAD8E9',
        },
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        serif: ['Lato', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
