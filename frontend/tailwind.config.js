/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: '#090B14',
          secondary: '#111525',
          card: '#151A2D',
          cardHover: '#1C2340',
          border: '#29304A',
          purple: '#7C3AED',
          purpleGlow: '#9333EA',
          blue: '#3B82F6',
          gold: '#F5B942',
          goldGlow: '#FACC15',
          success: '#22C55E',
          danger: '#EF4444',
          text: '#F8FAFC',
          muted: '#94A3B8',
          strength: '#EF4444',
          intellect: '#3B82F6',
          vitality: '#10B981',
          discipline: '#8B5CF6',
          wisdom: '#F59E0B'
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(245, 185, 66, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'card-rpg': '0 10px 30px -10px rgba(0, 0, 0, 0.7)'
      }
    },
  },
  plugins: [],
}
