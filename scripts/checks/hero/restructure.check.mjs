// The early-exit restructure must not change a single pixel. Run with --save before the shader edit,
// then without it after. Reduced motion gives a deterministic frame.
import { readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { assert, ink, launch, openHero } from './lib.mjs'

const file = join(tmpdir(), 'hero-restructure-baseline.json')
const cases = [{}, { coverage: 0 }, { inkAlpha: 0.0005 }]
const { browser, page } = await launch({ reducedMotion: true })
const prints = []
for (const params of cases) {
  await openHero(page, { ...params, glyphs: false }, '&rm=1')
  prints.push((await ink(page)).fingerprint)
}
await browser.close()
if (process.argv.includes('--save')) {
  writeFileSync(file, JSON.stringify(prints))
  console.log('saved', prints)
} else {
  const before = JSON.parse(readFileSync(file, 'utf8'))
  cases.forEach((c, i) => assert(prints[i] === before[i], `identical frame for ${JSON.stringify(c)}`))
}
