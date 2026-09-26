/**
 * Inputs for the hero's glyph layer that don't need the GPU: where the 16px cells start, and the
 * scroll band. Dependency-free so node can test it directly (npm run test:hero).
 */

export const CELL = 16

/** Gaussian half-width of the scroll band, CSS px (the band reads as about six cells tall). */
export const BAND_SIGMA = 48

/** Band strength saturates at this scroll speed, px/s. */
const BAND_SATURATION = 1500
/** Seconds for the band to fall below 5% once scrolling stops. */
const BAND_DECAY = 0.8
/** Velocity smoothing time constant, s. */
const VELOCITY_TAU = 0.08

/**
 * Cell origin in section CSS px. Columns start on the page lattice (the copy's left edge, the same
 * integer the paper below uses); rows are anchored to the bottom edge so the last row meets the paper.
 */
export function cellOrigin(latticeX: number, height: number): { x: number; y: number } {
  const mod = (n: number) => ((n % CELL) + CELL) % CELL
  return { x: mod(latticeX), y: mod(height) }
}

export interface ScrollBand {
  /** Last scroll position seen while active; null after an inactive frame. */
  lastY: number | null
  /** Smoothed scroll velocity, px/s (positive is down). */
  velocity: number
  /** 0 to 1. */
  strength: number
  /** Pattern clock offset, s. */
  phase: number
}

export function newScrollBand(): ScrollBand {
  return { lastY: null, velocity: 0, strength: 0, phase: 0 }
}

/**
 * Advance the band by one frame. `y` is window.scrollY, or null when the hero is off screen, the tab
 * is hidden or motion is reduced; a null frame forgets the position so the next one can't spike.
 */
export function stepScroll(s: ScrollBand, y: number | null, dt: number, phasePerPx: number): void {
  const decay = Math.exp((-dt * 3) / BAND_DECAY)
  if (y === null || s.lastY === null) {
    s.lastY = y
    s.velocity = 0
    s.strength *= decay
    return
  }
  const dy = y - s.lastY
  s.lastY = y
  s.phase += dy * phasePerPx
  const v = dy / Math.max(dt, 1e-3)
  s.velocity += (v - s.velocity) * (1 - Math.exp(-dt / VELOCITY_TAU))
  const target = Math.min(1, Math.abs(s.velocity) / BAND_SATURATION)
  s.strength = Math.max(target, s.strength * decay)
}

/** The band sits on a fixed viewport line (62% down); in section coordinates it sweeps as the page scrolls. */
export function bandY(innerHeight: number, sectionTop: number): number {
  return 0.62 * innerHeight - sectionTop
}
