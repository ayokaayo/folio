import type { Param } from '../../types'
import { PALETTES } from '@/components/hero/palettes'
import { HERO_SETTINGS } from '@/components/hero/settings'

/** Lab controls for the home hero. Defaults come from HERO_SETTINGS (the approved tuning). */
const WAKE: Param[] = [
    { key: 'latent', label: 'Background form', type: 'select', options: ['saddle', 'lens', 'mark'], default: 'saddle' },
    { key: 'latentAmp', label: 'Background form (cycles)', type: 'range', min: 0, max: 3, step: 0.05, default: 1.1 },
    { key: 'fieldAmp', label: 'Wake strength (cycles)', type: 'range', min: 0, max: 4, step: 0.05, default: 1.1 },
    { key: 'impulse', label: 'Disturbance', type: 'range', min: 0, max: 2, step: 0.05, default: 0.25 },
    { key: 'waveSpeed', label: 'Wave speed', type: 'range', min: 0.05, max: 0.5, step: 0.01, default: 0.35 },
    { key: 'damping', label: 'Settling', type: 'range', min: 0.9, max: 0.999, step: 0.001, default: 0.97 },
    { key: 'energyHue', label: 'Colour of disturbance', type: 'range', min: 0, max: 2, step: 0.05, default: 0 },
    { key: 'restAngle', label: 'Screen turn (deg)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.52 },
]

const MOTION: Param[] = [
  { key: 'flow', label: 'Flow at rest (cycles/s)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.14 },
  { key: 'flowBoost', label: 'Flow boost from hand (×)', type: 'range', min: 0, max: 12, step: 0.25, default: 5 },
  { key: 'breath', label: 'Breathing turn (deg)', type: 'range', min: 0, max: 0.4, step: 0.005, default: 0.06 },
  { key: 'breathPeriod', label: 'Breathing period (s)', type: 'range', min: 4, max: 40, step: 1, default: 16 },
  { key: 'wander', label: 'Form wander (of width)', type: 'range', min: 0, max: 0.25, step: 0.005, default: 0.06 },
  { key: 'attack', label: 'Energy rise ω', type: 'range', min: 1, max: 30, step: 0.5, default: 10 },
  { key: 'release', label: 'Energy fall-off (s)', type: 'range', min: 0.2, max: 6, step: 0.1, default: 1.6 },
  { key: 'speedFull', label: 'Hand speed for full energy (px/s)', type: 'range', min: 200, max: 4000, step: 50, default: 1400 },
]

const COMMON: Param[] = [
  { key: 'palette', label: 'Palette', type: 'select', options: Object.keys(PALETTES), default: 'accent' },
  { key: 'hue', label: 'Contour colour', type: 'range', min: 0, max: 2, step: 0.05, default: 0 },
  { key: 'pitch', label: 'Line pitch (px)', type: 'range', min: 2, max: 8, step: 0.25, default: 3.5 },
  { key: 'coverage', label: 'Line weight', type: 'range', min: 0.08, max: 0.6, step: 0.01, default: 0.18 },
  { key: 'inkAlpha', label: 'Ink strength', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.33 },
  { key: 'angle', label: 'Screen angle (deg)', type: 'range', min: 0, max: 90, step: 1, default: 44 },
  { key: 'subInk', label: 'Subtitle ink', type: 'select', options: ['site', 'dark', 'key', 'deep', 'accent-dark', 'accent'], default: 'accent' },
  { key: 'halo', label: 'Paper halo around copy (px)', type: 'range', min: 0, max: 16, step: 0.5, default: 0 },
  { key: 'copyFade', label: 'Copy-side ink fade', type: 'range', min: 0, max: 1, step: 0.01, default: 0.32 },
  { key: 'highlight', label: 'Headline highlight', type: 'select', options: ['off', 'tint', 'marker', 'underlay', 'label'], default: 'marker' },
  { key: 'hiSub', label: 'Subtitle highlight', type: 'select', options: ['off', 'tint', 'marker', 'underlay', 'label'], default: 'tint' },
  { key: 'subWeight', label: 'Subtitle medium weight', type: 'toggle', default: false },
  { key: 'hiColor', label: 'Highlight colour', type: 'select', options: ['accent', 'purple', 'lavender', 'grey', 'palette'], default: 'accent' },
  { key: 'hiStrength', label: 'Highlight wash', type: 'range', min: 0, max: 0.6, step: 0.01, default: 0 },
  { key: 'hiInk', label: 'Ruling through highlight', type: 'range', min: 0, max: 1, step: 0.01, default: 0 },
  { key: 'hiPad', label: 'Highlight overhang (px)', type: 'range', min: 0, max: 40, step: 1, default: 7 },
  { key: 'hiRadius', label: 'Label corner radius (px)', type: 'range', min: 0, max: 16, step: 0.5, default: 0 },
  { key: 'hiGap', label: 'Gap between label lines (px)', type: 'range', min: 0, max: 16, step: 0.5, default: 7.5 },
  { key: 'headInk', label: 'Headline ink', type: 'select', options: ['key', 'deep', 'accent-dark', 'accent'], default: 'accent-dark' },
  { key: 'paper', label: 'Paper', type: 'color', default: '#F7F5F0' },
]


export const HERO_PARAMS: Param[] = [...WAKE, ...MOTION, ...COMMON].map(p =>
  p.key in HERO_SETTINGS ? ({ ...p, default: HERO_SETTINGS[p.key] } as Param) : p,
)
