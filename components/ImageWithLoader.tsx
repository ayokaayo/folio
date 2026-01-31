'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithLoaderProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  quality?: number
  priority?: boolean
  className?: string
  containerClassName?: string
  shimmerClassName?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  onLoad?: () => void
  onClick?: () => void
}

/**
 * ImageWithLoader - Next.js Image with discrete loading state
 * 
 * Design:
 * - Neutral gray background while loading
 * - Discrete image icon in center
 * - Subtle shimmer animation (translucent white gradient sweep)
 * - Smooth fade-in when image loads
 * - Respects reduced motion preferences
 */
export default function ImageWithLoader({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  quality = 90,
  priority = false,
  className = '',
  containerClassName = '',
  shimmerClassName = '',
  objectFit = 'cover',
  onLoad,
  onClick,
}: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }[objectFit]

  const baseContainerClasses = fill 
    ? 'absolute inset-0 overflow-hidden bg-bg-primary' 
    : 'relative overflow-hidden bg-bg-primary max-w-full h-auto'
  
  // Check if className includes img-grayscale (which has its own transitions)
  const hasCustomTransition = className.includes('img-grayscale')

  const imageClasses = `
    ${objectFitClass}
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    ${!hasCustomTransition ? 'transition-opacity duration-500' : ''}
    ${className}
  `.trim()

  return (
    <div
      className={`${baseContainerClasses} ${containerClassName}`}
      style={!fill && width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
      onClick={onClick}
    >
      {/* Loading state with icon and shimmer */}
      {!isLoaded && (
        <div
          className={`
            absolute inset-0 bg-bg-primary flex items-center justify-center
            after:absolute after:inset-0
            after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
            after:animate-shimmer
            ${shimmerClassName}
          `.trim()}
          aria-hidden="true"
        >
          {/* Discrete image icon */}
          <svg
            className="w-8 h-8 text-text-tertiary/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Image with fade-in */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        quality={quality}
        priority={priority}
        onLoad={handleLoad}
        className={imageClasses}
      />
    </div>
  )
}
