'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { HERO_COPY, type HeroCopy } from './copy'
import { HERO_SETTINGS, type HeroValues } from './settings'
import { INK, sheetColor } from './palettes'

/**
 * Home hero. The copy is plain server-rendered HTML (first paint, SEO, selectable); the
 * moiré field (three.js) loads afterwards as its own chunk and draws behind it.
 */
const HeroField = dynamic(() => import('./field/HeroField'), { ssr: false })

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

interface HeroSectionProps {
  copy?: HeroCopy
  /** Tuning; defaults to the approved settings. The dev-only lab passes its own. */
  values?: HeroValues
  /** Forces reduced motion (lab); otherwise follows the OS setting. */
  reducedMotion?: boolean
}

export default function HeroSection({ copy = HERO_COPY, values = HERO_SETTINGS, reducedMotion }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const osReduced = usePrefersReducedMotion()
  const paper = String(values.paper)
  const halo = Number(values.halo)
  const hc = sheetColor(values)
  // Cartographic halo: a thin ring of paper around each glyph keeps type legible over line work.
  const textShadow =
    halo > 0 ? `0 0 ${halo * 0.25}px ${hc}, 0 0 ${halo * 0.5}px ${hc}, 0 0 ${halo}px ${hc}, 0 0 ${halo * 2}px ${hc}` : undefined
  const headColor = INK[String(values.headInk)]
  const subColor = INK[String(values.subInk)]
  const subWeight = Boolean(values.subWeight)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: paper, touchAction: 'pan-y pinch-zoom', minHeight: 'clamp(560px, 74vh, 780px)' }}
    >
      <HeroField sectionRef={sectionRef} copyRef={copyRef} values={values} reducedMotion={reducedMotion ?? osReduced} />
      <div className="relative z-10 pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="lattice">
          <div ref={copyRef} className="w-full lg:w-[round(calc((100%-11*16px)/12*8+7*16px),1px)] lg:[container-type:inline-size]" style={{ textShadow }}>
            {/* From lg the title line doesn't wrap, so the size follows the 8-column width (which steps with the lattice)
                rather than the viewport: the title line, 29 monospace characters at 0.575em each, always fits. */}
            <h1
              data-line="head"
              className="font-mono font-medium text-text-primary text-headline lg:text-[length:min(48px,calc(100cqw/16.9))]"
              style={{ color: headColor }}
            >
              {copy.headline.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <>
                      {' '}
                      <br className="hidden md:block" />
                    </>
                  )}
                  {/* The title line holds on large screens (the size above is fitted to it); later lines wrap. */}
                  <span className={i === 0 ? 'lg:whitespace-nowrap' : undefined}>{line}</span>
                </Fragment>
              ))}
            </h1>
            <p data-line="sub" className={`font-mono text-subhead text-text-secondary mt-6 ${subWeight ? 'font-medium' : ''}`} style={{ color: subColor }}>
              {copy.subhead.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <>
                      {' '}
                      <br className="hidden md:block" />
                    </>
                  )}
                  {line}
                </Fragment>
              ))}
            </p>
            <div className="mt-12">
              <Link
                href={copy.cta.href}
                className="btn-primary hero-cta inline-flex justify-between cta-2col"
                style={{ textShadow: 'none' }}
              >
                <span className="font-mono text-label uppercase tracking-wide">{copy.cta.label}</span>
                <svg className="hero-cta-arrow w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

