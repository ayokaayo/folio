export interface SideProject {
  id: string
  hashtag: string
  year: string
  title: string
  description: string
  imageUrl?: string // Path to image in /public folder (e.g., '/images/design-system.jpg')
  imageAlt?: string // Alt text for the image
  linkUrl?: string // Optional link to project details or external site
}

export const projects: SideProject[] = [
  {
    id: 'design-system-evolution',
    hashtag: '#B2B SaaS',
    year: '2024',
    title: 'Design System Evolution',
    description: 'Built a comprehensive design system that scaled across multiple product lines, reducing design debt by 60% and improving development velocity.',
  },
  {
    id: 'ai-content-generation',
    hashtag: '#AI/ML',
    year: '2024',
    title: 'AI-Powered Content Generation',
    description: 'Designed and shipped AI-powered content generation tools enabling operators to automate player communications at scale.',
  },
  {
    id: 'enterprise-dashboard',
    hashtag: '#Enterprise SaaS',
    year: '2023',
    title: 'Enterprise Dashboard Redesign',
    description: 'Redesigned core analytics dashboard improving operator efficiency and end-user engagement metrics, contributing to industry awards.',
  },
  {
    id: 'mobile-app-redesign',
    hashtag: '#Mobile Design',
    year: '2023',
    title: 'Mobile App Redesign',
    description: 'Led complete redesign of mobile application focusing on user engagement and retention, resulting in 40% increase in daily active users.',
  },
  {
    id: 'onboarding-optimization',
    hashtag: '#UX Research',
    year: '2023',
    title: 'Onboarding Flow Optimization',
    description: 'Streamlined user onboarding process reducing time-to-value by 50% and improving conversion rates through progressive disclosure.',
  },
  {
    id: 'accessibility-audit',
    hashtag: '#Accessibility',
    year: '2022',
    title: 'Accessibility Audit & Implementation',
    description: 'Conducted comprehensive accessibility audit and implemented WCAG 2.1 AA compliance across entire platform, improving usability for all users.',
  },
  {
    id: 'exotica-radio',
    hashtag: '#Side Project',
    year: 'Ongoing',
    title: 'Exotica Radio',
    description:
      'An online radio station playing curated ambient, world music, and eclectic sounds. Designed and built the platform end-to-end, from UI to streaming setup and playlist curation.',
  },
  {
    id: 'norma-ai-assistant',
    hashtag: '#AI / LegalTech',
    year: 'Ongoing',
    title: 'Norma — AI Assistant for Law Firms',
    description:
      'AI-powered assistant helping legal teams automate document review, case research, and client communication, with product strategy and UX flows tailored for legal workflows.',
  },
  {
    id: 'codex-tarot',
    hashtag: '#Generative AI',
    year: 'Ongoing',
    title: 'Codex Tarot',
    description:
      'Online oracle blending traditional tarot with generative AI interpretations, designing the reading experience, visual system, and prompting logic for personalised readings.',
  },
]

// Side projects shown on homepage (first 3)
export const sideProjects = projects.slice(0, 3)

