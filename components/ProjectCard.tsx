'use client'

/**
 * ProjectCard — MONO EDITION
 * 
 * Design spec:
 * - Background: --bg-surface
 * - Border: 1px solid --border-subtle
 * - Border-radius: 0px (brutalist)
 * - Left border: 3px solid --accent (featured) or --bg-grid (standard)
 * - All text: IBM Plex Mono
 * - Image: 16:9, grayscale default
 */

import Link from 'next/link'
import { SideProject } from '@/lib/projects'
import { getProjectRoute } from '@/lib/constants'

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

  return (
    <article
      className="group bg-bg-surface overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-border-subtle hover:border-text-tertiary"
    >
      <Link href={cardUrl} className="block">
        {/* Image */}
        {project.imageUrl ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.imageAlt || project.title}
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
        ) : null}

        {/* Content */}
        <div className="p-8">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-4">
            <span className="tag font-mono text-caption uppercase tracking-wide">
              {project.hashtag}
            </span>
            <span 
              className="font-mono text-caption text-text-tertiary"
              style={{ padding: '4px 10px' }}
            >
              {project.year}
            </span>
            {project.status && project.status !== 'live' && (
              <span 
                className="tag font-mono text-caption"
                style={{ textTransform: 'capitalize' }}
              >
                {project.status}
              </span>
            )}
          </div>

          {/* Title — MONO */}
          <h3 className="font-mono font-medium text-text-primary text-title-md mb-3">
            {project.title}
          </h3>

          {/* Description */}
          <p className="font-mono text-body text-text-secondary mb-6">
            {project.cardSummary || project.description}
          </p>

          {/* View Link - hidden until hover */}
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
      </Link>
    </article>
  )
}
