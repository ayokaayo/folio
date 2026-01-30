'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FigmaFrame from './FigmaFrame'

interface Testimonial {
  quote: string
  company: string
  role?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoPlayInterval?: number
}

export default function TestimonialCarousel({ 
  testimonials, 
  autoPlayInterval = 6000 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return
    
    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPaused, autoPlayInterval, goToNext, testimonials.length])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <FigmaFrame label={`${currentIndex + 1} / ${testimonials.length}`}>
      <div 
        className="bg-bg-surface border border-border-subtle p-6 md:p-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Testimonial content */}
        <div className="min-h-[120px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <blockquote className="font-mono text-body text-text-primary leading-relaxed mb-4">
                "{currentTestimonial.quote}"
              </blockquote>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-label uppercase tracking-wide text-text-tertiary">
                  {currentTestimonial.company}
                </span>
                {currentTestimonial.role && (
                  <>
                    <span className="text-text-tertiary">·</span>
                    <span className="font-mono text-caption text-text-secondary">
                      {currentTestimonial.role}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-subtle">
          {/* Prev/Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              className="p-2 border border-border-subtle hover:border-text-tertiary transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="p-2 border border-border-subtle hover:border-text-tertiary transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 transition-colors ${
                  index === currentIndex 
                    ? 'bg-[#008FF0]' 
                    : 'bg-border-subtle hover:bg-text-tertiary'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="font-mono text-caption text-text-tertiary">
            {isPaused ? 'Paused' : 'Auto'}
          </div>
        </div>
      </div>
    </FigmaFrame>
  )
}
