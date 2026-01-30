'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * MillimetricPaper — Engineering paper grid with square cells
 *
 * Uses the SAME flexbox structure as ExposedGrid:
 * - 12/6/4 responsive columns with flex: 1 1 0%
 * - 16px gaps between columns
 * - Each column subdivided into 6×6 square cells
 *
 * Uses JavaScript to measure column width and create true squares.
 */

import { GRID_GAP } from './ExposedGrid'

interface MillimetricPaperProps {
  /** Opacity of the grid lines (0-1) */
  opacity?: number
  /** Z-index for layering */
  zIndex?: number
  /** Number of subdivisions per column (6 = 6×6 grid) */
  subdivisions?: number
}

export default function MillimetricPaper({
  opacity = 0.5,
  zIndex = 0,
  subdivisions = 6,
}: MillimetricPaperProps) {
  const [columnCount, setColumnCount] = useState(12)
  const [cellSize, setCellSize] = useState(16)
  const columnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateGrid = () => {
      // Get column count from CSS variable
      const cols = getComputedStyle(document.documentElement)
        .getPropertyValue('--grid-columns')
        .trim()
      setColumnCount(parseInt(cols, 10) || 12)

      // Measure actual column width to calculate square cell size
      if (columnRef.current) {
        const colWidth = columnRef.current.offsetWidth
        setCellSize(colWidth / subdivisions)
      }
    }

    updateGrid()
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [subdivisions])

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
            ref={colIndex === 0 ? columnRef : undefined}
            className="relative h-full"
            style={{ flex: '1 1 0%' }}
          >
            {/* Vertical subdivision lines (percentage-based) */}
            {Array.from({ length: subdivisions }).map((_, subIndex) => (
              <div
                key={`v-${subIndex}`}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(subIndex / subdivisions) * 100}%`,
                  width: '1px',
                  backgroundColor: lineColor,
                }}
              />
            ))}

            {/* Right edge line */}
            <div
              className="absolute top-0 bottom-0 right-0"
              style={{
                width: '1px',
                backgroundColor: lineColor,
              }}
            />

            {/* Horizontal lines - spaced to match cell width for squares */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
                backgroundSize: `100% ${cellSize}px`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
