'use client'

import { useState } from 'react'
import type { ImageWithCaption } from '@/lib/caseStudies/types'
import ImageModal from './ImageModal'
import LazyImage from './LazyImage'


interface BeforeAfterImageProps {
  before: ImageWithCaption
  after: ImageWithCaption
  className?: string
  defaultView?: 'before' | 'after'
}

/**
 * BeforeAfterImage - Displays two images with toggle buttons to switch between before/after
 * 
 * Usage:
 * Add two images with "before" and "after" in their captions or URLs:
 * 
 * images: [
 *   {
 *     url: '/img/case-study/before-interface.png',
 *     alt: 'Before: Old interface',
 *     caption: 'Before: Users leaving platform'
 *   },
 *   {
 *     url: '/img/case-study/after-interface.png',
 *     alt: 'After: New interface',
 *     caption: 'After: Fully localized interface'
 *   }
 * ]
 * 
 * The component will automatically detect and render as before/after toggle.
 */
export default function BeforeAfterImage({ before, after, className = '', defaultView = 'before' }: BeforeAfterImageProps) {
  const [activeView, setActiveView] = useState<'before' | 'after'>(defaultView)
  const [selectedImage, setSelectedImage] = useState<ImageWithCaption | null>(null)

  const activeImage = activeView === 'before' ? before : after

  return (
    <>
      <figure className={`w-full ${className}`}>
        <div className="relative w-full border border-text/10 bg-text/5 p-1 cursor-pointer" onClick={() => setSelectedImage(activeImage)}>
          {/* Toggle Buttons - Upper Right Corner */}
          <div className="absolute top-3 right-3 z-10 flex gap-1 bg-background/90 backdrop-blur-sm border border-text/10 p-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveView('before')}
              aria-label="Show before image"
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                activeView === 'before'
                  ? 'bg-brand-lilac text-text'
                  : 'text-text/70 hover:text-text hover:bg-text/5'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setActiveView('after')}
              aria-label="Show after image"
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                activeView === 'after'
                  ? 'bg-brand-lilac text-text'
                  : 'text-text/70 hover:text-text hover:bg-text/5'
              }`}
            >
              After
            </button>
          </div>

          {/* Image Container */}
          <div className="relative w-full">
            <LazyImage
              key={activeView}
              src={activeImage.url}
              alt={activeImage.alt}
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Caption */}
        {activeImage.caption && (
          <figcaption className="mt-3 text-sm text-text/60 text-center italic">
            {activeImage.caption}
          </figcaption>
        )}
      </figure>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  )
}
