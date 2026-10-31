'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { NOT_FOUND_MARKER, notFoundPath, track } from '@/lib/analytics'
import HeroSection from './hero/HeroSection'
import type { HeroCopy } from './hero/copy'
import { NOT_FOUND, displayPath, truncateMiddle, variantFor } from './hero/notFoundCopy'

const noSubscribe = () => () => {}

/**
 * The not-found pages: the home hero with a large 404 drawn in glyphs beside (or below) the copy. The
 * missing path is read on the client and rendered as text, so React escapes it. The copy follows the path:
 * the root not-found page also serves unknown case studies and projects, whose layouts set
 * dynamicParams = false, so unknown ids 404 at routing time. The page is prerendered once, so the server
 * can't know the path: until hydration the copy says "here", and the hydrating render matches it.
 */
export default function NotFoundHero() {
  const pathname = usePathname() ?? ''
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false)
  const v = NOT_FOUND[variantFor(hydrated ? pathname : '')]
  // Once per visit to the page; the ref also absorbs React's double effect run in development.
  const counted = useRef(false)
  useEffect(() => {
    if (counted.current || !pathname) return
    counted.current = true
    track('not_found', { path: notFoundPath(pathname) })
  }, [pathname])
  const copy: HeroCopy = {
    headline: [v.headline, hydrated ? `Nothing lives at ${truncateMiddle(displayPath(pathname))}.` : 'Nothing lives here.'],
    subhead: [],
    cta: v.primary,
    cta2: v.secondary,
  }
  return (
    // The marker tells the analytics payload hook to report this page as /404.
    <main id="main-content" {...{ [NOT_FOUND_MARKER]: '' }}>
      <HeroSection copy={copy} shape="404" />
    </main>
  )
}
