/**
 * The glyph layer's six controls, and how each expands into the shader's tuning values. The lab shows
 * only these; settings.ts stores them, so values tuned in the lab paste straight back.
 * Defaults (0.5 on the 0-1 controls) reproduce the values the layer was first tuned with.
 */
import type { HeroValues } from './settings'

export interface GlyphMacros {
  /** 0-1: how many glyphs show at rest and how heavy they can get; 0 turns the layer off. */
  density: number
  /** 0-1: how fast rest glyphs change and the pattern evolves; 0 is still. */
  motion: number
  /** 0-1: share of columns carrying a falling stream. */
  streams: number
  /** 0-1: how strongly a tap, click or pointer wake lifts, bends and darkens glyphs. */
  burst: number
  /** 0-1: how strongly scrolling sweeps a band and morphs the pattern. */
  scroll: number
  /** Pattern scale in cells. */
  size: number
}

export const GLYPH_MACROS: GlyphMacros = { density: 0.5, motion: 0.5, streams: 0.12, burst: 0.5, scroll: 0.5, size: 9 }

export function expandGlyphMacros(m: GlyphMacros): HeroValues {
  const d = Math.min(1, Math.max(0, m.density))
  const mo = Math.min(1, Math.max(0, m.motion))
  const b = Math.min(1, Math.max(0, m.burst))
  const sc = Math.min(1, Math.max(0, m.scroll))
  return {
    glyphs: d > 0,
    glyphRest: 0.98 - 0.36 * d,
    glyphRestTop: Math.min(6, Math.max(1, Math.round(2 + 8 * d))),
    glyphChurn: 3 * mo,
    glyphSpeed: 2 * mo,
    glyphRain: Math.min(1, Math.max(0, m.streams)),
    glyphWake: 2 * b,
    glyphMutate: b,
    glyphInkMax: 0.4 + 0.6 * b,
    glyphDeepen: 0.4 + 0.8 * b,
    bandGain: 2 * sc,
    glyphScrollPhase: 0.04 * sc,
    glyphScale: m.size,
  }
}
