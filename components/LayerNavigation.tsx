'use client'

/**
 * LayerNavigation — MONO EDITION
 * 
 * Sticky layer tabs for case study detail pages
 * - Tabs: [SURFACE] [STRUCTURE] [FOUNDATION]
 * - All text: IBM Plex Mono
 * - Accent: Forest green
 */

import { useState, useEffect, useCallback } from 'react'

export type Layer = 'surface' | 'structure' | 'foundation'

interface LayerNavigationProps {
  activeLayer: Layer
  onLayerChange: (layer: Layer) => void
}

const LAYERS: { id: Layer; label: string }[] = [
  { id: 'surface', label: 'Surface' },
  { id: 'structure', label: 'Structure' },
  { id: 'foundation', label: 'Foundation' },
]

export default function LayerNavigation({ 
  activeLayer, 
  onLayerChange,
}: LayerNavigationProps) {
  // Handle initial hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Layer
    if (LAYERS.some(l => l.id === hash)) {
      onLayerChange(hash)
    }
  }, [onLayerChange])

  // Update URL hash when layer changes
  const handleLayerClick = useCallback((layer: Layer) => {
    onLayerChange(layer)
    window.history.replaceState(null, '', `#${layer}`)
  }, [onLayerChange])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      handleLayerClick(LAYERS[index - 1].id)
    } else if (e.key === 'ArrowRight' && index < LAYERS.length - 1) {
      handleLayerClick(LAYERS[index + 1].id)
    }
  }, [handleLayerClick])

  return (
    <nav 
      className="sticky top-[80px] z-40 bg-bg-surface border-b border-border-subtle"
      role="tablist"
      aria-label="Case study layers"
    >
      <div className="max-w-content mx-auto px-6 sm:px-[5vw]">
        <div className="flex items-center gap-1">
          {LAYERS.map((layer, index) => {
            const isActive = activeLayer === layer.id
            return (
              <button
                key={layer.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${layer.id}-panel`}
                id={`${layer.id}-tab`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleLayerClick(layer.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="relative px-6 py-4 font-mono text-label uppercase tracking-wide transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {layer.label}
                
                {/* Active underline — forest green */}
                {isActive && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

/**
 * LayerContent — Wrapper for layer content with slide animation
 */
interface LayerContentProps {
  layer: Layer
  activeLayer: Layer
  children: React.ReactNode
}

export function LayerContent({ layer, activeLayer, children }: LayerContentProps) {
  const isActive = layer === activeLayer
  const wasActive = layer !== activeLayer

  if (!isActive && !wasActive) return null

  return (
    <div
      role="tabpanel"
      id={`${layer}-panel`}
      aria-labelledby={`${layer}-tab`}
      className="transition-transform duration-300 ease-out"
      style={{
        transform: isActive ? 'translateY(0)' : 'translateY(-20px)',
        opacity: isActive ? 1 : wasActive ? 0.15 : 0,
        display: isActive ? 'block' : wasActive ? 'block' : 'none',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  )
}
