'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { copyEmailToClipboard } from '@/lib/utils/email'

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    const success = await copyEmailToClipboard()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12">
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
              I&apos;m a Senior Product Designer with 10+ years building B2B platforms. I&apos;ve worked
              across startups and enterprises, from founding designer roles to leading design on products serving globally.
            </p>
            <p>
              My path started in graphic design but I&apos;ve grown into design ops, product
              strategy, and systems thinking. I code and speak dev fluently, which changes how I collaborate with engineering.
            </p>
            <p>
              I tend to stay long at companies despite moving countries frequently. Unbabel (ML-powered localization),
              Presslabs (founding designer), and now Fast Track AI, where I&apos;ve spent the last four years designing
              an iGaming CRM through 15× revenue growth and multiple industry awards.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: VIEWPORT.ONCE }}
              transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: 0 }}
              className="p-6 rounded-lg border border-text/10 bg-brand-green"
            >
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-text/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-text">Systems thinking &amp; strategy</h3>
              </div>
              <p className="text-base text-text/80 leading-relaxed">
                I design for the whole system, not just the screen in front of me. My work on design foundations has reduced technical debt while shipping new features in parallel.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: VIEWPORT.ONCE }}
              transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: 0.1 }}
              className="p-6 rounded-lg border border-text/10 bg-brand-green"
            >
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-text/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 110 4 2 2 0 010-4zM5 15a2 2 0 110 4 2 2 0 010-4zM5 5v14M19 5a2 2 0 110 4 2 2 0 010-4zM19 15a2 2 0 110 4 2 2 0 010-4zM19 5v14M12 12h-2M12 12h2" />
                </svg>
                <h3 className="text-lg font-semibold text-text">Untangling debt</h3>
              </div>
              <p className="text-base text-text/80 leading-relaxed">
                I&apos;ve become very familiar with systems deep in design and technical debt. Fast deliveries, tight capacity, scope drift, legacy constraints. I know how to assess what&apos;s actually possible and ship anyway.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: VIEWPORT.ONCE }}
              transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: 0.2 }}
              className="p-6 rounded-lg border border-text/10 bg-brand-green"
            >
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-text/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold text-text">AI-powered products</h3>
              </div>
              <p className="text-base text-text/80 leading-relaxed">
                I&apos;ve designed and shipped AI tools in production since 2017, before the current hype cycle. Not theory. Live products earning industry recognition.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: VIEWPORT.ONCE }}
              transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: 0.3 }}
              className="p-6 rounded-lg border border-text/10 bg-brand-green"
            >
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-text/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-text">Multi-market platforms</h3>
              </div>
              <p className="text-base text-text/80 leading-relaxed">
                I&apos;ve launched products across Brazil, Latin America, and APAC. Localization, timezone complexity, and cultural adaptation are things I&apos;ve solved, not things I&apos;ve read about.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: VIEWPORT.ONCE }}
              transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: 0.4 }}
              className="p-6 rounded-lg border border-text/10 bg-brand-green"
            >
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-text/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="text-lg font-semibold text-text">Enterprise-grade design</h3>
              </div>
              <p className="text-base text-text/80 leading-relaxed">
                I work on platforms where mistakes cost real money. Complex data, global operations, tight tolerances. Precision matters.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: VIEWPORT.ONCE }}
              transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: 0.5 }}
              className="p-6 rounded-lg border border-text/10 bg-brand-green"
            >
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-text/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-text">Cross-functional leadership</h3>
              </div>
              <p className="text-base text-text/80 leading-relaxed">
                I act as the UI quality gate for our back-office product. Leadership asked me to run design review sessions for PMs, QA, and engineers.
              </p>
            </motion.div>
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
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-text/10 bg-brand-lilac">
              <p className="text-base md:text-lg text-text/80 leading-relaxed mb-4">
                Based in Barcelona, open to remote positions. Relocating to Southeast Asia is on the horizon for
                the right opportunity.
              </p>
              <p className="text-base md:text-lg text-text/80 leading-relaxed">
                Looking for Senior Product Design roles in localization, iGaming, or B2B SaaS.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-text/10 bg-background hover:bg-text/5 hover:border-text/20 transition-colors duration-200 text-base font-medium text-text"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Copy email
                  </>
                )}
              </button>
              <a
                href="https://www.linkedin.com/in/ferreiramiguelangelo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-text/10 bg-background hover:bg-text/5 hover:border-text/20 transition-colors duration-200 text-base font-medium text-text"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
