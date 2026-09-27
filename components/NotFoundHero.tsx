'use client'

import { usePathname } from 'next/navigation'
import HeroSection from './hero/HeroSection'
import type { HeroCopy } from './hero/copy'
import { NOT_FOUND, displayPath, truncateMiddle, variantFor } from './hero/notFoundCopy'

/**
 * The not-found pages: the home hero with a large 404 drawn in glyphs beside (or below) the copy. The
 * missing path is read on the client and rendered as text, so React escapes it. Without a variant the copy
 * follows the path, so the root page also serves unknown case studies and projects (see middleware.ts).
 */
export default function NotFoundHero({ variant }: { variant?: keyof typeof NOT_FOUND }) {
  const pathname = usePathname() ?? ''
  const v = NOT_FOUND[variant ?? variantFor(pathname)]
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
