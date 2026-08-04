/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50:  '#F5F3EE',
          100: '#EAE6D9',
          200: '#C6BFB4',
          300: '#A09890',
          400: '#7A7665',
          500: '#5C5F47',
          600: '#464931',
          700: '#363924',
          800: '#282A18',
          900: '#1A1C0F',
        },
        graphite: {
          50:  '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          400: '#9A9A9A',
          500: '#737373',
          700: '#4A4A4A',
          900: '#2E2E2E',
        },
        beige: {
          100: '#FAF8F5',
          200: '#F5F3EE',
          300: '#EAE6D9',
          400: '#C6BFB4',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'sm-olive': '0 1px 3px rgba(92,95,71,0.06), 0 1px 2px rgba(92,95,71,0.04)',
        'md-olive': '0 4px 16px rgba(92,95,71,0.10), 0 2px 6px rgba(92,95,71,0.06)',
        'lg-olive': '0 8px 32px rgba(92,95,71,0.14), 0 4px 12px rgba(92,95,71,0.08)',
        'xl-olive': '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'float-slow':'float 8s ease-in-out infinite',
        'fade-up':   'fadeUp .6s ease both',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
