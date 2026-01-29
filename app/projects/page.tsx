'use client'

/**
 * Projects Page — MONO EDITION
 * 
 * - All typography: IBM Plex Mono
 * - 4-column grid on desktop
 * - Filter bar with forest green active state
 * - No Trace interaction (exclusive to case studies)
 */

import { useMemo, useState } from 'react'
import ProjectCard from '@/components/ProjectCard'
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
    <main id="main-content" className="pt-20">
      {/* Header */}
      <section className="max-w-content mx-auto px-6 sm:px-[5vw] py-12 md:py-16">
        <div className="grid grid-cols-12 gap-[2vw] items-end pb-4 border-b border-border-subtle mb-8">
          <div className="col-span-8">
            <span className="font-mono text-label uppercase tracking-wide text-text-secondary">
              Side Projects
            </span>
          </div>
          <div className="col-span-4 text-right">
            <span className="font-mono text-caption text-text-tertiary">
              004
            </span>
          </div>
        </div>
        
        <h1 className="font-mono font-medium text-text-primary text-headline">
          Projects
        </h1>
        <p className="font-mono text-body text-text-secondary max-w-2xl mt-6">
          Things I build when the constraints are my own.<br />
          Smaller products, faster cycles, full creative control.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="max-w-content mx-auto px-6 sm:px-[5vw] mb-8">
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

      {/* Projects Grid */}
      <section className="max-w-content mx-auto px-6 sm:px-[5vw] pb-24">
        <div className="grid grid-cols-12 gap-[2vw]">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            >
              <ProjectCard
                project={project}
                index={index}
              />
            </div>
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
