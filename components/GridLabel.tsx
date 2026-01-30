'use client'

/**
 * GridLabel — Figma-style label that aligns to the 16px baseline grid
 *
 * Design spec:
 * - Height: 24px (1.5 cells) or 32px (2 cells) — must align to grid
 * - Background: accent blue (#008FF0)
 * - Text: white, uppercase, mono
 * - Border radius: 4px (Figma-style)
 */

import { ReactNode } from 'react'

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
      className={`inline-flex items-center font-mono text-label uppercase tracking-wide whitespace-nowrap ${className}`}
      style={{
        height: `${height}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        backgroundColor: 'var(--accent)',
        color: '#fff',
        borderRadius: '4px',
        lineHeight: '1',
      }}
    >
      {children}
    </span>
  )
}

/**
 * GridLabelMuted — Light variant for secondary labels
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
      className={`inline-flex items-center font-mono text-label uppercase tracking-wide whitespace-nowrap ${className}`}
      style={{
        height: `${height}px`,
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        borderRadius: '4px',
        lineHeight: '1',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {children}
    </span>
  )
}
