// Footer contact form: validation, delivery, failures, spam traps, double submit, no key, lattice and
// mobile. Needs the dev server (npm run dev) on :3000. Run: node scripts/checks/contact.check.mjs
//
// The form renders only with a Web3Forms key. In development, ?contact=test swaps in a dummy key and
// ?contact=off forces none (lib/contact.ts, resolveContactKey), so the real key is never used here and
// the no-key case is checked without restarting the server. api.web3forms.com is intercepted with page.route: the real API is
// never called. window.umami is stubbed, as in analytics.check.mjs.
// Screenshots go to CONTACT_SHOTS (default: no screenshots).
import { chromium } from 'playwright-core'

const BASE = process.env.CONTACT_BASE ?? 'http://localhost:3000'
const ORIGIN = new URL(BASE).origin
const PATH = '/privacy'
const SHOTS = process.env.CONTACT_SHOTS ?? ''
const CELL = 16
const DUMMY_KEY = '00000000-0000-4000-8000-000000000000'
let realKey = 0

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    failed++
    console.error(`FAIL: ${msg}`)
  } else console.log(`ok: ${msg}`)
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const STUB = () => {
  window.__events = []
  Object.defineProperty(window, 'umami', {
    configurable: true,
    value: { track: (name, data) => window.__events.push({ name, data: data ?? null }) },
  })
}

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  message: 'Hello Miguel, I would like to talk about a role.',
}
const KEYS = ['access_key', 'botcheck', 'company', 'email', 'from_name', 'message', 'name', 'subject']

const browser = await chromium.launch({ channel: 'chrome' })

/**
 * A page on the form, with the API answered by `reply` (a function of the route, default 200 success).
 * Returns the page and the list of API requests it has made.
 */
async function openForm({ flag = 'test', viewport = { width: 1440, height: 900 }, mobile = false, reply } = {}) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile })
  await context.addInitScript(STUB)
  const requests = []
  await context.route(url => new URL(url).origin !== ORIGIN, async route => {
    const req = route.request()
    if (new URL(req.url()).hostname === 'api.web3forms.com') {
      requests.push({ method: req.method(), headers: req.headers(), body: req.postData() })
      // Belt and braces: a request with anything but the dummy key would be a real submission.
      if (!(req.postData() ?? '').includes(DUMMY_KEY)) realKey++
      if (reply) return reply(route)
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, body: { data: {}, message: 'Email sent successfully!' } }),
      })
    }
    return route.fulfill({ status: 204, body: '' })
  })
  const page = await context.newPage()
  await page.goto(`${BASE}${PATH}?contact=${flag}`, { waitUntil: 'load', timeout: 90000 })
  // data-contact-ready appears once the form has hydrated and its fill clock has started.
  if (flag === 'test') await page.locator('[data-contact-form][data-contact-ready]').waitFor({ timeout: 30000 })
  else await page.waitForTimeout(1500)
  // Show every revealed block at once, so geometry and screenshots are final.
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.setAttribute('data-revealed', '')))
  return { context, page, requests }
}

const form = page => page.locator('footer [data-contact-form]')
const field = (page, name) => form(page).locator(`[name="${name}"]`)
const send = page => form(page).locator('button[type="submit"]')
const events = page => page.evaluate(() => window.__events)
const named = async (page, name) => (await events(page)).filter(e => e.name === name)

/** A footer screenshot once scrolling and any reveal transition have settled. */
async function shot(page, name) {
  if (!SHOTS) return
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.setAttribute('data-revealed', '')))
  await page.waitForTimeout(900)
  await page.locator('footer').screenshot({ path: `${SHOTS}/contact-${name}.png`, animations: 'disabled' })
}

async function fill(page, values) {
  for (const [k, v] of Object.entries(values)) await field(page, k).fill(v)
}

