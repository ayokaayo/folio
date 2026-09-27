// Analytics against the REAL Umami tracker in a production build. Builds the committed HEAD (override
// with ANALYTICS_PROD_REF) in a temporary git worktree with NEXT_PUBLIC_UMAMI_WEBSITE_ID=test-id and
// NEXT_PUBLIC_UMAMI_DOMAINS=localhost, serves it with next start on a spare port, loads the real
// cloud.umami.is/script.js, and intercepts the collection requests so nothing reaches Umami. The server
// and the worktree are removed afterwards. Never touches the dev server on :3000.
// Run: node scripts/checks/analytics-prod.check.mjs   (commit first; it builds HEAD)
import { chromium } from 'playwright-core'
import { execFileSync, spawn, spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const ROOT = resolve(new URL('../..', import.meta.url).pathname)
const REF = process.env.ANALYTICS_PROD_REF ?? 'HEAD'
const PORT = Number(process.env.ANALYTICS_PROD_PORT ?? 3102)
const BASE = `http://localhost:${PORT}`

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    failed++
    console.error(`FAIL: ${msg}`)
  } else console.log(`ok: ${msg}`)
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const sleep = ms => new Promise(r => setTimeout(r, ms))

const dir = mkdtempSync(join(tmpdir(), 'folio-analytics-'))
const wt = join(dir, 'wt')
let server
let browser

