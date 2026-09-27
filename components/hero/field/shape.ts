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
export const EMBOLDEN = 0.07
/**
 * How far the type may be stretched vertically to fill a tall box. Set straight, three monospace digits
 * across a few columns come out too few cells high for the counters of 0 and 4 to read; a little taller and
 * condensed, they read at a glance.
 */
export const STRETCH_MAX = 1.4
/** Clear space kept inside the box: one cell top and bottom, and at the sides when centred. */
export const SHAPE_PAD = CELL

/** Ink extents of the text at 1px font size (canvas measureText divided by the size). */
export interface ShapeMetrics {
  left: number
  right: number
  ascent: number
  descent: number
}

/**
 * Where and how large to set the text in a bw by bh box: font size, vertical stretch, stroke width, and the
 * pen origin (x, and y in the stretched frame, so the drawn baseline sits at y * sy). Shared by the glyph
 * raster and the plain-type stand-in (HeroSection), so the two show the same digits.
 */
export interface ShapeFit {
  size: number
  sy: number
  lw: number
  x: number
  y: number
}

export function fitShape(m: ShapeMetrics, bw: number, bh: number, align: 'start' | 'center'): ShapeFit {
  const inkW = m.left + m.right + EMBOLDEN
  const inkH = m.ascent + m.descent + EMBOLDEN
  const padX = align === 'center' ? SHAPE_PAD : 0
  const byHeight = (bh - 2 * SHAPE_PAD) / inkH
  const size = Math.max(8, Math.min((bw - 2 * padX) / inkW, byHeight))
  const sy = Math.min(STRETCH_MAX, Math.max(1, byHeight / size))
  const lw = EMBOLDEN * size
  const x = (align === 'center' ? (bw - inkW * size) / 2 : 0) + lw / 2 + m.left * size
  const y = (bh - inkH * size * sy) / 2 / sy + lw / 2 + m.ascent * size
  return { size, sy, lw, x, y }
}

/** Measures text in the given family's medium weight; null without a 2D canvas. */
export function measureShape(text: string, family: string): ShapeMetrics | null {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return null
  const REF = 100
  ctx.font = `500 ${REF}px ${family}`
  const m = ctx.measureText(text)
  return {
    left: m.actualBoundingBoxLeft / REF,
    right: m.actualBoundingBoxRight / REF,
    ascent: m.actualBoundingBoxAscent / REF,
    descent: m.actualBoundingBoxDescent / REF,
  }
}

/** Sets text in a bw by bh box as fitShape places it and returns the box's RGBA pixels. */
export function rasterShape(text: string, bw: number, bh: number, align: 'start' | 'center', family: string): Uint8ClampedArray {
  const canvas = document.createElement('canvas')
  canvas.width = bw
  canvas.height = bh
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const m = measureShape(text, family)
  if (!ctx || !m) return new Uint8ClampedArray(bw * bh * 4)
  const f = fitShape(m, bw, bh, align)
  ctx.font = `500 ${f.size}px ${family}`
  ctx.setTransform(1, 0, 0, f.sy, 0, 0)
  ctx.fillStyle = '#000'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = f.lw
  ctx.lineJoin = 'round'
  ctx.fillText(text, f.x, f.y)
  ctx.strokeText(text, f.x, f.y)
  return ctx.getImageData(0, 0, bw, bh).data
}

/** Byte a halo cell carries: below the shape's 0.5 threshold, above zero. */
export const HALO = 64

/**
 * Rings the shape (cells at 128 or more) with a halo of the given radius in cells, where the glyph shader
 * keeps rest glyphs out, so the digits' silhouette and counters stay clean. Partly covered cells under the
 * threshold join the halo too. Returns a new grid.
 */
export function haloCells(g: ShapeGrid, radius: number): ShapeGrid {
  const { cols, rows, bytes } = g
  const out = new Uint8Array(bytes)
  const r2 = radius * radius + 0.5
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (bytes[j * cols + i] < 128) continue
      for (let dj = -radius; dj <= radius; dj++) {
        for (let di = -radius; di <= radius; di++) {
          const ii = i + di
          const jj = j + dj
          if (ii < 0 || jj < 0 || ii >= cols || jj >= rows || di * di + dj * dj > r2) continue
          const k = jj * cols + ii
          if (out[k] < 128) out[k] = HALO
        }
      }
    }
  }
  return { ...g, bytes: out }
}
