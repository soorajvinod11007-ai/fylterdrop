/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fylter: {
          darkest: "#11100F",
          dark: "#1C1917",
          primary: "#292521",
          secondary: "#44403C",
          surface: "#554E45",
          border: "#6B5B45",
          gold: "#B88A45",
          lightGold: "#D0B176",
          paleGold: "#F0E4CA",
          offWhite: "#FAFAF9",
          softWhite: "#FFFFFF",
          darkText: "#0C0A09",
          muted: "#B8B1A8",
          // Semantic aliases
          accent: "#A16207",
          'on-accent': "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 165, 102, 0.25)',
        'teal-glow': '0 10px 30px -10px rgba(10, 45, 47, 0.5)',
        'card-hover': '0 20px 35px -10px rgba(4, 23, 25, 0.4), 0 0 1px 1px rgba(197, 165, 102, 0.2)',
        'modal': '0 25px 60px -12px rgba(4, 23, 25, 0.8)',
        'input-focus': '0 0 0 3px rgba(197, 165, 102, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.35s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
};
