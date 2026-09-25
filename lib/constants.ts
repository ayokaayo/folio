// Animation constants
export const ANIMATION = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.5,
    SLOW: 0.6,
  },
  DELAY: {
    STAGGER: 0.1,
    SMALL: 0.1,
    MEDIUM: 0.2,
    LARGE: 0.3,
  },
  EASING: {
    EASE_OUT: 'easeOut',
    DEFAULT: 'ease',
  },
} as const

// Route paths
export const ROUTES = {
  HOME: '/',
  WORK: '/work',
  PROJECTS: '/projects',
  ABOUT: '/about',
} as const

// Helper function to generate work detail route
export function getWorkRoute(id: string): string {
  return `${ROUTES.WORK}/${id}`
}

// Helper function to generate project detail route
export function getProjectRoute(id: string): string {
  return `${ROUTES.PROJECTS}/${id}`
}

// Site configuration
export const SITE = {
  NAME: 'Miguel Angelo',
  TITLE: 'Miguel Angelo · Intelligent Systems Designer',
  DESCRIPTION: 'Intelligent Systems Designer turning LLMs into tools that teams can trust. Over a decade of highly regulated B2B products, from iGaming and localisation to enterprise software.',
  URL: 'https://miguelangelo.tech',
  EMAIL: 'hi@miguelangelo.tech',
  LINKEDIN: 'https://linkedin.com/in/ferreiramiguelangelo',
  // New file name so link previews (WhatsApp, LinkedIn) fetch the new image instead of a cached one.
  OG_IMAGE: '/img/og-image-2026-09b.jpg',
  // Google Analytics 4 Measurement ID
  // Replace with your actual GA4 ID: G-XXXXXXXXXX
  GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
  // 🎨 Design inspiration credit: This portfolio's aesthetic was inspired by thoughtful minimalism
  // and clean typography. Sometimes the best designs come from appreciating great work and making it your own.
} as const

// Navigation items
export const NAV_ITEMS = [
  { name: 'Work', href: ROUTES.WORK },
  { name: 'Projects', href: ROUTES.PROJECTS },
  { name: 'About', href: ROUTES.ABOUT },
] as const

// Viewport settings for animations
export const VIEWPORT = {
  ONCE: true,
  MARGIN: '-100px',
} as const

