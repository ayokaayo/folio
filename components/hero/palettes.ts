/**
 * Hero colours (no WebGL): palettes, site-token resolution, highlight and ink maps.
 * Colours are hex or a site token: `@accent` reads `--accent-rgb` from <html>, so the
 * hero follows the site palette (blue, or sage in preview) with no second source.
 */
import type { HeroValues } from './settings'

export const PALETTES: Record<string, [string, string, string]> = {
  // Key ink, second ink, accent.
  accent: ['#2A2A2C', '@accent-dark', '@accent'],
  'accent-purple': ['#2A2A2C', '@accent', '#9333EA'],
  purple: ['#2A2A2C', '#9333EA', '@accent'],
  soft: ['#6B6B6B', '@accent-light', '@accent'],
  grey: ['#2A2A2C', '#6B6B6B', '#A3A3A3'],
}
// Names used in earlier lab links.
const PALETTE_ALIAS: Record<string, string> = { blue: 'accent', 'blue-purple': 'accent-purple', 'soft-blue': 'soft', brand: 'accent' }
export function palette(name: unknown): [string, string, string] {
  const k = String(name)
  return PALETTES[k] ?? PALETTES[PALETTE_ALIAS[k]] ?? PALETTES.accent
}

let tokenCache: Record<string, string> | null = null
/** Forget resolved tokens (call when the site palette changes). */
export function resetTokens() {
  tokenCache = null
}
/** Resolve `@name` to the hex of `--name-rgb` on <html>; pass hex through. */
export function colour(c: string): string {
  if (!c.startsWith('@')) return c
  tokenCache ??= {}
  if (tokenCache[c]) return tokenCache[c]
  const raw = typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(`--${c.slice(1)}-rgb`)
  const ch = raw.trim().split(/[\s,]+/).map(Number)
  const hex = ch.length === 3 && ch.every(n => Number.isFinite(n)) ? '#' + ch.map(n => n.toString(16).padStart(2, '0')).join('') : '#338467'
  tokenCache[c] = hex
  return hex
}

export const HIGHLIGHT: Record<string, number> = { off: 0, tint: 1, marker: 2, underlay: 3, label: 4 }
export const HI_COLORS: Record<string, string> = { accent: '@accent', blue: '@accent', purple: '#9333EA', lavender: '#D8B4FE', grey: '#A3A3A3' }
export const LATENT: Record<string, number> = { saddle: 0, lens: 1, mark: 2 }

/** Text inks for the headline and subtitle. */
export const INK: Record<string, string | undefined> = {
  site: undefined,
  dark: '#45454A',
  key: 'var(--text-primary)',
  deep: 'var(--accent-deep)',
  'accent-dark': 'var(--accent-dark)',
  accent: 'var(--accent)',
  // Names used in earlier lab links.
  navy: 'var(--accent-deep)',
  'blue-dark': 'var(--accent-dark)',
  blue: 'var(--accent)',
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function highlightHex(values: HeroValues) {
  return values.hiColor === 'palette' ? palette(values.palette)[2] : HI_COLORS[String(values.hiColor)] ?? '@accent'
}

/** The paper colour under the highlight, so a text halo matches the wash instead of ringing. */
export function sheetColor(values: HeroValues) {
  const paper = String(values.paper)
  if ((HIGHLIGHT[String(values.highlight)] ?? 0) === 0) return paper
  const a = hexToRgb(paper)
  const b = hexToRgb(colour(highlightHex(values)))
  const k = Math.min(1, Number(values.hiStrength))
  const h = (i: number) => Math.round((a[i] + (b[i] - a[i]) * k) * 255).toString(16).padStart(2, '0')
  return `#${h(0)}${h(1)}${h(2)}`
}
