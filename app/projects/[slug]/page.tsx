'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getProjectBySlug, projects } from '@/lib/projects'
import { ANIMATION, ROUTES, getProjectRoute } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { getNextItem } from '@/lib/utils/getNextItem'
import NextItemCard from '@/components/NextItemCard'
import ImageModal from '@/components/ImageModal'
import DensityToggle from '@/components/DensityToggle'

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
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

          {/* Density toggle for kallax – reuse same component & session logic as work entries */}
          {project.id === 'kallax' && (
            <div className="mt-2 mb-4">
              <DensityToggle
                caseStudy={{
                  subtitle: project.subtitle || project.description,
                  impact: {
                    items: project.outcome
                      ? [project.outcome.summary, ...(project.outcome.notes || [])]
                      : [],
                  },
                  problem: {
                    title: '',
                    context: project.context?.background || '',
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

          {/* Project metadata */}
          {(project.timeline || project.role || project.techStack) && (
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-text/60">
              {project.timeline && (
                <span>{project.timeline}</span>
              )}
              {project.role && (
                <span>{project.role}</span>
              )}
              {project.techStack && project.techStack.length > 0 && (
                <span>{project.techStack.join(' • ')}</span>
              )}
            </div>
          )}

          {/* External links */}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta group"
                >
                  {link.label}
                  <svg
                    className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {project.imageUrl && (
            <div className="mt-8 mb-6 cursor-pointer" onClick={() => setSelectedImage({ url: project.imageUrl!, alt: project.imageAlt || project.title })}>
              <Image
                src={project.imageUrl}
                alt={project.imageAlt || project.title}
                width={2400}
                height={1600}
                className="w-full rounded-lg transition-transform hover:scale-[1.01]"
                quality={90}
              />
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
              {/* In quick mode for kallax, hide the long spark paragraph and trim intents */}
              {!(project.id === 'kallax' && densityMode === 'quick') && (
                <p className="text-base text-text/70 mb-6 leading-relaxed">
                  {project.mission.spark}
                </p>
              )}
              {project.mission.intent && project.mission.intent.length > 0 && (
                <ul className="space-y-2">
                  {(project.id === 'kallax' && densityMode === 'quick'
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
              {!(project.id === 'kallax' && densityMode === 'quick') && (
                <p className="text-base text-text/70 mb-4 leading-relaxed">
                  {project.context.opportunity}
                </p>
              )}
              {project.context.audience && !(project.id === 'kallax' && densityMode === 'quick') && (
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
                  {(project.id === 'kallax' && densityMode === 'quick'
                    ? project.creation.features.slice(0, 2)
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
                          <div className="relative w-full rounded-lg overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                            <div className="relative w-full">
                              <Image
                                src={feature.image.url}
                                alt={feature.image.alt}
                                width={2400}
                                height={1600}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                className="object-contain w-full h-auto"
                                quality={90}
                                unoptimized={false}
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
                        <div className="relative w-full rounded-lg overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                          <div className="relative w-full">
                            <Image
                              src={img.url}
                              alt={img.alt}
                              width={isReadingImage ? 400 : 2400}
                              height={isReadingImage ? 815 : 1600}
                              sizes={isReadingImage ? "400px" : "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"}
                              className="object-contain w-full h-auto"
                              quality={90}
                              unoptimized={false}
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
                  {(project.id === 'kallax' && densityMode === 'quick'
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
              {project.craft.exploration && !(project.id === 'kallax' && densityMode === 'quick') && (
                <p className="text-base text-text/70 leading-relaxed mb-6">
                  {project.craft.exploration}
                </p>
              )}
              {project.craft.image && (
                <motion.figure
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL }}
                  className="mt-6 w-full cursor-pointer"
                  onClick={() => setSelectedImage({ url: project.craft!.image!.url, alt: project.craft!.image!.alt, caption: project.craft!.image!.caption })}
                >
                  <div className="relative w-full rounded-lg overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                    <div className="relative w-full">
                      <Image
                        src={project.craft.image.url}
                        alt={project.craft.image.alt}
                        width={2400}
                        height={1600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        className="object-contain w-full h-auto"
                        quality={90}
                        unoptimized={false}
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
                  {(project.id === 'kallax' && densityMode === 'quick'
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
                  <div className="relative w-full rounded-lg overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                    <div className="relative w-full">
                      <Image
                        src="/img/projects/exotica-radio/google-ranking.png"
                        alt="Google search results showing exotica.radio ranking first"
                        width={2400}
                        height={1600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        className="object-contain w-full h-auto"
                        quality={90}
                        unoptimized={false}
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
                    {(project.id === 'kallax' && densityMode === 'quick'
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
                    {project.reflection.nextSteps.map((step, index) => (
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
                      <div className="relative w-full rounded-lg overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                        <div className="relative w-full">
                          <Image
                            src={img.url}
                            alt={img.alt}
                            width={isMobileImage ? 400 : 1600}
                            height={isMobileImage ? 815 : 1200}
                            sizes={isMobileImage ? "400px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"}
                            className="object-contain w-full h-auto"
                            quality={90}
                            unoptimized={false}
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
          <div className="mt-16 pt-16 border-t border-text/10">
            <NextItemCard
              title={nextProject.title}
              description={nextProject.description}
              href={getProjectRoute(nextProject.id)}
              type="project"
            />
          </div>
        )}
      </section>

      {/* Image Modal */}
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  )
}