try {
  execFileSync('git', ['-C', ROOT, 'worktree', 'add', '--detach', wt, REF], { stdio: 'ignore' })
  symlinkSync(join(ROOT, 'node_modules'), join(wt, 'node_modules'))
  const env = { ...process.env, NODE_ENV: 'production', NEXT_PUBLIC_UMAMI_WEBSITE_ID: 'test-id', NEXT_PUBLIC_UMAMI_DOMAINS: 'localhost' }
  console.log(`building ${REF} in ${wt} ...`)
  const build = spawnSync('npx', ['next', 'build'], { cwd: wt, env, encoding: 'utf8' })
  assert(build.status === 0, `production build with test-id succeeds (exit ${build.status})`)
  if (build.status !== 0) throw new Error(build.stdout.slice(-3000) + build.stderr.slice(-3000))

  server = spawn('npx', ['next', 'start', '-p', String(PORT)], { cwd: wt, env, detached: true, stdio: 'ignore' })
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE + '/')).ok) break
    } catch {}
    await sleep(500)
  }

  browser = await chromium.launch({ channel: 'chrome' })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const sent = []
  const requests = []
  context.on('request', r => requests.push(r.url()))
  // Collection requests are captured and answered locally; the tracker script itself loads for real.
  const collect = async route => {
    const req = route.request()
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
    }
    if (req.method() === 'POST') {
      try {
        sent.push(JSON.parse(req.postData() ?? 'null'))
      } catch {
        sent.push({ unparsed: req.postData() })
      }
    }
    return route.fulfill({ status: 200, contentType: 'application/json', headers: cors, body: '{}' })
  }
  await context.route('https://gateway.umami.is/**', collect)
  await context.route('https://cloud.umami.is/api/**', collect)

  const pageviews = () => sent.filter(s => s?.type === 'event' && s.payload && !s.payload.name)
  const named = n => sent.filter(s => s?.type === 'event' && s.payload?.name === n)
  async function until(fn, timeout = 8000) {
    const t0 = Date.now()
    while (Date.now() - t0 < timeout) {
      if (fn()) return true
      await sleep(100)
    }
    return false
  }

  const page = await context.newPage()

  // Script tag attributes as rendered.
  await page.goto(BASE + '/?ref=acme&email=x@y.z', { waitUntil: 'load', timeout: 90000 })
  const attrs = await page.evaluate(() => {
    const el = document.querySelector('script[src="https://cloud.umami.is/script.js"]')
    return el && Object.fromEntries([...el.attributes].map(a => [a.name, a.value]))
  })
  assert(
    attrs && attrs['data-website-id'] === 'test-id' && attrs['data-do-not-track'] === 'true' && attrs['data-before-send'] === 'umamiBeforeSend' && !('data-host-url' in attrs),
    `script tag loads cloud.umami.is directly with the expected attributes (${JSON.stringify(attrs)})`,
  )

  // Tagged link: ref kept, everything else dropped.
  await until(() => pageviews().length >= 1)
  const first = pageviews()[0]?.payload
  assert(first?.url === `${BASE}/?ref=acme`, `page view url keeps only ?ref=acme (${first?.url})`)

  // Client navigation home -> /work.
  // The home nav bar is hidden until revealed, so the link is clicked from script (still a Link click).
  await page.locator('nav a[href="/work"]').first().evaluate(a => a.click())
  await until(() => pageviews().some(p => p.payload.url === `${BASE}/work`))
  const work = pageviews().find(p => p.payload.url === `${BASE}/work`)?.payload
  assert(!!work, 'Link navigation home -> /work sends a page view')
  assert(work?.referrer === '/?ref=acme', `its referrer is cleaned too (${work?.referrer})`)

  // Case-study card.
  const id = await page.locator('[data-case-study-id]').first().getAttribute('data-case-study-id')
  await page.locator('[data-case-study-id] a').first().click()
  await until(() => named('case_study_open').length >= 1)
  const cs = named('case_study_open')
  assert(cs.length === 1 && same(cs[0].payload.data, { id }), `case_study_open {id:'${id}'} sent by the real tracker (${JSON.stringify(cs.map(c => c.payload.data))})`)

  // Cold 404 in a fresh page: one not_found, and the page reported as /404.
  const before404 = sent.length
  const p404 = await context.newPage()
  const res = await p404.goto(BASE + '/secret-path-12345678?token=abc', { waitUntil: 'load', timeout: 90000 })
  await until(() => named('not_found').length >= 1)
  await sleep(2500)
  const nf = named('not_found')
  const views404 = sent.slice(before404).filter(s => s?.type === 'event' && !s.payload?.name && s.payload?.url?.includes('/404'))
  assert(res.status() === 404, 'cold 404 returns 404')
  assert(nf.length === 1, `cold 404 sends exactly one not_found (${nf.length})`)
  assert(nf[0]?.payload?.url === `${BASE}/404` && same(nf[0]?.payload?.data, { path: '/secret-path-#' }), `not_found reports url /404 and a masked path (${JSON.stringify(nf[0]?.payload && { url: nf[0].payload.url, data: nf[0].payload.data })})`)
  assert(views404.length === 1 && views404[0].payload.url === `${BASE}/404`, `the 404 page view reports url /404 (${views404.map(v => v.payload.url)})`)

  // Leaving the 404 by a link: the next referrer is /404, not the missing path.
  await p404.locator('nav a[href="/work"]').first().evaluate(a => a.click())
  await until(() => sent.slice(before404).some(s => !s.payload?.name && s.payload?.url === `${BASE}/work`))
  const after = sent.slice(before404).find(s => !s.payload?.name && s.payload?.url === `${BASE}/work`)?.payload
  assert(after?.referrer === '/404', `leaving the 404 reports referrer /404 (${after?.referrer})`)

  // Privacy: nothing stored, nothing leaked.
  const cookies = await context.cookies()
  assert(cookies.length === 0, `no cookies (${cookies.map(c => c.name).join(', ') || 'none'})`)
  const storage = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))
  assert(storage.local.length === 0 && storage.session.length === 0, `no storage keys (${JSON.stringify(storage)})`)
  const all = JSON.stringify(sent)
  assert(!all.includes('@'), 'no payload contains @')
  const urls = sent.flatMap(s => [s?.payload?.url, s?.payload?.referrer]).filter(Boolean)
  const leaky = urls.filter(u => u.includes('#') || (u.includes('?') && !/\?ref=acme$/.test(u)))
  assert(leaky.length === 0, `no payload url or referrer carries a query (other than ?ref=acme) or fragment (${JSON.stringify(leaky)})`)
  assert(!all.includes('secret-path-12345678') && !all.includes('token'), 'the missing path and its query never leave the page')
  assert(sent.length > 0 && sent.every(s => s?.payload?.website === 'test-id'), `every payload is for test-id (${sent.length} payloads)`)
  const google = requests.filter(u => /google-analytics\.com|googletagmanager\.com/.test(u))
  assert(google.length === 0, `no Google requests (${google.length})`)
} catch (e) {
  failed++
  console.error('FAIL: check aborted:', e?.message ?? e)
} finally {
  await browser?.close().catch(() => {})
  if (server?.pid) {
    try {
      process.kill(-server.pid, 'SIGTERM')
    } catch {}
  }
  await sleep(500)
  try {
    execFileSync('git', ['-C', ROOT, 'worktree', 'remove', '--force', wt], { stdio: 'ignore' })
  } catch {}
  execFileSync('git', ['-C', ROOT, 'worktree', 'prune'], { stdio: 'ignore' })
  rmSync(dir, { recursive: true, force: true })
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall production analytics checks passed')
process.exitCode = failed ? 1 : 0
