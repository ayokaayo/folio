'use client'

/**
 * About Page — MONO EDITION
 * 
 * - Layout: Split screen (40% image / 60% content)
 * - All typography: IBM Plex Mono
 * - Accent: Forest green
 * - Portrait: B&W with subtle tint
 */

import { useState } from 'react'
import { copyEmailToClipboard } from '@/lib/utils/email'
import { SITE } from '@/lib/constants'

interface SkillSectionProps {
  title: string
  description: string
}

function SkillSection({ title, description }: SkillSectionProps) {
  return (
    <div className="py-6 border-b border-border-subtle last:border-b-0">
      <h3 className="font-mono font-medium text-text-primary text-title-sm mb-3">
        {title}
      </h3>
      <p className="font-mono text-body text-text-secondary mb-4">
        {description}
      </p>
      {/* Decorative forest green line */}
      <div 
        className="h-px w-16"
        style={{ backgroundColor: 'var(--accent)' }}
      />
    </div>
  )
}

export default function AboutPage() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    const success = await copyEmailToClipboard()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main id="main-content" className="pt-20">
      {/* Header */}
      <section className="max-w-content mx-auto px-6 sm:px-[5vw] py-12 md:py-16">
        <div className="grid grid-cols-12 gap-[2vw] items-end pb-4 border-b border-border-subtle mb-8">
          <div className="col-span-8">
            <span className="font-mono text-label uppercase tracking-wide text-text-secondary">
              About
            </span>
          </div>
          <div className="col-span-4 text-right">
            <span className="font-mono text-caption text-text-tertiary">
              001
            </span>
          </div>
        </div>
      </section>

      {/* Main Content - Split Layout */}
      <section className="max-w-content mx-auto px-6 sm:px-[5vw] pb-24">
        <div className="grid grid-cols-12 gap-[2vw]">
          {/* Left Column - Image (cols 1-5) */}
          <div className="col-span-12 lg:col-span-5">
            <div 
              className="relative aspect-[3/4] overflow-hidden"
              style={{ border: '5px solid var(--bg-grid)' }}
            >
              {/* Portrait with B&W + tint treatment */}
              <img
                src="/cv/1732891002696.jpeg"
                alt="Miguel Angelo - Product Designer"
                className="w-full h-full object-cover grayscale"
              />
              {/* Forest green tint overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{ backgroundColor: 'rgba(45, 90, 76, 0.08)' }}
              />
              {/* Grain overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          </div>

          {/* Right Column - Content (cols 7-12) */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-12 lg:mt-0">
            {/* Introduction */}
            <div className="mb-12">
              <h1 className="font-mono font-medium text-text-primary text-headline mb-8">
                Systems thinker, pragmatic builder.
              </h1>
              
              <div className="space-y-6 font-mono text-body text-text-secondary">
                <p>
                  I&apos;m a Senior Product Designer with 10+ years building B2B platforms for 
                  high-stakes operations. My work spans iGaming, AI systems, and localization — 
                  industries where technical complexity meets real business constraints.
                </p>
                <p>
                  I approach design as systems thinking: the interface is just the visible part 
                  of an interconnected whole. I map relationships, visualize constraints, and 
                  build for maintainability, not just shipping.
                </p>
                <p>
                  Currently based in Barcelona. Relocating to Southeast Asia Q3 2026, flexible 
                  for the right opportunity.
                </p>
              </div>
            </div>

            {/* What I Do Well */}
            <div className="mb-12">
              <h2 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-6">
                What I Do Well
              </h2>
              
              <div className="divide-y divide-border-subtle">
                <SkillSection
                  title="Systems Thinking & Strategy"
                  description="Design for the whole system, not just the screen. Reduced technical debt while shipping parallel features through platform thinking."
                />
                <SkillSection
                  title="Untangling Debt"
                  description="Legacy systems, tight capacity, scope drift. I know how to assess what's actually possible and ship anyway."
                />
                <SkillSection
                  title="AI-Powered Products"
                  description="Designed and shipped AI tools in production since 2017, before the current hype cycle. Live products earning industry recognition."
                />
                <SkillSection
                  title="Multi-Market Platforms"
                  description="Launched products across Brazil, Latin America, and APAC. Solved localization, timezone complexity, and cultural adaptation."
                />
              </div>
            </div>

            {/* Current Status */}
            <div
              className="p-8 mb-12"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              <h2 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-6">
                Current Status
              </h2>
              <div className="space-y-3 font-mono text-body">
                <div className="flex gap-4">
                  <span className="text-text-tertiary w-20">Based:</span>
                  <span className="text-text-primary">Barcelona</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-text-tertiary w-20">Open:</span>
                  <span className="text-text-primary">Remote, Senior Product Design</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-text-tertiary w-20">Sectors:</span>
                  <span className="text-text-primary">Localization, iGaming, B2B SaaS, AI</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
                Contact
              </h2>
              <div className="flex items-center gap-4">
                <span className="font-mono text-body text-text-primary">
                  {SITE.EMAIL}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="font-mono text-caption uppercase tracking-wide text-text-tertiary hover:text-accent transition-colors duration-150"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <a
                href={SITE.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 font-mono text-body text-text-primary hover:text-accent transition-colors duration-150"
              >
                LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
