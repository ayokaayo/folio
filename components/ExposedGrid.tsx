'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

/**
 * ExposedGrid — Visual grid overlay with refined golden spotlight effect
 *
 * Features:
 * - Trailing hover wake with graduated intensity falloff
 * - Multi-layer glow effects with organic spring easing
 * - Staggered element animations for depth
 * - Ambient breathing pulse on hover
 * - Corner intersection markers
 */

// Grid constants - exported for use in other components
export const GRID_GAP = 16
export const GRID_COLUMNS_DESKTOP = 12
export const GRID_COLUMNS_TABLET = 6
export const GRID_COLUMNS_MOBILE = 4

// Golden palette with refined variations
const GOLDEN = {
  primary: '#C9A227',
  bright: '#D4AF37',
  warm: '#B8960F',
  glow: 'rgba(201, 162, 39, 0.6)',
  glowSoft: 'rgba(201, 162, 39, 0.3)',
  glowSubtle: 'rgba(201, 162, 39, 0.12)',
}

// Refined easing curves
const EASING = {
  // Smooth spring-like settle
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  // Elegant ease-out for fades
  fadeOut: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  // Quick response, smooth settle
  responsive: 'cubic-bezier(0.19, 1, 0.22, 1)',
  // Gentle breathing
  breath: 'cubic-bezier(0.37, 0, 0.63, 1)',
}

interface ExposedGridProps {
  showColumns?: boolean
  showBaseline?: boolean
  opacity?: number
  position?: 'fixed' | 'absolute'
  zIndex?: number
  showLabels?: boolean
  showGaps?: boolean
  interactive?: boolean
}

// Trail history entry
interface TrailEntry {
  column: number
  timestamp: number
}

