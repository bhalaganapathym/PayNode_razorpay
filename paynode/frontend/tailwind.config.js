/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        neo: {
          canvas: '#FFFDF5',
          bg: '#FFFDF5',
          ink: '#000000',
          fg: '#000000',
          accent: '#FF6B6B',
          secondary: '#FFD93D',
          muted: '#C4B5FD',
          success: '#10B981',
          blue: '#38BDF8',
          white: '#FFFFFF',
        },
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'neo-sm': '4px 4px 0px 0px #000000',
        'neo': '8px 8px 0px 0px #000000',
        'neo-lg': '12px 12px 0px 0px #000000',
        'neo-xl': '16px 16px 0px 0px #000000',
        'neo-white': '8px 8px 0px 0px #FFFFFF',
        'neo-accent': '8px 8px 0px 0px #FF6B6B',
        'neo-secondary': '8px 8px 0px 0px #FFD93D',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
