/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          light: '#16355C',
          50: '#F5F7FB',
          100: '#E8EDF5',
          200: '#C7D3E5',
          300: '#9FB2D0',
          400: '#6B82A8',
          500: '#475C84',
          600: '#2E426A',
          700: '#16355C',
          800: '#0B1F3A',
          900: '#06122A',
        },
        yellow: {
          pastel: '#FFE88A',
          light: '#FFF7D6',
        },
        bg: '#F8FAFC',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#1E293B',
          muted: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '22px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)',
        card: '0 1px 3px rgba(15,23,42,0.05), 0 8px 24px rgba(15,23,42,0.05)',
        lift: '0 10px 30px rgba(15,23,42,0.10)',
        navy: '0 12px 32px rgba(11,31,58,0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-in-fast': 'fade-in-fast 0.3s ease-out both',
        'slide-up': 'slide-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
