'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CaseStudy } from '@/lib/caseStudies'
import { calculateCaseStudyReadingTime } from '@/lib/utils/readingTime'

interface DensityToggleProps {
  caseStudy: CaseStudy
  mode: 'quick' | 'deep'
  onModeChange: (mode: 'quick' | 'deep') => void
}

export default function DensityToggle({
  caseStudy,
  mode,
  onModeChange,
}: DensityToggleProps) {
  const [quickTime, setQuickTime] = useState<string>('')
  const [deepTime, setDeepTime] = useState<string>('')

  useEffect(() => {
    // Calculate reading times for both modes
    setQuickTime(calculateCaseStudyReadingTime(caseStudy, 'quick'))
    setDeepTime(calculateCaseStudyReadingTime(caseStudy, 'deep'))
  }, [caseStudy])

  const handleModeChange = (newMode: 'quick' | 'deep') => {
    onModeChange(newMode)
    // Save to sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('density-preference', newMode)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex bg-white border border-text/20 rounded-full overflow-hidden shadow-sm">
        <button
          onClick={() => handleModeChange('quick')}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
            mode === 'quick'
              ? 'bg-brand-lilac text-text'
              : 'bg-transparent text-text/70 hover:text-text hover:bg-text/5'
          }`}
          aria-pressed={mode === 'quick'}
          aria-label="Quick Read mode"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Quick Read</span>
            {quickTime && (
              <span className="text-xs opacity-80">{quickTime}</span>
            )}
          </span>
        </button>
        <button
          onClick={() => handleModeChange('deep')}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
            mode === 'deep'
              ? 'bg-brand-lilac text-text'
              : 'bg-transparent text-text/70 hover:text-text hover:bg-text/5'
          }`}
          aria-pressed={mode === 'deep'}
          aria-label="Deep Dive mode"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Deep Dive</span>
            {deepTime && (
              <span className="text-xs opacity-80">{deepTime}</span>
            )}
          </span>
        </button>
      </div>
    </div>
  )
}

