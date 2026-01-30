/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tactile Minimal × Swiss Brutalism — MONO EDITION
        // Deep forest green accent, full monospace typography
        
        // Backgrounds
        'bg-primary': '#F7F5F0',
        'bg-surface': '#FFFCF8',
        'bg-grid': '#E8DFD0',
        
        // Text — softened from pure black
        'text-primary': '#2A2A2C',
        'text-secondary': '#6B6B6B',
        'text-tertiary': '#A3A3A3',
        
        // Accent — System Blue (Figma-style)
        'accent': '#008FF0',
        'accent-muted': 'rgba(0, 143, 240, 0.1)',
        'accent-light': '#3DA8F5',
        'accent-dark': '#0070C0',
        
        // Borders
        'border-subtle': '#E5E0D8',
        'border-accent': '#008FF0',
        
        // Legacy compatibility
        background: {
          DEFAULT: '#F7F5F0',
          light: '#FFFCF8',
        },
        text: {
          DEFAULT: '#2A2A2C',
          light: '#6B6B6B',
          muted: '#A3A3A3',
        },
        primary: {
          DEFAULT: '#008FF0',
          dark: '#0070C0',
        },
        brand: {
          beige: '#F7F5F0',
          card: '#FFFCF8',
          cardHover: '#F5F0E8',
          green: '#BCD1CA',
        },
      },
      fontFamily: {
        // MONO ONLY — All typography uses IBM Plex Mono
        sans: ['var(--font-ibm-plex-mono)', 'monospace'],
        serif: ['var(--font-ibm-plex-mono)', 'monospace'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(40px, 5vw, 72px)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'headline': ['clamp(28px, 3.5vw, 48px)', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'title-lg': ['22px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'title-md': ['18px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'title-sm': ['16px', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'subhead': ['20px', { lineHeight: '1.3', letterSpacing: '0' }],
        'body': ['15px', { lineHeight: '1.65', letterSpacing: '0' }],
        'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        'caption': ['10px', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },
      letterSpacing: {
        'tight': '-0.025em',
        'headline': '-0.02em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        'content': '1400px',
      },
      transitionTimingFunction: {
        'trace': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
