// Rest dynamics: at rest glyphs keep changing (churn), use a wider vocabulary than dots, streams fall
// in a fraction of columns, and wake-only glyphs (box, solid) never appear at rest.
import { assert, ink, launch, openHero } from './lib.mjs'

// The mechanism under test, pinned independently of the approved tuning (settings.ts), which may cap
// rest glyphs at dots or run the pattern clock fast.
const BASE = { coverage: 0, glyphRestTop: 6, glyphSpeed: 1, glyphChurn: 1.5, glyphScale: 9 }

const box = c => c.x1 - c.x0 >= 15 || c.y1 - c.y0 >= 15
// A solid fills most of its box (n counts device pixels); stroke glyphs such as + × ◇ fill well under half.
const solid = (c, dpr = 1) => {
  const w = c.x1 - c.x0
  const h = c.y1 - c.y0
  return w >= 7 && h >= 7 && c.n >= 0.6 * w * h * dpr * dpr
}
// Glyph identity by its ink bounding box only; pixel counts drift with antialiasing and ink scale.
const sig = c => `${Math.round(c.x1 - c.x0)}x${Math.round(c.y1 - c.y0)}`

// Share of rest cells whose glyph changes over 600 ms, pointer out of the hero.
async function churn(params) {
  const { browser, page } = await launch()
  await openHero(page, { ...BASE, ...params })
  await page.mouse.move(5, 890) // keep the pointer out of the hero
  const a = await ink(page)
  await page.waitForTimeout(600)
  const b = await ink(page)
  await browser.close()
  const B = new Map(b.cells.map(c => [`${c.cx},${c.cy}`, c]))
  let shared = 0
  let changed = 0
  for (const c of a.cells) {
    const d = B.get(`${c.cx},${c.cy}`)
    if (!d) continue
    shared++
    if (sig(c) !== sig(d)) changed++
  }
  return { shared, changed, ratio: shared ? changed / shared : 0 }
}

// Churn: the same cells change glyph within 600 ms, clearly more than the slow pattern alone does.
const on = await churn({})
const off = await churn({ glyphChurn: 0 })
assert(on.shared > 20, `enough rest cells to judge churn (${on.shared})`)
assert(
  on.ratio >= 0.25 && on.ratio >= 2 * off.ratio,
  `rest glyphs churn (${on.changed}/${on.shared} changed in 600 ms; ${off.changed}/${off.shared} with churn off)`,
)

// Vocabulary: stroke glyphs (+ × ◇, a side of 9 px or more) appear at rest; never box glyphs or solids.
const { browser, page } = await launch()
await openHero(page, BASE)
await page.mouse.move(5, 890)
let strokes = 0
let wakeOnly = 0
for (let i = 0; i < 5; i++) {
  const r = await ink(page)
  r.cells.forEach(c => {
    if (c.x1 - c.x0 >= 9 || c.y1 - c.y0 >= 9) strokes++
    if (box(c) || solid(c, r.dpr)) wakeOnly++
  })
  await page.waitForTimeout(250)
}
assert(strokes >= 10, `rest uses stroke glyphs as well as dots (${strokes} cells)`)
assert(wakeOnly === 0, `no box glyphs or solids at rest (${wakeOnly})`)
await browser.close()

// Streams: with every column streaming and the pattern nearly silent, long vertical runs appear;
// with no streams, they don't.
async function longestRun(params) {
  const { browser, page } = await launch()
  await openHero(page, { ...BASE, glyphRest: 0.995, ...params })
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
