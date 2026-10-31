// Renders every route on two running servers and compares what a visitor ends up with: the HTTP status,
// the final visible text and a full-page screenshot. Useful before and after a framework upgrade.
// Run: PARITY_A=http://localhost:3102 PARITY_B=http://localhost:3101 node scripts/checks/render-parity.check.mjs
// Screenshots go to PARITY_SHOTS as <a|b>-<width>-<route>.png (default: no screenshots).
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const A = process.env.PARITY_A ?? 'http://localhost:3102'
const B = process.env.PARITY_B ?? 'http://localhost:3101'
const SHOTS = process.env.PARITY_SHOTS ?? ''
const ROUTES = ['/', '/about', '/kallax', '/privacy', '/projects', '/work', '/cv',
  '/projects/norma', '/projects/exotica-radio', '/projects/kallax', '/projects/codex-tarot', '/projects/word-war-one',
  '/work/design-native-agent', '/work/nexus', '/work/dna', '/work/dropdown-builder', '/work/fast-track-ai',
  '/work/sms-characters', '/work/time-management', '/does-not-exist', '/work/nope']
const WIDTHS = [1440, 390]

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    failed++
    console.error(`FAIL: ${msg}`)
  } else console.log(`ok: ${msg}`)
}

async function snap(page, base, route, width, tag) {
  const errors = []
  page.removeAllListeners('pageerror')
  page.on('pageerror', e => errors.push(e.message))
  const res = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 })
  // Let entrance animations settle; reduced motion is forced so they are short.
  await page.waitForTimeout(1500)
  const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').trim()
  const title = await page.title()
  let shot = null
  if (SHOTS) {
    shot = `${SHOTS}/${tag}-${width}-${route.replace(/\//g, '_') || '_'}.png`
    await page.screenshot({ path: shot, fullPage: true })
  }
  return { status: res?.status(), text, title, errors, shot }
}

const browser = await chromium.launch({ channel: 'chrome' })
const report = []
try {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    for (const route of ROUTES) {
      const a = await snap(page, A, route, width, 'a')
      const b = await snap(page, B, route, width, 'b')
      report.push({ width, route, a, b })
      assert(a.status === b.status, `${width} ${route}: status ${a.status} / ${b.status}`)
      assert(a.title === b.title, `${width} ${route}: title`)
      assert(a.text === b.text, `${width} ${route}: visible text (${a.text.length} / ${b.text.length} chars)`)
      assert(b.errors.length === 0, `${width} ${route}: no page errors on B${b.errors.length ? ' — ' + b.errors.join(' | ') : ''}`)
    }
    await ctx.close()
  }
} finally {
  await browser.close()
  if (SHOTS) writeFileSync(`${SHOTS}/report.json`, JSON.stringify(report, null, 2))
}

console.log(failed ? `\n${failed} failed` : '\nall passed')
process.exit(failed ? 1 : 0)
