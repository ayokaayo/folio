// Rest dynamics: at rest glyphs keep changing (churn), use a wider vocabulary than dots, streams fall
// in a fraction of columns, and wake-only glyphs (box, solid) never appear at rest.
import { assert, ink, launch, openHero } from './lib.mjs'

const box = c => c.x1 - c.x0 >= 15 || c.y1 - c.y0 >= 15
// A solid fills most of its box (n counts device pixels); stroke glyphs such as + × ◇ fill well under half.
const solid = (c, dpr = 1) => {
  const w = c.x1 - c.x0
  const h = c.y1 - c.y0
  return w >= 7 && h >= 7 && c.n >= 0.6 * w * h * dpr * dpr
}
const sig = c => `${Math.round(c.x1 - c.x0)}x${Math.round(c.y1 - c.y0)}:${Math.round(c.n / 4)}`

const { browser, page } = await launch()
await openHero(page, { coverage: 0 })
await page.mouse.move(5, 890) // keep the pointer out of the hero

// Churn: the same cells change glyph within 600 ms.
const a = await ink(page)
await page.waitForTimeout(600)
const b = await ink(page)
const byKey = r => new Map(r.cells.map(c => [`${c.cx},${c.cy}`, c]))
const A = byKey(a)
const B = byKey(b)
let shared = 0
let changed = 0
for (const [k, c] of A) {
  const d = B.get(k)
  if (!d) continue
  shared++
  if (sig(c) !== sig(d)) changed++
}
assert(shared > 20, `enough rest cells to judge churn (${shared})`)
assert(changed / shared >= 0.25, `rest glyphs churn (${changed}/${shared} changed in 600 ms)`)

// Vocabulary: at least four distinct glyph shapes at rest, never box glyphs or solids.
const shapes = new Set()
let wakeOnly = 0
for (let i = 0; i < 5; i++) {
  const r = await ink(page)
  r.cells.forEach(c => {
    shapes.add(sig(c).split(':')[0])
    if (box(c) || solid(c, r.dpr)) wakeOnly++
  })
  await page.waitForTimeout(250)
}
assert(shapes.size >= 4, `rest uses a varied vocabulary (${shapes.size} shapes)`)
assert(wakeOnly === 0, `no box glyphs or solids at rest (${wakeOnly})`)
await browser.close()

// Streams: with every column streaming and the pattern nearly silent, long vertical runs appear;
// with no streams, they don't.
async function longestRun(params) {
  const { browser, page } = await launch()
  await openHero(page, { coverage: 0, glyphRest: 0.99, ...params })
  await page.mouse.move(5, 890)
  const r = await ink(page)
  await browser.close()
  const cols = new Map()
  r.cells.forEach(c => cols.set(c.cx, [...(cols.get(c.cx) ?? []), c.cy]))
  let best = 0
  for (const ys of cols.values()) {
    ys.sort((p, q) => p - q)
    let run = 1
    for (let i = 1; i < ys.length; i++) {
      run = ys[i] === ys[i - 1] + 1 ? run + 1 : 1
      best = Math.max(best, run)
    }
  }
  return best
}
const withRain = await longestRun({ glyphRain: 1 })
const noRain = await longestRun({ glyphRain: 0 })
assert(withRain >= 5, `streams form vertical runs (${withRain} cells)`)
assert(noRain < 5, `no runs without streams (${noRain} cells)`)
