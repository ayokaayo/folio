'use client'

import { useEffect, useState } from 'react'
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
  const [showTooltip, setShowTooltip] = useState(false)

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
    <div className="flex items-center gap-3">
      <div className="inline-flex bg-white overflow-hidden">
        <button
          onClick={() => handleModeChange('quick')}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
            mode === 'quick'
              ? 'bg-accent text-white'
              : 'bg-transparent text-text/60 hover:text-text hover:bg-text/5'
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
            <span>
              <span className="sm:hidden">Quick</span>
              <span className="hidden sm:inline">Quick Read</span>
            </span>
            {quickTime && (
              <span className={`text-xs ${mode === 'quick' ? 'opacity-90' : 'opacity-60'}`}>
                <span className="sm:hidden">{quickTime.replace('min', 'm')}</span>
                <span className="hidden sm:inline">{quickTime}</span>
              </span>
            )}
          </span>
        </button>
        <button
          onClick={() => handleModeChange('deep')}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
            mode === 'deep'
              ? 'bg-accent text-white'
              : 'bg-transparent text-text/60 hover:text-text hover:bg-text/5'
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
            <span>
              <span className="sm:hidden">Deep</span>
              <span className="hidden sm:inline">Deep Dive</span>
            </span>
            {deepTime && (
              <span className={`text-xs ${mode === 'deep' ? 'opacity-90' : 'opacity-60'}`}>
                <span className="sm:hidden">{deepTime.replace('min', 'm')}</span>
                <span className="hidden sm:inline">{deepTime}</span>
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Info icon with tooltip */}
      <div className="relative">
        <button
          type="button"
          className="w-6 h-6 flex items-center justify-center text-text/50 hover:text-text/80 transition-colors"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label="Reading density info"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {showTooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 bg-text text-white text-xs rounded-lg shadow-lg z-50">
            <p className="mb-1"><strong>Quick Read:</strong> Key points and highlights only.</p>
            <p><strong>Deep Dive:</strong> Full context, process details, and rationale.</p>
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-text rotate-45" />
          </div>
        )}
      </div>
    </div>
  )
}

