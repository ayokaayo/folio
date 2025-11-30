'use client'

// Home page - Miguel Angelo's portfolio landing
// Every pixel here was crafted with intention. Welcome! 👋
import { motion } from 'framer-motion'
import Link from 'next/link'
import CaseStudyCard from '@/components/CaseStudyCard'
import ProjectCard from '@/components/ProjectCard'
import { caseStudies } from '@/lib/caseStudies'
import { sideProjects } from '@/lib/projects'
import { ANIMATION, ROUTES, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

// Selected works for homepage: Time Management first, then SMS Characters
// Dropdown Builder stays in works folder only
// Moved inside component to avoid hydration issues

export default function Home() {
  const prefersReducedMotion = useReducedMotion()
  
  // Find case studies inside component to avoid hydration issues
  const timeManagement = caseStudies?.find((cs) => cs.id === 'time-management')
  const smsCharacters = caseStudies?.find((cs) => cs.id === 'sms-characters')
  const selectedWorks = [timeManagement, smsCharacters].filter(
    (cs): cs is NonNullable<typeof cs> => cs !== undefined
  )

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW, ease: ANIMATION.EASING.EASE_OUT }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-4 leading-tight">
            Hi, I am Miguel Angelo.
          </h1>
          <p className="text-xl md:text-2xl text-text/70 max-w-2xl mb-8">
            Senior Product Designer with 10+ years building B2B platforms for localization, iGaming, and AI-powered systems. Designing for scale, across markets and cultures.
          </p>
          <Link href={ROUTES.WORK} className="btn-cta group">
            Explore my projects
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
          </Link>
        </motion.div>
      </section>

      {/* Selected Work Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? {} : "hidden"}
          whileInView={prefersReducedMotion ? {} : "visible"}
          viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-8">
            Selected Works
          </h2>
          <div className="space-y-8">
            {selectedWorks && selectedWorks.length > 0 ? (
              selectedWorks.map((work, index) => (
                <CaseStudyCard key={work.id} caseStudy={work} index={index} />
              ))
            ) : (
              <p className="text-text/70">No case studies available.</p>
            )}
          </div>
          <div className="mt-8">
            <Link href={ROUTES.WORK} className="btn-cta group">
              View all work
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
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Side Projects Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? {} : "hidden"}
          whileInView={prefersReducedMotion ? {} : "visible"}
          viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text">
              Projects
            </h2>
          </div>
          <p className="text-base text-text/70 mb-8 max-w-2xl">
            I am passionate about building products that solve everyday problems for people—it&apos;s what motivates me every day. Here are some of the recent apps I&apos;ve developed
          </p>
          <div className="space-y-8">
            {sideProjects && sideProjects.length > 0 ? (
              sideProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))
            ) : (
              <p className="text-text/70">No projects available.</p>
            )}
          </div>
          <div className="mt-8">
            <Link href={ROUTES.PROJECTS} className="btn-cta group">
              View all projects
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
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Thoughts & Words Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? {} : "hidden"}
          whileInView={prefersReducedMotion ? {} : "visible"}
          viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-8">
            Thoughts &amp; Words
          </h2>
          <div className="space-y-4">
            <article className="border border-text/10 rounded-xl px-5 py-4 cursor-pointer transition-colors hover:bg-text/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text mb-1">
                    Designing for Global Operations
                  </h3>
                  <p className="text-sm text-text/70">
                    Lessons from scaling products across three continents and operating across timezones.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wide text-text/50">
                  Soon
                </span>
              </div>
            </article>
            <article className="border border-text/10 rounded-xl px-5 py-4 cursor-pointer transition-colors hover:bg-text/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text mb-1">
                    AI Product Design Before and After the Hype
                  </h3>
                  <p className="text-sm text-text/70">
                    What seven years of working with AI products actually taught me about building for the real world.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wide text-text/50">
                  Soon
                </span>
              </div>
            </article>
          </div>
          <div className="mt-8">
            <Link href={ROUTES.ABOUT} className="btn-cta group">
              More about how I think
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
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
