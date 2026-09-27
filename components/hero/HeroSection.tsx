'use client'

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import GridCta from '../GridCta'
import { SHAPE_PAD, STRETCH_MAX, fitShape, measureShape, type ShapeFit } from './field/shape'
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
  /**
   * Text the glyph field draws as dense heavy marks (the not-found pages pass "404"): right of the copy
   * from lg, below it on smaller screens. Absent on the home hero, which then renders exactly as before.
   */
  shape?: string
}

/**
 * Where the shape goes. The engine reads the visible box's rectangle (and data-align) to fit the text; the
 * same text sits inside as plain type, shown until the field has drawn the glyph version, and for good
 * when there is no field (no WebGL, a lost context, or no script). Once script runs, the plain type is set
 * with the engine's own fit (field/shape.ts), so the crossfade doesn't jump; before that, CSS approximates it.
 */
function ShapeBox({ text, align, className, color, hidden, reduced }: {
  text: string
  align: 'start' | 'center'
  className: string
  color: string | undefined
  hidden: boolean
  reduced: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<{ f: ShapeFit; w: number; h: number } | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let alive = true
    const measure = () => {
      if (!alive) return
      const b = el.getBoundingClientRect()
      const w = Math.round(b.width)
      const h = Math.round(b.height)
      const m = w >= SHAPE_PAD && h >= SHAPE_PAD ? measureShape(text, getComputedStyle(document.body).fontFamily) : null
      setFit(m ? { f: fitShape(m, w, h, align), w, h } : null)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    // Metrics taken before the mono loads belong to the fallback face.
    document.fonts.ready.then(measure)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [text, align])
  const fade = { color, opacity: hidden ? 0 : 0.9, transition: reduced ? 'none' : 'opacity 450ms ease-out' }
  return (
    <div
      ref={ref}
      data-shape-box
      data-align={align}
      aria-hidden
      className={`relative [container-type:size] flex items-center ${align === 'center' ? 'justify-center' : ''} ${className}`}
    >
      {fit ? (
        <svg className="absolute inset-0 select-none" width={fit.w} height={fit.h} style={fade}>
          <text
            x={fit.f.x}
            y={fit.f.y}
            transform={`scale(1 ${fit.f.sy})`}
            fontSize={fit.f.size}
            fontWeight={500}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={fit.f.lw}
            strokeLinejoin="round"
          >
            {text}
          </text>
        </svg>
      ) : (
        <span
          className="font-mono font-medium leading-none select-none"
          style={{
            // Three monospace digits are about 1.8em wide and their figures 0.7em tall, stretched as the glyphs are.
            fontSize: `min(calc((100cqw - ${align === 'center' ? 2 * SHAPE_PAD : 0}px) / 1.85), calc((100cqh - ${2 * SHAPE_PAD}px) / 0.8 / ${STRETCH_MAX}))`,
            transform: `scaleY(${STRETCH_MAX})`,
            ...fade,
          }}
        >
          {text}
        </span>
      )}
    </div>
  )
}

/**
 * From lg the title line holds on one line at a size fitted to the 8-column copy width: n monospace
 * characters at 0.575em each, plus a little slack (the home title's 28 characters give 16.4).
 */
function titleFit(title: string) {
  return (Array.from(title).length * 0.575 + 0.3).toFixed(2)
}

export default function HeroSection({ copy = HERO_COPY, values = HERO_SETTINGS, reducedMotion, shape }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const osReduced = usePrefersReducedMotion()
  const reduced = reducedMotion ?? osReduced
  // True once the field has drawn the shape in glyphs; the plain type fades out then.
  const [shapeDrawn, setShapeDrawn] = useState(false)
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
      style={{ background: paper, touchAction: 'pan-y pinch-zoom', minHeight: 'calc(clamp(560px, 74vh, 780px) + 80px)' }}
    >
      <HeroField
        sectionRef={sectionRef}
        copyRef={copyRef}
        values={values}
        reducedMotion={reduced}
        {...(shape ? { shape, onShape: setShapeDrawn } : {})}
      />
      {/* The hero runs up behind the transparent nav (80px), so the field fills the top of the screen. */}
      <div className="relative z-10 pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="lattice">
          <div ref={copyRef} className="w-full lg:w-[round(calc((100%-11*16px)/12*8+7*16px),1px)] lg:[container-type:inline-size]" style={{ textShadow }}>
            {/* From lg the title line doesn't wrap, so the size follows the 8-column width (which steps with the lattice)
                rather than the viewport: the title line, 28 monospace characters at 0.575em each, always fits. */}
            <h1
              data-line="head"
              className={
                shape
                  ? 'font-mono font-medium text-text-primary text-headline lg:text-[length:min(48px,calc(100cqw/var(--hero-fit)))]'
                  : 'font-mono font-medium text-text-primary text-headline lg:text-[length:min(48px,calc(100cqw/16.4))]'
              }
              style={shape ? ({ color: headColor, '--hero-fit': titleFit(copy.headline[0] ?? '') } as CSSProperties) : { color: headColor }}
            >
              {copy.headline.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <>
                      {' '}
                      <br />
                    </>
                  )}
                  {/* The title sits on its own line at every width and holds on large screens (the size above is
                      fitted to it); later lines wrap, in light weight. On the not-found pages a long path moves whole to
                      the next line and breaks inside only when it must. An inline-block would do the same, but its box
                      joins the line rectangles the engine measures and widens the highlight and the copy clearance. */}
                  <span
                    className={
                      i === 0
                        ? 'lg:whitespace-nowrap'
                        : shape
                          ? 'font-light [overflow-wrap:anywhere]'
                          : 'font-light'
                    }
                  >
                    {line}
                  </span>
                </Fragment>
              ))}
            </h1>
            {copy.subhead.length > 0 && (
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
            )}
            {/* A second CTA starts one gutter after the first, which is two columns wide, so both sit on the lattice. */}
            <div className={copy.cta2 ? 'mt-12 flex flex-wrap items-start gap-4' : 'mt-12'}>
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
              {copy.cta2 && <GridCta href={copy.cta2.href} label={copy.cta2.label} />}
            </div>
          </div>
          {shape && (
            <ShapeBox text={shape} align="start" className="mt-12 h-[288px] lg:hidden" color={headColor} hidden={shapeDrawn} reduced={reduced} />
          )}
        </div>
      </div>
      {/* From lg the shape takes columns 8 to 12, below the nav band; copy clearance keeps its glyphs off the copy. */}
      {shape && (
        <div className="absolute inset-0 z-10 hidden lg:block pointer-events-none">
          <div className="lattice flex h-full pt-24 pb-16">
            <div className="shrink-0 w-[round(calc((100%-11*16px)/12*7+6*16px),1px)]" />
            <ShapeBox text={shape} align="center" className="flex-1 ml-4" color={headColor} hidden={shapeDrawn} reduced={reduced} />
          </div>
        </div>
      )}
    </section>
  )
}

