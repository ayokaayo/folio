import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Lab from './Lab'

// Dev-only (the .dev.tsx extension is only a page in development; see next.config.js).
export const metadata = { title: 'Hero lab', robots: { index: false, follow: false } }

export default function HeroLabPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <Suspense>
      <Lab />
    </Suspense>
  )
}
