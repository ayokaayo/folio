'use client'

/**
 * Work Page — MONO EDITION
 *
 * - All typography: IBM Plex Mono
 * - Grid visible from bottom extending upward
 * - Case studies with forest green accent borders
 */

import { useMemo } from 'react'
import { caseStudies } from '@/lib/caseStudies'
import CaseStudyCard, { CARD_GAP } from '@/components/CaseStudyCard'
import ExposedGrid, { GRID_GAP } from '@/components/ExposedGrid'

export default function WorkPage() {
  // Ensure stable order
  const orderedCaseStudies = useMemo(() => {
    const order = ['fast-track-ai', 'time-management', 'sms-characters', 'dropdown-builder']
    return order
      .map(id => caseStudies.find(cs => cs.id === id))
      .filter((cs): cs is NonNullable<typeof cs> => cs !== undefined)
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
            Case Studies
          </h1>
          <p className="font-mono text-body text-text-secondary max-w-2xl mt-6">
            Deep dives into high-stakes product design.<br></br> Systems thinking,
            technical constraints, and measurable outcomes.
          </p>
        </div>
      </section>

      {/* Case Studies List */}
      <section
        className="relative max-w-content mx-auto pb-24"
        style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px`, zIndex: 1 }}
      >
        <div className="flex flex-col" style={{ gap: `${CARD_GAP}px` }}>
          {orderedCaseStudies.map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
              featured={caseStudy.id === 'fast-track-ai'}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
