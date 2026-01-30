'use client'

/**
 * About Page — MONO EDITION
 *
 * - Layout: Split screen (40% image / 60% content)
 * - All typography: IBM Plex Mono
 * - Accent: Forest green
 * - Grid visible from bottom extending upward
 */

import ExposedGrid, { GRID_GAP } from '@/components/ExposedGrid'
import FigmaFrame from '@/components/FigmaFrame'

interface SkillSectionProps {
  title: string
  description: string
}

function SkillSection({ title, description }: SkillSectionProps) {
  return (
    <div className="py-6">
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
  return (
    <main id="main-content" className="pt-20 relative min-h-screen">
      {/* Grid visible from bottom - full height, behind content */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ExposedGrid showColumns showGaps opacity={0.3} showLabels={false} position="fixed" />
      </div>

      {/* Main Content - Split Layout */}
      <section
        className="relative max-w-content mx-auto py-12 md:py-16 pb-24"
        style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px`, zIndex: 1 }}
      >
        {/* Split layout: 4 cols image, gap, remaining cols content */}
        <div
          className="flex flex-col lg:flex-row"
          style={{ gap: `${GRID_GAP}px` }}
        >
          {/* Left Column - Image: visible only on desktop (12 cols), hidden on tablet (6) and mobile (4) */}
          <div className="hidden lg:block w-full lg:w-[calc((100%-11*16px)/12*4+3*16px)] lg:shrink-0">
            <FigmaFrame
              label="That's me"
              alwaysVisible
              pillText="Hi, I'm Miguel. Pleased to meet you!"
            >
              <div className="group relative aspect-square overflow-hidden bg-bg-grid">
                {/* Portrait: B&W by default, full colour on hover */}
                <img
                  src="/cv/MAF.jpg"
                  alt="Miguel Angelo - Product Designer"
                  className="w-full h-full object-cover object-center img-grayscale"
                />
                {/* Accent tint overlay */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay"
                  style={{ backgroundColor: 'rgba(0, 143, 240, 0.08)' }}
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
            </FigmaFrame>
          </div>

          {/* Right Column - Content (gap + remaining columns) */}
          <div className="flex-1 mt-12 lg:mt-0">
            {/* Introduction */}
            <div className="mb-12">
              <h1 className="font-mono font-medium text-text-primary text-headline mb-8">
                Systems Thinker,<br />
                Pragmatic Builder.
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

              <div>
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
                  <span className="text-text-tertiary w-20 uppercase">Based:</span>
                  <span className="text-text-primary">Barcelona</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-text-tertiary w-20 uppercase">Open:</span>
                  <span className="text-text-primary">Remote, Senior Product Design</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-text-tertiary w-20 uppercase">Sectors:</span>
                  <span className="text-text-primary">Localization, iGaming, B2B SaaS, AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
