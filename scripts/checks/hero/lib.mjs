// Helpers for the hero glyph checks. Needs the dev server (npm run dev) on :3000.
import { chromium } from 'playwright-core'

export const BASE = process.env.HERO_BASE ?? 'http://localhost:3000'
const PAPER = [0xf7, 0xf5, 0xf0]

export async function launch({ mobile = false, width = mobile ? 390 : 1440, height = mobile ? 844 : 900, reducedMotion = false } = {}) {
  const browser = await chromium.launch({ channel: 'chrome' })
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  })
  const page = await context.newPage()
  return { browser, page }
}

/** Opens the production hero in the lab with lab parameters (p.key=value). */
export async function openHero(page, params = {}, extra = '') {
  const q = new URLSearchParams({ v: 'moire-wake', embed: '1' })
  for (const [k, v] of Object.entries(params)) q.set(`p.${k}`, typeof v === 'boolean' ? (v ? '1' : '0') : String(v))
  await page.goto(`${BASE}/lab/hero?${q}${extra}`, { waitUntil: 'load', timeout: 90000 })
  await page.waitForFunction(() => window.__hero && window.__hero.u.uEntrance.value >= 1, null, { timeout: 30000 })
  await page.waitForTimeout(300)
}

/**
 * Ink per 16px glyph cell: pixels that differ from paper, grouped by the engine's cell grid, with each
 * cell's ink bounding box (CSS px, relative to the cell's top-left).
 */
export async function ink(page) {
  return page.evaluate(([pr, pg, pb]) => {
    const canvas = document.querySelector('section canvas')
    const w = canvas.width
    const h = canvas.height
    const dpr = w / canvas.getBoundingClientRect().width
    const off = new OffscreenCanvas(w, h)
    const ctx = off.getContext('2d')
    ctx.drawImage(canvas, 0, 0)
    const d = ctx.getImageData(0, 0, w, h).data
    const o = window.__hero.u.uCellOrigin ? window.__hero.u.uCellOrigin.value : { x: 0, y: 0 }
    const cells = new Map()
    let total = 0
    let hash = 0
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4
        hash = (hash * 31 + d[i] * 3 + d[i + 1] * 5 + d[i + 2] * 7) >>> 0
        if (Math.abs(d[i] - pr) + Math.abs(d[i + 1] - pg) + Math.abs(d[i + 2] - pb) < 12) continue
        total++
        const cx = Math.floor((x / dpr - o.x) / 16)
        const cy = Math.floor((y / dpr - o.y) / 16)
        const lx = x / dpr - o.x - cx * 16
        const ly = y / dpr - o.y - cy * 16
        const k = `${cx},${cy}`
        const c = cells.get(k) ?? { cx, cy, n: 0, x0: 16, x1: 0, y0: 16, y1: 0 }
        c.n++
        c.x0 = Math.min(c.x0, lx)
        c.x1 = Math.max(c.x1, lx + 1 / dpr)
        c.y0 = Math.min(c.y0, ly)
        c.y1 = Math.max(c.y1, ly + 1 / dpr)
        cells.set(k, c)
      }
    }
    return { w, h, dpr, cells: [...cells.values()], total, fingerprint: hash.toString(16) }
  }, PAPER)
}

/** Reads a uniform's current value from the dev probe. */
export async function uniform(page, name) {
  return page.evaluate(n => {
    const v = window.__hero.u[n].value
    return v && typeof v === 'object' && 'x' in v ? { ...v } : v
  }, name)
}

export function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    process.exitCode = 1
  } else console.log(`ok: ${msg}`)
}
