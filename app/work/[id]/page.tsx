'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { caseStudies } from '@/lib/caseStudies'
import CaseStudyDetail from '@/components/CaseStudyDetail'
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

  if (!caseStudy) {
    notFound()
  }

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <Link
            href={ROUTES.WORK}
            className="inline-flex items-center gap-2 text-sm text-text/70 hover:text-text transition-colors duration-200 mb-8"
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
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-[#F5E6D3] border border-text/20 rounded-full text-sm font-medium text-text">
              {caseStudy.hashtag}
            </span>
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
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <CaseStudyDetail caseStudy={caseStudy} />
      </section>
    </main>
  )
}

