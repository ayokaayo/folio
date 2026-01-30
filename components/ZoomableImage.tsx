'use client'

import { useRef, useState, useEffect } from 'react'

interface ZoomableImageProps {
  src: string
  alt: string
  caption?: string
}

export default function ZoomableImage({ src, alt, caption }: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.1) // Start small, will be set on load
  const [minScale, setMinScale] = useState(0.1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Calculate fit scale when image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight

    setImageSize({ width: imgWidth, height: imgHeight })

    // Calculate scale to fit image in container
    const scaleX = containerRect.width / imgWidth
    const scaleY = containerRect.height / imgHeight
    const fitScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 1:1

    setMinScale(fitScale)
    setScale(fitScale)
    setPosition({ x: 0, y: 0 })
    setIsLoaded(true)
  }

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isLoaded || !containerRef.current || imageSize.width === 0) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const scaleX = containerRect.width / imageSize.width
      const scaleY = containerRect.height / imageSize.height
      const fitScale = Math.min(scaleX, scaleY, 1)

      setMinScale(fitScale)
      if (scale < fitScale) {
        setScale(fitScale)
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isLoaded, imageSize, scale])

  // Zoom handlers
  const zoomIn = () => {
    setScale(prev => Math.min(prev * 1.3, 1)) // Max 1:1
  }

  const zoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev / 1.3, minScale)
      if (newScale <= minScale) {
        setPosition({ x: 0, y: 0 })
      }
      return newScale
    })
  }

  const resetZoom = () => {
    setScale(minScale)
    setPosition({ x: 0, y: 0 })
  }


  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= minScale) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current.getBoundingClientRect()
    const imgWidth = imageSize.width * scale
    const imgHeight = imageSize.height * scale

    // Calculate bounds
    const maxX = Math.max(0, (imgWidth - container.width) / 2)
    const maxY = Math.max(0, (imgHeight - container.height) / 2)

    const newX = Math.max(-maxX, Math.min(maxX, e.clientX - dragStart.x))
    const newY = Math.max(-maxY, Math.min(maxY, e.clientY - dragStart.y))

    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch handlers for pan only
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale > minScale) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect()
      const imgWidth = imageSize.width * scale
      const imgHeight = imageSize.height * scale

      const maxX = Math.max(0, (imgWidth - container.width) / 2)
      const maxY = Math.max(0, (imgHeight - container.height) / 2)

      const newX = Math.max(-maxX, Math.min(maxX, e.touches[0].clientX - dragStart.x))
      const newY = Math.max(-maxY, Math.min(maxY, e.touches[0].clientY - dragStart.y))

      setPosition({ x: newX, y: newY })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const canZoomIn = scale < 0.99 // Allow zoom in if not at 1:1
  const canZoomOut = scale > minScale + 0.01
  const canPan = scale > minScale + 0.01
  const isAtDefault = scale <= minScale + 0.01 && position.x === 0 && position.y === 0

  return (
    <figure className="w-full">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden border border-text/10 bg-white"
        style={{ height: '500px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            cursor: canPan ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Native img required for zoom/pan transform and onLoad dimensions */}
          <img
            src={src}
            alt={alt}
            className="select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              maxWidth: 'none',
              maxHeight: 'none',
            }}
            onLoad={handleImageLoad}
            draggable={false}
          />
        </div>

        {/* Loading state - shimmer */}
        {!isLoaded && (
          <div 
            className="absolute inset-0 bg-text/5 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        {/* Controls */}
        {isLoaded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-text/10">
            {/* Zoom out */}
            <button
              onClick={zoomOut}
              disabled={!canZoomOut}
              className="p-1.5 rounded-full hover:bg-text/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
            >
              <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            {/* Zoom percentage */}
            <span className="text-xs font-mono text-text/70 min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>

            {/* Zoom in */}
            <button
              onClick={zoomIn}
              disabled={!canZoomIn}
              className="p-1.5 rounded-full hover:bg-text/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
            >
              <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-text/20" />

            {/* Reset */}
            <button
              onClick={resetZoom}
              disabled={isAtDefault}
              className="p-1.5 rounded-full hover:bg-text/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Reset view"
            >
              <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>

            {/* Pan indicator */}
            <div
              className={`p-1.5 rounded-full transition-colors ${canPan ? 'text-accent' : 'text-text/30'}`}
              title={canPan ? 'Drag to pan' : 'Zoom in to pan'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-text/60 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
