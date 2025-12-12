'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { fetchGitHubReadme } from '@/lib/utils/github'
import MobilePhoneMockup from '@/components/MobilePhoneMockup'

export default function KallaxPage() {
  const prefersReducedMotion = useReducedMotion()
  const [readmeContent, setReadmeContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReadme = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const content = await fetchGitHubReadme('ayokaayo', 'kallax')
        setReadmeContent(content)
      } catch (err) {
        setError('Failed to load README content')
        console.error('Error loading README:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadReadme()
  }, [])

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-8 leading-tight">
            Kallax
          </h1>

          <div className="space-y-6 text-base md:text-lg text-text/80 leading-relaxed mb-12">
            <p>
              Your vinyl DJ companion.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mobile Mockup Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <MobilePhoneMockup>
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text mx-auto mb-4"></div>
                  <p className="text-text/60">Loading README...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-text/60">{error}</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-serif font-bold text-text mb-4 mt-6 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-serif font-bold text-text mb-3 mt-5">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-serif font-semibold text-text mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-base text-text/80 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 text-text/80 space-y-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 text-text/80 space-y-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-base text-text/80 leading-relaxed">
                        {children}
                      </li>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text underline hover:text-text/70 transition-colors duration-200"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className="bg-text/5 px-1.5 py-0.5 rounded text-sm font-mono text-text/90">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-text/5 p-4 rounded-lg overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {readmeContent}
                </ReactMarkdown>
              </div>
            )}
          </MobilePhoneMockup>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <p className="text-base md:text-lg text-text/80">
            BPM info, powered by{' '}
            <a
              href="https://getsongbpm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-text/70 underline transition-colors duration-200"
            >
              GetSongBPM
            </a>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