export default function ExposedGrid({
  showColumns = true,
  showBaseline = false,
  opacity = 0.5,
  position = 'absolute',
  zIndex = 0,
  showLabels = true,
  showGaps = true,
  interactive = true,
}: ExposedGridProps) {
  const [columnCount, setColumnCount] = useState(12)
  const [activeColumn, setActiveColumn] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [trail, setTrail] = useState<TrailEntry[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastMouseX = useRef<number | null>(null)
  const trailTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Trail decay timing (ms)
  const TRAIL_DURATION = 1400
  const TRAIL_MAX_LENGTH = 8

  // Track column count for responsive grids
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

  // Decay trail over time
  useEffect(() => {
    if (!isHovering || trail.length === 0) return

    const decayTrail = () => {
      const now = Date.now()
      setTrail(prev => prev.filter(entry => now - entry.timestamp < TRAIL_DURATION))
    }

    const interval = setInterval(decayTrail, 50)
    return () => clearInterval(interval)
  }, [isHovering, trail.length])

  // Calculate which column the mouse is over
  const calculateActiveColumn = useCallback((clientX: number) => {
    if (!gridRef.current) return null

    const rect = gridRef.current.getBoundingClientRect()
    const padding = GRID_GAP

    const relativeX = clientX - rect.left - padding
    const contentWidth = rect.width - (padding * 2)
    const slotWidth = contentWidth / columnCount
    const columnIndex = Math.round(relativeX / slotWidth)

    if (columnIndex >= 0 && columnIndex < columnCount) {
      return columnIndex
    }
    return null
  }, [columnCount])

  // Handle mouse move with RAF for smooth performance
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive) return

    lastMouseX.current = e.clientX

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        if (lastMouseX.current !== null) {
          const newColumn = calculateActiveColumn(lastMouseX.current)

          // Update trail when column changes
          if (newColumn !== null && newColumn !== activeColumn) {
            setTrail(prev => {
              const now = Date.now()
              // Add previous active column to trail
              const newTrail = activeColumn !== null
                ? [{ column: activeColumn, timestamp: now }, ...prev]
                : prev
              // Limit trail length
              return newTrail.slice(0, TRAIL_MAX_LENGTH)
            })
          }

          setActiveColumn(newColumn)
        }
        rafRef.current = null
      })
    }
  }, [interactive, calculateActiveColumn, activeColumn])

  const handleMouseEnter = useCallback(() => {
    if (!interactive) return
    setIsHovering(true)
  }, [interactive])

  const handleMouseLeave = useCallback(() => {
    if (!interactive) return
    setIsHovering(false)
    setActiveColumn(null)
    // Clear trail with a graceful fade
    if (trailTimeoutRef.current) clearTimeout(trailTimeoutRef.current)
    trailTimeoutRef.current = setTimeout(() => setTrail([]), TRAIL_DURATION)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [interactive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      if (trailTimeoutRef.current) clearTimeout(trailTimeoutRef.current)
    }
  }, [])

  // Calculate intensity based on distance and trail
  const getColumnIntensity = useCallback((columnIndex: number): {
    intensity: number
    delay: number
    isTrail: boolean
  } => {
    const now = Date.now()

    // Check if this column is the active one
    if (activeColumn === columnIndex) {
      return { intensity: 1, delay: 0, isTrail: false }
    }

    // Check distance from active column (neighbor effect)
    if (activeColumn !== null) {
      const distance = Math.abs(columnIndex - activeColumn)
      if (distance <= 5) {
        // Exponential falloff: 1, 0.45, 0.2, 0.09, 0.04, 0.02
        const neighborIntensity = Math.pow(0.45, distance)
        const delay = distance * 55
        return { intensity: neighborIntensity, delay, isTrail: false }
      }
    }

    // Check trail
    const trailEntry = trail.find(t => t.column === columnIndex)
    if (trailEntry) {
      const age = now - trailEntry.timestamp
      // Ease-out curve for more natural fade: starts strong, fades gracefully
      const normalizedAge = age / TRAIL_DURATION
      const trailIntensity = Math.max(0, Math.pow(1 - normalizedAge, 1.5)) * 0.6
      return { intensity: trailIntensity, delay: 0, isTrail: true }
    }

    return { intensity: 0, delay: 0, isTrail: false }
  }, [activeColumn, trail])

  return (
    <div
      ref={gridRef}
      className={`${position === 'fixed' ? 'fixed' : 'absolute'} inset-0 ${interactive ? 'cursor-crosshair' : 'pointer-events-none'} select-none overflow-hidden`}
      style={{
        zIndex,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          {Array.from({ length: columnCount }).map((_, i) => {
            const { intensity, delay, isTrail } = getColumnIntensity(i)
            const isActive = activeColumn === i
            const hasGlow = intensity > 0.1

            // Staggered timing for different elements
            const edgeDelay = delay
            const fillDelay = delay + 50
            const labelDelay = delay + 100
            const cornerDelay = delay + 30

            return (
              <div
                key={i}
                className="relative h-full"
                style={{
                  flex: '1 1 0%',
                }}
              >
                {/* Column fill - subtle golden wash */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: intensity > 0
                      ? `linear-gradient(
                          180deg,
                          rgba(201, 162, 39, ${0.08 * intensity}) 0%,
                          rgba(201, 162, 39, ${0.04 * intensity}) 30%,
                          rgba(201, 162, 39, ${0.02 * intensity}) 60%,
                          transparent 100%
                        )`
                      : 'transparent',
                    transition: `background ${isTrail ? 800 : 1100}ms ${EASING.fadeOut} ${fillDelay}ms`,
                  }}
                />

                {/* Left edge - base line */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-px"
                  style={{
                    backgroundColor: 'var(--border-subtle)',
                    opacity: hasGlow ? opacity * (1 - intensity * 0.7) : opacity,
                    transition: `opacity 900ms ${EASING.fadeOut} ${edgeDelay}ms`,
                  }}
                />

                {/* Right edge - base line */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-px"
                  style={{
                    backgroundColor: 'var(--border-subtle)',
                    opacity: hasGlow ? opacity * (1 - intensity * 0.7) : opacity,
                    transition: `opacity 900ms ${EASING.fadeOut} ${edgeDelay}ms`,
                  }}
                />

                {/* Left edge - golden glow layer 1 (soft spread) */}
                <div
                  className="absolute left-0 top-0 bottom-0"
                  style={{
                    width: '3px',
                    marginLeft: '-1px',
                    background: `linear-gradient(
                      180deg,
                      ${GOLDEN.glowSoft} 0%,
                      ${GOLDEN.glowSubtle} 40%,
                      transparent 80%
                    )`,
                    opacity: intensity,
                    filter: `blur(2px)`,
                    transition: `opacity ${isTrail ? 600 : 1000}ms ${EASING.responsive} ${edgeDelay}ms`,
                  }}
                />

                {/* Left edge - golden glow layer 2 (core) */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-px"
                  style={{
                    background: `linear-gradient(
                      180deg,
                      ${GOLDEN.bright} 0%,
                      ${GOLDEN.primary} 15%,
                      ${GOLDEN.warm} 35%,
                      rgba(201, 162, 39, 0.4) 60%,
                      transparent 90%
                    )`,
                    opacity: intensity,
                    boxShadow: isActive
                      ? `0 0 8px ${GOLDEN.glow}, 0 0 20px ${GOLDEN.glowSoft}, 0 0 40px ${GOLDEN.glowSubtle}`
                      : hasGlow
                        ? `0 0 6px ${GOLDEN.glowSoft}`
                        : 'none',
                    transition: `opacity ${isTrail ? 500 : 900}ms ${EASING.responsive} ${edgeDelay}ms, box-shadow 1000ms ${EASING.fadeOut} ${edgeDelay}ms`,
                  }}
                />

                {/* Right edge - golden glow layer 1 (soft spread) */}
                <div
                  className="absolute right-0 top-0 bottom-0"
                  style={{
                    width: '3px',
                    marginRight: '-1px',
                    background: `linear-gradient(
                      180deg,
                      ${GOLDEN.glowSoft} 0%,
                      ${GOLDEN.glowSubtle} 40%,
                      transparent 80%
                    )`,
                    opacity: intensity,
                    filter: `blur(2px)`,
                    transition: `opacity ${isTrail ? 600 : 1000}ms ${EASING.responsive} ${edgeDelay}ms`,
                  }}
                />

                {/* Right edge - golden glow layer 2 (core) */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-px"
                  style={{
                    background: `linear-gradient(
                      180deg,
                      ${GOLDEN.bright} 0%,
                      ${GOLDEN.primary} 15%,
                      ${GOLDEN.warm} 35%,
                      rgba(201, 162, 39, 0.4) 60%,
                      transparent 90%
                    )`,
                    opacity: intensity,
                    boxShadow: isActive
                      ? `0 0 8px ${GOLDEN.glow}, 0 0 20px ${GOLDEN.glowSoft}, 0 0 40px ${GOLDEN.glowSubtle}`
                      : hasGlow
                        ? `0 0 6px ${GOLDEN.glowSoft}`
                        : 'none',
                    transition: `opacity ${isTrail ? 500 : 900}ms ${EASING.responsive} ${edgeDelay}ms, box-shadow 1000ms ${EASING.fadeOut} ${edgeDelay}ms`,
                  }}
                />

                {/* Top-left corner marker */}
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: '4px',
                    height: '4px',
                    marginLeft: '-1.5px',
                    marginTop: '-1.5px',
                    borderRadius: '50%',
                    background: GOLDEN.bright,
                    opacity: intensity * 0.9,
                    boxShadow: isActive
                      ? `0 0 6px ${GOLDEN.glow}, 0 0 12px ${GOLDEN.glowSoft}`
                      : 'none',
                    transform: `scale(${0.6 + intensity * 0.4})`,
                    transition: `opacity 700ms ${EASING.responsive} ${cornerDelay}ms, transform 800ms ${EASING.spring} ${cornerDelay}ms, box-shadow 900ms ${EASING.fadeOut}`,
                  }}
                />

                {/* Top-right corner marker */}
                <div
                  className="absolute right-0 top-0"
                  style={{
                    width: '4px',
                    height: '4px',
                    marginRight: '-1.5px',
                    marginTop: '-1.5px',
                    borderRadius: '50%',
                    background: GOLDEN.bright,
                    opacity: intensity * 0.9,
                    boxShadow: isActive
                      ? `0 0 6px ${GOLDEN.glow}, 0 0 12px ${GOLDEN.glowSoft}`
                      : 'none',
                    transform: `scale(${0.6 + intensity * 0.4})`,
                    transition: `opacity 700ms ${EASING.responsive} ${cornerDelay}ms, transform 800ms ${EASING.spring} ${cornerDelay}ms, box-shadow 900ms ${EASING.fadeOut}`,
                  }}
                />

                {/* Column label */}
                {showLabels && (
                  <span
                    className="absolute top-4 left-2 font-mono text-caption"
                    style={{
                      color: intensity > 0.5
                        ? GOLDEN.primary
                        : intensity > 0
                          ? `rgba(201, 162, 39, ${0.4 + intensity * 0.6})`
                          : 'var(--text-tertiary)',
                      opacity: intensity > 0 ? 0.4 + intensity * 0.6 : opacity * 0.5,
                      textShadow: isActive
                        ? `0 0 10px ${GOLDEN.glow}, 0 0 20px ${GOLDEN.glowSoft}`
                        : hasGlow
                          ? `0 0 6px ${GOLDEN.glowSubtle}`
                          : 'none',
                      transform: `translateY(${isActive ? -2 : intensity > 0 ? -1 * intensity : 0}px)`,
                      letterSpacing: isActive ? '0.05em' : '0',
                      transition: `
                        color 800ms ${EASING.fadeOut} ${labelDelay}ms,
                        opacity 800ms ${EASING.fadeOut} ${labelDelay}ms,
                        text-shadow 900ms ${EASING.fadeOut} ${labelDelay}ms,
                        transform 900ms ${EASING.spring} ${labelDelay}ms,
                        letter-spacing 800ms ${EASING.responsive} ${labelDelay}ms
                      `,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showBaseline && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 3px,
              rgba(0, 143, 240, ${opacity * 0.3}) 3px,
              rgba(0, 143, 240, ${opacity * 0.3}) 4px
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
  style?: React.CSSProperties
}

export function GridRow({ children, className = '', style }: GridRowProps) {
  return (
    <div
      className={`max-w-content mx-auto w-full ${className}`}
      style={{
        display: 'flex',
        gap: `${GRID_GAP}px`,
        paddingLeft: `${GRID_GAP}px`,
        paddingRight: `${GRID_GAP}px`,
        ...style,
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
