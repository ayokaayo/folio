'use client'

import { useEffect, useState } from 'react'

/**
 * ExposedGrid — Visual grid overlay
 *
 * Uses flexbox with explicit equal widths to guarantee all columns are identical.
 * Shows column areas with subtle fill and gaps between them.
 */

// Grid constants - exported for use in other components
export const GRID_GAP = 16
export const GRID_COLUMNS_DESKTOP = 12
export const GRID_COLUMNS_TABLET = 6
export const GRID_COLUMNS_MOBILE = 4

interface ExposedGridProps {
  showColumns?: boolean
  showBaseline?: boolean
  opacity?: number
  position?: 'fixed' | 'absolute'
  zIndex?: number
  showLabels?: boolean
  showGaps?: boolean
}

export default function ExposedGrid({
  showColumns = true,
  showBaseline = false,
  opacity = 0.5,
  position = 'absolute',
  zIndex = 0,
  showLabels = true,
  showGaps = true,
}: ExposedGridProps) {
  const [columnCount, setColumnCount] = useState(12)

  useEffect(() => {
    const updateColumnCount = () => {
      const cols = getComputedStyle(document.documentElement)
        .getPropertyValue('--grid-columns')
        .trim()
      setColumnCount(parseInt(cols, 10) || 12)
    }

    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)
    return () => window.removeEventListener('resize', updateColumnCount)
  }, [])

  return (
    <div
      className={`${position === 'fixed' ? 'fixed' : 'absolute'} inset-0 pointer-events-none select-none overflow-hidden`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      {showColumns && (
        <div
          className="h-full w-full max-w-content mx-auto"
          style={{
            display: 'flex',
            gap: `${GRID_GAP}px`,
            paddingLeft: `${GRID_GAP}px`,
            paddingRight: `${GRID_GAP}px`,
          }}
        >
          {Array.from({ length: columnCount }).map((_, i) => (
            <div
              key={i}
              className="relative h-full"
              style={{
                flex: '1 1 0%',
                // Subtle column fill to distinguish from gaps
                backgroundColor: showGaps ? `rgba(45, 90, 76, ${opacity * 0.06})` : 'transparent',
              }}
            >
              {/* Left edge line */}
              <div
                className="absolute left-0 top-0 bottom-0 w-px bg-border-subtle"
                style={{ opacity }}
              />
              {/* Right edge line */}
              <div
                className="absolute right-0 top-0 bottom-0 w-px bg-border-subtle"
                style={{ opacity }}
              />
              {/* Column label */}
              {showLabels && (
                <span
                  className="absolute top-4 left-2 font-mono text-caption text-text-tertiary"
                  style={{ opacity: opacity * 0.8 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {showBaseline && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 3px,
              rgba(45, 90, 76, ${opacity * 0.3}) 3px,
              rgba(45, 90, 76, ${opacity * 0.3}) 4px
            )`,
          }}
        />
      )}
    </div>
  )
}

// Helper component to create grid-aligned layouts
interface GridRowProps {
  children: React.ReactNode
  className?: string
}

export function GridRow({ children, className = '' }: GridRowProps) {
  return (
    <div
      className={`max-w-content mx-auto w-full ${className}`}
      style={{
        display: 'flex',
        gap: `${GRID_GAP}px`,
        paddingLeft: `${GRID_GAP}px`,
        paddingRight: `${GRID_GAP}px`,
      }}
    >
      {children}
    </div>
  )
}

// Helper for spanning multiple columns
// Supports responsive spans: span (desktop), spanTablet (6 cols), spanMobile (4 cols)
interface GridColProps {
  children: React.ReactNode
  span?: number
  spanTablet?: number
  spanMobile?: number
  className?: string
}

export function GridCol({
  children,
  span = 1,
  spanTablet,
  spanMobile,
  className = '',
}: GridColProps) {
  // Default responsive behavior: clamp to available columns
  const tablet = spanTablet ?? Math.min(span, 6)
  const mobile = spanMobile ?? Math.min(span, 4)

  return (
    <div
      className={className}
      style={{
        // Use CSS custom property for responsive flex
        // Desktop: span, Tablet: tablet, Mobile: mobile
        flex: `var(--col-span, ${span}) var(--col-span, ${span}) 0%`,
        // @ts-ignore - CSS custom properties
        '--col-span-desktop': span,
        '--col-span-tablet': tablet,
        '--col-span-mobile': mobile,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
