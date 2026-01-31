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
import ImageWithLoader from '@/components/ImageWithLoader'
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
                <ImageWithLoader
                  src="/cv/MAF.jpg"
                  alt="Miguel Angelo - Product Designer"
                  fill
                  sizes="(max-width: 1024px) 0px, 40vw"
                  objectFit="cover"
                  className="img-grayscale"
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
                Systems Thinker. Pragmatic Builder.
              </h1>

              <div className="space-y-6 font-mono text-body text-text-secondary">
                <p>
                  Senior Product Designer with 10+ years in B2B platforms where failure is expensive: iGaming with real-time transactions and compliance requirements, AI systems in production since 2017, and localization infrastructure powering multi-market operations across Brazil, Latin America, and APAC.
                </p>
                <p>
                  I treat interfaces as the visible layer of deeper systems. I map dependencies, surface constraints early, and design for what the engineering team will actually inherit, not just what ships in the demo.
                </p>
                <p>
                  Based in Barcelona. Open to remote or hybrid for the right fit.
                </p>
              </div>
            </div>

            {/* Where I&apos;m Most Useful */}
            <div className="mb-12">
              <h2 className="inline-block font-mono text-label uppercase tracking-wide text-white bg-[#008FF0] px-4 py-2 rounded mb-6">
                Where I&apos;m Most Useful
              </h2>

              <div>
                <SkillSection
                  title="Legacy systems under pressure"
                  description="Tight capacity, accumulated drift, unclear ownership. I know how to audit what's actually shippable and sequence work that doesn't collapse under its own weight."
                />
                <SkillSection
                  title="AI products in production"
                  description="Not chatbots bolted onto existing features. Full systems: Fast Track AI earned industry recognition as the first natural-language CRM in iGaming. I&apos;ve been designing and shipping AI tools since before the current hype cycle."
                />
                <SkillSection
                  title="Multi-market complexity"
                  description="Localization isn&apos;t translation. I&apos;ve launched products across timezones, regulatory regimes, and cultural contexts, solving the infrastructure problems that make global operations actually work."
                />
              </div>
            </div>


          </div>
        </div>
      </section>
    </main>
  )
}
