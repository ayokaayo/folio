'use client'

/**
 * FigmaFrame — Figma-style selection frame wrapper
 *
 * Wraps any card component to give it a Figma-like selection appearance:
 * - Corner resize handles (always visible)
 * - On hover: blue border, frame label, "click to open" pill
 */

import { ReactNode } from 'react'

interface FigmaFrameProps {
  children: ReactNode
  label?: string
  className?: string
  /** When true, border and frame chrome are always visible (no hover required) */
  alwaysVisible?: boolean
  /** When false, hide the pill (e.g. for non-link frames) */
  showPill?: boolean
  /** Custom text for the pill (default: "Click to open") */
  pillText?: string
}

export default function FigmaFrame({
  children,
  label = 'Frame',
  className = '',
  alwaysVisible = false,
  showPill = true,
  pillText = 'Click to open',
}: FigmaFrameProps) {
  return (
    <div
      className={`figma-frame group relative ${className} ${alwaysVisible ? 'figma-frame--always-visible' : ''}`}
    >
      {/* Corner handles - always visible */}
      <div className="corner-handle top-left" />
      <div className="corner-handle top-right" />
      <div className="corner-handle bottom-left" />
      <div className="corner-handle bottom-right" />

      {/* Frame label - visible on hover */}
      <div className="frame-label">
        {label}
      </div>

      {/* Pill - visible on hover (hidden when showPill is false) */}
      {showPill && (
        <div className="click-pill">
          {pillText}
        </div>
      )}

      {/* Card content */}
      {children}
    </div>
  )
}
