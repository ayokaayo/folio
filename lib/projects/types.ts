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

