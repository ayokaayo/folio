import type { VariantMeta } from '../../types'

export const meta: VariantMeta = {
  id: 'current',
  title: 'Current hero',
  author: 'baseline',
  concept: 'What is live today: exposed 12-column grid, hovered columns glow gold with a trailing wake.',
  params: [{ key: 'opacity', label: 'Grid opacity', type: 'range', min: 0, max: 1, step: 0.05, default: 0.5 }],
}
