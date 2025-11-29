import type { ImageWithCaption } from '@/lib/caseStudies/types'

export type ProjectStatus = 'live' | 'beta' | 'archived' | 'building'

export type ProjectLinkType = 'live' | 'code' | 'design' | 'article' | 'other'

export interface ProjectLink {
  label: string
  url: string
  type: ProjectLinkType
}

export interface ProjectFeature {
  title: string
  description: string
  image?: ImageWithCaption
}

export interface SideProject {
  id: string
  hashtag: string
  year: string
  title: string
  subtitle?: string
  status?: ProjectStatus
  description: string
  imageUrl?: string // Path to image in /public folder (e.g., '/images/design-system.jpg')
  imageAlt?: string // Alt text for the image
  linkUrl?: string // Optional link to project details or external site
  images?: ImageWithCaption[] // Gallery of images with captions to display in project
  timeline?: string
  role?: string
  techStack?: string[]
  links?: ProjectLink[]
  mission?: {
    statement: string
    spark: string
    intent: string[]
  }
  context?: {
    background: string
    opportunity: string
    audience?: string
  }
  creation?: {
    approach: string
    features?: ProjectFeature[]
    images?: ImageWithCaption[]
  }
  craft?: {
    decisions: string[]
    exploration?: string
    image?: ImageWithCaption
  }
  outcome?: {
    summary: string
    notes?: string[]
  }
  reflection?: {
    insight: string
    openQuestions?: string[]
    nextSteps?: string[]
  }
  gallery?: ImageWithCaption[]
}

export interface SideProjectCard {
  id: string
  hashtag: string
  year: string
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
  status?: ProjectStatus
  linkUrl: string
}

// Re-export for convenience
export type { ImageWithCaption } from '@/lib/caseStudies/types'
