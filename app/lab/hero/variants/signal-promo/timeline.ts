/**
 * Signal hero choreography: one loop as a pure function of time, told as a genesis from zero to one and
 * beyond. A blank page; one mark; the mark multiplies across the lattice as the DNA glyphs (dots to
 * diamonds), a wave of them with the palette's light behind; the glyphs quietly settle heavier where the
 * title will stand, so it is latent in the grid for a moment, and the words resolve out of it. Then the title breaks apart
 * and each word plays what it means (intelligent thinks in currents, systems shifts in modules, designer
 * draws its own construction and colours it in) before they fuse back into the one title, hold, and the
 * marks draw back into the one mark, which goes, and the page is blank again. Times are seconds at speed 1.
 */

export const SCENES = ['zero', 'one', 'beyond', 'latent', 'word', 'intelligent', 'systems', 'designer', 'title', 'return'] as const
export type Scene = (typeof SCENES)[number]

export const AT = {
  /** First caption types. */
  word1: 0.6,
  /** The one mark. */
  bit: 3.0,
  /** Second caption. */
  word2: 4.0,
  /** The mark multiplies across the lattice. */
  bloom: 6.4,
  /** Third caption. */
  word3: 6.9,
  /** The marks settle where the title will stand. */
  latent: 9.6,
  /** The words resolve out of the grid. */
  form: 11.4,
  /** The words step apart, then play in turn. */
  apart: 14.6,
  i: 15.0,
  s: 19.2,
  d: 22.6,
  /** The words come home and fuse. */
  fuse: 26.0,
  /** The title holds from here, for `hold` s. */
  hold: 28.2,
} as const

const RETURN = 3.6

/** Where each scene starts, in order (the return from the end of the hold), and where the loop ends. */
export function sceneStarts(hold: number): number[] {
  const end = AT.hold + hold
  return [0, AT.bit, AT.bloom, AT.latent - 0.4, AT.form, AT.i, AT.s + 0.2, AT.d - 0.4, AT.fuse, end, end + RETURN]
}

export function loopLength(hold: number) {
  return AT.hold + hold + RETURN
}

/** Representative moments, for freezing a scene in the lab and for reduced motion (one). */
export function sceneTime(scene: string, hold: number): number | null {
  switch (scene) {
    case 'zero':
      return 2.4
    case 'one':
      return 5.4
    case 'beyond':
      return 7.8
    case 'latent':
      return 10.8
    case 'word':
      return 12.6
    case 'intelligent':
      return 17.4
    case 'systems':
      return 21.0
    case 'designer':
      return 24.2
    case 'title':
      return AT.hold + Math.min(hold, 4)
    default:
      return null
  }
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** 0 before a, 1 after b, linear between. */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const backOut = (x: number) => (x <= 0 ? 0 : 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2))
const bell = (x: number) => Math.sin(Math.PI * clamp01(x))

/** Radius of the made world, CSS px: the marks' wave goes out from the one mark, and in the return draws back. */
export function bloomRadius(t: number, hold: number, reach: number): number {
  const end = AT.hold + hold
  const full = reach * 1.15 + 80
  if (t < AT.bloom) return 0
  if (t < end) return full * ease(seg(t, AT.bloom, AT.bloom + 3.6))
  return full * (1 - ease(seg(t, end + 0.2, end + 3.0)))
}

