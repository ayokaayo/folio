// Render the case-study cover HTML files to JPG using the installed Chrome.
// Usage: node docs/covers/render.mjs
import { chromium } from 'playwright-core'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const jobs = [
  // DNA ships the dark variant (cover-field-dark.jpg); the light one is kept as an alternate.
  { html: 'docs/covers/dna-dark.html', out: 'public/img/dna/cover-field-dark.jpg' },
  { html: 'docs/covers/dna.html', out: 'public/img/dna/cover-field.jpg' },
  { html: 'docs/covers/nexus.html', out: 'public/img/nexus/cover-drift.jpg' },
]

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] })
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 })
  await page.goto(pathToFileURL(path.join(root, j.html)).href)
  await page.waitForFunction(() => window.__ready === true, { timeout: 20000 })
  await page.waitForTimeout(250)
  await page.screenshot({ path: path.join(root, j.out), type: 'jpeg', quality: 90 })
  console.log('rendered', j.out)
  await page.close()
}
await browser.close()
