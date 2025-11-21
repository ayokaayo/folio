'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <main id="main-content" className="pt-20 md:pt-24">
      {/* Hero Section - Personal Story */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text mb-8 leading-tight">
            Being a designer was a dream I had to fight for
          </h1>
          <div className="space-y-6 text-base md:text-lg text-text/80 leading-relaxed">
            <p>
              I grew up with a passion for creating and solving problems through design. While I earned a degree in Arts & Design, I soon realized that my true calling was in designing better products that could improve people&apos;s lives and drive business growth.
            </p>
            <p>
              I started my journey as a designer through hands-on experience, taking on projects that challenged me to think strategically about user needs and business outcomes. Over time, I found my place as a designer in B2B SaaS companies, where I played a key role in scaling products and establishing design foundations, including Unbabel (2017-2021) and Fast Track AI (2021-Present).
            </p>
            <p>
              I believe that great design is a result of collaboration and a series of experimentation. Thus, in my design I incorporate workshops and leverage my experience in data analysis to make data-informed decisions that balance user needs with business goals.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="/Miguel_Ferreira_Resume_v2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-base font-medium"
              >
                Download resume
              </a>
              <a
                href="https://linkedin.com/in/ferreiramiguelangelo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-base font-medium"
              >
                Linkedin profile
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Education Section */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-8">Education</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-text mb-1">Bachelor, Arts & Design</h3>
              <p className="text-base text-text/70">Instituto Politécnico de Bragança, Portugal</p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-text mb-1">Introduction to Generative AI</h3>
              <p className="text-base text-text/70">Google (2023)</p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-text mb-1">Information Security Management (ISO 27001)</h3>
              <p className="text-base text-text/70">2019</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* My Journey Section */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-8">My journey</h2>
          <div className="space-y-8">
            <div>
              <div className="flex items-start gap-4 mb-2">
                <span className="text-2xl font-serif font-bold text-text">24 ~</span>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-text mb-1">Fast Track AI</h3>
                  <p className="text-base text-text/70 mb-2">Senior Product Designer</p>
                  <p className="text-sm text-text/60">
                    I joined as a Product Designer and scaled design through 15× revenue growth (€2M → €30M), was later put in charge of designing AI features and localization tools, contributing to multiple industry awards including MiGEA 2024, SBC 2024, and AIBC 2024.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-4 mb-2">
                <span className="text-2xl font-serif font-bold text-text">21-24</span>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-text mb-1">Unbabel / Lingo24</h3>
                  <p className="text-base text-text/70 mb-2">Design Project Coordinator</p>
                  <p className="text-sm text-text/60">
                    I joined the company and built ML-driven localization pipelines for Fortune 500 clients, establishing design operations and quality frameworks across 3 continents, contributing to $2M+ annual project value.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-4 mb-2">
                <span className="text-2xl font-serif font-bold text-text">12-17</span>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-text mb-1">Presslabs</h3>
                  <p className="text-base text-text/70 mb-2">Senior Graphic Designer</p>
                  <p className="text-sm text-text/60">
                    I had the chance to design and build products from 0 to 1 as the first in-house designer, establishing brand identity, design system, and core product UI from scratch for an early-stage startup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What Miguel is good at */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-4">What Miguel is good at</h2>
          <p className="text-base text-text/70 mb-12">Not sure what I can help you with? Well... here are a few things</p>
          
          <div className="space-y-12">
            <div>
              <div className="flex items-start gap-4 mb-3">
                <span className="text-2xl font-serif font-bold text-text">01</span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-text mb-3">Data-Informed Design</h3>
                  <p className="text-base text-text/70 leading-relaxed">
                    Being a designer with experience in data analysis, I always advocate for data-informed design and use analytics tools like Amplitude and Hotjar to gather quantitative data that informs design decisions.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-3">
                <span className="text-2xl font-serif font-bold text-text">02</span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-text mb-3">Workshop facilitation</h3>
                  <p className="text-base text-text/70 leading-relaxed">
                    I believe workshops are an amazing way for teams to sit together, share ideas, explore solutions, and get to know each other better. I enjoy facilitating workshops with my team to solve problems and propose solutions together.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-3">
                <span className="text-2xl font-serif font-bold text-text">03</span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-text mb-3">AI design</h3>
                  <p className="text-base text-text/70 leading-relaxed">
                    I&apos;ve designed and shipped AI-powered content generation tools in production, enabling operators to automate player communications at scale. This work earned AIBC and MiGEA innovation awards in 2024.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-3">
                <span className="text-2xl font-serif font-bold text-text">04</span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-text mb-3">DesignOps</h3>
                  <p className="text-base text-text/70 leading-relaxed">
                    I&apos;ve established design foundations at multiple companies. At Fast Track AI, I rebuilt critical product flows and design system components while managing extensive technical debt, modernizing UI across CRM modules.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-3">
                <span className="text-2xl font-serif font-bold text-text">05</span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-text mb-3">Product-led Growth</h3>
                  <p className="text-base text-text/70 leading-relaxed">
                    I am deeply passionate about PLG and its pivotal role in bridging business strategy with user experience. My focus is on leveraging design to drive business outcomes, as demonstrated by scaling Fast Track AI through 15× revenue growth while maintaining NPS 90+.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-3">
                <span className="text-2xl font-serif font-bold text-text">06</span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-text mb-3">Scaling products</h3>
                  <p className="text-base text-text/70 leading-relaxed">
                    Over the past 10+ years, I have scaled B2B SaaS products from early stage to enterprise, leading design through significant growth phases. My experience includes managing design systems under technical debt and balancing strategic vision with execution constraints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What Miguel does outside of work */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-8">What Miguel does outside of work?</h2>
          <div className="space-y-6 text-base md:text-lg text-text/80 leading-relaxed">
            <p>
              <strong>I am — a problem solver.</strong><br />
              I enjoy tackling complex challenges and finding elegant solutions, whether in design, product strategy, or everyday life. This mindset drives my passion for building products that genuinely improve people&apos;s lives.
            </p>
            <p>
              <strong>I am — also a continuous learner.</strong><br />
              I believe in staying curious and constantly expanding my skills. This is why I&apos;ve pursued certifications in AI, information security, and continuously explore new design methodologies and tools to stay at the forefront of product design.
            </p>
          </div>
        </motion.div>
      </section>

      {/* How's it like to work with Miguel */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-8">How&apos;s it like to work with Miguel?</h2>
          <p className="text-base md:text-lg text-text/80 leading-relaxed mb-6">
            I don&apos;t just want to be your colleague — but your partner in creating great products. No matter what happens at work, human connection is what drives meaningful collaboration.
          </p>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 border-t border-text/10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.SLOW }}
        >
          <p className="text-lg md:text-xl text-text/80 leading-relaxed mb-6">
            I enjoy designing for growth or any products that make the world a bit better.
          </p>
          <p className="text-base md:text-lg text-text/70 leading-relaxed mb-6">
            Designers are problem solvers at heart—I truly believe that by leveraging our skills, we can make the world a better place.
          </p>
          <p className="text-base md:text-lg text-text/70 leading-relaxed mb-8">
            My goal is to contribute to these ideals in any way I can.<br />
            If you feel the same, I&apos;d love to talk.
          </p>
          <a
            href="mailto:hi@miguelangelo.tech"
            className="text-primary hover:underline text-base font-medium inline-flex items-center gap-2"
          >
            Drop me an email
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
          </a>
        </motion.div>
      </section>
    </main>
  )
}
