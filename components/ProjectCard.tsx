'use client'

/**
 * ProjectCard — MONO EDITION with Figma-style frame
 *
 * Design spec:
 * - Figma-style selection frame on hover
 * - Background: --bg-surface
 * - All text: IBM Plex Mono
 * - Image: 16:9, grayscale default
 */

import Image from 'next/image'
import Link from 'next/link'
import { SideProject } from '@/lib/projects'
import { getProjectRoute } from '@/lib/constants'
import FigmaFrame from './FigmaFrame'
import GridLabel, { GridLabelMuted } from './GridLabel'

interface ProjectCardProps {
  project: SideProject
  index?: number
  featured?: boolean
}

export default function ProjectCard({
  project,
  index = 0,
  featured = false,
}: ProjectCardProps) {
  // Always link to portfolio entry, external links are shown on project detail page
  const cardUrl = getProjectRoute(project.id)

  // Get reading time - use project's readingTime if available, otherwise default
  const readingTimeLabel = project.readingTime || '6–9 min read'

  return (
    <FigmaFrame label={readingTimeLabel}>
      <article className="group bg-bg-surface overflow-hidden border border-border-subtle project-card-article">
        <Link href={cardUrl} className="block h-full flex flex-col">
          {/* Image - height constrained to fit within grid-aligned card */}
          {project.imageUrl ? (
            <div className="relative overflow-hidden project-card-image flex-shrink-0">
              <Image
                src={project.imageUrl}
                alt={project.imageAlt || project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover img-grayscale"
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
          ) : null}

          {/* Content - padding aligned to grid, flex-grow to fill space */}
          <div className="project-card-content flex flex-col flex-grow justify-between">
            <div>
              {/* Tags - Figma-style labels */}
              <div className="flex items-center gap-2 mb-4">
                <GridLabel size="sm">{project.hashtag}</GridLabel>
                <GridLabelMuted size="sm">{project.year}</GridLabelMuted>
                {project.status && project.status !== 'live' && (
                  <GridLabelMuted size="sm" className="capitalize">{project.status}</GridLabelMuted>
                )}
              </div>

              {/* Title — MONO */}
              <h3 className="font-mono font-medium text-text-primary text-title-md mb-3">
                {project.title}
              </h3>

              {/* Description - line-clamp to fit within fixed height */}
              <p
                className="font-mono text-body text-text-secondary line-clamp-3"
                style={{ lineHeight: '1.5' }}
              >
                {project.cardSummary || project.description}
              </p>
            </div>

            {/* View Link - hidden until hover, aligned to bottom */}
            <div className="mt-4">
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
        </Link>
      </article>
    </FigmaFrame>
  )
}
