'use client'

/**
 * Home Page — Miguel Angelo Portfolio V2 (MONO EDITION)
 *
 * Design System: Tactile Minimal × Swiss Brutalism
 *
 * MONO EDITION:
 * - All typography: IBM Plex Mono
 * - Accent: System blue (#008FF0)
 * - Grid: Exposed 12-column with coordinate labels
 */

import { useMemo } from 'react'
import Link from 'next/link'
import CaseStudyCard from '@/components/CaseStudyCard'
import ProjectCard from '@/components/ProjectCard'
import ExposedGrid, { GridRow, GRID_GAP } from '@/components/ExposedGrid'
import MillimetricPaper from '@/components/MillimetricPaper'
import GridLabel, { GridLabelMuted } from '@/components/GridLabel'
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
        {/* EXPOSED GRID - 12 columns with coordinate labels - above content to capture mouse */}
        <ExposedGrid showColumns showLabels showGaps opacity={0.5} interactive zIndex={5} />

        {/* Hero Content - pointer-events-none to let grid receive mouse, but links need pointer-events-auto */}
        <div className="relative z-10 pt-12 pb-12 md:pt-16 md:pb-16 pointer-events-none">
          <div
            className="max-w-content mx-auto"
            style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px` }}
          >
            {/* Main Content - spans 8 of 12 columns on desktop */}
            <div className="w-full lg:w-[calc((100%-11*16px)/12*8+7*16px)]">
              <h1 className="font-mono font-medium text-text-primary text-headline">
                Systems thinker,<br />
                designing infrastructure<br />
                for high-stakes operations.
              </h1>

              <p className="font-mono text-subhead text-text-secondary mt-6">
                Pragmatic builder. 10+ years in regulated industries:<br />
                Localisation, iGaming, Enterprise SaaS.
              </p>

              {/* CTA - spans exactly 2 grid columns */}
              <div className="mt-12">
                <Link
                  href={ROUTES.WORK}
                  className="btn-primary group inline-flex justify-between cta-2col pointer-events-auto"
                >
                  <span className="font-mono text-label uppercase tracking-wide">View Work</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 ml-3"
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

      {/* PROJECTS & SELECTED WORKS - Single continuous millimetric grid */}
      <section className="relative" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
        <MillimetricPaper opacity={0.5} zIndex={0} />

        {/* PROJECTS SECTION */}
        <div className="relative z-10">
        {/* Section Header - height aligned to grid (32px = 2 cells) */}
        <GridRow style={{ marginBottom: '49px', height: '32px', alignItems: 'center' }}>
          <div style={{ flex: '8 8 0%' }} className="flex-1 lg:flex-[8_8_0%]">
            <GridLabel>Side Projects</GridLabel>
          </div>
          <div style={{ flex: '4 4 0%' }} className="flex-1 lg:flex-[4_4_0%] text-right">
            <GridLabelMuted size="sm">004</GridLabelMuted>
          </div>
        </GridRow>

        {/* Project Cards - 2 cards side by side on tablet+, stacked on mobile */}
        <GridRow className="flex-col md:flex-row items-baseline">
          {selectedProjects.map((project, index) => (
            <div
              key={project.id}
              style={{ flex: '1 1 0%' }}
            >
              <ProjectCard
                project={project}
                index={index}
                featured={project.id === 'norma'}
              />
            </div>
          ))}
        </GridRow>

        <GridRow style={{ marginTop: '48px' }}>
          <div style={{ flex: '1 1 0%' }}>
            <Link href={ROUTES.PROJECTS} className="btn-tertiary group">
              <span className="font-mono text-label uppercase tracking-wide">View all projects</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </GridRow>
        </div>

        {/* SELECTED WORKS SECTION */}
        <div className="relative z-10" style={{ marginTop: '72px' }}>
        {/* Section Header - height aligned to grid (32px = 2 cells) */}
        <GridRow style={{ marginBottom: '48px', height: '32px', alignItems: 'center' }}>
          <div style={{ flex: '8 8 0%' }} className="flex-1 lg:flex-[8_8_0%]">
            <GridLabel>Selected Works</GridLabel>
          </div>
          <div style={{ flex: '4 4 0%' }} className="flex-1 lg:flex-[4_4_0%] text-right">
            <GridLabelMuted size="sm">004</GridLabelMuted>
          </div>
        </GridRow>

        {/* Case Study Cards */}
        <GridRow className="flex-col" style={{ gap: '32px' }}>
          {selectedWorks.map((work, index) => (
            <CaseStudyCard
              key={work.id}
              caseStudy={work}
              index={index}
              featured={work.id === 'fast-track-ai'}
            />
          ))}
        </GridRow>

        <GridRow style={{ marginTop: '48px' }}>
          <div style={{ flex: '1 1 0%' }}>
            <Link href={ROUTES.WORK} className="btn-tertiary group">
              <span className="font-mono text-label uppercase tracking-wide">View all work</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </GridRow>
        </div>
      </section>
    </main>
  )
}
