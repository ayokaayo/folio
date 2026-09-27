// GPU cost of the glyph layer with production settings (the lab's defaults are HERO_SETTINGS).
// Timer path: EXT_disjoint_timer_query_webgl2 times the hero's full-screen draw, glyphs off vs on, on a
// 390 x 844 phone at 2x and a 1440 x 900 desktop at 2x, at rest and with a pointer wake running.
// Budget (spec: the mobile profile): the layer adds under 2 ms of GPU time per frame on the phone. The
// desktop numbers are reported for reference, not asserted.
// Stress path (only when the timer extension is unavailable): a canvas about ten times a 390 x 844 phone
// at 2x in pixels; the frame cadence with the layer on must stay within 10% of off. HERO_PERF_STRESS=1 forces it.
import { assert, launch, openHero } from './lib.mjs'

const ARGS = ['--enable-privileged-webgl-extensions', '--enable-webgl-draft-extensions']

// Wraps every WebGL2 draw in a TIME_ELAPSED query while window.__gpu.on is set, and collects the results
// (ms) as they arrive, discarding any that a disjoint event spoils.
const TIMER = () => {
  const st = { on: false, ext: null, gl: null, pending: [], ms: [] }
  window.__gpu = st
  const proto = WebGL2RenderingContext.prototype
  for (const name of ['drawElements', 'drawArrays']) {
    const orig = proto[name]
    proto[name] = function (...a) {
      if (!st.on) return orig.apply(this, a)
      if (!st.gl) {
        st.gl = this
        st.ext = this.getExtension('EXT_disjoint_timer_query_webgl2')
      }
      if (!st.ext || this !== st.gl) return orig.apply(this, a)
      const q = this.createQuery()
      this.beginQuery(st.ext.TIME_ELAPSED_EXT, q)
      const r = orig.apply(this, a)
      this.endQuery(st.ext.TIME_ELAPSED_EXT)
      st.pending.push(q)
      return r
    }
  }
  const poll = () => {
    const { gl, ext } = st
    if (gl && ext) {
      const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT)
      while (st.pending.length && gl.getQueryParameter(st.pending[0], gl.QUERY_RESULT_AVAILABLE)) {
        const q = st.pending.shift()
        if (!disjoint) st.ms.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6)
        gl.deleteQuery(q)
      }
    }
    requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
}

const median = xs => {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

async function hasTimer() {
  const { browser, page } = await launch({ args: ARGS })
  const ok = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2')?.getExtension('EXT_disjoint_timer_query_webgl2'))
  await browser.close()
  return ok
}

// Median GPU ms of the hero draw over 150 frames. wake: a pointer keeps circling the open side.
async function gpuMs(profile, glyphsOn, wake) {
  const { browser, page } = await launch({ ...profile, args: ARGS })
  await page.addInitScript(TIMER)
  await openHero(page, glyphsOn ? {} : { glyphs: false })
  const { width: w, height: h } = page.viewportSize()
  await page.mouse.move(w * 0.7, h * 0.4)
  await page.evaluate(() => (window.__gpu.on = true))
  let done = false
  const mover = (async () => {
    for (let i = 0; !done && wake; i++) {
      const a = i * 0.15
      await page.mouse.move(w * (0.7 + 0.15 * Math.cos(a)), h * (0.45 + 0.25 * Math.sin(a)))
      await page.waitForTimeout(16)
    }
  })()
  await page.waitForFunction(() => window.__gpu.ms.length >= 170, null, { timeout: 60000 })
  done = true
  await mover
  const ms = await page.evaluate(() => window.__gpu.ms.slice(20))
  await browser.close()
  return median(ms)
}

// Median frame interval over 200 frames, on a canvas about ten times a phone's pixels.
async function stressMs(glyphsOn) {
  const { browser, page } = await launch({ width: 2560, height: 1440, dpr: 2 })
  await openHero(page, glyphsOn ? {} : { glyphs: false })
  const ms = await page.evaluate(
    () =>
      new Promise(res => {
        const times = []
        let last = performance.now()
        const tick = now => {
          times.push(now - last)
          last = now
          if (times.length < 240) requestAnimationFrame(tick)
          else res(times.slice(40))
        }
        requestAnimationFrame(tick)
      }),
  )
  await browser.close()
  return median(ms)
}

if (!process.env.HERO_PERF_STRESS && (await hasTimer())) {
  console.log('path: GPU timer (EXT_disjoint_timer_query_webgl2)')
  const profiles = [
    { name: 'phone 390x844@2', opts: { mobile: true, dpr: 2 }, budget: true },
    { name: 'desktop 1440x900@2', opts: { dpr: 2 }, budget: false },
  ]
  for (const { name, opts, budget } of profiles) {
    for (const wake of [false, true]) {
      const off = await gpuMs(opts, false, wake)
      const on = await gpuMs(opts, true, wake)
      const label = `${name}${wake ? ', wake' : ', rest'}`
      console.log(`${label}: GPU draw off ${off.toFixed(3)} ms, on ${on.toFixed(3)} ms`)
      if (budget) assert(on - off < 2, `${label}: glyph layer adds under 2 ms GPU (${(on - off).toFixed(3)} ms)`)
      else console.log(`info: ${label}: glyph layer adds ${(on - off).toFixed(3)} ms GPU (reference only)`)
    }
  }
} else {
  console.log(`path: stress (${process.env.HERO_PERF_STRESS ? 'forced' : 'no timer extension'}): 2560x1440@2 canvas, about 11x a 390x844@2 phone`)
  const off = await stressMs(false)
  const on = await stressMs(true)
  console.log(`median frame: off ${off.toFixed(2)} ms, on ${on.toFixed(2)} ms`)
  assert(on <= off * 1.1, `frame cadence with the layer on within 10% of off (${((on / off - 1) * 100).toFixed(1)}%)`)
}
