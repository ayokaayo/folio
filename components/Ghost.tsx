import type { CSSProperties } from 'react'
import ExposedGrid from './ExposedGrid'
import MillimetricPaper from './MillimetricPaper'
import { HERO_COPY } from './hero/copy'

/**
 * Ghost loading: placeholders shaped like each page, shown by the route `loading.tsx` files while a
 * page loads. They use the real containers and card classes, so the real content lands exactly where
 * its ghost was, then settles in with the scroll reveal. Text ghosts sit inside elements carrying the
 * real type classes, so each bar takes the same line box as the text it stands in for.
 */

/** A bar the width of `ch` characters, inside a line of real type. */
function Line({ ch, style }: { ch: number; style?: CSSProperties }) {
  return <span className="ghost ghost-line" style={{ width: `${ch}ch`, ...style }} />
}

function Lines({ widths, className, style }: { widths: number[]; className: string; style?: CSSProperties }) {
  return (
    <p className={className} style={style}>
      {widths.map((w, i) => (
        <span key={i} className="block">
          <Line ch={w} style={{ maxWidth: '100%' }} />
        </span>
      ))}
    </p>
  )
}

/** Known text drawn as ghost bars: the words are transparent, so the bars wrap exactly as the page will. */
function Words({ children }: { children: string }) {
  return <span className="ghost ghost-words">{children}</span>
}

/** A tag: 24px high, whole cells wide. */
function Tag({ cells }: { cells: number }) {
  return <span className="ghost inline-block rounded" style={{ width: cells * 16, height: 24 }} />
}

/** Matches the /work and /projects headers; keep the copy in step with those pages. */
function PageHeader({ title, lines }: { title: string; lines: [string, string] }) {
  return (
    <section className="relative py-12 md:py-16" style={{ zIndex: 1 }}>
      <div className="lattice">
        <h1 className="font-mono font-medium text-headline">
          <Words>{title}</Words>
        </h1>
        <p className="font-mono text-body max-w-2xl mt-6">
          <Words>{lines[0]}</Words>
          <br />
          <Words>{lines[1]}</Words>
        </p>
      </div>
    </section>
  )
}

export function GhostCaseStudyCard() {
  return (
    <div className="figma-frame relative">
      <div className="flex flex-col lg:flex-row bg-bg-surface overflow-hidden border border-border-subtle case-study-card-article" style={{ gap: 16 }}>
        <div className="case-study-meta-col -ml-px p-4">
          <div className="mb-3">
            <Tag cells={8} />
          </div>
          <h3 className="font-mono font-medium text-title-lg mb-2">
            <Line ch={10} />
          </h3>
          <p className="font-mono text-caption mb-3">
            <Line ch={20} />
          </p>
          <Lines widths={[36, 38, 30]} className="font-mono text-body" style={{ lineHeight: 1.5 }} />
        </div>
        <div className="case-study-visual-col lg:flex-1">
          <div className="ghost" />
        </div>
      </div>
    </div>
  )
}

export function GhostProjectCard() {
  return (
    <div className="figma-frame relative">
      <div className="bg-bg-surface overflow-hidden border border-border-subtle project-card-article">
        <div className="project-card-image flex-shrink-0">
          <div className="ghost" />
        </div>
        <div className="project-card-content flex flex-col flex-grow">
          <div className="flex items-center gap-4 mb-4">
            <Tag cells={5} />
            <Tag cells={4} />
          </div>
          <h3 className="font-mono font-medium text-title-md mb-3">
            <Line ch={8} />
          </h3>
          <Lines widths={[44, 40]} className="font-mono text-body" style={{ lineHeight: 1.5 }} />
        </div>
      </div>
    </div>
  )
}

function FixedColumns() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <ExposedGrid showColumns showGaps opacity={0.3} showLabels={false} position="fixed" interactive={false} />
    </div>
  )
}