try {
  // 1. Validation.
  {
    const { context, page, requests } = await openForm()
    await page.waitForTimeout(3200)
    await send(page).click()
    await page.waitForTimeout(300)
    const errs = await form(page).locator('.contact-error').allTextContents()
    assert(errs.length === 3, `empty submit shows three field errors (${JSON.stringify(errs)})`)
    const invalid = await form(page).locator('[aria-invalid="true"]').evaluateAll(els => els.map(e => e.name))
    assert(same(invalid, ['name', 'email', 'message']), `aria-invalid on name, email, message (${invalid})`)
    const described = await field(page, 'name').evaluate(e => {
      const id = e.getAttribute('aria-describedby')
      return id && document.getElementById(id)?.textContent
    })
    assert(!!described, `aria-describedby points at the name error (${described})`)
    assert((await page.evaluate(() => document.activeElement?.getAttribute('name'))) === 'name', 'focus moves to the first invalid field')
    assert(requests.length === 0, `empty submit sends no request (${requests.length})`)
    let ev = await named(page, 'contact_failed')
    assert(ev.length === 1 && same(ev[0].data, { reason: 'validation' }), `contact_failed {reason:'validation'} (${JSON.stringify(ev)})`)

    await field(page, 'name').fill('Ada')
    assert((await form(page).locator('.contact-error').count()) === 2, 'the name error clears as the field is fixed')

    await fill(page, { email: 'not-an-email', message: '          ' })
    await send(page).click()
    await page.waitForTimeout(300)
    const emailErr = await form(page).locator('[name="email"] ~ .contact-error').textContent().catch(() => '')
    assert(/look right/.test(emailErr), `an invalid email shows an error (${emailErr})`)
    const msgErr = await form(page).locator('[name="message"] ~ .contact-error').textContent().catch(() => '')
    assert(/Write a message/.test(msgErr), `a whitespace-only message is rejected (${msgErr})`)
    await field(page, 'name').fill('   ')
    await send(page).click()
    await page.waitForTimeout(300)
    assert((await form(page).locator('[name="name"] ~ .contact-error').count()) === 1, 'a whitespace-only name is rejected')
    assert(requests.length === 0, `invalid submits send no request (${requests.length})`)
    await context.close()
  }

  // 2. Success.
  {
    const { context, page, requests } = await openForm()
    await fill(page, VALID)
    await page.waitForTimeout(3200)
    await shot(page, '1440-idle')
    await send(page).click()
    await page.locator('[data-contact-sent]').waitFor({ timeout: 5000 })
    assert(requests.length === 1, `one request is sent (${requests.length})`)
    const r = requests[0]
    const body = JSON.parse(r.body)
    assert(r.method === 'POST' && /application\/json/.test(r.headers['content-type']), `POST with a JSON content type (${r.method} ${r.headers['content-type']})`)
    assert(same(Object.keys(body).sort(), KEYS), `exactly the expected JSON keys (${Object.keys(body).sort()})`)
    assert(
      body.name === VALID.name &&
        body.email === VALID.email &&
        body.company === VALID.company &&
        body.message === VALID.message &&
        body.subject === `Portfolio message from ${VALID.name}` &&
        body.from_name === 'miguelangelo.tech' &&
        body.botcheck === false &&
        typeof body.access_key === 'string' &&
        body.access_key.length > 0,
      `payload values (${JSON.stringify({ ...body, access_key: '…' })})`,
    )
    const text = await page.locator('[data-contact-sent]').textContent()
    assert(text.includes(`Message sent. I'll reply to ${VALID.email}.`), `confirmation names the email (${text})`)
    assert(await page.evaluate(() => document.activeElement?.hasAttribute('data-contact-sent')), 'focus moves to the confirmation')
    const ev = await named(page, 'contact_sent')
    assert(ev.length === 1 && ev[0].data === null, `contact_sent fires once, no properties (${JSON.stringify(ev)})`)
    const all = JSON.stringify(await events(page))
    assert(!all.includes('@') && !all.includes('Ada') && !all.includes('Hello'), 'no event carries field contents')
    await shot(page, '1440-sent')

    await page.locator('[data-contact-sent] button').click()
    assert((await field(page, 'name').inputValue()) === '', '"Send another" brings back an empty form')
    await context.close()
  }

  // 3. Server error, then network failure.
  for (const [kind, reply] of [
    ['server', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{"statusCode":500,"error":"Something went wrong on server."}' })],
    ['network', route => route.abort('failed')],
  ]) {
    const { context, page, requests } = await openForm({ reply })
    await fill(page, VALID)
    await page.waitForTimeout(3200)
    await send(page).click()
    await page.waitForFunction(() => document.querySelector('[data-contact-status]')?.textContent?.includes("didn't go through"), null, { timeout: 5000 }).catch(() => {})
    const status = await form(page).locator('[data-contact-status]').textContent()
    assert(status.includes("That didn't go through. Try again, or copy my email above."), `${kind}: the error message shows (${status})`)
    const kept = await Promise.all(Object.keys(VALID).map(k => field(page, k).inputValue()))
    assert(same(kept, Object.values(VALID)), `${kind}: the typed text is kept`)
    const ev = await named(page, 'contact_failed')
    assert(ev.length === 1 && same(ev[0].data, { reason: kind }), `${kind}: contact_failed {reason:'${kind}'} (${JSON.stringify(ev)})`)
    assert(requests.length === 1, `${kind}: one request (${requests.length})`)
    await context.close()
  }

  // 4. Spam traps: no request, no event, the normal confirmation.
  for (const [trap, arm, wait] of [
    ['website honeypot', page => form(page).locator('input[name="website"]').evaluate(e => (e.value = 'http://spam.example')), 3200],
    ['botcheck', page => form(page).locator('input[name="botcheck"]').evaluate(e => (e.checked = true)), 3200],
    ['under 3 seconds', () => {}, 0],
  ]) {
    const { context, page, requests } = await openForm()
    await fill(page, VALID)
    await arm(page)
    if (wait) await page.waitForTimeout(wait)
    await send(page).click()
    const shown = await page.locator('[data-contact-sent]').waitFor({ timeout: 5000 }).then(() => true, () => false)
    await page.waitForTimeout(300)
    assert(shown, `${trap}: the success state shows`)
    assert(requests.length === 0, `${trap}: no request is sent (${requests.length})`)
    assert((await events(page)).length === 0, `${trap}: no event fires`)
    await context.close()
  }

  // Honeypots are unreachable by keyboard and hidden from assistive technology.
  {
    const { context, page } = await openForm()
    const traps = await form(page).locator('input[name="website"], input[name="botcheck"]').evaluateAll(els =>
      els.map(e => ({ tab: e.tabIndex, hidden: !!e.closest('[aria-hidden="true"]') || e.getAttribute('aria-hidden') === 'true' })),
    )
    assert(traps.length === 2 && traps.every(t => t.tab === -1 && t.hidden), `honeypots have tabindex -1 and aria-hidden (${JSON.stringify(traps)})`)
    // Tab order through the form: the four fields, then Send.
    await field(page, 'name').focus()
    const order = ['name']
    for (let k = 0; k < 4; k++) {
      await page.keyboard.press('Tab')
      order.push(await page.evaluate(() => document.activeElement?.getAttribute('name') || document.activeElement?.textContent?.trim()))
    }
    assert(same(order, ['name', 'email', 'company', 'message', 'Send message']), `keyboard reaches every field and Send (${order})`)
    const ring = await send(page).evaluate(e => getComputedStyle(e).outlineStyle)
    assert(ring === 'solid', `Send shows a focus ring (${ring})`)
    await field(page, 'email').focus()
    const fieldRing = await field(page, 'email').evaluate(e => getComputedStyle(e).outlineStyle + ' ' + getComputedStyle(e).outlineWidth)
    assert(fieldRing === 'solid 2px', `fields show the accent focus ring (${fieldRing})`)
    await context.close()
  }

  // 5. Double click and a repeated Enter send one request.
  {
    const { context, page, requests } = await openForm({
      reply: async route => {
        await new Promise(r => setTimeout(r, 800))
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
      },
    })
    await fill(page, VALID)
    await page.waitForTimeout(3200)
    await send(page).dblclick()
    await page.waitForTimeout(100)
    const label = await send(page).textContent()
    const disabled = await send(page).getAttribute('aria-disabled')
    assert(label.includes('Sending...') && disabled === 'true', `while sending the button reads "Sending..." and is disabled (${label.trim()}, ${disabled})`)
    assert(await field(page, 'message').isEditable(), 'fields stay editable while sending')
    await field(page, 'message').press('Enter').catch(() => {})
    await send(page).click().catch(() => {})
    await page.locator('[data-contact-sent]').waitFor({ timeout: 5000 })
    assert(requests.length === 1, `double click sends a single request (${requests.length})`)
    assert((await named(page, 'contact_sent')).length === 1, 'contact_sent fires once')
    await context.close()
  }

  // 6. No key: no form, the footer as before.
  {
    const { context, page } = await openForm({ flag: 'off' })
    assert((await page.locator('footer form, footer [data-contact-form], footer textarea').count()) === 0, 'with no key the form is not rendered')
    assert((await page.locator('footer button[aria-label="Copy email to clipboard"]').count()) === 1, 'the masked email and Copy button remain')
    await context.close()
  }

  // 7 and 8. Lattice geometry at several widths; overflow and touch targets on phones.
  for (const width of [1440, 1280, 1024, 834, 768, 640, 390, 375]) {
    const mobile = width <= 430
    const { context, page } = await openForm({ viewport: { width, height: 900 }, mobile })
    const g = await page.evaluate(CELL => {
      const lat = document.querySelector('footer .lattice')
      const cs = getComputedStyle(lat)
      const origin = lat.getBoundingClientRect().left + parseFloat(cs.paddingLeft)
      const off = x => {
        const o = ((x % CELL) + CELL) % CELL
        return Math.min(o, CELL - o)
      }
      const f = document.querySelector('footer [data-contact-form]')
      const col = f.parentElement.getBoundingClientRect()
      const box = e => e.getBoundingClientRect()
      const inputs = [...f.querySelectorAll('input.contact-field')].map(e => box(e).height)
      const textarea = box(f.querySelector('textarea')).height
      const fields = [...f.querySelectorAll('.contact-field')].map(e => [box(e).left - origin, box(e).right - origin])
      const btn = box(f.querySelector('button[type="submit"]'))
      const bad = []
      for (const [l, r] of [[col.left - origin, col.right - origin], ...fields, [btn.left - origin, btn.right - origin]])
        if (off(l) > 0.05 || off(r) > 0.05) bad.push(`${l.toFixed(1)}..${r.toFixed(1)}`)
      return {
        inputs,
        textarea,
        bad,
        fillsColumn: fields.every(([l, r]) => Math.abs(l - (col.left - origin)) < 0.05 && Math.abs(r - (col.right - origin)) < 0.05),
        btnW: btn.width,
        btnH: btn.height,
        colW: col.width,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        cols: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-columns'), 10),
      }
    }, CELL)
    assert(g.inputs.length === 3 && g.inputs.every(h => h === 48), `${width}: inputs are 48px (${g.inputs})`)
    assert(g.textarea % CELL === 0, `${width}: textarea height is whole cells (${g.textarea})`)
    assert(g.bad.length === 0 && g.fillsColumn, `${width}: column, fields and button edges land on lattice lines (${g.bad.join(' ') || 'all on lines'})`)
    // Two lattice columns: (colW + 16) spans N columns of the column; two of them are 2 * (col + 16) - 16.
    const colsInTrack = width >= 1024 ? 4 : width >= 768 ? 2 : g.cols
    const twoCols = ((g.colW + CELL) / colsInTrack) * 2 - CELL
    assert(Math.abs(g.btnW - twoCols) < 0.05 && g.btnH === 48, `${width}: Send is 2 columns wide and 48px high (${g.btnW}x${g.btnH}, want ${twoCols})`)
    if (mobile) {
      assert(g.overflow <= 0, `${width}: nothing overflows horizontally (${g.overflow})`)
      const targets = await form(page).locator('input.contact-field, textarea, button').evaluateAll(els => els.map(e => e.getBoundingClientRect().height))
      assert(targets.every(h => h >= 48), `${width}: form touch targets are 48px or more (${targets})`)
      if (width === 390 && SHOTS) {
        await fill(page, VALID)
        await shot(page, '390-idle')
        await page.waitForTimeout(3200)
        await send(page).click()
        await page.locator('[data-contact-sent]').waitFor({ timeout: 5000 })
        const again = await page.locator('[data-contact-sent] button').evaluate(e => e.getBoundingClientRect().height)
        assert(again >= 48, `${width}: "Send another" is a 48px target (${again})`)
        const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        assert(over <= 0, `${width}: the sent state does not overflow (${over})`)
        await shot(page, '390-sent')
      }
    }
    await context.close()
  }
  assert(realKey === 0, `every intercepted request carried the dummy key, never the real one (${realKey})`)
} finally {
  await browser.close()
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall contact checks passed')
process.exitCode = failed ? 1 : 0
