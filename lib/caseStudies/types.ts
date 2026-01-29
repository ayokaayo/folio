export interface ImageWithCaption {
  url: string // Path to image in /public folder (e.g., '/img/case-study/image1.png')
  caption?: string // Optional caption displayed below image
  alt: string // Required alt text for accessibility
  isZoomable?: boolean // If true, renders in a pan/zoom frame instead of opening in modal
}

export interface CaseStudy {
  id: string
  title: string
  subtitle: string
  hashtag: string
  company: string
  year: string
  linkText: string
  linkUrl?: string
  cardSummary?: string // Short 1-2 sentence summary for card preview
  imageUrl?: string
  imageAlt?: string
  coverImageUrl?: string
  coverImageAlt?: string
  images?: ImageWithCaption[] // Gallery of images with captions to display in case study
  impact: {
    title: string
    items: string[]
    quickItems?: string[]
    deepItems?: string[]
    images?: ImageWithCaption[]
  }
  problem: {
    title: string
    context: string
    issues: Array<string | { category?: string; description: string; impact?: string }>
    whyItMattered: string[]
    quickContext?: string
    quickIssues?: string[]
    images?: ImageWithCaption[]
  }
  approach: {
    title: string
    decisions: Array<{
      title: string
      decision: string
      rationale: string
      result: string
    }>
    images?: ImageWithCaption[]
  }
  designDecisions: Array<{
    title: string
    description: string
    image?: ImageWithCaption
  }>
  implementation: {
    title: string
    technical: string[]
    rollout: Array<string | { phase: string; activities: string[] }>
    quickTechnical?: string[]
    images?: ImageWithCaption[]
  }
  validation: {
    title: string
    outcomes: Array<string | { category: string; results: string[] }>
    feedback?: Array<string | { quote: string; source?: string }>
    technical: string[]
    quickOutcomes?: string[]
    images?: ImageWithCaption[]
  }
  learned: {
    title: string
    worked: string[]
    challenges: Array<{
      challenge: string
      solution: string
    }>
    insight: string
    quickInsight?: string
    images?: ImageWithCaption[]
  }
  process?: {
    title: string
    content: string[]
    images?: ImageWithCaption[]
  }
  timeline: string
  team: string
}

