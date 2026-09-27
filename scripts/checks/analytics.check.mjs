// Analytics: each allowlisted event fires on its real user action with exactly the expected properties,
// nothing sets cookies or adds storage keys, nothing reaches Google, and /privacy renders.
// window.umami is stubbed, so this runs with or without NEXT_PUBLIC_UMAMI_WEBSITE_ID. Needs the dev
// server (npm run dev) on :3000. Run: node scripts/checks/analytics.check.mjs
import { chromium } from 'playwright-core'

const BASE = process.env.ANALYTICS_BASE ?? 'http://localhost:3000'
const ORIGIN = new URL(BASE).origin

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    failed++
    console.error(`FAIL: ${msg}`)
  } else console.log(`ok: ${msg}`)
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// Records every umami.track call; the real script is never loaded here.
const STUB = () => {
  window.__events = []
  Object.defineProperty(window, 'umami', {
    configurable: true,
    value: { track: (name, data) => window.__events.push({ name, data: data ?? null }) },
  })
}

const browser = await chromium.launch({ channel: 'chrome' })
const external = []

async function newContext(opts = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts })
  await context.addInitScript(STUB)
  // Nothing leaves localhost: external requests are recorded and answered empty.
  await context.route(url => new URL(url).origin !== ORIGIN, route => {
    external.push(route.request().url())
    return route.fulfill({ status: 204, body: '' })
  })
  // Links with target=_blank open popups; close them, the event has already fired on the opener.
  context.on('page', p => p.opener().then(o => o && p.close().catch(() => {})))
  return context
}

const events = page => page.evaluate(() => window.__events)
async function waitEvent(page, name, timeout = 5000) {
  try {
    await page.waitForFunction(n => window.__events.some(e => e.name === n), name, { timeout })
  } catch {}
  return (await events(page)).filter(e => e.name === name)
}
async function open(page, path) {
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(600)
}
const storageKeys = page =>
  page.evaluate(() => ({ local: Object.keys(localStorage).sort(), session: Object.keys(sessionStorage).sort() }))

