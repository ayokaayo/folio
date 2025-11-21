'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SideProject } from '@/lib/projects'
import CardImage from './CardImage'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface ProjectCardProps {
  project: SideProject
  index?: number
}

/**
 * ProjectCard - Displays a side project entry
 * 
 * Features:
 * - Fully clickable card with hover animations
 * - Supports real images or placeholders
 * - Responsive image sizing across all breakpoints
 * - Smooth hover effects on text and image
 */
export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const cardUrl = project.linkUrl || `#${project.id}`

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
      transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: index * ANIMATION.DELAY.STAGGER }}
      className="mb-12"
    >
      {/* Fully clickable card wrapper */}
      <Link 
        href={cardUrl}
        className="group block overflow-hidden rounded-2xl"
      >
        <motion.div 
          className="flex flex-col lg:flex-row gap-0 overflow-hidden rounded-2xl bg-background border-2 border-text/10 transition-all duration-300 group-hover:border-[#E8D5C4]"
          whileHover={prefersReducedMotion ? {} : { y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Left Section - Text Content */}
          <div 
            className="flex-1 bg-brand-card p-8 md:p-10 lg:p-12 transition-colors duration-300 group-hover:bg-brand-beige"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-text/60 font-medium">{project.hashtag}</span>
              <span className="text-sm text-text/60 font-medium">{project.year}</span>
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-text mb-4">
              {project.title}
            </h3>
            <p className="text-base md:text-lg text-text/80 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Right Section - Image Wrapper */}
          <div 
            className="flex-1 w-full lg:w-auto lg:min-w-[400px] lg:max-w-[800px] xl:max-w-[900px] bg-background flex items-stretch p-0 overflow-hidden"
          >
            <motion.div
              className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-full"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <CardImage
                imageUrl={project.imageUrl}
                imageAlt={project.imageAlt}
                title={project.title}
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
