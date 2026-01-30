'use client'

import ImageWithLoader from './ImageWithLoader'
import ImagePlaceholder from './ImagePlaceholder'

interface CardImageProps {
  imageUrl?: string
  imageAlt?: string
  title: string
  className?: string
}

/**
 * CardImage component - handles both real images and placeholders for card previews
 * 
 * Image Guidelines for Card Previews (imageUrl):
 * - Recommended size: 1800x1200px (3:2 aspect ratio, optimized for ~800px display)
 * - Minimum size: 1200x800px (3:2 aspect ratio)
 * - Format: JPG, PNG or WebP for best performance
 * - Place images in /public/img/ folder (or /public/images/)
 * - Example: /public/img/dropdown/preview.jpg
 * 
 * Card previews use 3:2 aspect ratio:
 * - Mobile: Full width, maintains aspect ratio
 * - Tablet: Scales appropriately
 * - Desktop: Card previews max ~800px
 */
export default function CardImage({ 
  imageUrl, 
  imageAlt, 
  title, 
  className = '' 
}: CardImageProps) {
  // If no image URL provided, show placeholder
  // Card preview placeholder: 1800x1200px (optimized for ~800px display)
  if (!imageUrl) {
    return (
      <ImagePlaceholder 
        width={1800} 
        height={1200}
        alt={imageAlt || `${title} screenshot`}
        className={className}
      />
    )
  }

  // Use ImageWithLoader for optimized images with shimmer loading state
  return (
    <div className={`relative w-full aspect-[3/2] ${className}`}>
      <ImageWithLoader
        src={imageUrl}
        alt={imageAlt || `${title} screenshot`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
        priority={false}
        objectFit="cover"
      />
    </div>
  )
}
