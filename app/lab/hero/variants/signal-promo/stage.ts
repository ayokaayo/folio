/**
 * Signal hero layout: the title set in bold Plex Mono, one word to a line, snapped to the drawn grid, and
 * rasterised into two mask canvases for the shader: canvas A carries the three words sharp (R, G, B), canvas
 * B the same words blurred (each by its own radius, for the effect that word plays). Line metrics come back
 * too, so the DOM can draw cap-height and baseline guides and the readout can find room beside a line.
 */

export const GUTTER = 16

export interface Line {
  text: string
  /** The pen position the text is drawn from, and where its ink starts and ends, section CSS px. */
  x: number
  ink0: number
  width: number
  /** Baseline and cap top, section CSS px. */
  baseline: number
  capTop: number
  /** Advance of one character, CSS px (the face is monospaced). */
  adv: number
}

export interface Layout {
  w: number
  h: number
  /** Lattice content box, section CSS px. */
  x0: number
  x1: number
  desktop: boolean
  /**
   * The drawn grid's step, CSS px, rows from the section top and columns from x0. It comes from the title:
   * its cap is k steps and its lines stand one step apart, so every cap top and baseline sits on a row.
   */
  grid: number
  size: number
  lines: Line[]
  /**
   * Where each word goes when the title breaks apart: a step down the lattice, the second word centred
   * under the first and the third ranged right, each on a grid column. CSS px, added to x.
   */
  apart: number[]
}

export const WORDS = ['INTELLIGENT', 'SYSTEMS', 'DESIGNER']

/** Blur radius of each word in canvas B, CSS px: wide for the first word's flow, fine for the outline. */
const BLUR = [9, 3, 2.2]

export function layout(w: number, h: number, x0: number, x1: number, bottom: number, family: string, scale: number): Layout {
  const desktop = w >= 1024
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `700 100px ${family}`
  const capEm = ctx.measureText('H').actualBoundingBoxAscent / 100
  const inkEm = Math.max(...WORDS.map(l => {
    const m = ctx.measureText(l)
    return (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 100
  }))
  // The title sets the grid: its cap is k steps (3 by preference, 2 or 4 when that sets it larger) and its
  // lines stand one step apart. Steps are a multiple of 4, so the dots fall on the grid, and at least 16,
  // so the marks never crowd. The type starts on the first row clear of the HUD's top row.
  // From 1024px the title keeps to nine columns, leaving the right three for the readout, the curve and the
  // DNA mark.
  const cw = (x1 - x0 - 11 * GUTTER) / 12
  const span = desktop ? 9 * cw + 8 * GUTTER : x1 - x0
  const capMax = (span / inkEm) * capEm * scale
  let grid = 16
  let k = 3
  let best = -1
  for (let g = 16; g <= 96; g += 4) {
    for (const kk of [2, 3, 4]) {
      const cap = kk * g
      if (cap > capMax || 3 * cap + 2 * g > bottom - Math.ceil(120 / g) * g) continue
      const score = cap - (kk === 3 ? 0 : 16)
      if (score > best) {
        best = score
        grid = g
        k = kk
      }
    }
  }
  const capPx = k * grid
  const size = capPx / capEm
  ctx.font = `700 ${size}px ${family}`
  const free = Math.floor((bottom - Math.ceil(120 / grid) * grid - (3 * capPx + 2 * grid)) / grid)
  // Top on the first clear row, nudged a row down when there is plenty of room, for air under the HUD.
  const top = Math.ceil(120 / grid) * grid + (free >= 4 ? grid : 0)
  const lines: Line[] = WORDS.map((text, i) => {
    const m = ctx.measureText(text)
    const capTop = top + i * (capPx + grid)
    return {
      text,
      x: x0 + m.actualBoundingBoxLeft,
      ink0: x0,
      width: m.actualBoundingBoxRight - m.actualBoundingBoxLeft,
      capTop,
      baseline: capTop + capPx,
      adv: m.width / text.length,
    }
  })
  const snap = (x: number) => Math.round(x / grid) * grid
  const apart = [0, snap((lines[0].width - lines[1].width) / 2), snap(lines[0].width - lines[2].width)]
  return { w, h, x0, x1, desktop, grid, size, lines, apart }
}

/** Draws the words into the two mask canvases at device resolution. */
export function rasterise(l: Layout, family: string, dpr: number, a: HTMLCanvasElement, b: HTMLCanvasElement) {
  const W = Math.max(1, Math.round(l.w * dpr))
  const H = Math.max(1, Math.round(l.h * dpr))
  for (const c of [a, b]) {
    c.width = W
    c.height = H
  }
  const inks = ['#f00', '#0f0', '#00f']
  ;[a, b].forEach((c, k) => {
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, l.w, l.h)
    ctx.textBaseline = 'alphabetic'
    ctx.font = `700 ${l.size}px ${family}`
    // Additive, so each word lands in its own channel.
    ctx.globalCompositeOperation = 'lighter'
    l.lines.forEach((line, i) => {
      // The filter's radius is in canvas pixels, not the transformed space.
      ctx.filter = k === 1 ? `blur(${BLUR[i] * dpr}px)` : 'none'
      ctx.fillStyle = inks[i]
      ctx.fillText(line.text, line.x, line.baseline)
    })
  })
}
