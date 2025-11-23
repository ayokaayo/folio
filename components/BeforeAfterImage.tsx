'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ImageWithCaption } from '@/lib/caseStudies/types'

interface BeforeAfterImageProps {
  before: ImageWithCaption
  after: ImageWithCaption
  className?: string
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
export default function BeforeAfterImage({ before, after, className = '' }: BeforeAfterImageProps) {
  const [activeView, setActiveView] = useState<'before' | 'after'>('before')

  const activeImage = activeView === 'before' ? before : after

  return (
    <figure className={`w-full ${className}`}>
      <div className="relative w-full rounded-lg border border-text/10 bg-text/5 p-1">
        {/* Toggle Buttons - Upper Right Corner */}
        <div className="absolute top-3 right-3 z-10 flex gap-1 bg-background/90 backdrop-blur-sm rounded-lg border border-text/10 p-1">
          <button
            onClick={() => setActiveView('before')}
            aria-label="Show before image"
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
              activeView === 'before'
                ? 'bg-text/10 text-text border border-text/20'
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
                ? 'bg-text/10 text-text border border-text/20'
                : 'text-text/70 hover:text-text hover:bg-text/5'
            }`}
          >
            After
          </button>
        </div>

        {/* Image Container - Wraps naturally around image */}
        <div className="relative w-full">
          <Image
            src={activeImage.url}
            alt={activeImage.alt}
            width={2400}
            height={1600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-contain w-full h-auto"
            quality={90}
            unoptimized={false}
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
  )
}

