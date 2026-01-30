'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ImageWithLoader from '@/components/ImageWithLoader'
import { getProjectBySlug, projects } from '@/lib/projects'
import { ANIMATION, ROUTES, getProjectRoute } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { getNextItem } from '@/lib/utils/getNextItem'
import NextItemCard from '@/components/NextItemCard'
import ImageModal from '@/components/ImageModal'
import DensityToggle from '@/components/DensityToggle'
import ZoomableImage from '@/components/ZoomableImage'

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
}

/** Icon for project link by label (e.g. Google Play, Website, App Store) */
function ProjectLinkIcon({ label }: { label: string }) {
  const l = label.toLowerCase()
  const className = 'w-4 h-4 flex-shrink-0'
  if (l.includes('google play') || l.includes('play store')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.636z" />
      </svg>
    )
  }
  if (l.includes('app store') || l.includes('apple')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    )
  }
  if (l.includes('website') || l.includes('site') || l === 'web') {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  }
  if (l.includes('github') || l.includes('code')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  }
  // Default: external link
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const prefersReducedMotion = useReducedMotion()
  const project = getProjectBySlug(params.slug)
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string; caption?: string } | null>(null)
  const [densityMode, setDensityMode] = useState<'quick' | 'deep'>('deep')

  // Load density preference (same key as work entries)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.sessionStorage.getItem('density-preference')
    if (saved === 'quick' || saved === 'deep') {
      setDensityMode(saved)
    }
  }, [])

  // Get next project for navigation
  const nextProject = project ? getNextItem(project.id, projects) : null

  if (!project) {
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
              href={ROUTES.PROJECTS}
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
              Back to Projects
            </Link>
          </div>
          
          <div className="mb-4">
            <span className="text-sm text-text/70 font-medium">
              {project.hashtag} ({project.year})
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-4">
            {project.title}
          </h1>

          {/* Density toggle for kallax & codex-tarot – reuse same component & session logic as work entries */}
          {(project.id === 'kallax' || project.id === 'codex-tarot') && (
            <div className="mt-2 mb-4">
              <DensityToggle
                caseStudy={{
                  subtitle: project.subtitle || project.description,
                  impact: {
                    items: project.outcome
                      ? [project.outcome.summary, ...(project.outcome.notes || [])]
                      : [],
                    // Add quickItems for codex-tarot quick mode reading time calculation
                    ...(project.id === 'codex-tarot' && {
                      quickItems: [project.outcome?.summary, ...(project.outcome?.notes?.slice(0, 2) || [])].filter(Boolean),
                    }),
                  },
                  problem: {
                    title: '',
                    context: project.context?.background || '',
                    // Add quickContext for codex-tarot
                    ...(project.id === 'codex-tarot' && {
                      quickContext: project.context?.background?.split('.').slice(0, 2).join('.') + '.',
                    }),
                    issues: [],
                    whyItMattered: [],
                  },
                  approach: {
                    title: '',
                    decisions:
                      project.creation?.features?.map((feature) => ({
                        title: feature.title,
                        decision: feature.description,
                        rationale: '',
                        result: '',
                      })) || [],
                    images: [],
                  },
                  designDecisions:
                    project.craft?.decisions.map((decision) => ({
                      title: '',
                      description: decision,
                    })) || [],
                  implementation: {
                    title: '',
                    technical: project.techStack || [],
                    rollout: [],
                    images: [],
                  },
                  validation: {
                    title: '',
                    outcomes: [],
                    feedback: [],
                    technical: [],
                    images: [],
                  },
                  learned: {
                    title: '',
                    worked: [],
                    challenges: [],
                    insight: project.reflection?.insight || '',
                    // Add quickInsight for codex-tarot
                    ...(project.id === 'codex-tarot' && project.reflection?.insight && {
                      quickInsight: project.reflection.insight.split('.').slice(0, 2).join('.') + '.',
                    }),
                    images: [],
                  },
                  process: undefined,
                  timeline: project.timeline || '',
                  team: project.role || '',
                  images: project.images || [],
                  id: project.id,
                  title: project.title,
                  hashtag: project.hashtag,
                  company: '',
                  year: project.year,
                  linkText: '',
                } as any}
                mode={densityMode}
                onModeChange={setDensityMode}
              />
            </div>
          )}
          {project.subtitle && (
            <p className="text-lg md:text-xl text-text/80 max-w-3xl leading-relaxed mb-6">
              {project.subtitle}
            </p>
          )}
          
          <p className="text-base md:text-lg text-text/70 max-w-3xl leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Project metadata — white bounding box, labelled rows + muted tech tags */}
          {(project.timeline || project.role || project.techStack) && (
            <div className="mb-8 bg-white border border-border-subtle p-6 space-y-4">
              {(project.timeline || project.role) && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-6 gap-y-1 text-sm font-mono">
                  {project.timeline && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-text-tertiary uppercase tracking-wide text-caption">Timeline</span>
                      <span className="text-text-secondary">{project.timeline}</span>
                    </div>
                  )}
                  {project.role && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-text-tertiary uppercase tracking-wide text-caption">Role</span>
                      <span className="text-text-secondary">{project.role}</span>
                    </div>
                  )}
                </div>
              )}
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-text-tertiary uppercase tracking-wide text-caption font-mono">Tech stack</span>
                  <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-block font-mono text-caption uppercase tracking-wide px-2.5 py-1 border border-border-subtle bg-bg-grid/60 text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* External links — filter-style with icons */}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 font-mono text-caption uppercase tracking-wide border border-border-subtle bg-transparent text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-all duration-150"
                >
                  <ProjectLinkIcon label={link.label} />
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {project.imageUrl && (
            <div className="mt-8 mb-6 cursor-pointer" onClick={() => setSelectedImage({ url: project.imageUrl!, alt: project.imageAlt || project.title })}>
              <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                <ImageWithLoader
                  src={project.imageUrl}
                  alt={project.imageAlt || project.title}
                  width={2400}
                  height={1600}
                  className="w-full h-auto"
                  quality={90}
                  objectFit="contain"
                  containerClassName="bg-text/5"
                  shimmerClassName="after:via-white/10"
                />
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Project Details */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pb-20 pt-4">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW, delay: 0.1 }}
          className="space-y-12"
        >
          {/* Mission Section */}
          {project.mission && (
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-6">
                Mission
              </h2>
              <p className="text-lg text-text/80 mb-4 font-medium">
                {project.mission.statement}
              </p>
              {/* In quick mode, hide the long spark paragraph and trim intents */}
              {!(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')) && (
                <p className="text-base text-text/70 mb-6 leading-relaxed">
                  {project.mission.spark}
                </p>
              )}
              {project.mission.intent && project.mission.intent.length > 0 && (
                <ul className="space-y-2">
                  {(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')
                    ? project.mission.intent.slice(0, 2)
                    : project.mission.intent
                  ).map((intent, index) => (
                    <li key={index} className="text-base text-text/70 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{intent}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Context Section */}
          {project.context && (
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-6">
                Context
              </h2>
              <p className="text-base text-text/70 mb-4 leading-relaxed">
                {project.context.background}
              </p>
              {/* In quick mode, hide opportunity for kallax, show for codex-tarot as it's concise */}
              {!(project.id === 'kallax' && densityMode === 'quick') && (
                <p className="text-base text-text/70 mb-4 leading-relaxed">
                  {project.context.opportunity}
                </p>
              )}
              {/* In quick mode, hide audience as it's supplementary context */}
              {project.context.audience && !(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')) && (
                <p className="text-base text-text/70 leading-relaxed">
                  {project.context.audience}
                </p>
              )}
            </div>
          )}

          {/* Creation Section */}
          {project.creation && (
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-6">
                Creation
              </h2>
              <p className="text-base text-text/70 mb-8 leading-relaxed">
                {project.creation.approach}
              </p>
              
              {project.creation.features && project.creation.features.length > 0 && (
                <div className="space-y-8">
                  {/* Quick mode: show 2-4 core features; Deep mode: show all */}
                  {(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')
                    ? project.creation.features.slice(0, project.id === 'codex-tarot' ? 4 : 2)
                    : project.creation.features
                  ).map((feature, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-serif font-semibold text-text mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-base text-text/70 leading-relaxed">
                        {feature.description}
                      </p>
                      {feature.image && (
                        <motion.figure
                          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-100px' }}
                          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL }}
                          className="mt-6 w-full cursor-pointer"
                          onClick={() => setSelectedImage({ url: feature.image!.url, alt: feature.image!.alt, caption: feature.image!.caption })}
                        >
                          <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                            <div className="relative w-full">
                              <ImageWithLoader
                                src={feature.image.url}
                                alt={feature.image.alt}
                                width={2400}
                                height={1600}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                objectFit="contain"
                                quality={90}
                                className="w-full h-auto"
                                containerClassName="bg-text/5"
                                shimmerClassName="after:via-white/10"
                              />
                            </div>
                          </div>
                          {feature.image.caption && (
                            <figcaption className="mt-3 text-sm text-text/60 text-center italic">
                              {feature.image.caption}
                            </figcaption>
                          )}
                        </motion.figure>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {project.creation.images && project.creation.images.length > 0 && (
                <div className="mt-8 space-y-8">
                  {project.creation.images.map((img, index) => {
                    const isReadingImage = img.url.includes('reading.png')

                    // Zoomable images render in their own pan/zoom frame
                    if (img.isZoomable) {
                      return (
                        <motion.div
                          key={index}
                          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-100px' }}
                          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: index * 0.1 }}
                          className="w-full"
                        >
                          <ZoomableImage
                            src={img.url}
                            alt={img.alt}
                            caption={img.caption}
                          />
                        </motion.div>
                      )
                    }

                    return (
                      <motion.figure
                        key={index}
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: index * 0.1 }}
                        className={`${isReadingImage ? "w-full max-w-[400px] mx-auto" : "w-full"} cursor-pointer`}
                        onClick={() => setSelectedImage({ url: img.url, alt: img.alt, caption: img.caption })}
                      >
                        <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                          <div className="relative w-full">
                            <ImageWithLoader
                              src={img.url}
                              alt={img.alt}
                              width={isReadingImage ? 400 : 2400}
                              height={isReadingImage ? 815 : 1600}
                              sizes={isReadingImage ? "400px" : "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"}
                              objectFit="contain"
                              quality={90}
                              className="w-full h-auto"
                              containerClassName="bg-text/5"
                              shimmerClassName="after:via-white/10"
                            />
                          </div>
                        </div>
                        {img.caption && (
                          <figcaption className="mt-3 text-sm text-text/60 text-center italic">
                            {img.caption}
                          </figcaption>
                        )}
                      </motion.figure>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Craft Section */}
          {project.craft && (
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-6">
                Craft
              </h2>
              {project.craft.decisions && project.craft.decisions.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {/* Quick mode: show first 3 decisions; Deep mode: show all */}
                  {(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')
                    ? project.craft.decisions.slice(0, 3)
                    : project.craft.decisions
                  ).map((decision, index) => (
                    <li key={index} className="text-base text-text/70 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* In quick mode, hide exploration narrative to keep it concise */}
              {project.craft.exploration && !(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')) && (
                <p className="text-base text-text/70 leading-relaxed mb-6">
                  {project.craft.exploration}
                </p>
              )}
              {project.craft.image && (
                <>
                  {/* Zoomable image renders in its own pan/zoom frame */}
                  {project.craft.image.isZoomable ? (
                    <motion.div
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL }}
                      className="mt-6 w-full"
                    >
                      <ZoomableImage
                        src={project.craft.image.url}
                        alt={project.craft.image.alt}
                        caption={project.craft.image.caption}
                      />
                    </motion.div>
                  ) : (
                    <motion.figure
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL }}
                      className="mt-6 w-full cursor-pointer"
                      onClick={() => setSelectedImage({ url: project.craft!.image!.url, alt: project.craft!.image!.alt, caption: project.craft!.image!.caption })}
                    >
                      <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                        <div className="relative w-full">
                          <ImageWithLoader
                            src={project.craft.image.url}
                            alt={project.craft.image.alt}
                            width={2400}
                            height={1600}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                            objectFit="contain"
                            quality={90}
                            className="w-full h-auto"
                            containerClassName="bg-text/5"
                            shimmerClassName="after:via-white/10"
                          />
                        </div>
                      </div>
                      {project.craft.image.caption && (
                        <figcaption className="mt-3 text-sm text-text/60 text-center italic">
                          {project.craft.image.caption}
                        </figcaption>
                      )}
                    </motion.figure>
                  )}
                </>
              )}
            </div>
          )}

          {/* Outcome Section */}
          {project.outcome && (
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-6">
                Outcome
              </h2>
              <p className="text-base text-text/70 mb-4 leading-relaxed">
                {project.outcome.summary}
              </p>
              {project.outcome.notes && project.outcome.notes.length > 0 && (
                <ul className="space-y-2">
                  {/* Quick mode: show first 2 outcome notes; Deep mode: show all */}
                  {(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')
                    ? project.outcome.notes.slice(0, 2)
                    : project.outcome.notes
                  ).map((note, index) => (
                    <li key={index} className="text-base text-text/70 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              )}
              {project.id === 'exotica-radio' && (
                <motion.figure
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL }}
                  className="mt-6 w-full m-0 cursor-pointer"
                  onClick={() => setSelectedImage({ url: '/img/projects/exotica-radio/google-ranking.png', alt: 'Google search results showing exotica.radio ranking first', caption: 'First place with zero SEO effort' })}
                >
                  <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                    <div className="relative w-full">
                      <ImageWithLoader
                        src="/img/projects/exotica-radio/google-ranking.png"
                        alt="Google search results showing exotica.radio ranking first"
                        width={2400}
                        height={1600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        objectFit="contain"
                        quality={90}
                        className="w-full h-auto"
                        containerClassName="bg-text/5"
                        shimmerClassName="after:via-white/10"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-sm text-text/60 text-center italic">
                    First place with zero SEO effort
                  </figcaption>
                </motion.figure>
              )}
            </div>
          )}

          {/* Reflection Section */}
          {project.reflection && (
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-6">
                Reflection
              </h2>
              <p className="text-base text-text/70 mb-6 leading-relaxed font-medium">
                {project.reflection.insight}
              </p>
              {project.reflection.openQuestions && project.reflection.openQuestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-text mb-3">Open Questions</h3>
                  <ul className="space-y-2">
                    {/* Quick mode: show first 2 open questions; Deep mode: show all */}
                    {(densityMode === 'quick' && (project.id === 'kallax' || project.id === 'codex-tarot')
                      ? project.reflection.openQuestions.slice(0, 2)
                      : project.reflection.openQuestions
                    ).map((question, index) => (
                      <li key={index} className="text-base text-text/70 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.reflection.nextSteps && project.reflection.nextSteps.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Next Steps</h3>
                  <ul className="space-y-2">
                    {/* Quick mode: hide next steps as they're forward-looking; Deep mode: show all */}
                    {(densityMode === 'quick' && project.id === 'codex-tarot'
                      ? project.reflection.nextSteps.slice(0, 0)
                      : densityMode === 'quick' && project.id === 'kallax'
                      ? project.reflection.nextSteps.slice(0, 2)
                      : project.reflection.nextSteps
                    ).map((step, index) => (
                      <li key={index} className="text-base text-text/70 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Gallery Section */}
          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-6">
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-start">
                {project.gallery.map((img, index) => {
                  const isMobileImage = img.url.includes('mobile.png')

                  // Zoomable images render in their own pan/zoom frame
                  if (img.isZoomable) {
                    return (
                      <motion.div
                        key={index}
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: index * 0.1 }}
                        className="md:col-span-2 w-full"
                      >
                        <ZoomableImage
                          src={img.url}
                          alt={img.alt}
                          caption={img.caption}
                        />
                      </motion.div>
                    )
                  }

                  return (
                    <motion.figure
                      key={index}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: index * 0.1 }}
                      className={`w-full m-0 ${isMobileImage ? 'md:col-span-2 max-w-[400px] mx-auto' : ''} cursor-pointer`}
                      onClick={() => setSelectedImage({ url: img.url, alt: img.alt, caption: img.caption })}
                    >
                      <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                        <div className="relative w-full">
                          <ImageWithLoader
                            src={img.url}
                            alt={img.alt}
                            width={isMobileImage ? 400 : 1600}
                            height={isMobileImage ? 815 : 1200}
                            sizes={isMobileImage ? "400px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"}
                            objectFit="contain"
                            quality={90}
                            className="w-full h-auto"
                            containerClassName="bg-text/5"
                            shimmerClassName="after:via-white/10"
                          />
                        </div>
                      </div>
                      {img.caption && (
                        <figcaption className="mt-3 text-sm text-text/60 text-center italic">
                          {img.caption}
                        </figcaption>
                      )}
                    </motion.figure>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Next Project Navigation */}
        {nextProject && (
          <div className="mt-16 pt-16 divider-dashed-grid">
            <NextItemCard
              title={nextProject.title}
              description={nextProject.description}
              href={getProjectRoute(nextProject.id)}
              type="project"
              tags={[nextProject.hashtag, nextProject.year]}
            />
          </div>
        )}
      </section>

      {/* Image Modal */}
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  )
}

