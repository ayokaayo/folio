/**
 * Home hero copy (British English). Headline lines break from md up; the subtitle wraps.
 * Settled 2026-09-25 with Miguel: "Intelligent Systems Designer" is his title across the
 * site, CV and LinkedIn.
 */
export interface HeroCopy {
  headline: string[]
  subhead: string[]
  cta: { label: string; href: string }
}

export const HERO_COPY: HeroCopy = {
  headline: ['Intelligent Systems Designer.', 'Turning LLMs into tools', 'that teams can trust.'],
  subhead: [
    'Over a decade of highly regulated B2B products, from iGaming and localisation to enterprise software, where reliability is the product. Currently focusing on infrastructure and enablement for the new era.',
  ],
  cta: { label: 'View Work', href: '/work' },
}
