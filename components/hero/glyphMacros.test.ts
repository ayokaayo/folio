import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GLYPH_MACROS, expandGlyphMacros } from './glyphMacros.ts'

test('default macros reproduce the tuned glyph values', () => {
  const v = expandGlyphMacros(GLYPH_MACROS)
  assert.equal(v.glyphs, true)
  assert.ok(Math.abs(Number(v.glyphRest) - 0.8) < 1e-9)
  assert.equal(v.glyphRestTop, 6)
  assert.ok(Math.abs(Number(v.glyphChurn) - 1.5) < 1e-9)
  assert.ok(Math.abs(Number(v.glyphSpeed) - 1) < 1e-9)
  assert.ok(Math.abs(Number(v.glyphRain) - 0.12) < 1e-9)
  assert.ok(Math.abs(Number(v.glyphWake) - 1) < 1e-9)
  assert.ok(Math.abs(Number(v.glyphMutate) - 0.5) < 1e-9)
  assert.ok(Math.abs(Number(v.glyphInkMax) - 0.7) < 1e-9)
  assert.ok(Math.abs(Number(v.glyphDeepen) - 0.8) < 1e-9)
  assert.ok(Math.abs(Number(v.bandGain) - 1) < 1e-9)
  assert.ok(Math.abs(Number(v.glyphScrollPhase) - 0.02) < 1e-9)
  assert.equal(v.glyphScale, 9)
})

test('density 0 turns the layer off; low density keeps rest glyphs light', () => {
  assert.equal(expandGlyphMacros({ ...GLYPH_MACROS, density: 0 }).glyphs, false)
  const low = expandGlyphMacros({ ...GLYPH_MACROS, density: 0.2 })
  assert.equal(low.glyphs, true)
  assert.ok(Number(low.glyphRestTop) <= 4)
  assert.ok(Number(low.glyphRest) > 0.9)
})

test('motion 0 freezes rest; burst and scroll scale their groups together', () => {
  const still = expandGlyphMacros({ ...GLYPH_MACROS, motion: 0 })
  assert.equal(still.glyphChurn, 0)
  assert.equal(still.glyphSpeed, 0)
  const loud = expandGlyphMacros({ ...GLYPH_MACROS, burst: 1, scroll: 1 })
  assert.ok(Number(loud.glyphWake) > 1 && Number(loud.glyphInkMax) > 0.7 && Number(loud.glyphDeepen) > 0.8)
  assert.ok(Number(loud.bandGain) > 1 && Number(loud.glyphScrollPhase) > 0.02)
})
