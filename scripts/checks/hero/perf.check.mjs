// Frame time with the glyph layer on vs off, on the mobile profile at 4x CPU throttle.
// Budget: the layer adds under 2 ms per frame.
import { assert, launch, openHero } from './lib.mjs'

async function frameMs(glyphsOn) {
  const { browser, page } = await launch({ mobile: true })
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await openHero(page, { glyphs: glyphsOn })
  const ms = await page.evaluate(
    () =>
      new Promise(res => {
        const times = []
        let last = performance.now()
        const tick = now => {
          times.push(now - last)
          last = now
          if (times.length < 240) requestAnimationFrame(tick)
          else res(times.slice(40).sort((a, b) => a - b)[Math.floor(200 * 0.5)])
        }
        requestAnimationFrame(tick)
      }),
  )
  await browser.close()
  return ms
}

const off = await frameMs(false)
const on = await frameMs(true)
console.log(`median frame: off ${off.toFixed(2)} ms, on ${on.toFixed(2)} ms`)
assert(on - off < 2, `glyph layer adds under 2 ms per frame (${(on - off).toFixed(2)})`)
