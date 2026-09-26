// No glyph ink inside the copy line boxes or the CTA, grown by one cell, even in a strong wake;
// no rest glyphs in the copy column.
import { assert, ink, launch, openHero, uniform } from './lib.mjs'

for (const opts of [{}, { mobile: true }]) {
  const { browser, page } = await launch(opts)
  await openHero(page, { coverage: 0, glyphRest: 0.3, glyphWake: 3 })
  const boxes = await page.evaluate(() => {
    const u = window.__hero.u
    const n = u.uMaskCount.value
    const out = u.uMask.value.slice(0, n).map(v => [v.x, v.y, v.z, v.w])
    const c = u.uCtaBox.value
    out.push([c.x, c.y, c.z, c.w])
    return out
  })
  // Same rule as the shader: line boxes grow by uHiPad horizontally, then every box by one cell.
  const hiPad = await uniform(page, 'uHiPad')
  const col = await uniform(page, 'uCopyCol')
  const o = await uniform(page, 'uCellOrigin')
  const inBox = c => {
    const x0 = o.x + c.cx * 16 + c.x0
    const x1 = o.x + c.cx * 16 + c.x1
    const y0 = o.y + c.cy * 16 + c.y0
    const y1 = o.y + c.cy * 16 + c.y1
    return boxes.some(([a, b, cc, d], i) => {
      const px = (i < boxes.length - 1 ? hiPad : 0) + 16
      return x1 > a - px && x0 < cc + px && y1 > b - 16 && y0 < d + 16
    })
  }
  const rest = await ink(page)
  const restInCol = rest.cells.filter(c => {
    const x = o.x + (c.cx + 0.5) * 16
    return x >= col.x && x <= col.y
  }).length
  assert(restInCol === 0, `${opts.mobile ? 'mobile' : 'desktop'}: no rest glyphs in the copy column (${restInCol})`)
  const r = page.viewportSize()
  for (let x = 0; x <= r.width; x += 16) await page.mouse.move(x, 120 + (x % 160))
  await page.waitForTimeout(80)
  const wake = await ink(page)
  const hits = wake.cells.filter(inBox).length
  assert(hits === 0, `${opts.mobile ? 'mobile' : 'desktop'}: no glyphs on the copy or CTA in a strong wake (${hits})`)
  assert(wake.cells.length > rest.cells.length, 'the wake still drew glyphs elsewhere')
  await browser.close()
}
