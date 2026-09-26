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
 * LazyImage - Native img with loading state (ghost + fade-in)
 *
 * Design:
 * - Uses native <img> for natural aspect ratio support
 * - Ghost placeholder (components/Ghost.tsx) while loading
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
      {/* Ghost until the image arrives */}
      {!isLoaded && <div className="absolute inset-0 ghost" aria-hidden="true" />}

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
