'use client'

/**
 * Projects Page — MONO EDITION
 *
 * - All typography: IBM Plex Mono
 * - Grid visible from bottom extending upward
 */

import { useMemo } from 'react'
import ProjectCard from '@/components/ProjectCard'
import ExposedGrid, { GRID_GAP } from '@/components/ExposedGrid'
import { projects } from '@/lib/projects'

export default function ProjectsPage() {
  // Ensure stable order
  const orderedProjects = useMemo(() => {
    const order = ['kallax', 'codex-tarot', 'norma', 'exotica-radio', 'word-war-one']
    return order
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
  }, [])

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

      {/* Projects Grid - 2 columns on tablet, 3 on desktop */}
      <section
        className="relative max-w-content mx-auto pb-24"
        style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px`, zIndex: 1 }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ rowGap: `${GRID_GAP}px`, columnGap: `${GRID_GAP}px` }}
        >
          {orderedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* Behance CTA */}
        <div className="mt-16">
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
