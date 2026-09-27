// Scrolling sends a band of glyphs through the hero in the scroll direction and morphs the pattern;
// both settle when scrolling stops. Reduced motion ignores scroll.
import { assert, ink, launch, openHero, uniform } from './lib.mjs'

// Locked seconds of pattern clock per px scrolled (settings.ts), set raw so the threshold is explicit.
const PHASE = 0.1
// Signed clock change, allowing for the 36000 s wrap (CLOCK_WRAP in glyphInputs.ts).
const WRAP = 36000
const delta = (a, b) => ((((b - a + WRAP / 2) % WRAP) + WRAP) % WRAP) - WRAP / 2

{
  const { browser, page } = await launch()
  // glyphSpeed 0 stops the time term, so any clock movement comes from scroll alone.
  await openHero(page, { coverage: 0, glyphSpeed: 0, glyphScrollPhase: PHASE })
  const heavy = r => r.cells.filter(c => c.x1 - c.x0 >= 9 || c.y1 - c.y0 >= 9).length
  const rest = heavy(await ink(page))
  const t0 = await uniform(page, 'uGlyphT')
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 40)
    await page.waitForTimeout(16)
  }
  const band = await uniform(page, 'uBand')
  const during = heavy(await ink(page))
  const t1 = await uniform(page, 'uGlyphT')
  const h = (await page.evaluate(() => window.__hero.size())).h
  assert(band.x > 0 && band.x < h, `band inside the hero at the glyph count (y ${band.x.toFixed(0)} of ${h})`)
  assert(band.y > 0.3, `band strength while scrolling (${band.y.toFixed(2)})`)
  assert(during > rest + 5, `band lifts glyphs (${rest} to ${during})`)
  const up = delta(t0, t1)
  assert(up > 320 * PHASE * 0.8, `pattern clock advanced with scroll alone (${up.toFixed(2)} s)`)
  await page.waitForTimeout(1500)
  const settled = await uniform(page, 'uBand')
  assert(settled.y < 0.05, `band settles after scrolling stops (${settled.y.toFixed(3)})`)
  const idle = delta(t1, await uniform(page, 'uGlyphT'))
  assert(Math.abs(idle) < 1e-6, `clock holds while scroll is still at glyphSpeed 0 (${idle.toFixed(3)} s)`)
  // Scroll back up: the clock runs back.
  const t2 = await uniform(page, 'uGlyphT')
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, -40)
    await page.waitForTimeout(16)
  }
  const t3 = await uniform(page, 'uGlyphT')
  const down = delta(t2, t3)
  assert(down < -320 * PHASE * 0.8, `scrolling up reverses the morph (${down.toFixed(2)} s)`)
  await browser.close()
}

{
  const { browser, page } = await launch({ reducedMotion: true })
  await openHero(page, { coverage: 0 }, '&rm=1')
  await page.mouse.wheel(0, 300)
  await page.waitForTimeout(100)
  const band = await uniform(page, 'uBand')
  assert(band.y === 0, 'reduced motion ignores scroll')
  await browser.close()
}
