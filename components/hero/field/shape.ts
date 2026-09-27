/**
 * The glyph layer's shape (the not-found pages' "404"): text set in the site mono on an offscreen canvas,
 * then reduced to one byte per 16px lattice cell, the share of the cell the type covers. engine.ts uploads
 * the grid as a texture and glyphs.ts fills the covered cells with dense heavy marks.
 * reduceToCells is dependency-free so node can test it (npm run test:hero); rasterShape needs a DOM.
 */
import { CELL } from './glyphInputs.ts'

export interface ShapeGrid {
  /** Texture size in cells. Cell (cx, cy) sits at texel (cx + 1, cy + 1): the lattice origin can leave a
   *  partial column left of it and a partial row above it, and those are cells -1. */
  cols: number
  rows: number
  /** Coverage per cell, 0 to 255, row-major from the top row. */
  bytes: Uint8Array
  /** The cell origin the grid was built against, section CSS px. */
  ox: number
  oy: number
}

/**
 * Sums the alpha of an RGBA image placed at (bx, by) in a w by h section into lattice cells whose origin
 * is (ox, oy). A cell's byte is the covered share of its whole area, so half inside the image counts half.
 */
export function reduceToCells(
  rgba: ArrayLike<number>,
  bw: number,
  bh: number,
  bx: number,
  by: number,
  ox: number,
  oy: number,
  w: number,
  h: number,
): ShapeGrid {
  const cols = Math.ceil(w / CELL) + 2
  const rows = Math.ceil(h / CELL) + 2
  const sum = new Float64Array(cols * rows)
  for (let y = 0; y < bh; y++) {
    const j = Math.floor((by + y + 0.5 - oy) / CELL) + 1
    if (j < 0 || j >= rows) continue
    for (let x = 0; x < bw; x++) {
      const a = rgba[(y * bw + x) * 4 + 3]
      if (!a) continue
      const i = Math.floor((bx + x + 0.5 - ox) / CELL) + 1
      if (i < 0 || i >= cols) continue
      sum[j * cols + i] += a
    }
  }
  const bytes = new Uint8Array(cols * rows)
  for (let k = 0; k < sum.length; k++) bytes[k] = Math.min(255, Math.round(sum[k] / (CELL * CELL)))
  return { cols, rows, bytes, ox, oy }
}

/** Stroke laid over the fill, in em: the site loads the mono up to medium, and the digits want bold. */
const EMBOLDEN = 0.07
/**
 * How far the type may be stretched vertically to fill a tall box. Three monospace digits across a few columns
 * come out only nine or ten cells high, too coarse for the counters of 0 and 4 to read; drawn taller and
 * condensed, they read at a glance, like a segment display.
 */
export const STRETCH_MAX = 1.8

/**
 * Sets text as large as fits a bw by bh box (one cell clear top and bottom, and at the sides when centred),
 * in the given font family's medium weight, stretched up to STRETCH_MAX times vertically to fill the box's
 * height, and returns the box's RGBA pixels.
 */
export function rasterShape(text: string, bw: number, bh: number, align: 'start' | 'center', family: string): Uint8ClampedArray {
  const canvas = document.createElement('canvas')
  canvas.width = bw
  canvas.height = bh
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Uint8ClampedArray(bw * bh * 4)
  const REF = 100
  ctx.font = `500 ${REF}px ${family}`
  const m = ctx.measureText(text)
  const inkW = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / REF + EMBOLDEN
  const inkH = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / REF + EMBOLDEN
  const padX = align === 'center' ? CELL : 0
  const byHeight = (bh - 2 * CELL) / inkH
  const size = Math.max(8, Math.min((bw - 2 * padX) / inkW, byHeight))
  const sy = Math.min(STRETCH_MAX, Math.max(1, byHeight / size))
  ctx.font = `500 ${size}px ${family}`
  const f = ctx.measureText(text)
  const lw = EMBOLDEN * size
  const iw = f.actualBoundingBoxLeft + f.actualBoundingBoxRight + lw
  const ih = f.actualBoundingBoxAscent + f.actualBoundingBoxDescent + lw
  const x = (align === 'center' ? (bw - iw) / 2 : 0) + lw / 2 + f.actualBoundingBoxLeft
  // y in the stretched frame: the ink is sy times taller on the canvas.
  const y = (bh - ih * sy) / 2 / sy + lw / 2 + f.actualBoundingBoxAscent
  ctx.setTransform(1, 0, 0, sy, 0, 0)
  ctx.fillStyle = '#000'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = lw
  ctx.lineJoin = 'round'
  ctx.fillText(text, x, y)
  ctx.strokeText(text, x, y)
  return ctx.getImageData(0, 0, bw, bh).data
}
