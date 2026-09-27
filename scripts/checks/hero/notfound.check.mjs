// Not-found pages: status and copy per route, the glyph 404 at rest, scatter and re-form under a drag,
// reduced motion, the plain-type stand-in without WebGL, the home hero untouched, and screenshots.
// Glyph counts run through the lab (?shape=404) with the ruling off (coverage 0), so every inked pixel is a
// glyph. Screenshots go to $NOTFOUND_SHOTS (a directory) when it is set.
import { assert, BASE, ink, launch, openHero } from './lib.mjs'

const SHOTS = process.env.NOTFOUND_SHOTS
const PREFIX = process.env.NOTFOUND_PREFIX ?? '404'

/**
 * Cells the shape covers (the engine's own grid, read back through the dev probe), as "cx,cy" keys; with
 * halo, the ring around it instead (bytes above 0 and under 128), where rest glyphs are kept out.
 */
async function shapeCells(page, halo = false) {
  return page.evaluate(halo => {
    const g = window.__hero.shape()
    if (!g) return []
    const out = []
    for (let j = 0; j < g.rows; j++)
      for (let i = 0; i < g.cols; i++) {
        const b = g.bytes[j * g.cols + i]
        if (halo ? b > 0 && b < 128 : b >= 128) out.push(`${i - 1},${j - 1}`)
      }
    return out
  }, halo)
}

// A heavy mark (+ × ◇ ┼ ╬) spans at least 9 px; the lighter rest marks (. · :) stay well under.
const heavyIn = (cells, region) => cells.filter(c => region.has(`${c.cx},${c.cy}`) && (c.x1 - c.x0 >= 9 || c.y1 - c.y0 >= 9)).length
const inkedIn = (cells, region) => cells.filter(c => region.has(`${c.cx},${c.cy}`)).length

async function openNotFound(page, path = '/this-does-not-exist') {
  const res = await page.goto(BASE + path, { waitUntil: 'load', timeout: 90000 })
  await page.waitForFunction(() => window.__hero && window.__hero.u.uEntrance.value >= 1 && window.__hero.u.uShapeOn.value === 1, null, { timeout: 30000 })
  await page.waitForTimeout(500)
  return res
}

/** The shape region's centre and extent in viewport px. */
async function regionBox(page, region) {
  const o = await page.evaluate(() => ({ ...window.__hero.u.uCellOrigin.value, top: document.querySelector('section canvas').getBoundingClientRect().top }))
  const xs = [...region].map(k => Number(k.split(',')[0]))
  const ys = [...region].map(k => Number(k.split(',')[1]))
  const x0 = o.x + Math.min(...xs) * 16
  const x1 = o.x + (Math.max(...xs) + 1) * 16
  const y0 = o.top + o.y + Math.min(...ys) * 16
  const y1 = o.top + o.y + (Math.max(...ys) + 1) * 16
  return { x0, x1, y0, y1 }
}

/** Sweeps the pointer back and forth across the box (not pressed, so no text gets selected). */
async function scatter(page, b, rows = 5) {
  await page.mouse.move(b.x0 - 20, b.y0)
  for (let r = 0; r < rows; r++) {
    const y = b.y0 + ((r + 0.5) / rows) * (b.y1 - b.y0)
    const [from, to] = r % 2 ? [b.x1 + 20, b.x0 - 20] : [b.x0 - 20, b.x1 + 20]
    for (let k = 0; k <= 12; k++) await page.mouse.move(from + ((to - from) * k) / 12, y)
  }
}

// 1. Status and copy on each route, with the path escaped and long paths shortened.
const ROUTES = [
  ['/this-does-not-exist', 'This page drifted off the grid'],
  ['/work/nope', 'This case study drifted off the grid'],
  ['/projects/nope', 'This project drifted off the grid'],
]
for (const [path, headline] of ROUTES) {
  const res = await fetch(BASE + path)
  const html = await res.text()
  assert(res.status === 404, `${path} answers 404 (${res.status})`)
  assert(html.includes(headline), `${path} renders "${headline}"`)
  assert(html.includes(`Nothing lives at ${path}.`), `${path} renders "Nothing lives at ${path}."`)
  assert(html.includes('<title>Not found · Miguel Angelo</title>'), `${path} has the not-found title`)
}
{
  const { browser, page } = await launch()
  await openNotFound(page, '/%3Cb%3Ebold%3C%2Fb%3E')
  const h1 = await page.evaluate(() => ({ text: document.querySelector('h1').textContent, tags: document.querySelector('h1').querySelectorAll('b').length }))
  assert(h1.text.includes('Nothing lives at /<b>bold</b>.') && h1.tags === 0, `the path renders as text, not markup (${JSON.stringify(h1)})`)
  await openNotFound(page, '/' + 'a'.repeat(30) + '/' + 'z'.repeat(30))
  const long = await page.evaluate(() => document.querySelector('h1').textContent)
  assert(/Nothing lives at \/a+…z+\.$/.test(long) && long.split('at ')[1].length === 29, `long paths keep both ends around an ellipsis, 28 characters (${long})`)
  const a11y = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    canvas: document.querySelector('section canvas').getAttribute('aria-hidden'),
    ctas: [...document.querySelectorAll('section a')].map(a => [a.textContent.trim(), a.getAttribute('href')]),
  }))
  assert(a11y.h1 === 1 && a11y.canvas === 'true', `one h1, and the field is hidden from assistive tech (${a11y.h1}, ${a11y.canvas})`)
  assert(JSON.stringify(a11y.ctas) === JSON.stringify([['Back home', '/'], ['View work→', '/work']]), `CTAs: ${JSON.stringify(a11y.ctas)}`)
  const standIn = await page.evaluate(() => [...document.querySelectorAll('[data-shape-box]')].map(b => getComputedStyle(b.firstElementChild).opacity))
  assert(standIn.every(o => o === '0'), `the plain-type 404 hides once the glyphs are drawn (${standIn})`)
  await browser.close()
}

