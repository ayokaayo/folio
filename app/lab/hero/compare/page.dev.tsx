import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Compare from './Compare'

// Dev-only (the .dev.tsx extension is only a page in development; see next.config.js).
export const metadata = { title: 'Hero lab: compare upgrades', robots: { index: false, follow: false } }

export default function HeroComparePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <Suspense>
      <Compare />
    </Suspense>
  )
}
