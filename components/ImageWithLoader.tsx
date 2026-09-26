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
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  onLoad?: () => void
  onClick?: () => void
}

/**
 * ImageWithLoader - Next.js Image with discrete loading state
 * 
 * Design:
 * - A ghost (see components/Ghost.tsx) while loading
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
      {/* Ghost until the image arrives */}
      {!isLoaded && <div className="absolute inset-0 ghost" aria-hidden="true" />}

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