try {
  // Footer: CV, LinkedIn, copy email (ok).
  {
    const context = await newContext()
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: ORIGIN })
    const page = await context.newPage()
    await open(page, '/about')
    const before = await storageKeys(page)

    await page.locator('footer a[href="/cv/Miguel_Ferreira_Resume.pdf"]').click()
    let ev = await waitEvent(page, 'cv_download')
    assert(ev.length === 1 && same(ev[0].data, { from: 'footer' }), `cv_download {from:'footer'} (${JSON.stringify(ev)})`)

    await page.locator('footer a[href*="linkedin.com"]').click()
    ev = await waitEvent(page, 'linkedin_click')
    assert(ev.length === 1 && same(ev[0].data, { from: 'footer' }), `linkedin_click {from:'footer'} (${JSON.stringify(ev)})`)

    await page.locator('footer button[aria-label="Copy email to clipboard"]').click()
    ev = await waitEvent(page, 'email_copy')
    assert(ev.length === 1 && same(ev[0].data, { result: 'ok' }), `email_copy {result:'ok'} (${JSON.stringify(ev)})`)
    const clip = JSON.stringify(await events(page))
    assert(!clip.includes('@'), 'no event carries an email address')

    // Several pages later: no cookies, no new storage keys.
    for (const path of ['/', '/work', '/projects', '/work/nexus', '/projects/kallax', '/privacy']) await open(page, path)
    const cookies = await context.cookies()
    assert(cookies.length === 0, `no cookies after visiting several pages (${cookies.map(c => c.name).join(', ') || 'none'})`)
    const after = await storageKeys(page)
    assert(same(before, after), `no localStorage or sessionStorage keys added (before ${JSON.stringify(before)}, after ${JSON.stringify(after)})`)
    await context.close()
  }

  // Copy email (failed): the clipboard rejects.
  {
    const context = await newContext()
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error('denied')) },
      })
    })
    const page = await context.newPage()
    page.on('console', () => {})
    await open(page, '/about')
    await page.locator('footer button[aria-label="Copy email to clipboard"]').click()
    const ev = await waitEvent(page, 'email_copy')
    assert(ev.length === 1 && same(ev[0].data, { result: 'failed' }), `email_copy {result:'failed'} (${JSON.stringify(ev)})`)
    await context.close()
  }

  // Cards, live product, image enlarge, 404, privacy.
  {
    const context = await newContext()
    const page = await context.newPage()

    await open(page, '/')
    const card = page.locator('[data-case-study-id] a').first()
    const id = await page.locator('[data-case-study-id]').first().getAttribute('data-case-study-id')
    await card.scrollIntoViewIfNeeded()
    await card.click()
    let ev = await waitEvent(page, 'case_study_open')
    assert(ev.length === 1 && same(ev[0].data, { id }), `case_study_open {id:'${id}'} on home (${JSON.stringify(ev)})`)

    await open(page, '/projects')
    const proj = page.locator('a[href^="/projects/"]').filter({ has: page.locator('h3') }).first()
    const projId = (await proj.getAttribute('href')).split('/').pop()
    await proj.click()
    ev = await waitEvent(page, 'project_open')
    assert(ev.length === 1 && same(ev[0].data, { id: projId }), `project_open {id:'${projId}'} (${JSON.stringify(ev)})`)

    await open(page, '/projects/codex-tarot')
    await page.locator('main a[href^="https://play.google.com"]').first().click()
    ev = await waitEvent(page, 'live_product_click')
    assert(
      ev.length === 1 && same(ev[0].data, { project: 'codex-tarot', host: 'play.google.com' }),
      `live_product_click {project:'codex-tarot', host:'play.google.com'}, hostname only (${JSON.stringify(ev)})`,
    )
    await page.locator('a[href="/projects"]').first().click()
    await page.waitForTimeout(500)
    ev = await events(page)
    assert(ev.filter(e => e.name === 'live_product_click').length === 1, 'internal links on a project page are not counted as outbound')

    await open(page, '/work/sms-characters')
    const fig = page.locator('main figure.cursor-pointer').first()
    await fig.scrollIntoViewIfNeeded()
    await fig.click()
    await page.locator('[aria-label="Close image"]').waitFor({ timeout: 5000 })
    ev = await waitEvent(page, 'proof_open')
    assert(ev.length === 1 && same(ev[0].data, { page: 'sms-characters', kind: 'image' }), `proof_open {page:'sms-characters', kind:'image'} (${JSON.stringify(ev)})`)

    const res = await page.goto(BASE + '/no-such-page-for-analytics', { waitUntil: 'load', timeout: 90000 })
    ev = await waitEvent(page, 'not_found')
    await page.waitForTimeout(800)
    ev = (await events(page)).filter(e => e.name === 'not_found')
    assert(res.status() === 404, '/no-such-page-for-analytics returns 404')
    assert(ev.length === 1 && same(ev[0].data, { path: '/no-such-page-for-analytics' }), `not_found fires once with the path (${JSON.stringify(ev)})`)

    await page.goto(BASE + '/' + 'x'.repeat(90) + '?secret=1', { waitUntil: 'load', timeout: 90000 })
    ev = await waitEvent(page, 'not_found')
    const path = ev[0]?.data?.path ?? ''
    assert(ev.length === 1 && path.length === 60 && !path.includes('?'), `not_found path is cut to 60 characters with no query (${path.length})`)

    const priv = await page.goto(BASE + '/privacy', { waitUntil: 'load', timeout: 90000 })
    const h1 = await page.locator('main h1').textContent()
    const text = await page.locator('main').textContent()
    assert(priv.status() === 200 && h1.trim() === 'Privacy' && text.includes('No cookies, no ads, no tracking across sites.'), '/privacy returns 200 and renders')
    assert((await page.title()) === 'Privacy · Miguel Angelo', 'privacy page title')
    assert((await page.locator('footer a[href="/privacy"]').count()) === 1, 'footer links to /privacy')
    await context.close()
  }

  // Hero: the first play fires once, however much play follows.
  {
    const context = await newContext()
    const page = await context.newPage()
    await page.goto(BASE + '/', { waitUntil: 'load', timeout: 90000 })
    await page.waitForFunction(() => window.__hero && window.__hero.u.uEntrance.value >= 1, null, { timeout: 30000 })
    assert((await events(page)).filter(e => e.name === 'hero_play').length === 0, 'hero_play does not fire on load')
    const box = await page.locator('section').first().boundingBox()
    for (let k = 0; k <= 20; k++) await page.mouse.move(box.x + box.width * (0.3 + k * 0.02), box.y + box.height * 0.6)
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(600)
    for (let k = 0; k <= 10; k++) await page.mouse.move(box.x + box.width * (0.7 - k * 0.02), box.y + box.height * 0.3)
    await page.waitForTimeout(300)
    const ev = (await events(page)).filter(e => e.name === 'hero_play')
    assert(ev.length === 1 && same(ev[0].data, { kind: 'pointer' }), `hero_play {kind:'pointer'} fires once (${JSON.stringify(ev)})`)
    await context.close()
  }

  // Hero by scroll alone.
  {
    const context = await newContext()
    const page = await context.newPage()
    await page.goto(BASE + '/', { waitUntil: 'load', timeout: 90000 })
    await page.waitForFunction(() => window.__hero && window.__hero.u.uEntrance.value >= 1, null, { timeout: 30000 })
    for (let k = 0; k < 4; k++) {
      await page.evaluate(() => window.scrollBy(0, 60))
      await page.waitForTimeout(80)
    }
    const ev = await waitEvent(page, 'hero_play', 3000)
    assert(ev.length === 1 && same(ev[0].data, { kind: 'scroll' }), `hero_play {kind:'scroll'} on scroll alone (${JSON.stringify(ev)})`)
    await context.close()
  }

  const google = external.filter(u => /google-analytics\.com|googletagmanager\.com/.test(u))
  assert(google.length === 0, `no requests to google-analytics or googletagmanager (${google.length})`)
  const umamiDirect = external.filter(u => /umami\.is/.test(u))
  assert(umamiDirect.length === 0, `no direct requests to umami.is (${umamiDirect.length})`)
} finally {
  await browser.close()
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall analytics checks passed')
process.exitCode = failed ? 1 : 0
