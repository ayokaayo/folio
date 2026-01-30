'use client'

import Link from 'next/link'
import FigmaFrame from './FigmaFrame'
import { GridLabelMuted } from './GridLabel'

interface NextItemCardProps {
  title: string
  description: string
  href: string
  // For case studies (both required)
  quickReadTime?: string
  deepReadTime?: string
  // For articles/projects (single average time)
  averageReadTime?: string
  // Type discriminator to determine display mode
  type: 'case-study' | 'article' | 'project'
  // Tags to display under title
  tags?: string[]
}

/**
 * NextItemCard - Displays a link to another item from the same category
 * Neutral styling with Figma frame hover effect, and compact text
 */
export default function NextItemCard({
  title,
  description,
  href,
  quickReadTime,
  deepReadTime,
  averageReadTime,
  type,
  tags,
}: NextItemCardProps) {
  // Render reading time tags based on type
  const renderReadingTime = () => {
    if (type === 'case-study') {
      // Case studies: show both quick and deep dive
      return (
        <div className="flex flex-col items-end gap-1.5">
          {quickReadTime && (
            <div className="flex items-center gap-1.5 border border-border-subtle px-2 py-1 bg-bg-surface">
              <svg
                className="w-3 h-3 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-mono text-caption uppercase tracking-wide text-text-secondary">
                Quick {quickReadTime}
              </span>
            </div>
          )}
          {deepReadTime && (
            <div className="flex items-center gap-1.5 border border-border-subtle px-2 py-1 bg-bg-surface">
              <svg
                className="w-3 h-3 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-mono text-caption uppercase tracking-wide text-text-secondary">
                Deep {deepReadTime}
              </span>
            </div>
          )}
        </div>
      )
    } else {
      // Articles/Projects: show single average reading time
      if (averageReadTime) {
        return (
          <span className="font-mono text-caption uppercase tracking-wide text-text-tertiary">
            {averageReadTime}
          </span>
        )
      }
      return null
    }
  }

  return (
    <FigmaFrame 
      label={`Next ${type === 'case-study' ? 'Article' : type === 'project' ? 'Project' : 'Article'}`}
      pillText="Click to open"
    >
      <Link href={href}>
        <article className="bg-bg-surface border border-border-subtle px-5 py-4 cursor-pointer h-full">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Title - smaller, mono font */}
              <h3 className="font-mono font-medium text-text-primary text-body mb-2 line-clamp-1">
                {title}
              </h3>
              
              {/* Tags under title - using neutral muted style */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <GridLabelMuted key={index} size="sm">{tag}</GridLabelMuted>
                  ))}
                </div>
              )}
              
              {/* Description - compact, line-clamped */}
              <p className="font-mono text-caption text-text-secondary line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>
            
            {/* Reading time - right side */}
            <div className="flex-shrink-0">
              {renderReadingTime()}
            </div>
          </div>
        </article>
      </Link>
    </FigmaFrame>
  )
}
