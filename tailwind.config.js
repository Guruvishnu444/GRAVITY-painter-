/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          bg: '#F4F6F9',
          surface: '#FFFFFF',
          card: '#F8FAFC',
          muted: '#E2E8F0',
        },
        ink: {
          static: '#4B7BE5',
          'static-light': '#6C92E8',
          dynamic: '#F97066',
          'dynamic-light': '#FDA29B',
        },
        marble: {
          slate: '#2D3748',
        },
        target: {
          mint: '#32D583',
        },
        star: {
          gold: '#FDB022',
        }
      },
      boxShadow: {
        'neumorph': '6px 6px 14px rgba(166, 180, 200, 0.35), -6px -6px 14px rgba(255, 255, 255, 0.9)',
        'neumorph-inset': 'inset 3px 3px 6px rgba(166, 180, 200, 0.35), inset -3px -3px 6px rgba(255, 255, 255, 0.9)',
      }
    },
  },
  plugins: [],
}
