'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import type { ImageWithCaption } from '@/lib/caseStudies/types'
import ImageModal from './ImageModal'
import ImageWithLoader from './ImageWithLoader'

interface ImageGalleryProps {
  images: ImageWithCaption[]
  className?: string
}

/**
 * ImageGallery - Displays a collection of images with captions
 * 
 * Usage:
 * Add images to your case study or project data:
 * 
 * images: [
 *   {
 *     url: '/img/case-study/interface-screenshot.png',
 *     caption: 'The new dropdown interface with progressive disclosure',
 *     alt: 'Dropdown interface showing category selection'
 *   },
 *   {
 *     url: '/img/case-study/validation-flow.png',
 *     caption: 'Real-time validation prevents errors',
 *     alt: 'Validation flow diagram'
 *   }
 * ]
 * 
 * Images should be placed in /public/img/ organized by case study or project.
 * Recommended size: 1600-2400px width for best quality on retina displays.
 */
export default function ImageGallery({ images, className = '' }: ImageGalleryProps) {
  const prefersReducedMotion = useReducedMotion()
  const [selectedImage, setSelectedImage] = useState<ImageWithCaption | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <div className={`space-y-8 ${className}`}>
        {images.map((image, index) => (
          <motion.figure
            key={`image-${index}-${image.url}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
            transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: index * 0.1 }}
            className="w-full cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
              <div className="relative w-full">
                <ImageWithLoader
                  src={image.url}
                  alt={image.alt}
                  width={2400}
                  height={1600}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  objectFit="contain"
                  quality={90}
                  className="w-full h-auto"
                  containerClassName="bg-text/5"
                  shimmerClassName="after:via-white/10"
                />
              </div>
            </div>
            {image.caption && (
              <figcaption className="mt-3 text-sm text-text/60 text-center italic">
                {image.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  )
}
