'use client'

/**
 * Projects Page — MONO EDITION
 *
 * - All typography: IBM Plex Mono
 * - Grid visible from bottom extending upward
 * - Filter bar with forest green active state
 */

import { useMemo, useState } from 'react'
import ProjectCard from '@/components/ProjectCard'
import ExposedGrid, { GRID_GAP } from '@/components/ExposedGrid'
import { projects } from '@/lib/projects'

type FilterCategory = 'all' | 'ai' | 'productivity' | 'experiments'

const FILTERS: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI/ML' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'experiments', label: 'Experiments' },
]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  // Ensure stable order
  const orderedProjects = useMemo(() => {
    const order = ['kallax', 'codex-tarot', 'norma', 'exotica-radio']
    return order
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
  }, [])

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return orderedProjects
    return orderedProjects.filter(p => {
      const hashtag = p.hashtag.toLowerCase()
      if (activeFilter === 'ai') return hashtag.includes('ai')
      if (activeFilter === 'productivity') return hashtag.includes('productivity')
      if (activeFilter === 'experiments') return hashtag.includes('experiment')
      return true
    })
  }, [orderedProjects, activeFilter])

  return (
    <main id="main-content" className="pt-20 relative min-h-screen">
      {/* Grid visible from bottom - full height, behind content */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ExposedGrid showColumns showGaps opacity={0.3} showLabels={false} position="fixed" />
      </div>

      {/* Header */}
      <section
        className="relative py-12 md:py-16"
        style={{ zIndex: 1 }}
      >
        <div
          className="max-w-content mx-auto"
          style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px` }}
        >
          <h1 className="font-mono font-medium text-text-primary text-headline">
            Projects
          </h1>
          <p className="font-mono text-body text-text-secondary max-w-2xl mt-6">
            Things I build when the constraints are my own.<br />
            Smaller products, faster cycles, full creative control.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section
        className="relative max-w-content mx-auto mb-8"
        style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px`, zIndex: 1 }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 font-mono text-caption uppercase tracking-wide transition-all duration-150 ${
                activeFilter === filter.id
                  ? 'text-white'
                  : 'bg-transparent border text-text-secondary hover:text-text-primary'
              }`}
              style={{
                backgroundColor: activeFilter === filter.id ? 'var(--accent)' : 'transparent',
                borderColor: activeFilter === filter.id ? 'var(--accent)' : 'var(--border-subtle)',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid - 2 columns on tablet, 3 on desktop */}
      <section
        className="relative max-w-content mx-auto pb-24"
        style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px`, zIndex: 1 }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: `${GRID_GAP}px` }}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* Behance CTA */}
        <div className="mt-16 pt-8 border-t border-border-subtle">
          <a
            href="https://www.behance.net/miguelangeloferreira"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tertiary group"
          >
            <span className="font-mono text-label uppercase tracking-wide">View earlier work on Behance</span>
            <span className="arrow">→</span>
          </a>
        </div>
      </section>
    </main>
  )
}
