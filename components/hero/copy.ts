/**
 * Home hero copy (British English). The title line always sits on its own line, holds on large
 * screens and is set medium; the lines after it wrap in normal weight, so the title reads apart.
 * The subtitle wraps. Settled 2026-09-25 with Miguel: "Intelligent Systems Designer" is his title
 * across the site, CV and LinkedIn. Lines revised by Miguel 2026-09-26.
 */
export interface HeroCopy {
  headline: string[]
  subhead: string[]
  cta: { label: string; href: string }
}

export const HERO_COPY: HeroCopy = {
  headline: ['Intelligent Systems Designer', 'Converting raw compute into trustworthy tools & products.'],
  subhead: ['Building the infrastructure and enabling enterprises for the new era.'],
  cta: { label: 'View Work', href: '/work' },
}
