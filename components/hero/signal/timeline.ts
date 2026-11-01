/**
 * Signal hero choreography: one loop as a pure function of time, opening on the title. The one mark goes
 * out across the grid as a wave of DNA glyphs; the glyphs settle heavier where the title will stand, so it
 * is latent in the grid for a moment, and the words resolve out of it. The title holds, then breaks apart
 * and each word plays what it means (intelligent carries signals, systems shifts in modules, designer
 * draws its own construction and colours it in) before they come home and hold. In the return the words
 * dissolve and the marks draw back into the one mark, which the loop opens from again: zero to one is
 * the seam of the loop, not its opening. Times are seconds at speed 1.
 */

export const SCENES = ['resolve', 'intelligent', 'systems', 'designer', 'title', 'return'] as const
export type Scene = (typeof SCENES)[number]

export const AT = {
  /** The one mark goes out across the grid. */
  bloom: 0.2,
  /** The glyphs settle where the title will stand. */
  latent: 0.5,
  /** The words resolve out of the grid. */
  form: 1.3,
  /** The words step apart, then play in turn. */
  apart: 6.0,
  i: 6.3,
  s: 9.1,
  d: 11.9,
  /** The words come home. */
  fuse: 14.7,
  /** The title holds from here, for `hold` s. */
  hold: 16.0,
} as const

/** Each word's play, s. */
const PLAY = 2.8
const RETURN = 3.0

/** Where each scene starts, in order (the return from the end of the hold), and where the loop ends. */
export function sceneStarts(hold: number): number[] {
  const end = AT.hold + hold
  return [0, AT.i, AT.s, AT.d, AT.fuse, end, end + RETURN]
}

export function loopLength(hold: number) {
  return AT.hold + hold + RETURN
}

/** Representative moments, for freezing a scene in the lab and for reduced motion (title). */
export function sceneTime(scene: string, hold: number): number | null {
  switch (scene) {
    case 'resolve':
      return 1.5
    case 'intelligent':
      return AT.i + 1.6
    case 'systems':
      return AT.s + 1.8
    case 'designer':
      return AT.d + 1.6
    case 'title':
      return AT.hold + Math.min(hold, 3)
    default:
      return null
  }
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** 0 before a, 1 after b, linear between. */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const bell = (x: number) => Math.sin(Math.PI * clamp01(x))

/** Radius of the made world, CSS px: the glyphs' wave goes out from the one mark, and in the return draws back. */
export function bloomRadius(t: number, hold: number, reach: number): number {
  const end = AT.hold + hold
  const full = reach * 1.15 + 80
  if (t < end) return full * ease(seg(t, AT.bloom, AT.bloom + 1.6))
  return full * (1 - ease(seg(t, end + 0.6, end + 2.4)))
}

export interface Frame {
  scene: Scene
  /** Index of the scene in SCENES. */
  index: number
  /** Radius of the made world: inside it the marks stand. */
  bloomR: number
  /** The title latent in the grid: the glyphs heavier where it will stand, 0 to 1. */
  latent: number
  /** The one mark, 0 to 1. */
  bit: number
  /** How far each word has resolved out of the grid, 0 (latent) to 1 (set). */
  form: [number, number, number]
  /** How far the words stand apart, 0 to 1 (to the layout's apart offsets). */
  apart: [number, number, number]
  /** Intelligent: its signals. */
  sparks: number
  /** Systems: amount, and the shift register's step, 0 to 4 (0 and 4 are home). */
  sys: number
  step: number
  /** Designer: outline and colour fill, and its type guides. */
  outline: number
  fill: number
  guidesD: number
  /** The sweep as the words come home, 0 to 1. */
  fuse: number
  /** Each word's step back while another plays: 0 ink, 1 grey. */
  dim: [number, number, number]
}

/**
 * The frame at loop time t (s). `reach` is the distance from the centre to the farthest corner, CSS px.
 */
export function frameAt(t: number, hold: number, reach: number): Frame {
  const end = AT.hold + hold
  const f: Frame = {
    scene: 'resolve',
    index: 0,
    bloomR: bloomRadius(t, hold, reach),
    latent: 0,
    bit: 0,
    form: [0, 0, 0],
    apart: [0, 0, 0],
    sparks: 0,
    sys: 0,
    step: 0,
    outline: 0,
    fill: 0,
    guidesD: 0,
    fuse: 0,
    dim: [0, 0, 0],
  }

  // The one mark opens the loop and goes as its wave goes out; in the return it comes back.
  f.bit = t < end ? 1 - seg(t, AT.bloom + 0.2, AT.bloom + 0.8) : seg(t, end + 2.0, end + 2.6)
  f.latent = ease(seg(t, AT.latent, AT.latent + 1.0)) * (1 - ease(seg(t, AT.form + 0.4, AT.form + 1.8)))

  // The words resolve one after the other, and stay set until the return dissolves them.
  const out = ease(seg(t, end + 0.1, end + 1.6))
  for (let i = 0; i < 3; i++) {
    f.form[i] = ease(seg(t, AT.form + i * 0.3, AT.form + 1.2 + i * 0.3)) * (1 - out)
    f.apart[i] = ease(seg(t, AT.apart + i * 0.15, AT.apart + 0.8 + i * 0.15)) * (1 - ease(seg(t, AT.fuse + (2 - i) * 0.12, AT.fuse + 0.7 + (2 - i) * 0.12)))
  }

  // Intelligent: signals run along the letters.
  f.sparks = seg(t, AT.i, AT.i + 0.6) * (1 - seg(t, AT.i + PLAY - 0.5, AT.i + PLAY + 0.2))
  // Systems: the word is cut into grid modules that shift like a register, four steps and home.
  f.sys = ease(seg(t, AT.s - 0.3, AT.s + 0.3)) * (1 - ease(seg(t, AT.s + PLAY - 0.4, AT.s + PLAY + 0.2)))
  const x = 4 * seg(t, AT.s + 0.2, AT.s + PLAY - 0.4)
  f.step = Math.min(4, Math.floor(x) + ease(clamp01((x - Math.floor(x) - 0.35) / 0.65)))
  // Designer: down to its outline on the construction, coloured in, then back to ink.
  f.outline = ease(seg(t, AT.d - 0.4, AT.d + 0.3)) * (1 - ease(seg(t, AT.d + PLAY - 0.5, AT.d + PLAY + 0.1)))
  f.fill = ease(seg(t, AT.d + 0.6, AT.d + 1.4)) * (1 - ease(seg(t, AT.d + PLAY - 0.6, AT.d + PLAY + 0.1)))
  f.guidesD = seg(t, AT.d - 0.2, AT.d + 0.2) * (1 - seg(t, AT.d + PLAY - 0.5, AT.d + PLAY - 0.1))
  // Home: a sage sweep runs through the title once.
  f.fuse = bell(seg(t, AT.fuse + 0.5, AT.fuse + 1.7))

  // Depth: while one word plays, the other two step back to grey.
  const plays = [AT.i, AT.s, AT.d, AT.fuse]
  const on = [0, 1, 2].map(j => ease(seg(t, plays[j] - 0.3, plays[j] + 0.3)) * (1 - ease(seg(t, plays[j + 1] - 0.3, plays[j + 1] + 0.3))))
  for (let i = 0; i < 3; i++) f.dim[i] = Math.min(1, on.reduce((s, w, j) => s + (j === i ? 0 : w), 0))

  const starts = sceneStarts(hold)
  for (let k = 0; k < SCENES.length; k++) if (t >= starts[k]) f.index = k
  f.scene = SCENES[f.index]
  return f
}
