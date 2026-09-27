import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NOT_FOUND, PATH_MAX, displayPath, truncateMiddle, variantFor } from './notFoundCopy.ts'

test('short paths are shown whole', () => {
  assert.equal(truncateMiddle('/this-does-not-exist'), '/this-does-not-exist')
  assert.equal(truncateMiddle('/' + 'a'.repeat(PATH_MAX - 1)), '/' + 'a'.repeat(PATH_MAX - 1))
})

test('long paths keep both ends around a middle ellipsis, at the limit', () => {
  const long = '/work/' + 'x'.repeat(60) + '/end'
  const out = truncateMiddle(long)
  assert.equal(Array.from(out).length, PATH_MAX)
  assert.ok(out.startsWith('/work/'))
  assert.ok(out.endsWith('/end'))
  assert.equal(out.split('…').length, 2)
})

test('truncation counts characters, not UTF-16 units', () => {
  const out = truncateMiddle('/' + '🙂'.repeat(50))
  assert.equal(Array.from(out).length, PATH_MAX)
})

test('paths decode percent escapes, and malformed ones stay as they are', () => {
  assert.equal(displayPath('/caf%C3%A9'), '/café')
  assert.equal(displayPath('/100%'), '/100%')
})

test('each variant names its own place and offers two ways back', () => {
  assert.equal(NOT_FOUND.page.headline, 'This page drifted off the grid')
  assert.equal(NOT_FOUND.work.primary.href, '/work')
  assert.equal(NOT_FOUND.project.primary.href, '/projects')
  for (const v of Object.values(NOT_FOUND)) assert.notEqual(v.primary.href, v.secondary.href)
})

test('the variant follows the missing path', () => {
  assert.equal(variantFor('/this-does-not-exist'), 'page')
  assert.equal(variantFor('/work/nope'), 'work')
  assert.equal(variantFor('/projects/nope'), 'project')
  assert.equal(variantFor('/work/nope/deeper'), 'page')
  assert.equal(variantFor('/work'), 'page')
})
