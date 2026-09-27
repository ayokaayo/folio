import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BAND_LINE, BAND_SIGMA, CELL, CLOCK_WRAP, bandY, cellOrigin, glyphClockTerms, newScrollBand, stepScroll } from './glyphInputs.ts'

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

test('the band is pinned to BAND_LINE (12%) of the viewport, in section coordinates', () => {
  assert.equal(BAND_LINE, 0.12)
  assert.equal(bandY(1000, 80), 40)
  assert.equal(bandY(1000, -300), 420)
  assert.equal(BAND_SIGMA, 48)
})

test('clock terms match the per-pixel pattern maths they replace', () => {
  const TAU = Math.PI * 2
  for (const t of [0, 17.25, 1234.5, CLOCK_WRAP - 0.5]) {
    const g = glyphClockTerms(t)
    const w = [40, 53, 67].map((p, i) => 0.5 + 0.5 * Math.sin((TAU * t) / p + [0, 2.1, 4.2][i]))
    const sum = w[0] + w[1] + w[2]
    w.forEach((x, i) => assert.ok(Math.abs(g.w[i] - x / sum) < 1e-12))
    assert.ok(Math.abs(g.o1[0] - 18 * Math.sin(t / 29)) < 1e-12)
    assert.ok(Math.abs(g.o1[1] - 9 * Math.sin(t / 37 + 1)) < 1e-12)
    assert.ok(Math.abs(g.o2[0] + 14 * Math.sin(t / 43 + 2)) < 1e-12)
    assert.ok(Math.abs(g.o2[1] - 7 * Math.sin(t / 31)) < 1e-12)
    assert.ok(Math.abs(g.rot[0] - Math.cos(t / 90)) < 1e-12 && Math.abs(g.rot[1] - Math.sin(t / 90)) < 1e-12)
    // The spin is wrapped to one turn but lands on the same angle.
    assert.ok(g.spin >= 0 && g.spin < TAU)
    assert.ok(Math.abs(Math.cos(g.spin) - Math.cos(t / 7)) < 1e-9)
  }
})

test('the pattern clock wraps at ten hours', () => {
  assert.equal(CLOCK_WRAP, 36000)
})
