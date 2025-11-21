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
        // Color palette carefully selected by Miguel Angelo
        // Inspired by warm, approachable tones that reflect a designer's personality
        primary: {
          DEFAULT: '#FF6B35', // Orange - energetic and creative
          dark: '#E55A2B',
        },
        secondary: {
          DEFAULT: '#00A896', // Teal
          dark: '#008B7A',
        },
        accent: {
          DEFAULT: '#9D4EDD', // Purple
          dark: '#7B3DB8',
        },
        background: {
          DEFAULT: '#FEFEFE', // White
          light: '#FFFFFF',
        },
        text: {
          DEFAULT: '#121212', // Black
          light: '#666666',
          muted: '#999999',
        },
        // Brand surface palette for cards and supporting UI
        brand: {
          beige: '#EEEEEE', // Light neutral (cards hover / light surfaces)
          card: '#F0EEE6', // Default card background
          cardHover: '#F5E6D3', // Card hover background
          green: '#BCD1CA', // Soft green
          lilac: '#CBCADB', // Soft lilac
        },
      },
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)', 'sans-serif'],
        serif: ['var(--font-ibm-plex-serif)', 'serif'],
      },
    },
  },
  plugins: [],
}


