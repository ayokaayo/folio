// Scrolling sends a band of glyphs through the hero in the scroll direction and morphs the pattern;
// both settle when scrolling stops. Reduced motion ignores scroll.
import { assert, ink, launch, openHero, uniform } from './lib.mjs'

{
  const { browser, page } = await launch()
  await openHero(page, { coverage: 0 })
  const heavy = r => r.cells.filter(c => c.x1 - c.x0 >= 9 || c.y1 - c.y0 >= 9).length
  const rest = heavy(await ink(page))
  const t0 = await uniform(page, 'uGlyphT')
  // The band sits on a fixed viewport line (62% down), so it leaves the hero's bottom edge after about
  // 190 px of scroll at 1440x900 (hero 666 px tall, top at 80 px). Glyphs are counted mid-sweep, while
  // the band is still inside the hero; strength and clock are read after the full 320 px.
  let during = 0
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 40)
    await page.waitForTimeout(16)
    if (i === 2) during = heavy(await ink(page))
  }
  const band = await uniform(page, 'uBand')
  const t1 = await uniform(page, 'uGlyphT')
  assert(band.y > 0.3, `band strength while scrolling (${band.y.toFixed(2)})`)
  assert(during > rest + 5, `band lifts glyphs (${rest} to ${during})`)
  assert(t1 - t0 > 320 * 0.02 * 0.8, `pattern clock advanced with scroll (${(t1 - t0).toFixed(2)} s)`)
  await page.waitForTimeout(1500)
  const settled = await uniform(page, 'uBand')
  assert(settled.y < 0.05, `band settles after scrolling stops (${settled.y.toFixed(3)})`)
  // Scroll back up: the clock runs back.
  const t2 = await uniform(page, 'uGlyphT')
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, -40)
    await page.waitForTimeout(16)
  }
  const t3 = await uniform(page, 'uGlyphT')
  assert(t3 < t2 + 1, 'scrolling up reverses the morph')
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
