import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          muted: 'var(--color-bg-muted)',
          light: 'var(--bg)',
          dark: 'var(--color-bg-dark)',
        },
        surface: 'var(--surface)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          yellow: 'var(--accent)',
          purple: 'var(--accent2)',
          red: 'var(--color-accent-red)',
          '2': 'var(--accent2)',
        },
        border: 'var(--border)',
        // Legacy support
        fg: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
        },
        card: {
          DEFAULT: 'var(--surface)',
          border: 'var(--border)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      zIndex: {
        header: 'var(--z-header)',
        modal: 'var(--z-modal)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

