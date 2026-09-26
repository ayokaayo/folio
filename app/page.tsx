'use client'

/**
 * Home Page: Miguel Angelo Portfolio V2 (MONO EDITION)
 *
 * Design System: Tactile Minimal × Swiss Brutalism
 *
 * MONO EDITION:
 * - All typography: IBM Plex Mono
 * - Accent: site accent token (--accent), blue or sage
 * - Hero: moiré wake field (components/hero)
 */

import { useMemo } from 'react'
import CaseStudyCard from '@/components/CaseStudyCard'
import ProjectCard from '@/components/ProjectCard'
import { GridRow } from '@/components/ExposedGrid'
import HeroSection from '@/components/hero/HeroSection'
import MillimetricPaper from '@/components/MillimetricPaper'
import GridLabel, { GridLabelMuted } from '@/components/GridLabel'
import GridCta from '@/components/GridCta'
import { caseStudies } from '@/lib/caseStudies'
import { projects as sideProjects } from '@/lib/projects'
import { ROUTES } from '@/lib/constants'

export default function Home() {
  // Selected works for homepage
  const selectedWorks = useMemo(() => {
    const order = ['nexus', 'dna', 'fast-track-ai']
    return order
      .map(id => caseStudies.find(cs => cs.id === id))
      .filter((cs): cs is NonNullable<typeof cs> => cs !== undefined)
  }, [])

  // Filter and order projects for homepage
  const selectedProjects = useMemo(() => {
    const order = ['kallax', 'norma']
    return order
      .map(id => sideProjects?.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
  }, [])

  return (
    <main id="main-content" className="pt-20">
      {/* HERO: moiré wake field behind server-rendered copy (components/hero) */}
      <HeroSection />

      {/* PROJECTS & SELECTED WORKS - Single continuous millimetric grid */}
      <section className="relative" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
        {/* The grid fades in over 48px so it meets the hero's field instead of starting on a hard edge. */}
        <div
          className="absolute inset-0"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 48px)', maskImage: 'linear-gradient(to bottom, transparent, #000 48px)' }}
        >
          <MillimetricPaper opacity={0.5} zIndex={0} />
        </div>

        {/* PROJECTS SECTION */}
        <div className="relative z-10">
        {/* Section Header - height aligned to grid (32px = 2 cells). `flex: s s (s-1)·16px` makes each side span s whole columns (3+1, 4+2, 8+4). */}
        <GridRow style={{ marginBottom: '48px', height: '32px', alignItems: 'center' }}>
          <div className="flex-[3_3_32px] sm:flex-[4_4_48px] lg:flex-[8_8_112px]">
            <GridLabel size="md">Side Projects</GridLabel>
          </div>
          <div className="flex-[1_1_0px] sm:flex-[2_2_16px] lg:flex-[4_4_48px] text-right">
            <GridLabelMuted size="md">005</GridLabelMuted>
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
            <GridCta href={ROUTES.PROJECTS} label="View all projects" />
          </div>
        </GridRow>
        </div>

        {/* SELECTED WORKS SECTION */}
        <div className="relative z-10" style={{ marginTop: '64px' }}>
        {/* Section Header - height aligned to grid (32px = 2 cells) */}
        <GridRow style={{ marginBottom: '48px', height: '32px', alignItems: 'center' }}>
          <div className="flex-[3_3_32px] sm:flex-[4_4_48px] lg:flex-[8_8_112px]">
            <GridLabel size="md">Selected Works</GridLabel>
          </div>
          <div className="flex-[1_1_0px] sm:flex-[2_2_16px] lg:flex-[4_4_48px] text-right">
            <GridLabelMuted size="md">{String(caseStudies.length).padStart(3, '0')}</GridLabelMuted>
          </div>
        </GridRow>

        {/* Case Study Cards */}
        <GridRow className="flex-col" style={{ gap: '48px' }}>
          {selectedWorks.map((work, index) => (
            <CaseStudyCard
              key={work.id}
              caseStudy={work}
              index={index}
              featured={work.id === 'dna'}
            />
          ))}
        </GridRow>

        <GridRow style={{ marginTop: '48px' }}>
          <div style={{ flex: '1 1 0%' }}>
            <GridCta href={ROUTES.WORK} label="View all work" />
          </div>
        </GridRow>
        </div>
      </section>
    </main>
  )
}
