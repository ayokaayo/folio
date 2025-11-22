'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
    }
    // In production, you could send this to an error reporting service
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-text/70 mb-8">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-8 text-left bg-text/5 p-4 rounded-lg border border-text/10 max-w-lg mx-auto">
            <summary className="cursor-pointer text-sm font-semibold text-text mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-text/60 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Try again
          </button>
          <Link
            href={ROUTES.HOME}
            className="px-6 py-3 bg-text/10 text-text rounded-lg hover:bg-text/20 transition-colors font-medium inline-flex items-center gap-2"
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
        </div>
      </div>
    </div>
  )
}



