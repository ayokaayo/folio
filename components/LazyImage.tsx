'use client'

import { useState, useRef, useEffect } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  onClick?: () => void
}

/**
 * LazyImage - Native img with loading state (shimmer + fade-in)
 *
 * Design:
 * - Uses native <img> for natural aspect ratio support
 * - Gray background with shimmer animation while loading
 * - Smooth fade-in when image loads
 * - Handles cached images that load before React attaches onLoad
 * - Preserves all native img behavior
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onClick,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Handle cached images that may already be loaded before onLoad attaches
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalHeight > 0) {
      setIsLoaded(true)
    }
  }, [src])

  return (
    <div className="relative w-full">
      {/* Loading state with shimmer */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-text/5 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          {/* Discrete image icon */}
          <svg
            className="w-8 h-8 text-text/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2z"
            />
          </svg>
        </div>
      )}

      {/* Image with fade-in */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
        className={`
          w-full h-auto block
          transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `.trim()}
      />
    </div>
  )
}
