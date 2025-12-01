/**
 * Projects Index
 * 
 * This file exports all side projects and provides helper functions
 * for the project pages.
 * 
 * To add a new project:
 * 1. Create a new file in /lib/projects/ (e.g., 'my-project.ts')
 * 2. Copy the template from template.ts and fill in your content
 * 3. Import and add to the `projects` array below
 */

import type { SideProject, SideProjectCard } from './types'

// ─────────────────────────────────────────────────────────────
// IMPORT YOUR PROJECTS HERE
// ─────────────────────────────────────────────────────────────
import { exoticaRadio } from './exotica-radio'
import { codexTarot } from './codex-tarot'
// import { anotherProject } from './another-project'

// ─────────────────────────────────────────────────────────────
// PROJECTS ARRAY
// Add your imported projects here in display order
// ─────────────────────────────────────────────────────────────
export const projects: SideProject[] = [
  exoticaRadio,
  codexTarot,
  // Add more projects here:
  // myProject,
  // anotherProject,
]

// Export alias for backwards compatibility
export const sideProjects = projects

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// Used by the project pages
// ─────────────────────────────────────────────────────────────

/**
 * Get a project by its URL slug
 */
export function getProjectBySlug(slug: string): SideProject | undefined {
  return projects.find(project => project.id === slug)
}

/**
 * Get all project slugs for static generation
 */
export function getAllProjectSlugs(): string[] {
  return projects.map(project => project.id)
}

/**
 * Get projects as card format (for listing pages)
 */
export function getProjectCards(): SideProjectCard[] {
  return projects.map(({ id, hashtag, year, title, description, imageUrl, imageAlt, status }) => ({
    id,
    hashtag,
    year,
    title,
    description,
    imageUrl,
    imageAlt,
    status,
    linkUrl: `/projects/${id}`,
  }))
}

/**
 * Get projects by status
 */
export function getProjectsByStatus(status: SideProject['status']): SideProject[] {
  return projects.filter(project => project.status === status)
}

/**
 * Get live/active projects only
 */
export function getLiveProjects(): SideProject[] {
  return projects.filter(project => project.status === 'live' || project.status === 'beta')
}

// Re-export types for convenience
export type { SideProject, SideProjectCard, ProjectLink, ProjectFeature, ImageWithCaption } from './types'