export function GhostHome() {
  return (
    <main id="main-content" className="pt-20" aria-busy="true">
      <section className="relative" style={{ minHeight: 'clamp(560px, 74vh, 780px)' }}>
        <div className="pt-16 pb-16 md:pt-24 md:pb-24">
          <div className="lattice">
            <div className="w-full lg:w-[round(calc((100%-11*16px)/12*8+7*16px),1px)] lg:[container-type:inline-size]">
              <h1 className="font-mono font-medium text-headline lg:text-[length:min(48px,calc(100cqw/16.4))]">
                {HERO_COPY.headline.map((line, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <>
                        {' '}
                        <br />
                      </>
                    )}
                    <span className={i === 0 ? 'lg:whitespace-nowrap' : 'font-light'}><Words>{line}</Words></span>
                  </span>
                ))}
              </h1>
              <p className="font-mono text-subhead mt-6">
                <Words>{HERO_COPY.subhead.join(' ')}</Words>
              </p>
              <div className="mt-12">
                <span className="ghost cta-2col inline-block rounded" style={{ height: 40 }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative" style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="absolute inset-0">
          <MillimetricPaper opacity={0.5} zIndex={0} />
        </div>
        <div className="relative z-10 lattice" style={{ height: 32, marginBottom: 48 }}>
          <span className="ghost inline-block rounded" style={{ width: 128, height: 32 }} />
        </div>
        <div className="relative z-10 lattice flex flex-col md:flex-row" style={{ gap: 16 }}>
          <div style={{ flex: '1 1 0%' }}><GhostProjectCard /></div>
          <div style={{ flex: '1 1 0%' }}><GhostProjectCard /></div>
        </div>
      </section>
    </main>
  )
}

export function GhostWork() {
  return (
    <main id="main-content" className="pt-20 relative min-h-screen" aria-busy="true">
      <FixedColumns />
      <PageHeader
        title="Case Studies"
        lines={['Deep dives into high-stakes product design.', 'Systems thinking, technical constraints, and measurable outcomes.']}
      />
      <section className="relative lattice pb-24" style={{ zIndex: 1 }}>
        <div className="flex flex-col" style={{ gap: 32 }}>
          <GhostCaseStudyCard />
          <GhostCaseStudyCard />
          <GhostCaseStudyCard />
        </div>
      </section>
    </main>
  )
}

export function GhostProjects() {
  return (
    <main id="main-content" className="pt-20 relative min-h-screen" aria-busy="true">
      <FixedColumns />
      <PageHeader
        title="Projects"
        lines={['Things I build when the constraints are my own.', 'Smaller products, faster cycles, full creative control.']}
      />
      <section className="relative lattice pb-24" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <GhostProjectCard key={i} />
          ))}
        </div>
      </section>
    </main>
  )
}

export function GhostAbout() {
  return (
    <main id="main-content" className="pt-20 relative min-h-screen" aria-busy="true">
      <FixedColumns />
      <section className="relative lattice py-12 md:py-16 pb-24" style={{ zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row" style={{ gap: 16 }}>
          <div className="hidden lg:block w-full lg:w-[calc((100%-11*16px)/12*4+3*16px)] lg:shrink-0">
            <div className="ghost aspect-square" />
          </div>
          <div className="flex-1 min-w-0 mt-12 lg:mt-0">
            <h1 className="font-mono font-medium text-headline mb-8">
              <Words>Intelligent Systems Designer.</Words> <br />
              <Words>Pragmatic Builder.</Words>
            </h1>
            <div className="space-y-6">
              <Lines widths={[70, 72, 50]} className="font-mono text-body" />
              <Lines widths={[72, 70, 68, 30]} className="font-mono text-body" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/** Case study and project detail pages. */
export function GhostArticle() {
  return (
    <main id="main-content" className="pt-20 md:pt-24" aria-busy="true">
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12">
        <div className="mb-8 h-5" />
        <p className="mb-6 text-sm">
          <Line ch={22} />
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
          <Line ch={9} />
        </h1>
        <Lines widths={[60, 52]} className="text-lg md:text-xl leading-relaxed mb-6" />
        <div className="mt-10 mb-6 ghost aspect-video" />
      </section>
    </main>
  )
}
