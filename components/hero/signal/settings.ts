/**
 * The signal hero's approved settings (soft forms, brand fill). The dev-only lab (app/lab/hero, variant
 * `signal`) tunes the same keys; its meta defaults match these.
 */
export type SignalValues = Record<string, number | string | boolean>

export const SIGNAL_SETTINGS: SignalValues = {
  scene: 'loop',
  speed: 1,
  hold: 6,
  once: false,
  intro: true,
  dot: 4,
  dotFill: 0.8,
  round: 1,
  halftone: 0.35,
  formTone: 'soft',
  palette: 'brand',
  grid: 1,
  hud: true,
  exit: true,
  wake: 1,
  size: 1,
}
