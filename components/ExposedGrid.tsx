'use client'

/**
 * ExposedGrid — Visual 12-column grid overlay — MONO EDITION
 * 
 * A signature element of the Tactile Minimal × Swiss Brutalism design system.
 * The grid is exposed, not hidden — celebrating structural logic.
 * 
 * Features:
 * - 12-column grid with coordinate labels (01-12)
 * - Vertical lines at 50% opacity
 * - Grid-aligned to max-content container
 * - All text: IBM Plex Mono
 */

interface ExposedGridProps {
  /** Show vertical grid lines */
  showColumns?: boolean
  /** Show horizontal baseline grid (4px) */
  showBaseline?: boolean
  /** Grid line opacity (0-1) */
  opacity?: number
  /** Fixed position (full viewport) or absolute (container) */
  position?: 'fixed' | 'absolute'
  /** Z-index */
  zIndex?: number
  /** Grid coordinate labels */
  showLabels?: boolean
}

export default function ExposedGrid({
  showColumns = true,
  showBaseline = false,
  opacity = 0.5,
  position = 'absolute',
  zIndex = 0,
  showLabels = true,
}: ExposedGridProps) {
  return (
    <div
      className={`${position === 'fixed' ? 'fixed' : 'absolute'} inset-0 pointer-events-none select-none overflow-hidden`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      {/* 12-Column Grid */}
      {showColumns && (
        <div className="w-full h-full max-w-content mx-auto px-6 sm:px-[5vw]">
          <div className="grid grid-cols-12 gap-[2vw] h-full relative">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative h-full">
                {/* Vertical grid line */}
                <div 
                  className="absolute inset-y-0 left-0 w-px bg-border-subtle"
                  style={{ opacity }}
                />
                {/* Column coordinate label */}
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
            {/* Right edge line */}
            <div className="relative h-full">
              <div 
                className="absolute inset-y-0 right-0 w-px bg-border-subtle"
                style={{ opacity }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Baseline Grid (4px) */}
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

/**
 * GridContainer - Content wrapper with exposed grid
 */
interface GridContainerProps {
  children: React.ReactNode
  className?: string
  showGrid?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function GridContainer({
  children,
  className = '',
  showGrid = false,
  as: Component = 'div',
}: GridContainerProps) {
  return (
    <Component className={`relative w-full ${className}`}>
      {showGrid && <ExposedGrid showColumns opacity={0.4} />}
      <div className="relative z-10 max-w-content mx-auto px-6 sm:px-[5vw]">
        {children}
      </div>
    </Component>
  )
}
