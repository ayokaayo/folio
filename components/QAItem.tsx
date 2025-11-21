'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIMATION } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface QAItemProps {
  question: string
  answer: string | string[]
}

export default function QAItem({ question, answer }: QAItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const answerContent = Array.isArray(answer) ? answer : [answer]
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="border-b border-text/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between group"
      >
        <h3 className="text-lg md:text-xl font-serif font-bold text-text group-hover:text-primary transition-colors">
          {question}
        </h3>
        <span className="text-sm text-text/60 ml-4">
          {isOpen ? 'Close' : 'Tap to read'}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL }}
            className="overflow-hidden"
          >
            <div className="pt-6 text-text/80 space-y-4">
              {answerContent.map((paragraph, index) => (
                <p key={`qa-para-${index}-${paragraph.substring(0, 15)}`} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

