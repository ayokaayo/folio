// The four glyph upgrades (lab toggles fxFringe, fxFlurry, fxWrite, fxEdges), each measured on the glyph
// layer alone (ruling off) against the same page with the toggle off. See the spec's amendment of
// 2026-09-26, upgrades 1 to 4.
import { assert, ink, launch, openHero, uniform } from './lib.mjs'

const GLYPH_ONLY = { coverage: 0 }
const OUT = [5, 890] // pointer parked outside the hero
const key = c => `${c.cx},${c.cy}`
const solid = (c, dpr) => {
  const w = c.x1 - c.x0
  const h = c.y1 - c.y0
  return w >= 7 && h >= 7 && c.n >= 0.6 * w * h * dpr * dpr
}
const heavy = r => r.cells.filter(c => c.x1 - c.x0 >= 15 || c.y1 - c.y0 >= 15 || solid(c, r.dpr)).length

// 1. Fringes: under reduced motion (a still frame), glyph presence follows the moiré's interference
// phase, so the set of inked cells moves a lot when the toggle flips.
{
  const { browser, page } = await launch({ reducedMotion: true })
  const frame = async on => {
    await openHero(page, { ...GLYPH_ONLY, fxFringe: on }, '&rm=1')
    return ink(page)
  }
  const a = await frame(false)
  const b = await frame(true)
  await browser.close()
  const A = new Set(a.cells.map(key))
  const B = new Set(b.cells.map(key))
  const union = new Set([...A, ...B])
  let diff = 0
  for (const k of union) if (A.has(k) !== B.has(k)) diff++
  const share = diff / Math.max(union.size, 1)
  assert(a.fingerprint !== b.fingerprint, `fringes: frame differs from base (${a.fingerprint} vs ${b.fingerprint})`)
  assert(share >= 0.3, `fringes: ${diff}/${union.size} = ${share.toFixed(2)} of inked cells differ (floor 0.30)`)
}

// Captures frames straight from the canvas every `every` ms (ImageBitmaps, so the capture keeps time),
// then reduces each to a glyph signature per inked cell: its ink bounding box and top edge.
async function signatures(page, count, every) {
  return page.evaluate(
    async ([count, every]) => {
      const canvas = document.querySelector('section canvas')
      const bitmaps = []
      for (let i = 0; i < count; i++) {
        const t0 = performance.now()
        bitmaps.push(await createImageBitmap(canvas))
        await new Promise(r => setTimeout(r, Math.max(0, every - (performance.now() - t0))))
      }
      const w = canvas.width
      const h = canvas.height
      const dpr = w / canvas.getBoundingClientRect().width
      const o = window.__hero.u.uCellOrigin.value
      const off = new OffscreenCanvas(w, h)
      const ctx = off.getContext('2d')
      return bitmaps.map(bm => {
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(bm, 0, 0)
        const d = ctx.getImageData(0, 0, w, h).data
        const cells = {}
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4
            if (Math.abs(d[i] - 0xf7) + Math.abs(d[i + 1] - 0xf5) + Math.abs(d[i + 2] - 0xf0) < 12) continue
            const cx = Math.floor((x / dpr - o.x) / 16)
            const cy = Math.floor((y / dpr - o.y) / 16)
            const lx = x / dpr - o.x - cx * 16
            const ly = y / dpr - o.y - cy * 16
            const k = `${cx},${cy}`
            const c = cells[k] ?? (cells[k] = [16, 0, 16, 0])
            c[0] = Math.min(c[0], lx)
            c[1] = Math.max(c[1], lx + 1 / dpr)
            c[2] = Math.min(c[2], ly)
            c[3] = Math.max(c[3], ly + 1 / dpr)
          }
        }
        const out = {}
        for (const [k, c] of Object.entries(cells)) out[k] = `${Math.round(c[1] - c[0])}x${Math.round(c[3] - c[2])}@${Math.round(c[2])}`
        return out
      })
    },
    [count, every],
  )
}

