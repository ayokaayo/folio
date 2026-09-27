// The six lab controls: each has a clearly visible range, measured on the glyph layer alone (ruling off),
// with the control set by URL and everything else at its default. Defaults reproduce the locked look.
import { assert, ink, launch, openHero, uniform } from './lib.mjs'

const GLYPH_ONLY = { coverage: 0 }
const OUT = [5, 890] // pointer parked outside the hero

const { browser, page } = await launch()
const open = async params => {
  await openHero(page, { ...GLYPH_ONLY, ...params })
  await page.mouse.move(...OUT)
}
const mean = xs => xs.reduce((a, b) => a + b, 0) / Math.max(xs.length, 1)
const sig = c => `${Math.round(c.x1 - c.x0)}x${Math.round(c.y1 - c.y0)}`
const solid = (c, dpr) => {
  const w = c.x1 - c.x0
  const h = c.y1 - c.y0
  return w >= 7 && h >= 7 && c.n >= 0.6 * w * h * dpr * dpr
}
const heavy = r => r.cells.filter(c => c.x1 - c.x0 >= 15 || c.y1 - c.y0 >= 15 || solid(c, r.dpr)).length

// Inked cells, averaged over a few frames so one lucky frame of the pattern doesn't decide it.
async function inked(params) {
  await open(params)
  const n = []
  for (let i = 0; i < 4; i++) {
    n.push((await ink(page)).cells.length)
    await page.waitForTimeout(250)
  }
  return mean(n)
}

// Share of cells, inked in both frames, whose glyph changes over 600 ms.
async function churn(params) {
  await open(params)
  const a = await ink(page)
  await page.waitForTimeout(600)
  const b = await ink(page)
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

// Longest vertical run of inked cells in any column.
function longestRun(r) {
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
// glyphRest 0.995 alone doesn't quiet the pattern: its blend saturates at 1 wherever the three fields
// agree, so at the default scale it still draws vertical runs of 6 to 14 cells with no streams at all.
// So the pattern clock is also stopped (glyphSpeed 0, raw) and only cells inked in a later frame but
// not the first count: the frozen pattern cancels out, churn only swaps glyphs within inked cells, and
// streams (on their own clock) have moved well past their trail length in 300 ms.
async function runs(params) {
  await open({ glyphRest: 0.995, glyphSpeed: 0, ...params })
  const first = new Set((await ink(page)).cells.map(c => `${c.cx},${c.cy}`))
  const out = []
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(300)
    const r = await ink(page)
    out.push(longestRun({ cells: r.cells.filter(c => !first.has(`${c.cx},${c.cy}`)) }))
  }
  return Math.max(...out)
}

// Heavy (box or solid) cells the moment a drag across the open side of the hero ends.
async function burst(params) {
  await open(params)
  await page.mouse.move(900, 200)
  for (let x = 900; x <= 1400; x += 20) await page.mouse.move(x, 200 + (x - 900) * 0.5)
  const n = heavy(await ink(page))
  await page.mouse.move(...OUT)
  await page.waitForTimeout(2500)
  return n
}

// Band strength during the Task 5 wheel sequence (eight 40 px steps, 16 ms apart).
async function band(params) {
  await open(params)
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 40)
    await page.waitForTimeout(16)
  }
  const b = await uniform(page, 'uBand')
  await page.evaluate(() => window.scrollTo(0, 0))
  return b.y
}

// Mean size of 4-connected clusters of inked cells, and the frame fingerprint.
async function clusters(params) {
  await open(params)
  const r = await ink(page)
  const set = new Set(r.cells.map(c => `${c.cx},${c.cy}`))
  const seen = new Set()
  const sizes = []
  for (const k of set) {
    if (seen.has(k)) continue
    let n = 0
    const stack = [k]
    seen.add(k)
    while (stack.length) {
      const [x, y] = stack.pop().split(',').map(Number)
      n++
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const q = `${x + dx},${y + dy}`
        if (set.has(q) && !seen.has(q)) {
          seen.add(q)
          stack.push(q)
        }
      }
    }
    sizes.push(n)
  }
  return { mean: mean(sizes), count: sizes.length, fingerprint: r.fingerprint }
}

// Defaults: no p.* for the controls reproduces the locked look.
await open({})
const rest0 = await uniform(page, 'uGlyphRest')
const scale0 = await uniform(page, 'uGlyphScale')
assert(Math.abs(rest0 - 0.77) <= 0.01, `defaults give glyphRest 0.77 (${rest0.toFixed(3)})`)
assert(Math.abs(scale0 - 11) <= 0.3, `defaults give glyphScale 11 (${scale0.toFixed(2)})`)

// Density.
const dLo = await inked({ density: 0.1 })
const dHi = await inked({ density: 1 })
assert(dHi >= 3 * dLo, `density: inked cells at 1 are at least 3x those at 0.1 (${dLo.toFixed(1)} to ${dHi.toFixed(1)}, x${(dHi / Math.max(dLo, 1e-9)).toFixed(2)})`)

// Motion.
const mHi = await churn({ motion: 0.9 })
const mLo = await churn({ motion: 0 })
assert(mHi.ratio >= 0.3, `motion 0.9 churns (${mHi.changed}/${mHi.shared} = ${mHi.ratio.toFixed(2)} changed in 600 ms, floor 0.3)`)
assert(mLo.ratio <= 0.05, `motion 0 is frozen (${mLo.changed}/${mLo.shared} = ${mLo.ratio.toFixed(2)}, ceiling 0.05)`)

// Streams.
const sHi = await runs({ streams: 1 })
const sLo = await runs({ streams: 0 })
assert(sHi >= 8, `streams 1: longest vertical run ${sHi} cells (floor 8)`)
assert(sLo < 5, `streams 0: longest vertical run ${sLo} cells (below 5)`)

// Burst.
const bHi = await burst({ burst: 1 })
const bLo = await burst({ burst: 0 })
assert(bHi >= 10, `burst 1: ${bHi} heavy cells at drag end (floor 10)`)
assert(bLo === 0, `burst 0: ${bLo} heavy cells at drag end`)

// Scroll.
const rHi = await band({ scroll: 1 })
const rLo = await band({ scroll: 0 })
assert(rHi >= 1.5, `scroll 1: band strength ${rHi.toFixed(2)} while scrolling (floor 1.5)`)
assert(rLo === 0, `scroll 0: band strength ${rLo}`)

// Pattern size.
const zLo = await clusters({ size: 0 })
const zHi = await clusters({ size: 1 })
assert(zLo.fingerprint !== zHi.fingerprint, `size: frames differ at 0 and 1 (${zLo.fingerprint} vs ${zHi.fingerprint})`)
assert(
  zHi.mean >= 1.5 * zLo.mean,
  `size: mean cluster at 1 is at least 1.5x at 0 (${zLo.mean.toFixed(2)} cells over ${zLo.count} to ${zHi.mean.toFixed(2)} over ${zHi.count}, x${(zHi.mean / Math.max(zLo.mean, 1e-9)).toFixed(2)})`,
)

await browser.close()
