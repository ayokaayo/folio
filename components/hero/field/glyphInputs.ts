/**
 * Inputs for the hero's glyph layer that don't need the GPU: where the 16px cells start, and the
 * scroll band. Dependency-free so node can test it directly (npm run test:hero).
 */

export const CELL = 16

/** Copy line boxes the shader can hold (headline plus subtitle lines). */
export const MAX_MASK = 12

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

/** Where the scroll band sits, as a fraction of the viewport height: just under the nav. */
export const BAND_LINE = 0.12

/**
 * The band sits on a fixed viewport line (BAND_LINE down, just under the nav); in section coordinates it
 * sweeps the whole hero from top to bottom as the hero scrolls away, and back up on the way back.
 */
export function bandY(innerHeight: number, sectionTop: number): number {
  return BAND_LINE * innerHeight - sectionTop
}

/** The pattern clock wraps here, s: ten hours, so the pattern never visibly re-rolls in a visit. */
export const CLOCK_WRAP = 36000

export interface GlyphClockTerms {
  /** Blend weights of the three fields, normalised to sum 1. */
  w: [number, number, number]
  /** Ring centre offset from the section centre, cells. */
  o1: [number, number]
  /** Rosette centre offset from the section centre, cells. */
  o2: [number, number]
  /** Diamond turn: cos and sin. */
  rot: [number, number]
  /** Rosette spin, radians, wrapped to one turn. */
  spin: number
}

/**
 * The glyph pattern's terms that depend only on the pattern clock t (s), worked out once per frame
 * rather than per pixel. Mirrors glyphPattern in glyphs.ts.
 */
export function glyphClockTerms(t: number): GlyphClockTerms {
  const TAU = Math.PI * 2
  const w = [40, 53, 67].map((p, i) => 0.5 + 0.5 * Math.sin((TAU * t) / p + 2.1 * i)) as [number, number, number]
  const sum = Math.max(w[0] + w[1] + w[2], 1e-3)
  const a = t / 90
  return {
    w: [w[0] / sum, w[1] / sum, w[2] / sum],
    o1: [18 * Math.sin(t / 29), 9 * Math.sin(t / 37 + 1)],
    o2: [-14 * Math.sin(t / 43 + 2), 7 * Math.sin(t / 31)],
    rot: [Math.cos(a), Math.sin(a)],
    spin: (((t / 7) % TAU) + TAU) % TAU,
  }
}
