'use client'

/**
 * GridLabel: Figma-style label that aligns to the 16px baseline grid
 *
 * Design spec:
 * - Height: 24px (1.5 cells) or 32px (2 cells): must align to grid
 * - Width: whole 16px cells
 * - Background: accent at 12% over an opaque underlay (the paper, or --surface-under inside cards),
 *   so the colour is unchanged but the grid doesn't show through
 * - Text: white, uppercase, mono
 * - Border radius: 4px (Figma-style)
 */

import { ReactNode, type CSSProperties } from 'react'

/**
 * Width rounded up to whole 16px cells. The type is monospace, so the text's width is its character
 * count times (1ch + letter-spacing); tracking-wide is 0.025em. Plain-string children only.
 */
function cellWidth(children: ReactNode, paddingX: number, border: number): CSSProperties {
  const text = Array.isArray(children) ? children.join('') : children
  if (typeof text !== 'string' && typeof text !== 'number') return {}
  const chars = String(text).length
  // A bordered label is one pixel wider and taller, given back by negative margins, so its right and
  // bottom borders sit on lattice lines like its left and top ones.
  const overhang = border ? { marginRight: '-1px', marginBottom: '-1px' } : {}
  return {
    minWidth: `calc(round(up, ${chars} * (1ch + 0.025em) + ${2 * paddingX + 2 * border}px, 16px) + ${border}px)`,
    justifyContent: 'center',
    ...overhang,
  }
}

interface GridLabelProps {
  children: ReactNode
  /** Size variant - 'sm' (24px) or 'md' (32px) */
  size?: 'sm' | 'md'
  /** Optional className for additional styling */
  className?: string
}

export default function GridLabel({
  children,
  size = 'sm',
  className = '',
}: GridLabelProps) {
  const height = size === 'sm' ? 24 : 32
  const paddingX = size === 'sm' ? 12 : 16

  return (
    <span
      data-grid-label=""
      className={`inline-flex items-center font-mono font-medium text-label uppercase tracking-wide whitespace-nowrap relative ${className}`}
      style={{
        height: `${height}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        background: 'linear-gradient(rgb(var(--accent-rgb) / 0.12), rgb(var(--accent-rgb) / 0.12)), var(--surface-under, var(--bg-primary))',
        ...cellWidth(children, paddingX, 0),
        color: 'var(--accent)',
        borderRadius: '4px',
        lineHeight: '1',
        zIndex: 20,
      }}
    >
      {children}
    </span>
  )
}

/**
 * GridLabelMuted: Light variant for secondary labels
 */
export function GridLabelMuted({
  children,
  size = 'sm',
  className = '',
}: GridLabelProps) {
  const height = size === 'sm' ? 24 : 32
  const paddingX = size === 'sm' ? 12 : 16

  return (
    <span
      data-grid-label=""
      className={`inline-flex items-center font-mono font-medium text-label uppercase tracking-wide whitespace-nowrap relative ${className}`}
      style={{
        height: `${height + 1}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        backgroundColor: 'var(--bg-surface)',
        ...cellWidth(children, paddingX, 1),
        color: 'var(--text-secondary)',
        borderRadius: '4px',
        lineHeight: '1',
        border: '1px solid var(--border-subtle)',
        zIndex: 20,
      }}
    >
      {children}
    </span>
  )
}