// 2. Flurries: over 3 s, sampled every 150 ms, the share of cells with no change across a 1.2 s window
// (8 intervals), taken over every window. The pattern clock and streams are stopped so only the churn
// changes glyphs, and churn is pinned at 6 swaps a second.
async function quiet(on) {
  const { browser, page } = await launch()
  await openHero(page, { ...GLYPH_ONLY, glyphChurn: 6, glyphSpeed: 0, glyphRain: 0, fxFlurry: on })
  await page.mouse.move(...OUT)
  await page.waitForTimeout(300)
  const frames = await signatures(page, 21, 150)
  await browser.close()
  const cells = Object.keys(frames[0]).filter(k => frames.every(f => k in f))
  const changes = cells.map(k => frames.slice(1).map((f, i) => (f[k] !== frames[i][k] ? 1 : 0)))
  const shares = []
  for (let s = 0; s + 8 <= 20; s++) shares.push(changes.filter(ch => ch.slice(s, s + 8).every(x => x === 0)).length / Math.max(cells.length, 1))
  const perSecond = changes.reduce((a, ch) => a + ch.reduce((p, q) => p + q, 0), 0) / Math.max(cells.length, 1) / 3
  return { cells: cells.length, min: Math.min(...shares), max: Math.max(...shares), mean: shares.reduce((a, b) => a + b, 0) / shares.length, perSecond }
}
{
  const on = await quiet(true)
  const off = await quiet(false)
  const fmt = q => `min ${q.min.toFixed(2)}, mean ${q.mean.toFixed(2)}, max ${q.max.toFixed(2)} over ${q.cells} cells, ${q.perSecond.toFixed(1)} changes/s`
  assert(on.cells > 20 && off.cells > 20, `flurries: enough steady cells to judge (${on.cells}, ${off.cells})`)
  assert(on.min >= 0.25, `flurries on: cells quiet for a whole 1.2 s window, every window (${fmt(on)}; floor 0.25)`)
  assert(off.max <= 0.1, `flurries off: cells quiet for a whole 1.2 s window, any window (${fmt(off)}; ceiling 0.10)`)
}

// 3. Writing streams: with every column streaming and the pattern nearly silent, the cells a head has
// passed keep a glyph, so 1 s into the page far more cells are inked.
async function written(on) {
  const { browser, page } = await launch()
  await openHero(page, { ...GLYPH_ONLY, glyphRain: 1, glyphRest: 0.995, fxWrite: on })
  await page.mouse.move(...OUT)
  await page.waitForFunction(() => window.__hero.u.uChurnT.value >= 1, null, { timeout: 10000 })
  const t = await uniform(page, 'uChurnT')
  const n = (await ink(page)).cells.length
  await browser.close()
  return { n, t }
}
{
  const on = await written(true)
  const off = await written(false)
  assert(
    on.n >= 1.4 * off.n,
    `writing streams: ${on.n} inked cells with, ${off.n} without, at ${on.t.toFixed(2)} s and ${off.t.toFixed(2)} s (x${(on.n / Math.max(off.n, 1)).toFixed(2)}, floor 1.4)`,
  )
}

// 4. Wave edges: heavy (box or solid) cells the moment a drag across the open side ends, default burst.
// Two drags each, averaged, since one drag's timing moves the count by a few cells.
async function edges(on) {
  const { browser, page } = await launch()
  const n = []
  for (let i = 0; i < 2; i++) {
    await openHero(page, { ...GLYPH_ONLY, fxEdges: on })
    await page.mouse.move(...OUT)
    await page.mouse.move(900, 200)
    for (let x = 900; x <= 1400; x += 20) await page.mouse.move(x, 200 + (x - 900) * 0.5)
    n.push(heavy(await ink(page)))
  }
  await browser.close()
  return { mean: (n[0] + n[1]) / 2, n }
}
{
  const on = await edges(true)
  const off = await edges(false)
  assert(
    on.mean >= 1.3 * off.mean && on.mean > 0,
    `wave edges: ${on.mean} heavy cells at drag end with (${on.n}), ${off.mean} without (${off.n}) (x${(on.mean / Math.max(off.mean, 1e-9)).toFixed(2)}, floor 1.3)`,
  )
}
