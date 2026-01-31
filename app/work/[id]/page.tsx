'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { caseStudies } from '@/lib/caseStudies'
import CaseStudyDetail from '@/components/CaseStudyDetail'
import { ANIMATION } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import Link from 'next/link'
import { ROUTES, getWorkRoute } from '@/lib/constants'
import { getNextItem } from '@/lib/utils/getNextItem'
import { calculateCaseStudyReadingTime } from '@/lib/utils/readingTime'
import NextItemCard from '@/components/NextItemCard'
import { parseMarkdownLinks } from '@/lib/utils/parseMarkdownLinks'

interface WorkDetailPageProps {
  params: {
    id: string
  }
}

export default function WorkDetailPage({ params }: WorkDetailPageProps) {
  const prefersReducedMotion = useReducedMotion()
  const caseStudy = caseStudies.find((cs) => cs.id === params.id)
  const [densityMode, setDensityMode] = useState<'quick' | 'deep'>('deep')

  // Get next case study for navigation
  const nextCaseStudy = caseStudy ? getNextItem(caseStudy.id, caseStudies) : null

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
          {/* Top bar with back button */}
          <div className="flex items-center justify-end mb-8">
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
          <div className="mb-6">
            <span className="text-sm text-text/70 font-medium">
              {caseStudy.company} ({caseStudy.year})
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            {caseStudy.title}
          </h1>
          <p className="text-lg md:text-xl text-text/80 max-w-3xl leading-relaxed mb-6">
            {parseMarkdownLinks(caseStudy.subtitle)}
          </p>
          {caseStudy.imageUrl && (
            <div className="mt-10 mb-6">
              <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element -- Native img for natural sizing */}
                <img
                  src={caseStudy.imageUrl}
                  alt={caseStudy.imageAlt || caseStudy.title}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Case Study Details */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pb-20 pt-4">
        <CaseStudyDetail 
          caseStudy={caseStudy} 
          densityMode={densityMode}
          onModeChange={setDensityMode}
        />
        
        {/* Next Case Study Navigation */}
        {nextCaseStudy && (
          <div className="mt-16 pt-16 divider-dashed-grid">
            <NextItemCard
              title={nextCaseStudy.title}
              description={nextCaseStudy.subtitle}
              href={getWorkRoute(nextCaseStudy.id)}
              quickReadTime={calculateCaseStudyReadingTime(nextCaseStudy, 'quick')}
              deepReadTime={calculateCaseStudyReadingTime(nextCaseStudy, 'deep')}
              type="case-study"
              tags={[nextCaseStudy.hashtag, nextCaseStudy.year]}
            />
          </div>
        )}
      </section>
    </main>
  )
}

