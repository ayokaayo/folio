'use client'

/**
 * Home Page — Miguel Angelo Portfolio V2 (MONO EDITION)
 * 
 * Design System: Tactile Minimal × Swiss Brutalism
 * 
 * MONO EDITION:
 * - All typography: IBM Plex Mono
 * - Accent: Deep forest green (#2D5A4C)
 * - Grid: Exposed 12-column with coordinate labels
 */

import { useMemo } from 'react'
import Link from 'next/link'
import CaseStudyCard from '@/components/CaseStudyCard'
import ProjectCard from '@/components/ProjectCard'
import ExposedGrid from '@/components/ExposedGrid'
import { caseStudies } from '@/lib/caseStudies'
import { projects as sideProjects } from '@/lib/projects'
import { ROUTES } from '@/lib/constants'

export default function Home() {
  // Selected works for homepage
  const selectedWorks = useMemo(() => {
    const order = ['fast-track-ai', 'time-management']
    return order
      .map(id => caseStudies.find(cs => cs.id === id))
      .filter((cs): cs is NonNullable<typeof cs> => cs !== undefined)
  }, [])
  
  // Filter and order projects for homepage
  const selectedProjects = useMemo(() => {
    const order = ['kallax', 'codex-tarot']
    return order
      .map(id => sideProjects?.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
  }, [])

  return (
    <main id="main-content" className="pt-20">
      {/* HERO SECTION */}
      <section className="relative cursor-crosshair">
        {/* EXPOSED GRID - 12 columns with coordinate labels */}
        <ExposedGrid showColumns showLabels opacity={0.5} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-content mx-auto px-6 sm:px-[5vw] w-full pt-12 pb-12 md:pt-16 md:pb-16">
          <div className="grid grid-cols-12 gap-[2vw]">
            {/* Main Content (cols 1-8) */}
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-mono font-medium text-text-primary text-headline">
                Systems thinker,<br />
                designing infrastructure<br />
                for high-stakes operations.
              </h1>

              <p className="font-mono text-subhead text-text-secondary mt-6">
                Pragmatic builder. 10+ years in regulated industries:<br />
                Localisation, iGaming, Enterprise SaaS.
              </p>

              {/* CTA */}
              <div className="mt-12">
                <Link href={ROUTES.WORK} className="btn-primary group">
                  <span className="font-mono text-label uppercase tracking-wide">View Work</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="relative pt-12 pb-24 border-t border-border-subtle">
        <div className="max-w-content mx-auto px-6 sm:px-[5vw] mb-12">
          <div className="grid grid-cols-12 gap-[2vw] items-end pb-4 border-b border-border-subtle">
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
        </div>

        <div className="max-w-content mx-auto px-6 sm:px-[5vw]">
          <div className="grid grid-cols-12 gap-[2vw]">
            {selectedProjects.map((project, index) => (
              <div 
                key={project.id}
                className="col-span-12 md:col-span-6"
              >
                <ProjectCard
                  project={project}
                  index={index}
                  featured={project.id === 'norma'}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <Link href={ROUTES.PROJECTS} className="btn-tertiary group">
              <span className="font-mono text-label uppercase tracking-wide">View all projects</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SELECTED WORKS SECTION */}
      <section className="relative py-24 border-t border-border-subtle">
        <div className="max-w-content mx-auto px-6 sm:px-[5vw] mb-12">
          <div className="grid grid-cols-12 gap-[2vw] items-end pb-4 border-b border-border-subtle">
            <div className="col-span-8">
              <span className="font-mono text-label uppercase tracking-wide text-text-secondary">
                Selected Works
              </span>
            </div>
            <div className="col-span-4 text-right">
              <span className="font-mono text-caption text-text-tertiary">
                004
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-content mx-auto px-6 sm:px-[5vw]">
          {selectedWorks.map((work, index) => (
            <CaseStudyCard
              key={work.id}
              caseStudy={work}
              index={index}
              featured={work.id === 'fast-track-ai'}
            />
          ))}
          
          <div className="mt-12">
            <Link href={ROUTES.WORK} className="btn-tertiary group">
              <span className="font-mono text-label uppercase tracking-wide">View all work</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
