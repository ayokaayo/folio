'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * MillimetricPaper — Engineering paper grid with square cells
 *
 * Uses the SAME flexbox structure as ExposedGrid:
 * - 12/6/4 responsive columns with flex: 1 1 0%
 * - 16px gaps between columns
 * - Fixed 16px baseline grid for predictable alignment
 */

import { GRID_GAP } from './ExposedGrid'

interface MillimetricPaperProps {
  /** Opacity of the grid lines (0-1) */
  opacity?: number
  /** Z-index for layering */
  zIndex?: number
}

/** Fixed baseline grid size - everything aligns to this */
export const BASELINE_GRID = 16

export default function MillimetricPaper({
  opacity = 0.5,
  zIndex = 0,
}: MillimetricPaperProps) {
  const [columnCount, setColumnCount] = useState(12)

  useEffect(() => {
    const updateGrid = () => {
      const cols = getComputedStyle(document.documentElement)
        .getPropertyValue('--grid-columns')
        .trim()
      setColumnCount(parseInt(cols, 10) || 12)
    }

    updateGrid()
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [])

  const lineColor = `rgba(229, 224, 216, ${opacity})`  // border-subtle

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex }}
      aria-hidden="true"
    >
      {/* Container matches ExposedGrid exactly */}
      <div
        className="h-full w-full max-w-content mx-auto"
        style={{
          display: 'flex',
          gap: `${GRID_GAP}px`,
          paddingLeft: `${GRID_GAP}px`,
          paddingRight: `${GRID_GAP}px`,
        }}
      >
        {Array.from({ length: columnCount }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="relative h-full"
            style={{ flex: '1 1 0%' }}
          >
            {/* Vertical subdivision lines - 16px apart for consistency */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px)`,
                backgroundSize: `${BASELINE_GRID}px 100%`,
              }}
            />

            {/* Horizontal lines - fixed 16px baseline grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
                backgroundSize: `100% ${BASELINE_GRID}px`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
