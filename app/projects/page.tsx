'use client'

/**
 * Projects Page: MONO EDITION
 *
 * - All typography: IBM Plex Mono
 * - Grid visible from bottom extending upward
 */

import { useMemo } from 'react'
import ProjectCard from '@/components/ProjectCard'
import { REVEAL } from '@/lib/reveal'
import ExposedGrid, { GRID_GAP } from '@/components/ExposedGrid'
import GridCta from '@/components/GridCta'
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
        <div className="lattice" {...REVEAL}>
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
        className="relative lattice pb-24"
        style={{ zIndex: 1 }}
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
        <div className="mt-16" {...REVEAL}>
          <GridCta href="https://www.behance.net/miguelangeloferreira" label="View earlier work on Behance" external />
        </div>
      </section>
    </main>
  )
}
