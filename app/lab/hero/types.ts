/**
 * Hero lab contract. Every variant folder has `meta.ts` (exports `meta`) and
 * `index.tsx` (default-exports the component).
 * The gallery renders the component full-width below the site nav and feeds it
 * the current tweak values.
 */

export type Author = 'claude' | 'codex' | 'together' | 'baseline'

export type ParamValue = number | string | boolean

export type Param =
  | { key: string; label: string; type: 'range'; min: number; max: number; step: number; default: number }
  | { key: string; label: string; type: 'color'; default: string }
  | { key: string; label: string; type: 'toggle'; default: boolean }
  | { key: string; label: string; type: 'select'; options: string[]; default: string }

export interface VariantMeta {
  id: string
  title: string
  author: Author
  /** One or two sentences: what it is and what the interaction does. */
  concept: string
  params: Param[]
}

export interface HeroCopy {
  /** Lines of the headline; a hard break goes between entries. One entry wraps naturally. */
  headline: string[]
  /** Lines of the subtitle; breaks between entries apply from md up. */
  subhead: string[]
  cta: { label: string; href: string }
}

export interface VariantProps {
  copy: HeroCopy
  values: Record<string, ParamValue>
  /** True when the OS asks for reduced motion or the gallery forces it. */
  reducedMotion: boolean
}