// A long path (39 characters, over the limit, so shortened to 28) never runs past the copy column or the viewport.
for (const width of [390, 1024, 1440]) {
  const { browser, page } = await launch({ width, height: 900, mobile: width < 600 })
  await openNotFound(page, '/' + 'segment-'.repeat(4) + 'abcdefg')
  const o = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    const col = h1.parentElement.getBoundingClientRect()
    const range = document.createRange()
    range.selectNodeContents(h1)
    const right = Math.max(...[...range.getClientRects()].map(r => r.right))
    return { right, col: col.right, vw: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }
  })
  assert(o.right <= o.col + 0.5 && o.right <= o.vw && o.scroll <= o.vw, `${width}: a long path stays inside the copy column (${JSON.stringify(o)})`)
  await browser.close()
}

// The CTAs sit on the lattice: the second starts one gutter after the two-column first, on a cell edge.
for (const opts of [{}, { mobile: true }]) {
  const { browser, page } = await launch(opts)
  await openNotFound(page)
  const g = await page.evaluate(() => {
    const [a, b] = [...document.querySelectorAll('section a')].map(e => e.getBoundingClientRect())
    const x0 = parseFloat(getComputedStyle(document.querySelector('section .lattice')).paddingLeft)
    return { a: [a.left, a.top, a.right], b: [b.left, b.top], x0 }
  })
  assert((g.a[0] - g.x0) % 16 === 0 && (g.b[0] - g.x0) % 16 === 0 && g.b[0] - g.a[2] === 16 && g.a[1] === g.b[1], `${opts.mobile ? 390 : 1440}: both CTAs on the lattice (${JSON.stringify(g)})`)
  await browser.close()
}

// 2. Rest: the digits are dense heavy marks.
let restHeavy = 0
for (const opts of [{}, { mobile: true }, { width: 1024, height: 768 }]) {
  const { browser, page } = await launch(opts)
  await openHero(page, { coverage: 0 }, '&shape=404')
  const region = new Set(await shapeCells(page))
  let heavy = 0
  let inked = 0
  for (let i = 0; i < 5; i++) {
    const r = await ink(page)
    heavy += heavyIn(r.cells, region) / 5
    inked += inkedIn(r.cells, region) / 5
    await page.waitForTimeout(150)
  }
  const tag = opts.mobile ? '390' : String(opts.width ?? 1440)
  assert(region.size >= 60, `${tag}: the shape covers ${region.size} cells`)
  assert(inked >= 60, `${tag}: at rest the digits hold ${inked.toFixed(0)} inked cells (floor 60)`)
  assert(heavy > inked / 2, `${tag}: most of them heavy (${heavy.toFixed(0)} of ${inked.toFixed(0)})`)
  // Box glyphs (┼ ╬) in the digits run to their cell edges, so their antialiasing can leave a one-pixel line
  // along the edge of a halo cell; only ink more than a pixel across both ways is a glyph.
  const halo = new Set(await shapeCells(page, true))
  const haloInked = (await ink(page)).cells.filter(c => halo.has(`${c.cx},${c.cy}`) && c.x1 - c.x0 > 1.5 && c.y1 - c.y0 > 1.5).length
  assert(halo.size > 0 && haloInked === 0, `${tag}: the halo round the digits stays clear at rest (${haloInked} inked of ${halo.size})`)

  // 3. A drag across the digits scatters them; at rest they re-form.
  if (!opts.mobile && !opts.width) {
    restHeavy = heavy
    const b = await regionBox(page, region)
    await scatter(page, b)
    await page.mouse.move(10, 890)
    // The wake's own core briefly lifts cells to box glyphs and solids, which count as heavy too, so the
    // scatter is read as the fewest heavy cells over the next half second, while the wake is up.
    let mid = Infinity
    for (let i = 0; i < 5; i++) {
      mid = Math.min(mid, heavyIn((await ink(page)).cells, region))
      await page.waitForTimeout(80)
    }
    assert(mid <= restHeavy * 0.6, `a drag thins the digits by 40% or more (${restHeavy.toFixed(0)} to ${mid} heavy)`)
    await page.waitForTimeout(4000)
    const back = heavyIn((await ink(page)).cells, region)
    assert(back >= restHeavy * 0.8, `after 4 s they re-form to 80% or more (${back} of ${restHeavy.toFixed(0)})`)

    // Scrolling scatters too: the scroll band sweeps down over the digits and back.
    await page.mouse.move(700, 400)
    let scrolled = Infinity
    for (let i = 0; i < 16; i++) {
      await page.mouse.wheel(0, i < 8 ? 60 : -60)
      await page.waitForTimeout(30)
      scrolled = Math.min(scrolled, heavyIn((await ink(page)).cells, region))
    }
    await page.mouse.move(10, 890)
    assert(scrolled <= restHeavy * 0.8, `scrolling past the digits thins them (${restHeavy.toFixed(0)} to ${scrolled} heavy)`)
    await page.waitForTimeout(4000)
    const settled = heavyIn((await ink(page)).cells, region)
    assert(settled >= restHeavy * 0.8, `and they re-form after scrolling (${settled} of ${restHeavy.toFixed(0)})`)
  }
  await browser.close()
}

