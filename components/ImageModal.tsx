'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import ImageWithLoader from './ImageWithLoader'

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
        onClick={onClose}
      >
        {/* Full screen dark overlay */}
        <div className="absolute inset-0 bg-black/90" style={{ width: '100vw', height: '100vh' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close image"
        >
          <svg
            className="w-6 h-6 text-white"
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

        {/* Image container */}
        <div
          className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? { scale: 1 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="relative w-full max-w-[95vw] max-h-[85vh] flex items-center justify-center"
          >
            <div className="relative w-[min(95vw,1200px)] h-[85vh]">
              <ImageWithLoader
                src={image.url}
                alt={image.alt}
                fill
                sizes="95vw"
                objectFit="contain"
                className="shadow-2xl"
                containerClassName="bg-black"
                shimmerClassName="after:via-white/10"
              />
            </div>
          </motion.div>
          {image.caption && (
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, delay: 0.1 }}
              className="mt-6 text-sm text-white/80 text-center italic max-w-2xl px-4"
            >
              {image.caption}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

