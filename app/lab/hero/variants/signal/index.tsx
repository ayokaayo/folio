'use client'

import SignalHero from '@/components/hero/signal/SignalHero'
import type { VariantProps } from '../../types'

/** The live home hero (components/hero/signal), fed the lab's tweaks. */
export default function Signal({ values, reducedMotion }: VariantProps) {
  return <SignalHero values={values} reducedMotion={reducedMotion} lab />
}
