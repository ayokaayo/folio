import { notFound } from 'next/navigation'
import { GhostAbout, GhostArticle, GhostHome, GhostProjects, GhostWork } from '@/components/Ghost'

// Dev-only (the .dev.tsx extension is only a page in development; see next.config.js).
// Renders a route's ghost in place (?page=home|work|projects|about|article) to compare with the real page.
export const metadata = { title: 'Ghost lab', robots: { index: false, follow: false } }

const GHOSTS = { home: GhostHome, work: GhostWork, projects: GhostProjects, about: GhostAbout, article: GhostArticle }

export default function GhostLabPage({ searchParams }: { searchParams: { page?: string } }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const Ghost = GHOSTS[(searchParams.page ?? 'work') as keyof typeof GHOSTS] ?? GhostWork
  return <Ghost />
}
