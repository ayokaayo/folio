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
import { norma } from './norma-case-study'
import { kallax } from './kallax'
// import { anotherProject } from './another-project'

// Example placeholder - remove when adding real projects
const exampleProject: SideProject = {
  id: 'example-project',
  hashtag: '#Template',
  year: '2024',
  title: 'Example Project',
  subtitle: 'A placeholder showing the mission-first structure',
  status: 'building',
  description: 'This is a placeholder project demonstrating the template. Replace it with your actual side projects. The mission-first approach emphasizes creative intent over business impact.',
  imageUrl: '/img/projects/example/hero.png',
  imageAlt: 'Example project hero image',
  timeline: 'Q4 2024',
  role: 'Design & Development',
  techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  links: [
    { label: 'Coming Soon', url: '#', type: 'live' },
  ],
  
  // MISSION: Why this exists (not what it achieved)
  mission: {
    statement: 'To explore what a mission-first project template looks like.',
    spark: 'I noticed side projects were being treated like mini case studies, with impact metrics front and center. But side projects aren\'t about proving ROI—they\'re about creative exploration.',
    intent: [
      'Create a template that respects the spirit of side projects',
      'Separate "impact" (case studies) from "mission" (personal work)',
      'Build something that feels authentic to the creative process',
    ],
  },
  
  // CONTEXT: The space this lives in
  context: {
    background: 'Portfolio templates often treat all projects the same—leading with metrics and outcomes. This works for client work but feels hollow for personal projects.',
    opportunity: 'What if the template itself encouraged a different kind of storytelling? One that starts with curiosity instead of conclusions?',
    audience: 'Designers and developers who build things because they want to, not because someone asked them to.',
  },
  
  // CREATION: What was built
  creation: {
    approach: 'Started with the question: what would I actually want to read about someone\'s side project? The answer was less "what did it achieve" and more "why did you make this?"',
    features: [
      {
        title: 'Mission Section',
        description: 'Replaces "Impact" with creative intent. What sparked this? What were you trying to explore?',
      },
      {
        title: 'Craft Notes',
        description: 'Space for the decisions and trade-offs that shaped the work. The thinking, not just the output.',
      },
      {
        title: 'Outcome (Optional)',
        description: 'What emerged after shipping—as observation, not celebration. Only include if something interesting happened.',
      },
    ],
  },
  
  // REFLECTION: What you took away
  reflection: {
    insight: 'The framing shapes the story. Lead with mission, and the project feels like exploration. Lead with impact, and it feels like justification.',
    openQuestions: [
      'Does this distinction matter to anyone else?',
      'How do you balance "showing value" with "being honest about intent"?',
    ],
  },
}

// ─────────────────────────────────────────────────────────────
// PROJECTS ARRAY
// Add your imported projects here in display order
// ─────────────────────────────────────────────────────────────
export const projects: SideProject[] = [
  kallax,
  codexTarot,
  norma,
  exoticaRadio,
  // Add more projects here:
  // myProject,
  // anotherProject,
]

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
