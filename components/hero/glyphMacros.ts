/**
 * The glyph layer's six controls, and how each expands into the shader's tuning values. The lab shows
 * only these; settings.ts stores them, so values tuned in the lab paste straight back.
 * Every control runs 0 to 1 with a clearly visible range, and the defaults reproduce the look Miguel
 * locked on 2026-09-26 (see the spec's amendment of that date).
 */
import type { HeroValues } from './settings'

export interface GlyphMacros {
  /** 0-1: how many glyphs show at rest, from empty to rich; bursts still work at 0. */
  density: number
  /** 0-1: how fast rest glyphs churn, streams fall and the pattern evolves; 0 is frozen. */
  motion: number
  /** 0-1: share of columns carrying a falling stream (0 to 35%) and the length of its trail. */
  streams: number
  /** 0-1: how strongly a tap, click or pointer wake lifts, bends and darkens glyphs. */
  burst: number
  /** 0-1: how strongly scrolling sweeps a band and morphs the pattern. */
  scroll: number
  /** 0-1: pattern scale, 3 to 30 cells on a log scale. */
  size: number
}

export const GLYPH_MACROS: GlyphMacros = { density: 0.4, motion: 0.605, streams: 0.314, burst: 0.5, scroll: 0.5, size: 0.564 }

const unit = (x: number) => Math.min(1, Math.max(0, Number(x)))

export function expandGlyphMacros(m: GlyphMacros): HeroValues {
  const d = unit(m.density)
  const mo = unit(m.motion)
  const s = unit(m.streams)
  const b = unit(m.burst)
  const r = unit(m.scroll)
  const z = unit(m.size)
  return {
    glyphs: true,
    glyphRest: 0.99 - 0.55 * d,
    glyphChurn: 20 * mo,
    glyphStreamSpeed: 18 * mo,
    glyphSpeed: 18 * mo,
    glyphRain: 0.35 * s,
    glyphTrail: 6 + 19 * s,
    glyphWake: 4 * b,
    glyphMutate: 2.4 * Math.max(0, b - 0.5),
    glyphInkMax: 0.4 + 0.6 * b,
    // The shader clamps deepening at 1, so the upper half of the range saturates sooner.
    glyphDeepen: 2 * b,
    bandGain: 2 * r,
    glyphScrollPhase: 0.2 * r,
    glyphScale: 3 * Math.pow(10, z),
  }
}
