'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface ImageModalProps {
  image: {
    url: string
    alt: string
    caption?: string
  } | null
  onClose: () => void
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
  const prefersReducedMotion = useReducedMotion()
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null)

  // Reset cached dimensions whenever a different asset is opened
  useEffect(() => {
    setNaturalSize(null)
  }, [image?.url])

  // Close on ESC key
  useEffect(() => {
    if (!image) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [image, onClose])

  if (!image) return null

  // Calculate the constrained display dimensions
  const getDisplayDimensions = () => {
    if (!naturalSize) return { width: '90vw', height: '80vh' }

    const maxWidth = Math.min(window.innerWidth * 0.95, naturalSize.width)
    const maxHeight = Math.min(window.innerHeight * 0.90, naturalSize.height)

    // Calculate aspect-ratio-constrained dimensions
    const aspectRatio = naturalSize.width / naturalSize.height
    
    let displayWidth = maxWidth
    let displayHeight = displayWidth / aspectRatio

    // If height exceeds max, constrain by height instead
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight
      displayWidth = displayHeight * aspectRatio
    }

    return {
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
    }
  }

  const displayDimensions = getDisplayDimensions()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Blurred background overlay */}
        <motion.div
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(8px)' }}
          exit={{ backdropFilter: 'blur(0px)' }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-text/20 hover:bg-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close image"
        >
          <svg
            className="w-6 h-6 text-text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image container - click outside to close */}
        <div
          className="relative z-10 flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? { scale: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="relative"
            style={{
              width: displayDimensions.width,
              height: displayDimensions.height,
            }}
          >
            <Image
              fill
              src={image.url}
              alt={image.alt}
              sizes="95vw"
              className="object-contain rounded-lg"
              quality={90}
              priority
              onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                setNaturalSize({ width: naturalWidth, height: naturalHeight })
              }
            />
          </motion.div>
          {image.caption && (
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, delay: 0.1 }}
              className="mt-4 text-sm text-text/70 text-center italic max-w-2xl px-4"
            >
              {image.caption}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

