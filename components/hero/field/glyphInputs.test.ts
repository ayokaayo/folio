import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BAND_SIGMA, CELL, bandY, cellOrigin, newScrollBand, stepScroll } from './glyphInputs.ts'

test('cell columns follow the lattice origin and rows are anchored to the bottom edge', () => {
  assert.equal(CELL, 16)
  assert.deepEqual(cellOrigin(48, 682), { x: 0, y: 10 })
  assert.deepEqual(cellOrigin(35, 666), { x: 3, y: 10 })
  // A hero that is exactly whole cells high starts rows at its top.
  assert.deepEqual(cellOrigin(11, 704), { x: 11, y: 0 })
})

test('first sample only records the position', () => {
  const s = newScrollBand()
  stepScroll(s, 500, 1 / 60, 0.02)
  assert.equal(s.lastY, 500)
  assert.equal(s.strength, 0)
  assert.equal(s.phase, 0)
})

test('fast scrolling saturates the band and advances the phase; scrolling up reverses it', () => {
  const s = newScrollBand()
  stepScroll(s, 0, 1 / 60, 0.02)
  for (let i = 1; i <= 20; i++) stepScroll(s, i * 30, 1 / 60, 0.02) // 1800 px/s
  assert.ok(s.strength > 0.95, `strength ${s.strength}`)
  assert.ok(Math.abs(s.phase - 600 * 0.02) < 1e-9)
  for (let i = 19; i >= 0; i--) stepScroll(s, i * 30, 1 / 60, 0.02)
  assert.ok(Math.abs(s.phase) < 1e-9)
})

test('the band decays below 5% about 0.8 s after stopping', () => {
  const s = newScrollBand()
  stepScroll(s, 0, 1 / 60, 0.02)
  for (let i = 1; i <= 20; i++) stepScroll(s, i * 30, 1 / 60, 0.02)
  for (let i = 0; i < 51; i++) stepScroll(s, 600, 1 / 60, 0.02) // 0.85 s still: margin over the 0.8 s decay
  assert.ok(s.strength < 0.05, `strength ${s.strength}`)
})

test('an inactive frame resets the position, so coming back does not spike', () => {
  const s = newScrollBand()
  stepScroll(s, 0, 1 / 60, 0.02)
  stepScroll(s, null, 1 / 60, 0.02)
  assert.equal(s.lastY, null)
  stepScroll(s, 5000, 1 / 60, 0.02) // hero back on screen far down the page
  assert.equal(s.strength, 0)
  assert.equal(s.phase, 0)
})

test('the band is pinned to 62% of the viewport, in section coordinates', () => {
  assert.equal(bandY(1000, 80), 540)
  assert.equal(bandY(1000, -300), 920)
  assert.equal(BAND_SIGMA, 48)
})
