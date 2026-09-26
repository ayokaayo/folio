'use client'

import HeroSection from '@/components/hero/HeroSection'
import { HERO_SETTINGS } from '@/components/hero/settings'
import { GLYPH_MACROS, expandGlyphMacros, type GlyphMacros } from '@/components/hero/glyphMacros'
import type { VariantProps } from '../../types'

const MACRO_KEYS = Object.keys(GLYPH_MACROS) as (keyof GlyphMacros)[]

/** The lab renders the production hero: settings, then the six glyph controls once moved, then raw URL overrides. */
export default function Wake({ values, reducedMotion }: VariantProps) {
  const macros = { ...GLYPH_MACROS }
  const raw: Record<string, number | string | boolean> = {}
  for (const [k, v] of Object.entries(values)) {
    if ((MACRO_KEYS as string[]).includes(k)) macros[k as keyof GlyphMacros] = Number(v)
    else raw[k] = v
  }
  // Until a control moves, the lab shows exactly the production settings (the locked look).
  const touched = MACRO_KEYS.some(k => macros[k] !== GLYPH_MACROS[k])
  return <HeroSection values={{ ...HERO_SETTINGS, ...(touched ? expandGlyphMacros(macros) : {}), ...raw }} reducedMotion={reducedMotion} />
}
