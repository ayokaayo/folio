// Glyph layer: lattice register, rest presence and levels, wake response, reduced motion, palette,
// resize, touch. Ruling off (coverage 0) so every inked pixel is a glyph.
import { assert, ink, launch, openHero, uniform } from './lib.mjs'

const GLYPH_ONLY = { coverage: 0 }
// Wake-only glyphs: box glyphs (a side of 15 px or more, they run to the cell edges) or the solid,
// which fills most of its box (n counts device pixels). Rest marks such as + × ◇ fill well under half.
const solid = (c, dpr) => {
  const w = c.x1 - c.x0
  const h = c.y1 - c.y0
  return w >= 7 && h >= 7 && c.n >= 0.6 * w * h * dpr * dpr
}
const heavy = (cells, dpr = 1) => cells.filter(c => c.x1 - c.x0 >= 15 || c.y1 - c.y0 >= 15 || solid(c, dpr)).length

// 1. Register with the paper lattice, desktop and a short phone.
for (const opts of [{}, { mobile: true, width: 375, height: 667 }]) {
  const { browser, page } = await launch(opts)
  await openHero(page, GLYPH_ONLY)
  const o = await uniform(page, 'uCellOrigin')
  const res = await uniform(page, 'uRes')
  const x0 = await page.evaluate(() => {
    const el = document.querySelector('section [data-line="head"]').closest('.lattice') ?? document.querySelector('.lattice')
    return parseFloat(getComputedStyle(el).paddingLeft)
  })
  assert(o.x === x0 % 16, `${opts.width ?? 1440}: columns start on the lattice (${o.x} vs ${x0 % 16})`)
  assert((res.y - o.y) % 16 === 0, `${opts.width ?? 1440}: rows end on the hero's bottom edge`)
  await browser.close()
}

// 2. Rest: glyphs present at every sample across a compressed cycle, no wake-only glyphs, inside cells.
{
  const { browser, page } = await launch()
  await openHero(page, { ...GLYPH_ONLY, glyphSpeed: 20 })
  let minCells = Infinity
  let heavyAtRest = 0
  let offCentre = 0
  for (let i = 0; i < 20; i++) {
    const r = await ink(page)
    minCells = Math.min(minCells, r.cells.length)
    heavyAtRest += heavy(r.cells, r.dpr)
    offCentre += r.cells.filter(c => c.x0 < 1 || c.x1 > 15 || c.y0 < 1 || c.y1 > 15).length
    await page.waitForTimeout(200)
  }
  assert(minCells >= 8, `rest glyphs in every sample (min ${minCells} cells)`)
  assert(heavyAtRest === 0, `no box glyphs or solids at rest (${heavyAtRest})`)
  assert(offCentre === 0, `rest glyphs sit inside their cells (${offCentre} off)`)

  // 3. Wake: a drag across the open side of the hero lifts density and wake-only glyphs, then decays.
  // A stronger wake lift, so the drag must reach the box glyphs and the solid.
  await openHero(page, { ...GLYPH_ONLY, glyphSpeed: 20, glyphWake: 2.5 })
  await page.mouse.move(10, 890)
  const rest = (await ink(page)).cells.length
  await page.mouse.move(900, 200)
  for (let x = 900; x <= 1400; x += 20) await page.mouse.move(x, 200 + (x - 900) * 0.5)
  // The wake core carries box glyphs and solids only for a few tens of ms, so sample them the moment
  // the drag ends; the wider rise in glyph count is read at 120 ms, as before.
  const peak = await ink(page)
  await page.waitForTimeout(120)
  const wake = await ink(page)
  assert(wake.cells.length >= rest * 2, `wake raises glyph count (${rest} to ${wake.cells.length})`)
  assert(heavy(peak.cells, peak.dpr) >= 5, `wake shows box glyphs and solids (${heavy(peak.cells, peak.dpr)})`)
  await page.mouse.move(10, 890)
  await page.waitForTimeout(2500)
  const after = await ink(page)
  assert(heavy(after.cells, after.dpr) <= 1, `wake decays back to rest within 2.5 s (${heavy(after.cells, after.dpr)} heavy)`)

  // Palette switch re-resolves the deep ink.
  const before = await uniform(page, 'uInkDeep')
  await page.evaluate(() => (document.documentElement.dataset.palette = 'blue'))
  await page.waitForTimeout(300)
  const blue = await uniform(page, 'uInkDeep')
  assert(before.x !== blue.x || before.y !== blue.y || before.z !== blue.z, 'deep ink follows the site palette')

  // Resize keeps the register.
  await page.setViewportSize({ width: 1180, height: 820 })
  await page.waitForTimeout(500)
  const o = await uniform(page, 'uCellOrigin')
  const res = await uniform(page, 'uRes')
  const x0 = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.lattice')).paddingLeft))
  assert(o.x === x0 % 16 && (res.y - o.y) % 16 === 0, 'register holds after resize')
  await browser.close()
}

// 4. Reduced motion: a still, composed frame with rest glyphs only.
{
  const { browser, page } = await launch({ reducedMotion: true })
  await openHero(page, GLYPH_ONLY, '&rm=1')
  const a = await ink(page)
  await page.mouse.move(1100, 300)
  await page.mouse.move(1300, 400)
  await page.waitForTimeout(1000)
  const b = await ink(page)
  assert(a.cells.length > 0, 'reduced motion shows rest glyphs')
  assert(a.fingerprint === b.fingerprint, 'reduced motion frame does not move')
  await browser.close()
}

// 5. Touch: taps raise wake glyphs around the tap points.
{
  const { browser, page } = await launch({ mobile: true })
  await openHero(page, GLYPH_ONLY)
  // A tap drops a deliberately small ripple, so count inked cells whose centres lie within three
  // cells (48 px) of any tap. The taps land in the copy column, where rest dots are suppressed, so
  // every counted cell is a wake glyph. Measured 6 to 9 cells over six runs; the floor sits below.
  const o = await uniform(page, 'uCellOrigin')
  const top = await page.evaluate(() => document.querySelector('section canvas').getBoundingClientRect().top)
  const taps = Array.from({ length: 12 }, (_, i) => [200 + (i % 4) * 12, 600 + Math.floor(i / 4) * 12])
  const nearTaps = cells =>
    cells.filter(c => {
      const x = o.x + (c.cx + 0.5) * 16
      const y = o.y + (c.cy + 0.5) * 16
      return taps.some(([tx, ty]) => Math.hypot(x - tx, y - (ty - top)) <= 48)
    }).length
  const rest = nearTaps((await ink(page)).cells)
  for (const [x, y] of taps) await page.touchscreen.tap(x, y)
  await page.waitForTimeout(100)
  const tapped = nearTaps((await ink(page)).cells)
  assert(tapped >= 5, `taps raise wake glyphs near the taps (${rest} to ${tapped} cells, floor 5)`)
  await browser.close()
}
