'use client'

import HeroSection from '@/components/hero/HeroSection'
import { HERO_SETTINGS } from '@/components/hero/settings'
import type { VariantProps } from '../../types'

/** The lab renders the production hero with its own tuning values. */
export default function Wake({ values, reducedMotion }: VariantProps) {
  return <HeroSection values={{ ...HERO_SETTINGS, ...values }} reducedMotion={reducedMotion} />
}
