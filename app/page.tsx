'use client'

// Home page - Miguel Angelo's portfolio landing
// Every pixel here was crafted with intention. Welcome! 👋
import { motion } from 'framer-motion'
import Link from 'next/link'
import CaseStudyCard from '@/components/CaseStudyCard'
import ProjectCard from '@/components/ProjectCard'
import ArticleCard from '@/components/ArticleCard'
import { caseStudies } from '@/lib/caseStudies'
import { sideProjects } from '@/lib/projects'
import { popularArticles } from '@/lib/articles'
import { ANIMATION, ROUTES, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

// Selected works (first 2) - showcasing the most impactful projects
const selectedWorks = caseStudies.slice(0, 2)

export default function Home() {
  const prefersReducedMotion = useReducedMotion()

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
            Hi. I am Miguel Angelo.
          </h1>
          <p className="text-lg md:text-xl text-text/70 max-w-2xl mb-8">
          A Senior Product Designer with 10+ years building complex B2B systems for high-stakes industries. Specialized in AI/ML integration, multi-market platforms, and design at scale.
          </p>
          <Link
            href={ROUTES.WORK}
            className="text-primary hover:underline text-base font-medium inline-flex items-center gap-2"
          >
            Explore my projects
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
            {selectedWorks.map((work, index) => (
              <CaseStudyCard key={work.id} caseStudy={work} index={index} />
            ))}
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
          <Link
            href={ROUTES.PROJECTS}
              className="text-text/70 hover:text-primary transition-colors text-sm font-medium"
            >
              Explore more apps
            </Link>
          </div>
          <p className="text-base text-text/70 mb-8 max-w-2xl">
            I am passionate about building products that solve everyday problems for people—it&apos;s what motivates me every day. Here are some of the recent apps I&apos;ve developed
          </p>
          <div className="space-y-8">
            {sideProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Popular Articles Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? {} : "hidden"}
          whileInView={prefersReducedMotion ? {} : "visible"}
          viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-8">
            Popular articles
          </h2>
          <p className="text-sm text-text/60 mb-8">
            Lately, I&apos;ve been writing to share my thoughts on product design and growth.
          </p>
          <div className="space-y-6">
            {popularArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Intro Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
          transition={{ duration: ANIMATION.DURATION.SLOW }}
          className="max-w-4xl"
        >
          <p className="text-lg md:text-xl text-text/80 leading-relaxed mb-6">
            I enjoy designing for growth or any products that make the world a bit better.
          </p>
          <p className="text-base md:text-lg text-text/70 leading-relaxed mb-6">
            Designers are problem solvers at heart—I truly believe that by leveraging our skills, we can make the world a better place.
          </p>
          <p className="text-base md:text-lg text-text/70 leading-relaxed mb-8">
            My goal is to contribute to these ideals in any way I can. If you feel the same, I&apos;d love to talk.
          </p>
          <p className="text-base md:text-lg text-text/70 leading-relaxed">
            Below are a few Q&As to help you determine if I am the right fit.
          </p>
          <Link
            href={ROUTES.ABOUT}
            className="text-primary hover:underline text-base font-medium inline-flex items-center gap-2 mt-6"
          >
            Learn more about me
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