// 4. Reduced motion: the digits are drawn, and the frame holds still, on the real page too.
{
  const { browser, page } = await launch({ reducedMotion: true })
  await openHero(page, { coverage: 0 }, '&rm=1&shape=404')
  const region = new Set(await shapeCells(page))
  const r = await ink(page)
  assert(heavyIn(r.cells, region) >= 60, `reduced motion draws the digits (${heavyIn(r.cells, region)} heavy cells)`)
  await openNotFound(page)
  const a = await ink(page)
  await page.mouse.move(1100, 300)
  await page.mouse.move(1300, 400)
  await page.waitForTimeout(1000)
  const b = await ink(page)
  assert(a.fingerprint === b.fingerprint, `reduced motion 404 frame does not move (${a.fingerprint}, ${b.fingerprint})`)
  await browser.close()
}

// Without WebGL the page still reads as a 404: the plain-type digits stay.
{
  const { browser, page } = await launch({ args: ['--disable-webgl', '--disable-3d-apis'] })
  await page.goto(BASE + '/this-does-not-exist', { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(2500)
  const s = await page.evaluate(() => ({
    canvas: !!document.querySelector('section canvas'),
    standIn: [...document.querySelectorAll('[data-shape-box]')].filter(b => b.getBoundingClientRect().width > 0).map(b => [b.textContent, getComputedStyle(b.firstElementChild).opacity]),
  }))
  assert(!s.canvas && s.standIn.length === 1 && s.standIn[0][0] === '404' && s.standIn[0][1] !== '0', `no WebGL: the typeset 404 shows (${JSON.stringify(s)})`)
  await browser.close()
}

// 5. The home hero draws no shape.
{
  const { browser, page } = await launch()
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 90000 })
  await page.waitForFunction(() => window.__hero && window.__hero.u.uEntrance.value >= 1, null, { timeout: 30000 })
  const s = await page.evaluate(() => ({ on: window.__hero.u.uShapeOn.value, grid: window.__hero.shape(), boxes: document.querySelectorAll('[data-shape-box]').length }))
  assert(s.on === 0 && s.grid === null && s.boxes === 0, `home draws no shape (${JSON.stringify(s)})`)
  await browser.close()
}

// 6. Screenshots, at rest and mid-scatter.
if (SHOTS) {
  for (const opts of [{}, { width: 1024, height: 768 }, { mobile: true }]) {
    const { browser, page } = await launch(opts)
    await openNotFound(page)
    const tag = opts.mobile ? '390x844' : opts.width ? '1024x768' : '1440x900'
    await page.screenshot({ path: `${SHOTS}/${PREFIX}-${tag}-rest.png` })
    const region = new Set(await shapeCells(page))
    await scatter(page, await regionBox(page, region), 4)
    await page.mouse.move(opts.mobile ? 380 : 10, opts.mobile ? 100 : 890)
    await page.waitForTimeout(150)
    await page.screenshot({ path: `${SHOTS}/${PREFIX}-${tag}-scatter.png` })
    await browser.close()
  }
  console.log(`screenshots in ${SHOTS}`)
}
