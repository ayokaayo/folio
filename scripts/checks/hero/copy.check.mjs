// No glyph ink inside the copy line boxes or the CTA, grown by one cell, even in a strong wake;
// no rest glyphs in the copy column.
import { BASE, assert, ink, launch, openHero, uniform } from './lib.mjs'

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
  // Tested at pixel centres, as the shader decides: with a fractional cell origin a box glyph's edge
  // stroke can leave a partly covered pixel whose top sits inside the cell and whose bottom pokes a
  // fraction of a pixel into the clear cell below.
  const inBox = c => {
    const x0 = o.x + c.cx * 16 + c.x0 + 0.5
    const x1 = o.x + c.cx * 16 + c.x1 - 0.5
    const y0 = o.y + c.cy * 16 + c.y0 + 0.5
    const y1 = o.y + c.cy * 16 + c.y1 - 0.5
    return boxes.some(([a, b, cc, d], i) => {
      const px = (i < boxes.length - 1 ? hiPad : 0) + 16
      return x1 > a - px && x0 < cc + px && y1 > b - 16 && y0 < d + 16
    })
  }
  const rest = await ink(page)
  // The column rule runs from the copy block's top to the CTA's bottom, with one cell of margin.
  const restInCol = rest.cells.filter(c => {
    const x = o.x + (c.cx + 0.5) * 16
    const y = o.y + (c.cy + 0.5) * 16
    return x >= col.x && x <= col.y && y >= col.z - 16 && y <= col.w + 16
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

// On phones the copy column spans nearly the full width, so below the CTA rest glyphs and streams
// must still appear.
{
  const { browser, page } = await launch({ mobile: true })
  await openHero(page, { coverage: 0, glyphRain: 0.5 })
  await page.waitForTimeout(2000)
  const col = await uniform(page, 'uCopyCol')
  const o = await uniform(page, 'uCellOrigin')
  const below = (await ink(page)).cells.filter(c => o.y + (c.cy + 0.5) * 16 > col.w + 16).length
  assert(below >= 5, `mobile: rest glyphs and streams below the CTA (${below} cells)`)
  await browser.close()
}

// Nav over the home hero: the desktop links wait hidden at the top of "/" and come in with the backdrop
// once the page scrolls, or at once when a link takes keyboard focus; elsewhere they always show.
{
  const { browser, page } = await launch()
  const links = () =>
    page.evaluate(() => {
      const d = document.querySelector('nav .md\\:flex')
      const nav = getComputedStyle(document.querySelector('nav'))
      return { op: getComputedStyle(d).opacity, pe: getComputedStyle(d).pointerEvents, bar: nav.backgroundColor !== 'rgba(0, 0, 0, 0)' }
    })
  await page.goto(`${BASE}/`, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(700)
  const top = await links()
  assert(top.op === '0' && top.pe === 'none' && !top.bar, `home top: links hidden, no bar (${JSON.stringify(top)})`)
  await page.locator('nav a', { hasText: 'Work' }).focus()
  await page.waitForTimeout(450)
  const focused = await links()
  assert(focused.op === '1' && focused.bar, `home top: focusing a link reveals the bar (${JSON.stringify(focused)})`)
  await page.evaluate(() => document.activeElement?.blur())
  await page.waitForTimeout(450)
  assert((await links()).op === '0', 'home top: links hide again once focus leaves')
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(700)
  const scrolled = await links()
  assert(scrolled.op === '1' && scrolled.pe !== 'none' && scrolled.bar, `home scrolled: links and bar shown (${JSON.stringify(scrolled)})`)
  await page.goto(`${BASE}/work`, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(500)
  assert((await links()).op === '1', 'other pages: links shown at the top')
  await browser.close()
}

// Phone: the avatar and the menu button stay visible over the hero, and the close icon's two strokes
// cross at the icon's centre with the middle line gone.
{
  const { browser, page } = await launch({ mobile: true })
  await page.goto(`${BASE}/`, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(700)
  const btn = page.locator('nav button[aria-controls="mobile-nav-panel"]')
  assert(await page.locator('nav a[aria-label="Miguel Angelo home"]').isVisible(), 'phone: avatar visible at the top')
  assert(await btn.isVisible(), 'phone: menu button visible at the top')
  await btn.click()
  await page.waitForTimeout(600)
  const x = await btn.locator('svg').evaluate(svg => {
    const s = svg.getBoundingClientRect()
    const [a, m, b] = [...svg.querySelectorAll('line')].map(l => ({ r: l.getBoundingClientRect(), op: getComputedStyle(l).opacity }))
    const c = r => [r.left + r.width / 2, r.top + r.height / 2]
    return { s: c(s), a: c(a.r), b: c(b.r), mid: m.op }
  })
  const off = Math.max(...[x.a, x.b].flatMap(p => [Math.abs(p[0] - x.s[0]), Math.abs(p[1] - x.s[1])]))
  assert(off < 0.5 && x.mid === '0', `phone: close icon strokes cross at the centre (off by ${off.toFixed(2)} px, middle opacity ${x.mid})`)
  await browser.close()
}
