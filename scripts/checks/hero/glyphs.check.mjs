// Glyph layer: lattice register, rest presence and levels, wake response, reduced motion, palette,
// resize, touch. Ruling off (coverage 0) so every inked pixel is a glyph.
import { assert, ink, launch, openHero, uniform } from './lib.mjs'

const GLYPH_ONLY = { coverage: 0 }
const heavy = cells => cells.filter(c => c.x1 - c.x0 >= 9 || c.y1 - c.y0 >= 9).length

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

// 2. Rest: glyphs present at every sample across a compressed cycle, dots only, centred in cells.
{
  const { browser, page } = await launch()
  await openHero(page, { ...GLYPH_ONLY, glyphSpeed: 20 })
  let minCells = Infinity
  let heavyAtRest = 0
  let offCentre = 0
  for (let i = 0; i < 20; i++) {
    const r = await ink(page)
    minCells = Math.min(minCells, r.cells.length)
    heavyAtRest += heavy(r.cells)
    offCentre += r.cells.filter(c => c.x0 < 2 || c.x1 > 14 || c.y0 < 2 || c.y1 > 14).length
    await page.waitForTimeout(200)
  }
  assert(minCells >= 8, `rest glyphs in every sample (min ${minCells} cells)`)
  assert(heavyAtRest === 0, `no marks or solids at rest (${heavyAtRest})`)
  assert(offCentre === 0, `rest glyphs sit inside their cells (${offCentre} off)`)

  // 3. Wake: a drag across the open side of the hero lifts density and heavy glyphs, then decays.
  const rest = (await ink(page)).cells.length
  await page.mouse.move(900, 200)
  for (let x = 900; x <= 1400; x += 20) await page.mouse.move(x, 200 + (x - 900) * 0.5)
  await page.waitForTimeout(120)
  const wake = await ink(page)
  assert(wake.cells.length >= rest * 2, `wake raises glyph count (${rest} to ${wake.cells.length})`)
  assert(heavy(wake.cells) >= 5, `wake shows marks and box glyphs (${heavy(wake.cells)})`)
  await page.mouse.move(10, 890)
  await page.waitForTimeout(2500)
  const after = await ink(page)
  assert(heavy(after.cells) <= 1, `wake decays back to rest within 2.5 s (${heavy(after.cells)} heavy)`)

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

// 5. Touch: taps raise wake glyphs.
{
  const { browser, page } = await launch({ mobile: true })
  await openHero(page, GLYPH_ONLY)
  // A tap drops a deliberately small ripple, so a burst of taps is measured by total glyph ink.
  const rest = (await ink(page)).total
  for (let i = 0; i < 12; i++) await page.touchscreen.tap(200 + (i % 4) * 12, 600 + Math.floor(i / 4) * 12)
  await page.waitForTimeout(100)
  const tapped = (await ink(page)).total
  assert(tapped > rest * 1.2, `taps raise wake glyphs (${rest} to ${tapped} ink px)`)
  await browser.close()
}
