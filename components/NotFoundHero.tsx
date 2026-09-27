'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { notFoundPath, track } from '@/lib/analytics'
import HeroSection from './hero/HeroSection'
import type { HeroCopy } from './hero/copy'
import { NOT_FOUND, displayPath, truncateMiddle, variantFor } from './hero/notFoundCopy'

/**
 * The not-found pages: the home hero with a large 404 drawn in glyphs beside (or below) the copy. The
 * missing path is read on the client and rendered as text, so React escapes it. The copy follows the path:
 * the root not-found page also serves unknown case studies and projects, whose layouts set
 * dynamicParams = false, so unknown ids 404 at routing time.
 */
export default function NotFoundHero() {
  const pathname = usePathname() ?? ''
  const v = NOT_FOUND[variantFor(pathname)]
  // Once per visit to the page; the ref also absorbs React's double effect run in development.
  const counted = useRef(false)
  useEffect(() => {
    if (counted.current || !pathname) return
    counted.current = true
    track('not_found', { path: notFoundPath(pathname) })
  }, [pathname])
  const copy: HeroCopy = {
    headline: [v.headline, `Nothing lives at ${truncateMiddle(displayPath(pathname))}.`],
    subhead: [],
    cta: v.primary,
    cta2: v.secondary,
  }
  return (
    <main id="main-content">
      <HeroSection copy={copy} shape="404" />
    </main>
  )
}
