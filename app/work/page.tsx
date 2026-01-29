'use client'

/**
 * Work Page — MONO EDITION
 * 
 * - All typography: IBM Plex Mono
 * - Grid-aligned section headers
 * - Case studies with forest green accent borders
 */

import { useMemo } from 'react'
import { caseStudies } from '@/lib/caseStudies'
import CaseStudyCard from '@/components/CaseStudyCard'

export default function WorkPage() {
  // Ensure stable order
  const orderedCaseStudies = useMemo(() => {
    const order = ['fast-track-ai', 'time-management', 'sms-characters', 'dropdown-builder']
    return order
      .map(id => caseStudies.find(cs => cs.id === id))
      .filter((cs): cs is NonNullable<typeof cs> => cs !== undefined)
  }, [])

  return (
    <main id="main-content" className="pt-20">
      {/* Header */}
      <section className="max-w-content mx-auto px-6 sm:px-[5vw] py-12 md:py-16">
        <div className="grid grid-cols-12 gap-[2vw] items-end pb-4 border-b border-border-subtle mb-8">
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
        
        <h1 className="font-mono font-medium text-text-primary text-headline">
          Case studies
        </h1>
        <p className="font-mono text-body text-text-secondary max-w-2xl mt-6">
          Deep dives into high-stakes product design. Systems thinking, 
          technical constraints, and measurable outcomes.
        </p>
      </section>

      {/* Case Studies List */}
      <section className="max-w-content mx-auto px-6 sm:px-[5vw] pb-24">
        <div className="space-y-8">
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
