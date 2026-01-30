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
 * ImageWithLoader - Next.js Image with discrete shimmer loading state
 * 
 * Design:
 * - Neutral bg-grid background while loading
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
    ? 'absolute inset-0 overflow-hidden bg-bg-grid' 
    : 'relative overflow-hidden bg-bg-grid'
  
  const imageClasses = `
    ${objectFitClass}
    transition-opacity duration-500 ease-trace
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    ${className}
  `.trim()

  return (
    <div
      className={`${baseContainerClasses} ${containerClassName}`}
      style={!fill ? { width, height } : undefined}
      onClick={onClick}
    >
      {/* Shimmer loading state */}
      {!isLoaded && (
        <div
          className={`
            absolute inset-0 bg-bg-grid
            after:absolute after:inset-0
            after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent
            after:animate-shimmer
            ${shimmerClassName}
          `.trim()}
          aria-hidden="true"
        />
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
