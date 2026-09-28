// Footer contact form, folded into one line that opens: the fold itself (collapsed by default, out of the
// tab order, opening into the message, Escape and Close returning focus, contact_open once, reduced
// motion), then validation, delivery, failures, spam traps, double submit, no key, lattice and mobile.
// Needs the dev server (npm run dev) on :3000. Run: node scripts/checks/contact.check.mjs
//
// The form renders only with a Web3Forms key. In development, ?contact=test swaps in a dummy key and
// ?contact=off forces none (lib/contact.ts, resolveContactKey), so the real key is never used here and
// the no-key case is checked without restarting the server. api.web3forms.com is intercepted with
// page.route: the real API is never called. window.umami is stubbed, as in analytics.check.mjs.
// Screenshots go to CONTACT_SHOTS as folded-<width>-<state>.png (default: no screenshots).
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
  message: 'Hello Miguel, I would like to talk about a role.',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
}
const KEYS = ['access_key', 'botcheck', 'email', 'from_name', 'message', 'name', 'subject']

const browser = await chromium.launch({ channel: 'chrome' })

/**
 * A page on the form, still folded, with the API answered by `reply` (a function of the route, default
 * 200 success). Returns the page and the list of API requests it has made.
 */
async function openForm({ flag = 'test', viewport = { width: 1440, height: 900 }, mobile = false, reply, reducedMotion } = {}) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, reducedMotion })
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
  // data-contact-ready appears once the form has hydrated.
  if (flag === 'test') await page.locator('[data-contact-form][data-contact-ready]').waitFor({ state: 'attached', timeout: 30000 })
  else await page.waitForTimeout(1500)
  // Show every revealed block at once, so geometry and screenshots are final.
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.setAttribute('data-revealed', '')))
  return { context, page, requests }
}

const wrap = page => page.locator('footer [data-contact]')
const toggle = page => page.locator('footer [data-contact-toggle]')
const form = page => page.locator('footer [data-contact-form]')
const field = (page, name) => form(page).locator(`[name="${name}"]`)
const send = page => form(page).locator('button[type="submit"]')
const events = page => page.evaluate(() => window.__events)
const named = async (page, name) => (await events(page)).filter(e => e.name === name)
const active = page =>
  page.evaluate(() => {
    const a = document.activeElement
    if (!a) return ''
    if (a.hasAttribute('data-contact-toggle')) return 'toggle'
    return a.getAttribute('name') || a.getAttribute('aria-label') || a.textContent?.replace(/[^\w ]/g, '').trim() || a.tagName
  })

/** Unfolds the form and waits for the fold to finish opening. */
async function unfold(page) {
  await toggle(page).click()
  await page.locator('footer [data-contact][data-open]').waitFor({ timeout: 5000 })
  await page.waitForTimeout(450)
}

/** A footer screenshot once scrolling and any transition have settled, the fixed navigation hidden. */
async function shot(page, name) {
  if (!SHOTS) return
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.evaluate(() => {
    document.activeElement?.blur?.()
    document.querySelectorAll('[data-reveal]').forEach(e => e.setAttribute('data-revealed', ''))
    for (const e of document.querySelectorAll('body *')) if (getComputedStyle(e).position === 'fixed') e.style.visibility = 'hidden'
  })
  await page.mouse.move(0, 0)
  await page.waitForTimeout(900)
  await page.locator('footer').screenshot({ path: `${SHOTS}/folded-${name}.png`, animations: 'disabled' })
}

async function fill(page, values) {
  for (const [k, v] of Object.entries(values)) await field(page, k).fill(v)
}

