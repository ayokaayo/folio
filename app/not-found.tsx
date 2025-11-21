import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-text mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-text mb-4">
          Page not found
        </h2>
        <p className="text-lg text-text/70 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href={ROUTES.HOME}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium inline-flex items-center gap-2"
          >
            Go home
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
          <Link
            href={ROUTES.WORK}
            className="px-6 py-3 bg-text/10 text-text rounded-lg hover:bg-text/20 transition-colors font-medium"
          >
            View work
          </Link>
        </div>
      </div>
    </div>
  )
}

