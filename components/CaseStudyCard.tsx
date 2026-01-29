'use client'

/**
 * CaseStudyCard — MONO EDITION
 * 
 * Design spec:
 * - Height: 280px desktop, auto mobile
 * - Layout: Horizontal flex (30% metadata / 70% visual)
 * - Background: --bg-surface
 * - Border-left: 3px solid --accent (featured) or --bg-grid (standard)
 * - All text: IBM Plex Mono
 * - Trace System: SVG lines connect metadata on hover (>200ms delay)
 */

import Link from 'next/link'
import { useState, useRef } from 'react'
import { CaseStudy } from '@/lib/caseStudies'
import { getWorkRoute } from '@/lib/constants'

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  index?: number
  featured?: boolean
  /** Trace connection target ID for SVG animation */
  traceTargetId?: string
}

export default function CaseStudyCard({ 
  caseStudy, 
  index = 0, 
  featured = false,
  traceTargetId,
}: CaseStudyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTrace, setShowTrace] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const cardUrl = caseStudy.linkUrl || getWorkRoute(caseStudy.id)

  // Handle hover with 200ms delay for trace trigger
  const handleMouseEnter = () => {
    setIsHovered(true)
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTrace(true)
    }, 200)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowTrace(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  // Use cardSummary for display, fallback to subtitle
  const cardDescription = caseStudy.cardSummary || caseStudy.subtitle

  return (
    <div
      ref={cardRef}
      className="group relative mb-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-case-study-id={caseStudy.id}
    >
      <Link href={cardUrl} className="block">
        <article
          className="flex flex-col lg:flex-row bg-bg-surface overflow-hidden transition-all duration-200 border border-border-subtle hover:border-text-tertiary"
          style={{ minHeight: '280px' }}
        >
          {/* Left Column - Metadata (35%) */}
          <div className="lg:w-[35%] p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Category Tag */}
              <span
                id={`${caseStudy.id}-category`}
                className="inline-block font-mono text-caption uppercase tracking-wide px-2 py-1 mb-4 border border-border-subtle text-text-secondary"
              >
                {caseStudy.hashtag}
              </span>

              {/* Title — MONO */}
              <h3 className="font-mono font-medium text-text-primary text-title-lg mb-4">
                {caseStudy.title}
              </h3>

              {/* Year */}
              <p 
                id={`${caseStudy.id}-year`}
                className="font-mono text-caption text-text-secondary mb-4"
              >
                {caseStudy.company} · {caseStudy.year}
              </p>

              {/* Card Summary */}
              <p
                id={`${caseStudy.id}-summary`}
                className="font-mono text-body text-text-secondary leading-relaxed"
              >
                {cardDescription}
              </p>
            </div>

            {/* View Link */}
            <div className="mt-6 lg:mt-0">
              <span className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-wide text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View project
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Right Column - Visual (65%) */}
          <div className="lg:w-[65%] relative overflow-hidden">
            {caseStudy.coverImageUrl || caseStudy.imageUrl ? (
              <div className="relative w-full h-full min-h-[280px] lg:min-h-0">
                <img
                  src={caseStudy.coverImageUrl || caseStudy.imageUrl}
                  alt={caseStudy.coverImageAlt || caseStudy.imageAlt || caseStudy.title}
                  className="w-full h-full object-cover img-grayscale"
                />
                {/* Grain overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full min-h-[280px] lg:min-h-0 bg-bg-grid flex items-center justify-center">
                <span className="font-mono text-caption text-text-tertiary uppercase tracking-wide">
                  No image
                </span>
              </div>
            )}

          </div>
        </article>
      </Link>

      {/* Trace System SVG overlay */}
      {traceTargetId && (
        <TraceLines 
          isVisible={showTrace}
          cardId={caseStudy.id}
          targetId={traceTargetId}
        />
      )}
    </div>
  )
}

/**
 * TraceLines - SVG connection lines for the Trace System
 */
interface TraceLinesProps {
  isVisible: boolean
  cardId: string
  targetId: string
}

function TraceLines({ isVisible }: TraceLinesProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.15s ease' }}
      aria-hidden="true"
    >
      {/* Horizontal trace line from card */}
      <line
        x1="0"
        y1="50%"
        x2={isVisible ? "-100" : "0"}
        y2="50%"
        stroke="var(--accent)"
        strokeWidth="1"
        fill="none"
        style={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </svg>
  )
}
