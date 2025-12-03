'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { caseStudies } from '@/lib/caseStudies'
import CaseStudyCard from '@/components/CaseStudyCard'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export default function WorkPage() {
  const prefersReducedMotion = useReducedMotion()

  // Ensure stable order: fast-track-ai, time-management, sms-characters, dropdown-builder
  const orderedCaseStudies = useMemo(() => {
    const order = ['fast-track-ai', 'time-management', 'sms-characters', 'dropdown-builder']
    return order
      .map(id => caseStudies.find(cs => cs.id === id))
      .filter((cs): cs is NonNullable<typeof cs> => cs !== undefined)
  }, [])

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-4">
            Work
          </h1>
          <p className="text-base md:text-lg text-text/70 max-w-2xl">
            Here's what I've been recently working on.
          </p>
        </motion.div>
      </section>

      {/* Case Studies List - Cards Only */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <motion.div
          initial={prefersReducedMotion ? {} : "hidden"}
          whileInView={prefersReducedMotion ? {} : "visible"}
          viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
          className="space-y-8"
        >
          {orderedCaseStudies.map((caseStudy, index) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} index={index} />
          ))}
        </motion.div>
      </section>
    </main>
  )
}
