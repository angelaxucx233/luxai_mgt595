/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        /** Yale University brand blues (no logo assets) */
        yale: {
          50: '#e8f0f8',
          100: '#d0e1f1',
          200: '#a1c3e3',
          300: '#6a9fd4',
          400: '#4a8fd4',
          500: '#286dc0',
          600: '#00356b',
          700: '#0f4068',
          800: '#0c3558',
          900: '#082d4a',
          950: '#052238',
        },
        /** Dark navy — page background only (use bg-yale-canvas) */
        'yale-canvas': '#00356b',
        /** Mid chrome — header, chat, sidebars (use bg-yale-panel) */
        'yale-panel': '#0c4a6e',
        /** White elevated surfaces (use bg-yale-card) */
        'yale-card': '#ffffff',
      },
      boxShadow: {
        yale: '0 8px 32px rgba(0, 0, 0, 0.12)',
        'yale-lg': '0 12px 40px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
};
