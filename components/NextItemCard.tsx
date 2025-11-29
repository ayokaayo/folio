'use client'

import Link from 'next/link'

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
}

/**
 * NextItemCard - Displays a link to another item from the same category
 * Styled identically to the "thoughts and words" component on the homepage
 * Shows reading time tags instead of "Soon"
 */
export default function NextItemCard({
  title,
  description,
  href,
  quickReadTime,
  deepReadTime,
  averageReadTime,
  type,
}: NextItemCardProps) {
  // Render reading time tags based on type
  const renderReadingTime = () => {
    if (type === 'case-study') {
      // Case studies: show both quick and deep dive with icons
      return (
        <div className="flex flex-col items-end gap-2">
          {quickReadTime && (
            <div className="flex items-center gap-1.5 bg-white rounded px-2 py-1">
              <svg
                className="w-3.5 h-3.5 text-text/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-xs uppercase tracking-wide text-text/50">
                Quick {quickReadTime}
              </span>
            </div>
          )}
          {deepReadTime && (
            <div className="flex items-center gap-1.5 bg-white rounded px-2 py-1">
              <svg
                className="w-3.5 h-3.5 text-text/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-xs uppercase tracking-wide text-text/50">
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
          <span className="text-xs uppercase tracking-wide text-text/50">
            {averageReadTime}
          </span>
        )
      }
      return null
    }
  }

  return (
    <Link href={href}>
      <article className="bg-[#BCD1CA] hover:bg-[#aec6bf] rounded-xl px-5 py-4 cursor-pointer transition-colors duration-150">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-text mb-1">
              {title}
            </h3>
            <p className="text-sm text-text/70">
              {description}
            </p>
          </div>
          {renderReadingTime()}
        </div>
      </article>
    </Link>
  )
}

