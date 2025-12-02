'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/lib/projects'
import { ANIMATION } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export default function ProjectsPage() {
  const prefersReducedMotion = useReducedMotion()

  // Ensure stable order: norma, exotica-radio, codex-tarot
  const orderedProjects = useMemo(() => {
    const order = ['norma', 'exotica-radio', 'codex-tarot']
    return order
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
  }, [])

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Side projects
          </h1>
          <p className="text-lg md:text-xl text-text/70 max-w-2xl mb-8">
          Things I build when the constraints are my own.<br />
          Smaller products, faster cycles, full creative control.
          </p>
        </motion.div>
      </section>

      {/* Projects List */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <div className="space-y-8">
          {orderedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* Behance CTA */}
        <div className="mt-14 pt-4">
          <a
            href="https://www.behance.net/miguelangeloferreira"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta group"
          >
            View earlier work on Behance
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
        </div>
      </section>
    </main>
  )
}
