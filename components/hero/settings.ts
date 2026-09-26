/**
 * Approved tuning for the home hero (moiré wake), from the hero lab, 2026-09-25.
 * The lab (app/lab/hero, dev only) reads these as its defaults, so tuning there and
 * pasting the result here is the whole workflow.
 */
export type HeroValue = number | string | boolean
export type HeroValues = Record<string, HeroValue>

export const HERO_SETTINGS: HeroValues = {
  // Motion
  flow: 0.41,
  flowBoost: 0.75,
  breath: 0,
  breathPeriod: 40,
  wander: 0,
  attack: 21,
  release: 1.6,
  speedFull: 1400,
  // Wake surface
  latent: 'saddle',
  latentAmp: 1.1,
  fieldAmp: 1.1,
  impulse: 0.25,
  waveSpeed: 0.35,
  damping: 0.97,
  energyHue: 0,
  restAngle: 0.52,
  // Screens and colour
  palette: 'accent',
  hue: 0,
  pitch: 3.5,
  coverage: 0.18,
  inkAlpha: 0.33,
  angle: 44,
  copyFade: 0.32,
  paper: '#F7F5F0',
  // Copy and highlights
  headInk: 'accent',
  subInk: 'accent',
  subWeight: false,
  halo: 0,
  highlight: 'marker',
  hiSub: 'tint',
  hiColor: 'accent',
  hiStrength: 0,
  hiInk: 0,
  hiPad: 7,
  hiRadius: 0,
  hiGap: 7.5,
  // Glyph layer (docs/superpowers/specs/2026-09-26-hero-ascii-layer-design.md)
  glyphs: true,
  glyphRest: 0.8,
  glyphWake: 1.0,
  glyphMutate: 0.5,
  glyphInkMax: 0.7,
  glyphDeepen: 0.8,
  glyphSpeed: 1,
  glyphScale: 9,
  bandGain: 1,
  glyphScrollPhase: 0.02,
}
