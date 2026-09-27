import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HALO, SHAPE_PAD, STRETCH_MAX, fitShape, haloCells, reduceToCells } from './shape.ts'

/** An opaque rectangle (x0, y0, x1, y1) in a bw by bh RGBA image. */
function rect(bw: number, bh: number, x0: number, y0: number, x1: number, y1: number) {
  const px = new Uint8ClampedArray(bw * bh * 4)
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) px[(y * bw + x) * 4 + 3] = 255
  return px
}

test('a fully covered cell reads 255 and its neighbours 0, at texel (cx + 1, cy + 1)', () => {
  // Box at (32, 48) in a 160 by 160 section, origin (0, 0): the image's first cell is cell (2, 3).
  const g = reduceToCells(rect(16, 16, 0, 0, 16, 16), 16, 16, 32, 48, 0, 0, 160, 160)
  assert.equal(g.cols, 12)
  assert.equal(g.rows, 12)
  assert.equal(g.bytes[4 * g.cols + 3], 255)
  assert.equal(g.bytes[4 * g.cols + 4], 0)
  assert.equal(g.bytes.reduce((a, b) => a + b, 0), 255)
})

test('coverage follows the lattice origin, including the partial cell before it', () => {
  // Origin (5, 0): section x 0 to 4 belongs to cell -1, texel 0.
  const g = reduceToCells(rect(21, 16, 0, 0, 21, 16), 21, 16, 0, 0, 5, 0, 64, 32)
  assert.equal(g.bytes[1 * g.cols + 0], Math.round((5 * 16 * 255) / 256))
  assert.equal(g.bytes[1 * g.cols + 1], 255)
})

test('a half covered cell reads about half', () => {
  const g = reduceToCells(rect(16, 16, 0, 0, 8, 16), 16, 16, 0, 0, 0, 0, 32, 32)
  assert.equal(g.bytes[1 * g.cols + 1], 128)
})

test('the halo rings the shape within the radius and leaves the shape itself alone', () => {
  const g = reduceToCells(rect(16, 16, 0, 0, 16, 16), 16, 16, 64, 64, 0, 0, 160, 160)
  const h = haloCells(g, 2)
  const at = (cx: number, cy: number) => h.bytes[(cy + 1) * h.cols + cx + 1]
  assert.equal(at(4, 4), 255)
  assert.equal(at(5, 4), HALO)
  assert.equal(at(6, 4), HALO)
  assert.equal(at(6, 6), 0) // outside radius 2 on the diagonal
  assert.equal(at(7, 4), 0)
  assert.equal(g.bytes[5 * g.cols + 6], 0) // the input grid is untouched
})

test('the fit stays inside the padded box and stretches at most STRETCH_MAX', () => {
  const m = { left: -0.05, right: 1.75, ascent: 0.7, descent: 0 }
  for (const [bw, bh] of [[400, 600], [368, 288], [700, 200]]) {
    const f = fitShape(m, bw, bh, 'center')
    assert.ok(f.sy >= 1 && f.sy <= STRETCH_MAX)
    const inkW = (m.left + m.right) * f.size + f.lw
    const top = (f.y - m.ascent * f.size - f.lw / 2) * f.sy
    const bottom = (f.y + m.descent * f.size + f.lw / 2) * f.sy
    assert.ok(inkW <= bw - 2 * SHAPE_PAD + 1e-6)
    assert.ok(top >= SHAPE_PAD - 1e-6 && bottom <= bh - SHAPE_PAD + 1e-6)
  }
})
