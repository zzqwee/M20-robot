/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          light: '#4DA3FF',
          dark: '#0066CC'
        },
        background: '#F5F7FA',
        glass: 'rgba(255, 255, 255, 0.6)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
        'glass-tint': 'rgba(225, 233, 240, 0.5)',
        'text-secondary': '#6C6F70'
      },
      backdropBlur: {
        'frosted': '20px'
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}