try {
  // 1. The fold: collapsed by default and out of the tab order; the toggle opens it into the message;
  // Escape, Close and the toggle fold it back to the toggle; contact_open fires once.
  {
    const { context, page } = await openForm()
    const c = await page.evaluate(() => {
      const w = document.querySelector('footer [data-contact]')
      const t = w.querySelector('[data-contact-toggle]')
      const panel = document.getElementById(t.getAttribute('aria-controls'))
      const controls = [...panel.querySelectorAll('input, textarea, button')].filter(e => e.tabIndex >= 0)
      return {
        expanded: t.getAttribute('aria-expanded'),
        controlsPanel: !!panel && panel.contains(w.querySelector('form')),
        inert: panel.hasAttribute('inert'),
        allInert: controls.every(e => !!e.closest('[inert]')),
        panelH: panel.getBoundingClientRect().height,
        open: w.hasAttribute('data-open'),
      }
    })
    assert(!c.open && c.expanded === 'false', `collapsed by default, aria-expanded="false" (${c.expanded})`)
    assert(c.controlsPanel, 'aria-controls names the panel that holds the form')
    assert(c.inert && c.allInert && c.panelH === 0, `the folded panel is inert and takes no height (${c.panelH})`)
    // Tab from the toggle: focus leaves the Contact column, never landing in the form.
    await toggle(page).focus()
    await page.keyboard.press('Tab')
    const next = await page.evaluate(() => ({ inForm: !!document.activeElement?.closest('[data-contact-form]'), text: document.activeElement?.textContent?.trim() }))
    assert(!next.inForm, `no field of the folded form is in the tab order (next: ${next.text})`)
    assert((await named(page, 'contact_open')).length === 0, 'contact_open does not fire on load')
    await shot(page, '1440-collapsed')

    await toggle(page).click()
    await page.waitForTimeout(50)
    assert((await toggle(page).getAttribute('aria-expanded')) === 'true', 'the toggle opens the form, aria-expanded="true"')
    assert((await active(page)) === 'message', `opening focuses the message field (${await active(page)})`)
    await page.waitForTimeout(450)
    assert(!(await page.evaluate(() => document.getElementById(document.querySelector('footer [data-contact-toggle]').getAttribute('aria-controls')).hasAttribute('inert'))), 'the open panel is not inert')

    await page.keyboard.press('Escape')
    await page.waitForTimeout(50)
    assert((await toggle(page).getAttribute('aria-expanded')) === 'false' && (await active(page)) === 'toggle', 'Escape folds the form and returns focus to the toggle')

    await unfold(page)
    await form(page).locator('.contact-fold-close').click()
    await page.waitForTimeout(50)
    assert((await toggle(page).getAttribute('aria-expanded')) === 'false' && (await active(page)) === 'toggle', 'Close folds the form and returns focus to the toggle')

    await unfold(page)
    await toggle(page).click()
    await page.waitForTimeout(50)
    assert((await toggle(page).getAttribute('aria-expanded')) === 'false' && (await active(page)) === 'toggle', 'the toggle folds it again and keeps focus')

    await unfold(page)
    const ev = await named(page, 'contact_open')
    assert(ev.length === 1 && ev[0].data === null, `contact_open fires once however often it opens, no properties (${JSON.stringify(ev)})`)
    await context.close()
  }

  // Reduced motion: the fold opens at once, with no transition.
  {
    const { context, page } = await openForm({ reducedMotion: 'reduce' })
    await toggle(page).click()
    const r = await page.evaluate(() => {
      const panel = document.querySelector('footer .contact-fold-panel')
      return { h: panel.getBoundingClientRect().height, form: panel.querySelector('form').getBoundingClientRect().height, t: getComputedStyle(panel).transitionDuration }
    })
    assert(r.h > 0 && Math.abs(r.h - r.form) < 0.5 && r.t.split(',').every(t => parseFloat(t) < 0.01), `reduced motion: the fold is open straight away (${r.h} of ${r.form}, ${r.t})`)
    await context.close()
  }

  // 2. Validation.
  {
    const { context, page, requests } = await openForm()
    await unfold(page)
    await page.waitForTimeout(3200)
    await send(page).click()
    await page.waitForTimeout(300)
    const errs = await form(page).locator('.contact-error').allTextContents()
    assert(errs.length === 3, `empty submit shows three field errors (${JSON.stringify(errs)})`)
    const invalid = await form(page).locator('[aria-invalid="true"]').evaluateAll(els => els.map(e => e.name))
    assert(same(invalid, ['message', 'name', 'email']), `aria-invalid on message, name, email (${invalid})`)
    const described = await field(page, 'name').evaluate(e => {
      const id = e.getAttribute('aria-describedby')
      return id && document.getElementById(id)?.textContent
    })
    assert(!!described, `aria-describedby points at the name error (${described})`)
    assert((await active(page)) === 'message', 'focus moves to the first invalid field, the message')
    assert(requests.length === 0, `empty submit sends no request (${requests.length})`)
    const ev = await named(page, 'contact_failed')
    assert(ev.length === 1 && same(ev[0].data, { reason: 'validation' }), `contact_failed {reason:'validation'} (${JSON.stringify(ev)})`)
    const h = await wrap(page).evaluate(e => e.getBoundingClientRect().height)
    assert(h % CELL === 0, `with errors showing the form is still whole cells (${h})`)

    await field(page, 'name').fill('Ada')
    assert((await form(page).locator('.contact-error').count()) === 2, 'the name error clears as the field is fixed')

    await fill(page, { email: 'not-an-email', message: '          ' })
    await send(page).click()
    await page.waitForTimeout(300)
    const emailErr = await form(page).locator('[data-error-for="email"]').textContent().catch(() => '')
    assert(/look right/.test(emailErr), `an invalid email shows an error (${emailErr})`)
    const msgErr = await form(page).locator('[data-error-for="message"]').textContent().catch(() => '')
    assert(/Write a message/.test(msgErr), `a whitespace-only message is rejected (${msgErr})`)
    await field(page, 'name').fill('   ')
    await send(page).click()
    await page.waitForTimeout(300)
    assert((await form(page).locator('[data-error-for="name"]').count()) === 1, 'a whitespace-only name is rejected')
    assert(requests.length === 0, `invalid submits send no request (${requests.length})`)
    await context.close()
  }

  // 3. Success.
  {
    const { context, page, requests } = await openForm()
    await unfold(page)
    await fill(page, VALID)
    await page.waitForTimeout(3200)
    await shot(page, '1440-open')
    await send(page).click()
    await page.locator('[data-contact-sent]').waitFor({ timeout: 5000 })
    assert(requests.length === 1, `one request is sent (${requests.length})`)
    const r = requests[0]
    const body = JSON.parse(r.body)
    assert(r.method === 'POST' && /application\/json/.test(r.headers['content-type']), `POST with a JSON content type (${r.method} ${r.headers['content-type']})`)
    assert(same(Object.keys(body).sort(), KEYS), `exactly the expected JSON keys, no company (${Object.keys(body).sort()})`)
    assert(
      body.name === VALID.name &&
        body.email === VALID.email &&
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
    assert((await page.locator('[data-contact-sent]').getAttribute('role')) === 'status', 'the confirmation is a status region')
    const ev = await named(page, 'contact_sent')
    assert(ev.length === 1 && ev[0].data === null, `contact_sent fires once, no properties (${JSON.stringify(ev)})`)
    const all = JSON.stringify(await events(page))
    assert(!all.includes('@') && !all.includes('Ada') && !all.includes('Hello'), 'no event carries field contents')
    const sentH = await page.locator('[data-contact-sent]').evaluate(e => e.getBoundingClientRect().height)
    assert(sentH % CELL === 0, `the confirmation is whole cells (${sentH})`)
    await shot(page, '1440-sent')

    await page.locator('[data-contact-sent] button').click()
    await page.waitForTimeout(100)
    assert((await field(page, 'message').inputValue()) === '' && (await field(page, 'name').inputValue()) === '', '"Send another" brings back an empty form')
    assert((await toggle(page).getAttribute('aria-expanded')) === 'true' && (await active(page)) === 'message', '"Send another" opens it with focus in the message')
    assert((await named(page, 'contact_open')).length === 1, 'contact_open still fired only once')
    await context.close()
  }

  // 4. Server error, then network failure.
  for (const [kind, reply] of [
    ['server', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{"statusCode":500,"error":"Something went wrong on server."}' })],
    ['network', route => route.abort('failed')],
  ]) {
    const { context, page, requests } = await openForm({ reply })
    await unfold(page)
    await fill(page, VALID)
    await page.waitForTimeout(3200)
    await send(page).click()
    await page.waitForFunction(() => document.querySelector('[data-contact-status]')?.textContent?.includes("didn't go through"), null, { timeout: 5000 }).catch(() => {})
    const status = await form(page).locator('[data-contact-status]').textContent()
    assert(status.includes("That didn't go through. Try again, or copy my email above."), `${kind}: the error message shows (${status})`)
    assert((await form(page).locator('[data-contact-status]').getAttribute('aria-live')) === 'polite', `${kind}: the message is in a polite live region`)
    const kept = await Promise.all(Object.keys(VALID).map(k => field(page, k).inputValue()))
    assert(same(kept, Object.values(VALID)), `${kind}: the typed text is kept`)
    const ev = await named(page, 'contact_failed')
    assert(ev.length === 1 && same(ev[0].data, { reason: kind }), `${kind}: contact_failed {reason:'${kind}'} (${JSON.stringify(ev)})`)
    assert(requests.length === 1, `${kind}: one request (${requests.length})`)
    await context.close()
  }

  // 5. Spam traps: no request, no event, the normal confirmation. The fill clock starts on unfolding.
  for (const [trap, arm, wait] of [
    ['website honeypot', page => form(page).locator('input[name="website"]').evaluate(e => (e.value = 'http://spam.example')), 3200],
    ['botcheck', page => form(page).locator('input[name="botcheck"]').evaluate(e => (e.checked = true)), 3200],
    ['under 3 seconds from unfolding', () => {}, 0],
  ]) {
    const { context, page, requests } = await openForm()
    // Time on the page before unfolding does not count towards the three seconds.
    if (!wait) await page.waitForTimeout(3200)
    await unfold(page)
    await fill(page, VALID)
    await arm(page)
    if (wait) await page.waitForTimeout(wait)
    await send(page).click()
    const shown = await page.locator('[data-contact-sent]').waitFor({ timeout: 5000 }).then(() => true, () => false)
    await page.waitForTimeout(300)
    assert(shown, `${trap}: the success state shows`)
    assert(requests.length === 0, `${trap}: no request is sent (${requests.length})`)
    const ev = (await events(page)).filter(e => e.name !== 'contact_open')
    assert(ev.length === 0, `${trap}: no send or failure event fires (${JSON.stringify(ev)})`)
    await context.close()
  }

  // Honeypots are unreachable by keyboard and hidden from assistive technology; the keyboard order.
  {
    const { context, page } = await openForm()
    await unfold(page)
    const traps = await form(page).locator('input[name="website"], input[name="botcheck"]').evaluateAll(els =>
      els.map(e => ({ tab: e.tabIndex, hidden: !!e.closest('[aria-hidden="true"]') || e.getAttribute('aria-hidden') === 'true' })),
    )
    assert(traps.length === 2 && traps.every(t => t.tab === -1 && t.hidden), `honeypots have tabindex -1 and aria-hidden (${JSON.stringify(traps)})`)
    await toggle(page).focus()
    const order = ['toggle']
    for (let k = 0; k < 5; k++) {
      await page.keyboard.press('Tab')
      order.push(await active(page))
    }
    assert(same(order, ['toggle', 'Close the message form', 'message', 'name', 'email', 'Send']), `keyboard reaches Close, every field and Send (${order})`)
    const ring = await send(page).evaluate(e => getComputedStyle(e).outlineStyle)
    assert(ring === 'solid', `Send shows a focus ring (${ring})`)
    await field(page, 'email').focus()
    await page.waitForTimeout(300)
    const f = await field(page, 'email').evaluate(e => ({ border: getComputedStyle(e).borderTopColor, shadow: getComputedStyle(e).boxShadow }))
    const accent = await page.evaluate(() => {
      const probe = document.createElement('i')
      probe.style.color = 'var(--accent)'
      document.body.append(probe)
      const c = getComputedStyle(probe).color
      probe.remove()
      return c
    })
    assert(f.border === accent && f.shadow.includes(accent) && /1px/.test(f.shadow), `a focused field draws the accent border and ring (${f.border}, ${f.shadow})`)
    await context.close()
  }

  // 6. Double click and a repeated Enter send one request.
  {
    const { context, page, requests } = await openForm({
      reply: async route => {
        await new Promise(r => setTimeout(r, 800))
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
      },
    })
    await unfold(page)
    await fill(page, VALID)
    await page.waitForTimeout(3200)
    await send(page).dblclick()
    await page.waitForTimeout(100)
    const s = await send(page).evaluate(e => ({ sending: e.hasAttribute('data-sending'), disabled: e.getAttribute('aria-disabled'), dots: !!e.querySelector('.contact-send-dots'), w: e.getBoundingClientRect().width }))
    assert(s.sending && s.disabled === 'true' && s.dots, `while sending the button is disabled and shows its dots (${JSON.stringify(s)})`)
    assert(await field(page, 'message').isEditable(), 'fields stay editable while sending')
    await field(page, 'name').press('Enter').catch(() => {})
    await send(page).click().catch(() => {})
    await page.locator('[data-contact-sent]').waitFor({ timeout: 5000 })
    assert(requests.length === 1, `double click sends a single request (${requests.length})`)
    assert((await named(page, 'contact_sent')).length === 1, 'contact_sent fires once')
    await context.close()
  }

  // 7. No key: no form, no toggle, the footer as before.
  {
    const { context, page } = await openForm({ flag: 'off' })
    assert((await page.locator('footer form, footer [data-contact], footer [data-contact-toggle], footer textarea').count()) === 0, 'with no key neither the toggle nor the form is rendered')
    assert((await page.locator('footer button[aria-label="Copy email to clipboard"]').count()) === 1, 'the masked email and Copy button remain')
    await context.close()
  }

  // 8 and 9. Lattice geometry at several widths; overflow and touch targets on phones.
  for (const width of [1440, 1280, 1024, 834, 768, 640, 390, 375]) {
    const mobile = width <= 430
    const { context, page } = await openForm({ viewport: { width, height: 900 }, mobile })
    if (width === 390) await shot(page, '390-collapsed')
    const measure = () =>
      page.evaluate(CELL => {
        const lat = document.querySelector('footer .lattice')
        const cs = getComputedStyle(lat)
        const origin = lat.getBoundingClientRect().left + parseFloat(cs.paddingLeft)
        const off = x => {
          const o = ((x % CELL) + CELL) % CELL
          return Math.min(o, CELL - o)
        }
        const w = document.querySelector('footer [data-contact]')
        const f = w.querySelector('[data-contact-form]')
        const box = e => e.getBoundingClientRect()
        const col = box(w.parentElement)
        const cta = box(w.querySelector('[data-contact-toggle]'))
        const inputs = [...f.querySelectorAll('input.contact-fold-input')].map(e => box(e))
        const textarea = box(f.querySelector('textarea'))
        const btn = box(f.querySelector('button[type="submit"]'))
        const bad = []
        const edges = [[col.left, col.right], [textarea.left, textarea.right], ...inputs.map(b => [b.left, b.right]), [btn.left, btn.right]]
        for (const [l, r] of edges) if (off(l - origin) > 0.05 || off(r - origin) > 0.05) bad.push(`${(l - origin).toFixed(1)}..${(r - origin).toFixed(1)}`)
        const near = (a, b) => Math.abs(a - b) < 0.05
        const inline = near(inputs[0].bottom, btn.bottom) && near(inputs[1].bottom, btn.bottom)
        return {
          inline,
          heights: inputs.map(b => b.height),
          textarea: textarea.height,
          bad,
          textareaFills: near(textarea.left, col.left) && near(textarea.right, col.right),
          rowFills: inline
            ? near(inputs[0].left, col.left) && near(btn.right, col.right) && near(inputs[1].left - inputs[0].right, CELL) && near(btn.left - inputs[1].right, CELL)
            : inputs.every(b => near(b.left, col.left) && near(b.right, col.right)) && near(btn.left, col.left),
          ctaW: cta.width,
          ctaH: cta.height,
          ctaLeft: cta.left - col.left,
          wrapH: box(w).height,
          btnW: btn.width,
          btnH: btn.height,
          colW: col.width,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          cols: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-columns'), 10),
        }
      }, CELL)
    const shut = await measure()
    assert(shut.ctaH === 49 && (shut.ctaW - 1) % CELL === 0 && shut.ctaLeft === 0 && shut.wrapH === 48, `${width}: the folded CTA is a btn-tertiary, whole cells (${shut.ctaW}x${shut.ctaH}, block ${shut.wrapH})`)
    await unfold(page)
    const g = await measure()
    assert(g.heights.length === 2 && g.heights.every(h => h === 48), `${width}: inputs are 48px (${g.heights})`)
    assert(g.textarea % CELL === 0 && g.textarea === 112, `${width}: the message is whole cells, 112px empty (${g.textarea})`)
    // Layout units are 1/64px, so a box placed at a fractional offset can measure a hair off.
    assert(Math.abs(g.wrapH - Math.round(g.wrapH)) < 0.01 && Math.round(g.wrapH) % CELL === 0, `${width}: the open form is whole cells (${g.wrapH})`)
    assert(g.bad.length === 0 && g.textareaFills && g.rowFills, `${width}: column, message, fields and Send land on lattice lines and fill the column (${g.bad.join(' ') || 'all on lines'})`)
    assert(g.inline === g.colW >= 400, `${width}: name, email and Send share a row only in a column of 400px or more (${g.colW}px, ${g.inline ? 'one row' : 'stacked'})`)
    if (g.inline) {
      assert(g.btnW === 80 && g.btnH === 48, `${width}: the inline Send is 80px by 48px (${g.btnW}x${g.btnH})`)
    } else {
      // Two lattice columns: (colW + 16) spans N columns of the column; two of them are 2 * (col + 16) - 16.
      const colsInTrack = width >= 1024 ? 4 : width >= 768 ? 2 : g.cols
      const twoCols = ((g.colW + CELL) / colsInTrack) * 2 - CELL
      assert(Math.abs(g.btnW - twoCols) < 0.05 && g.btnH === 48, `${width}: Send is 2 columns wide and 48px high (${g.btnW}x${g.btnH}, want ${twoCols})`)
    }
    // Growing the message adds whole lines and stays on the lattice, up to eight lines.
    await field(page, 'message').fill('A line\n'.repeat(5) + 'and the last')
    const grown = await field(page, 'message').evaluate(e => Math.round(e.getBoundingClientRect().height))
    await field(page, 'message').fill('A line\n'.repeat(20))
    const capped = await field(page, 'message').evaluate(e => Math.round(e.getBoundingClientRect().height))
    assert(grown === 16 + 6 * 32 && capped === 16 + 8 * 32, `${width}: the message grows by 32px lines and stops at eight (${grown}, ${capped})`)
    await field(page, 'message').fill('')
    if (mobile) {
      assert(g.overflow <= 0, `${width}: nothing overflows horizontally (${g.overflow})`)
      const targets = await wrap(page).locator('input.contact-fold-input, textarea, button').evaluateAll(els => els.map(e => e.getBoundingClientRect().height))
      assert(targets.every(h => h >= 48), `${width}: form touch targets are 48px or more (${targets})`)
      if (width === 390) {
        await fill(page, VALID)
        await shot(page, '390-open')
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
