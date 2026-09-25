import type { ComponentType } from 'react'
import type { VariantMeta, VariantProps } from './types'
import { meta as current } from './variants/current/meta'
import { meta as wake } from './variants/moire-wake/meta'

/**
 * Gallery order. Metas load eagerly (tiny); components load lazily so a heavy
 * WebGL variant costs nothing until selected. Add new variants here.
 */
export interface RegistryEntry {
  meta: VariantMeta
  load: () => Promise<{ default: ComponentType<VariantProps> }>
}

export const REGISTRY: RegistryEntry[] = [
  { meta: current, load: () => import('./variants/current') },
  { meta: wake, load: () => import('./variants/moire-wake') },
]
