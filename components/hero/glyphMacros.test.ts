import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GLYPH_MACROS, expandGlyphMacros, type GlyphMacros } from './glyphMacros.ts'

// The look Miguel approved, as effective rates: locked 2026-09-26 (churn 1.1 on a pattern clock at x11,
// i.e. 12.1 swaps a second, streams at 11 times nominal), then idle motion slowed by a third on 2026-09-27.
const LOCKED: Record<string, number> = {
  glyphRest: 0.77,
  glyphKeep: 1,
  glyphChurn: 8.1,
  glyphStreamSpeed: 7.29,
  glyphSpeed: 7.29,
  glyphRain: 0.11,
  glyphTrail: 12,
  glyphWake: 2,
  glyphMutate: 0,
  glyphInkMax: 0.7,
  glyphDeepen: 1,
  bandGain: 1,
  glyphScrollPhase: 0.1,
  glyphScale: 11,
}

const near = (got: unknown, want: number, rel = 0.02) => Math.abs(Number(got) - want) <= Math.max(rel * Math.abs(want), 1e-9)

test('default macros reproduce the locked look within 2%', () => {
  const v = expandGlyphMacros(GLYPH_MACROS)
  assert.equal(v.glyphs, true)
  for (const [k, want] of Object.entries(LOCKED)) assert.ok(near(v[k], want), `${k}: ${v[k]} vs ${want}`)
})

test('density 0 leaves rest nearly empty but keeps the layer on', () => {
  const v = expandGlyphMacros({ ...GLYPH_MACROS, density: 0 })
  assert.ok(Number(v.glyphRest) >= 0.98)
  assert.equal(v.glyphKeep, 0)
  assert.equal(v.glyphs, true)
})

test('low density thins rest glyphs by occupancy', () => {
  assert.ok(near(expandGlyphMacros({ ...GLYPH_MACROS, density: 0.1 }).glyphKeep, 0.25, 1e-9))
  assert.equal(expandGlyphMacros({ ...GLYPH_MACROS, density: 1 }).glyphKeep, 1)
})

test('scroll ramps band gain quadratically: 0, 1 at the default, 4 at full', () => {
  assert.equal(expandGlyphMacros({ ...GLYPH_MACROS, scroll: 0 }).bandGain, 0)
  assert.ok(near(expandGlyphMacros({ ...GLYPH_MACROS, scroll: 0.5 }).bandGain, 1, 1e-9))
  assert.ok(near(expandGlyphMacros({ ...GLYPH_MACROS, scroll: 1 }).bandGain, 4, 1e-9))
})

test('motion 0 stops churn, streams and the pattern clock', () => {
  const v = expandGlyphMacros({ ...GLYPH_MACROS, motion: 0 })
  assert.equal(v.glyphChurn, 0)
  assert.equal(v.glyphStreamSpeed, 0)
  assert.equal(v.glyphSpeed, 0)
})

test('pattern size runs 3 to 30 cells', () => {
  assert.ok(near(expandGlyphMacros({ ...GLYPH_MACROS, size: 0 }).glyphScale, 3, 1e-9))
  assert.ok(near(expandGlyphMacros({ ...GLYPH_MACROS, size: 1 }).glyphScale, 30, 1e-9))
})

test('every control moves its primary key at least 1.8x across its range', () => {
  const primary: Record<keyof GlyphMacros, string> = {
    density: 'glyphRest',
    motion: 'glyphChurn',
    streams: 'glyphRain',
    burst: 'glyphWake',
    scroll: 'bandGain',
    size: 'glyphScale',
  }
  for (const [c, key] of Object.entries(primary) as [keyof GlyphMacros, string][]) {
    const a = Math.abs(Number(expandGlyphMacros({ ...GLYPH_MACROS, [c]: 0 })[key]))
    const b = Math.abs(Number(expandGlyphMacros({ ...GLYPH_MACROS, [c]: 1 })[key]))
    const ratio = Math.max(a, b) / Math.max(Math.min(a, b), 1e-9)
    assert.ok(ratio >= 1.8, `${c} -> ${key}: ${a} to ${b} (x${ratio.toFixed(2)})`)
  }
})