export interface Frame {
  scene: Scene
  /** Index of the scene in SCENES, for the HUD label. */
  index: number
  /** Radius of the made world: inside it the marks stand and the light is in the field. */
  bloomR: number
  /** The title latent in the grid: the glyphs heavier where it will stand, 0 to 1. */
  latent: number
  /** The one mark, 0 to 1. */
  bit: number
  /** Caption on show (-1 none), its share typed, and its opacity. */
  caption: number
  typed: number
  captionAlpha: number
  colour: number
  /** How far each word has resolved out of the grid, 0 (latent) to 1 (set). */
  form: [number, number, number]
  /** How far the words stand apart, 0 to 1 (to the layout's apart offsets). */
  apart: [number, number, number]
  /** Intelligent: flow amount and sparks. */
  flow: number
  sparks: number
  /** Systems: amount, and the shift register's step, 0 to 4 (0 and 4 are home). */
  sys: number
  step: number
  /** Designer: outline and colour fill. */
  outline: number
  fill: number
  /** The flash as the words fuse, 0 to 1. */
  fuse: number
  /** Type guides on the whole title, and on the designer line alone. */
  guides: number
  guidesD: number
  /** The word the scene is about, 0 to 2, or -1. */
  focus: number
  luminance: number
  coherence: number
  /** The DNA mark at the right, playing one cycle as the words fuse: the cycle's phase, 0 to 1 (0 off). */
  blob: number
  /** Its scale: it lands with an overshoot, and goes at the end of its cycle. */
  blobScale: number
  /** Each word's step back while another plays: 0 ink, 1 grey. */
  dim: [number, number, number]
}

/**
 * The frame at loop time t (s). `reach` is the distance from the centre to the farthest corner, CSS px.
 */
