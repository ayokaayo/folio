'use client'

interface ImagePlaceholderProps {
  width?: number
  height?: number
  alt?: string
  className?: string
}

/**
 * ImagePlaceholder - Shows a placeholder when no image is provided
 * 
 * Displays dimensions to help with image preparation.
 * 
 * Card Preview Images (imageUrl):
 * - Recommended: 1800x1200px (3:2 aspect ratio)
 * - Minimum: 1200x800px (3:2 aspect ratio)
 * 
 * Replace with actual images using the imageUrl field in your data.
 */
export default function ImagePlaceholder({ 
  width = 1800, 
  height = 1200, 
  alt = 'Placeholder image',
  className = '' 
}: ImagePlaceholderProps) {
  return (
    <div 
      className={`bg-gradient-to-br from-text/5 via-text/10 to-text/5 flex items-center justify-center aspect-[3/2] ${className}`}
    >
      <div className="text-text/20 text-sm font-medium text-center px-4">
        <div>{width} × {height}</div>
        <div className="text-xs mt-1">Add image to replace</div>
      </div>
    </div>
  )
}

