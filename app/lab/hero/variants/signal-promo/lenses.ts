/**
 * The choreography's own wakes: scripted strokes that pass over the field the way the pointer does,
 * bending the dot grid and leaving the sage wash. Each pass is a path over a window of loop time; a stroke
 * is sampled at fixed steps behind its head, so its trail stays put from frame to frame and ages like the
 * pointer's. A pure function of loop time, so a frozen frame (?p.t=) shows the same lens.
 */

import { AT, bloomRadius } from './timeline'

export interface Lens {
  x: number
  y: number
  /** 0 just laid, 1 gone. */
  age: number
  s: number
}

interface Box {
  x0: number
  y0: number
  x1: number
  y1: number
}

export interface Geo {
  w: number
  h: number
  cx: number
  cy: number
  reach: number
  /** The words' boxes (cap top to baseline), where they stand now. */
  words: Box[]
}

interface Pass {
  from: number
  to: number
  s: number
  at: (u: number, tau: number) => [number, number]
}

const STEP = 0.08
const SAMPLES = 8
const LIFE = 1.1

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const smooth = (x: number) => x * x * (3 - 2 * x)

function passes(hold: number, g: Geo): Pass[] {
  const out: Pass[] = []
  // The blank page breathes: one slow lens drifts across it before anything is made.
  out.push({
    from: 0.3,
    to: AT.bit - 0.2,
    s: 0.35,
    at: u => [g.w * (-0.05 + 1.1 * u), g.cy + Math.sin(u * Math.PI * 2) * g.h * 0.12],
  })
  // The one mark: a pulse as it lands.
  out.push({ from: AT.bit, to: AT.bit + 0.2, s: 0.8, at: () => [g.cx, g.cy] })
  // The wave: two lenses ride its front, spiralling out opposite each other; in the return, in.
  const end = AT.hold + hold
  for (const [from, to, dir] of [
    [AT.bloom, AT.bloom + 3.4, 1],
    [end + 0.2, end + 2.8, -1],
  ]) {
    for (const turn of [0, Math.PI]) {
      out.push({
        from,
        to,
        s: 0.6,
        at: (u, tau) => {
          const r = bloomRadius(tau, hold, g.reach) * 0.96
          const a = 2.4 + turn + dir * 4.2 * u
          return [g.cx + r * Math.cos(a), g.cy + r * Math.sin(a)]
        },
      })
    }
  }
  const [wi, ws, wd] = g.words
  if (!wi || !ws || !wd) return out
  // The latent title: one slow lens drifts through where it will stand, as if bringing it up.
  out.push({
    from: AT.latent,
    to: AT.form,
    s: 0.5,
    at: u => [wi.x0 - 40 + (Math.max(wi.x1, wd.x1) - wi.x0 + 80) * ease(u), wi.y0 + (wd.y1 - wi.y0) * (0.5 + 0.35 * Math.sin(u * Math.PI * 1.5))],
  })
  // The title gathers: a lens runs down its lines, left to right, as the words land.
  out.push({
    from: AT.form,
    to: AT.form + 2.6,
    s: 0.75,
    at: u => {
      const lines = [wi, ws, wd]
      const k = Math.min(2, Math.floor(u * 3))
      const b = lines[k]
      const v = smooth(u * 3 - k)
      return [b.x0 - 30 + (b.x1 - b.x0 + 60) * v, (b.y0 + b.y1) / 2]
    },
  })
  // Intelligent: a lens loops through the word, a figure of eight, as its currents run.
  out.push({
    from: AT.i + 0.4,
    to: AT.i + 4.8,
    s: 0.7,
    at: u => {
      const a = u * Math.PI * 4
      return [(wi.x0 + wi.x1) / 2 + Math.sin(a) * (wi.x1 - wi.x0) * 0.42, (wi.y0 + wi.y1) / 2 + Math.sin(2 * a) * (wi.y1 - wi.y0) * 0.45]
    },
  })
  // Designer: a pen runs the baseline, then back along the cap line.
  out.push({
    from: AT.d - 0.2,
    to: AT.d + 2.4,
    s: 0.6,
    at: u => {
      const there = u < 0.5
      const v = ease(there ? u * 2 : (u - 0.5) * 2)
      return there ? [wd.x0 + (wd.x1 - wd.x0) * v, wd.y1] : [wd.x1 - (wd.x1 - wd.x0) * v, wd.y0]
    },
  })
  // The words fuse: a pulse at the title's heart, then a sweep through it.
  const cx = (wi.x0 + wi.x1) / 2
  const cy = (wi.y0 + wd.y1) / 2
  out.push({ from: AT.fuse + 0.6, to: AT.fuse + 0.8, s: 1, at: () => [cx, cy] })
  out.push({
    from: AT.fuse + 0.8,
    to: AT.fuse + 2.0,
    s: 0.8,
    at: u => [wi.x0 - 60 + (wi.x1 - wi.x0 + 120) * ease(u), wi.y0 + (wd.y1 - wi.y0) * u],
  })
  return out
}

/** The scripted lens points at loop time t, youngest first, at most n. */
export function lensesAt(t: number, hold: number, g: Geo, n: number): Lens[] {
  const pts: Lens[] = []
  const base = Math.floor(t / STEP) * STEP
  for (const p of passes(hold, g)) {
    if (t < p.from || t > p.to + SAMPLES * STEP) continue
    const span = p.to - p.from
    for (let k = 0; k < SAMPLES; k++) {
      // The head sits at t itself, the trail on fixed steps behind it.
      const tau = k === 0 ? Math.min(t, p.to) : base - k * STEP
      if (tau < p.from || tau > p.to || (k > 0 && tau >= Math.min(t, p.to))) continue
      const age = (t - tau) / LIFE
      if (age >= 1) continue
      const [x, y] = p.at(span > 0 ? (tau - p.from) / span : 1, tau)
      pts.push({ x, y, age, s: p.s })
    }
  }
  return pts.sort((a, b) => a.age - b.age).slice(0, n)
}