export function frameAt(t: number, hold: number, reach: number): Frame {
  const end = AT.hold + hold
  const f: Frame = {
    scene: 'zero',
    index: 0,
    bloomR: bloomRadius(t, hold, reach),
    latent: 0,
    bit: 0,
    caption: -1,
    typed: 0,
    captionAlpha: 0,
    colour: 0,
    form: [0, 0, 0],
    apart: [0, 0, 0],
    flow: 0,
    sparks: 0,
    sys: 0,
    step: 0,
    outline: 0,
    fill: 0,
    fuse: 0,
    guides: 0,
    guidesD: 0,
    focus: -1,
    luminance: 0,
    coherence: 0,
    blob: 0,
    blobScale: 0,
    dim: [0, 0, 0],
  }

  // Captions: each types on, holds, and goes.
  const caps: [number, number, number, number][] = [
    [AT.word1, AT.word1 + 1.5, 3.4, 3.8],
    [AT.word2, AT.word2 + 0.9, 6.0, 6.4],
    [AT.word3, AT.word3 + 1.4, AT.latent, AT.latent + 0.5],
  ]
  caps.forEach(([a, b, c, d], i) => {
    if (t >= a && t < d) {
      f.caption = i
      f.typed = seg(t, a, b)
      f.captionAlpha = 1 - seg(t, c, d)
    }
  })

  if (t < AT.bloom) {
    f.scene = t < AT.bit ? 'zero' : 'one'
    f.index = t < AT.bit ? 0 : 1
    f.bit = ease(seg(t, AT.bit, AT.bit + 0.8))
    f.luminance = f.bit > 0.5 ? 1 : 0
    return f
  }

  // From the bloom on, the light comes into the field with the marks and settles low under the type.
  f.colour = 0.35 + 0.5 * (1 - seg(t, AT.bloom + 3.0, AT.form + 1.2))
  f.luminance = Math.min(1, Math.pow(f.bloomR / reach, 2))
  f.bit = 1 - seg(t, AT.bloom + 0.6, AT.bloom + 1.6)
  f.latent = ease(seg(t, AT.latent - 0.4, AT.latent + 1.4)) * (1 - ease(seg(t, AT.form + 0.6, AT.form + 2.4)))
  // The DNA mark: one full cycle as the words fuse, part of the action rather than after it (one drop, a
  // bud swelling out, parting, running back in), then gone.
  const b0 = AT.fuse + 0.4
  const span = Math.min(6.5, Math.max(3, end - 0.3 - b0))
  const u = seg(t, b0, b0 + span)
  if (u > 0 && u < 1) {
    f.blob = u
    f.blobScale = backOut(seg(u, 0, 0.14)) * (1 - ease(seg(u, 0.86, 1)))
  }

  // The words gather, one after the other, and stay set until the return scatters them.
  const out = ease(seg(t, end + 0.3, end + 2.4))
  for (let i = 0; i < 3; i++) {
    f.form[i] = ease(seg(t, AT.form + i * 0.45, AT.form + 1.7 + i * 0.45)) * (1 - out)
    f.apart[i] = ease(seg(t, AT.apart + i * 0.2, AT.apart + 0.9 + i * 0.2)) * (1 - ease(seg(t, AT.fuse + (2 - i) * 0.15, AT.fuse + 0.8 + (2 - i) * 0.15)))
  }
  f.guides = seg(t, AT.form + 2.2, AT.form + 2.6) * (1 - seg(t, AT.apart - 0.2, AT.apart + 0.2))

  // Intelligent: the letters run into currents and spark, then gather again.
  f.flow = ease(seg(t, AT.i, AT.i + 1.4)) * (1 - ease(seg(t, AT.i + 4.4, AT.i + 5.8)))
  f.sparks = seg(t, AT.i + 0.4, AT.i + 1.2) * (1 - seg(t, AT.i + 4.6, AT.i + 5.4))
  // Systems: the word is cut into grid modules that shift like a register, four steps and home.
  f.sys = ease(seg(t, AT.s - 0.4, AT.s + 0.4)) * (1 - ease(seg(t, AT.s + 4.4, AT.s + 5.0)))
  const x = 4 * seg(t, AT.s + 0.2, AT.s + 4.4)
  f.step = Math.min(4, Math.floor(x) + ease(clamp01((x - Math.floor(x) - 0.35) / 0.65)))
  // Designer: down to its outline on the construction, coloured in, then back to ink.
  f.outline = ease(seg(t, AT.d - 0.6, AT.d + 0.4)) * (1 - ease(seg(t, AT.d + 2.6, AT.d + 3.3)))
  f.fill = ease(seg(t, AT.d + 0.9, AT.d + 2.0)) * (1 - ease(seg(t, AT.d + 2.5, AT.d + 3.3)))
  f.guidesD = seg(t, AT.d - 0.2, AT.d + 0.2) * (1 - seg(t, AT.d + 2.4, AT.d + 2.8))
  // Fusion: the words lock and the light runs through the whole title once.
  f.fuse = bell(seg(t, AT.fuse + 0.6, AT.fuse + 2.2))
  f.coherence = 1 / 3 + (2 / 3) * ease(seg(t, AT.fuse, AT.fuse + 1.4))

  const scenes: [number, Scene][] = [
    [AT.bloom, 'beyond'],
    [AT.latent - 0.4, 'latent'],
    [AT.form, 'word'],
    [AT.i, 'intelligent'],
    [AT.s + 0.2, 'systems'],
    [AT.d - 0.4, 'designer'],
    [AT.fuse, 'title'],
    [end, 'return'],
  ]
  for (const [at, s] of scenes) if (t >= at) f.scene = s
  f.index = SCENES.indexOf(f.scene)
  f.focus = f.scene === 'intelligent' ? 0 : f.scene === 'systems' ? 1 : f.scene === 'designer' ? 2 : -1
  // Depth: while one word plays, the other two step back to grey.
  const plays: [number, number][] = [
    [AT.i, AT.s + 0.2],
    [AT.s + 0.2, AT.d - 0.4],
    [AT.d - 0.4, AT.fuse],
  ]
  const on = plays.map(([a, b]) => ease(seg(t, a - 0.3, a + 0.3)) * (1 - ease(seg(t, b - 0.3, b + 0.3))))
  for (let i = 0; i < 3; i++) f.dim[i] = Math.min(1, on.reduce((s, w, j) => s + (j === i ? 0 : w), 0))

  if (f.scene === 'return') {
    // The marks draw back into the one mark, which goes; the page is blank again.
    f.colour = 0.35 * (1 - seg(t, end + 1.6, end + 3.0))
    f.bit = seg(t, end + 2.4, end + 2.8) * (1 - seg(t, end + 3.1, end + 3.5))
  }
  return f
}
