'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-8 leading-tight">
            About
          </h1>

          <div className="space-y-6 text-base md:text-lg text-text/80 leading-relaxed">
            <p>
              I&apos;m a natural problem solver and endlessly curious—which is why I ended up in product design. I had
              to choose between engineering and arts early on. Design let me do both.
            </p>
            <p>
              I found my place in the tech industry, working with startups and enterprises where product work brings out
              the best in me. I started in graphic design but made my strongest contributions in design ops, product
              strategy, and systems thinking. I can code a bit and speak developer fluently, which helps.
            </p>
            <p>
              I&apos;ve been working with AI since 2017—before the hype cycle—and I keep getting certifications in
              domains I&apos;m actively working in. Not chasing trends, just staying sharp.
            </p>
            <p>
              My career has taken me across different countries and continents. Now I&apos;m relocating back to
              Southeast Asia, where I found the best fit between the industry I work in and the society I want to be
              part of.
            </p>
            <p>
              I&apos;m drawn to deep systems thinking, strategy, and philosophical discussions that bring people
              together. If that sounds like your environment, let&apos;s talk.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-6">What I do well</h2>

          <div className="space-y-6 text-base md:text-lg text-text/80 leading-relaxed">
            <p>
              <strong>Systems thinking &amp; strategy</strong> — I see how pieces connect and design for the whole
              system, not just the interface.
            </p>
            <p>
              <strong>AI integration</strong> — Designed and shipped AI-powered tools in production since 2017. Not
              theory—live products earning industry recognition.
            </p>
            <p>
              <strong>Design operations</strong> — I&apos;ve established design foundations at multiple companies,
              managing technical debt while shipping new features.
            </p>
            <p>
              <strong>Multi-market products</strong> — I&apos;ve launched products across Brazil, Latin America, and
              APAC, handling localization, timezones, and cultural complexity.
            </p>
            <p>
              <strong>Data-informed decisions</strong> — I use analytics to balance intuition with evidence.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-6">Currently</h2>
          <div className="space-y-6 text-base md:text-lg text-text/80 leading-relaxed">
            <p>
              Based in Barcelona, relocating to Southeast Asia—particularly Singapore. Open to opportunities in
              localization, iGaming, or B2B SaaS platforms.
            </p>
            <p className="space-x-3">
              <a
                href="mailto:hi@miguelangelo.tech"
                className="text-primary hover:underline text-base font-medium"
              >
                Email me
              </a>
              <span>•</span>
              <a
                href="https://www.linkedin.com/in/ferreiramiguelangelo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-base font-medium"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
