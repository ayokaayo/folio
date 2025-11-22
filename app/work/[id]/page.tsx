'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { caseStudies } from '@/lib/caseStudies'
import CaseStudyDetail from '@/components/CaseStudyDetail'
import DensityToggle from '@/components/DensityToggle'
import { ANIMATION } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

interface WorkDetailPageProps {
  params: {
    id: string
  }
}

export default function WorkDetailPage({ params }: WorkDetailPageProps) {
  const prefersReducedMotion = useReducedMotion()
  const caseStudy = caseStudies.find((cs) => cs.id === params.id)
  const [densityMode, setDensityMode] = useState<'quick' | 'deep'>('quick')

  useEffect(() => {
    // Load preference from sessionStorage
    if (typeof window !== 'undefined') {
      const savedMode = sessionStorage.getItem('density-preference')
      if (savedMode === 'quick' || savedMode === 'deep') {
        setDensityMode(savedMode)
      }
    }
  }, [])

  if (!caseStudy) {
    notFound()
  }

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          {/* Top bar with toggle and back button */}
          <div className="flex items-center justify-between mb-8">
            <DensityToggle
              caseStudy={caseStudy}
              mode={densityMode}
              onModeChange={setDensityMode}
            />
            <Link
              href={ROUTES.WORK}
              className="inline-flex items-center gap-2 text-sm text-text/70 hover:text-text transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Work
            </Link>
          </div>
          <div className="mb-4">
            <span className="text-sm text-text/70 font-medium">
              {caseStudy.company} ({caseStudy.year})
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-4">
            {caseStudy.title}
          </h1>
          <p className="text-lg md:text-xl text-text/80 max-w-3xl leading-relaxed">
            {caseStudy.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Case Study Details */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <CaseStudyDetail caseStudy={caseStudy} densityMode={densityMode} />
      </section>
    </main>
  )
}

