'use client'

import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/lib/projects'
import { ANIMATION } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export default function ProjectsPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Side projects
          </h1>
          <p className="text-lg md:text-xl text-text/70 max-w-2xl mb-8">
            I am passionate about building products that solve everyday problems for people—it&apos;s what motivates me every day. Here are some of the recent apps I&apos;ve developed
          </p>
        </motion.div>
      </section>

      {/* Projects List */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
