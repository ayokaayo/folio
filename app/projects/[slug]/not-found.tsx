import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function NotFound() {
  return (
    <main id="main-content" className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-text mb-4">
          Project Not Found
        </h1>
        <p className="text-lg text-text/70 mb-8 max-w-2xl mx-auto">
          The project you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href={ROUTES.PROJECTS}
          className="inline-flex items-center gap-2 text-primary hover:underline text-base font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>
      </div>
    </main>
  )
}

