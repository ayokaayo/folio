'use client'

/**
 * Home hero: the title as a short looping sequence in ordered dither (WebGL2), drawn behind real,
 * server-rendered copy (the h1 and the foot). Without WebGL the title is set as type.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IBM_Plex_Mono } from 'next/font/google'
import { HERO_COPY } from '../copy'
import { cappedDpr, useActive, useLatest, usePrefersReducedMotion } from '../field/hooks'
import { SIGNAL_SETTINGS, type SignalValues } from './settings'
import { TRAIL, fragment, vertex } from './shader'
import { layout, rasterise, type Layout } from './stage'
import { AT, frameAt, loopLength, sceneStarts, sceneTime, type Frame } from './timeline'

// The title is set in the site mono at 700, a weight the site itself doesn't load.
const display = IBM_Plex_Mono({
  weight: ['700'],
  subsets: ['latin'],
  display: 'block',
})

const PAPER = '#F7F5F0'
const INK = '#2A2A2C'
// Designer's fill: eight inks; the word takes one at a time, turning from ink to ink.
const PALETTES: Record<string, string[]> = {
  // A pastel spectrum anchored on the sage: sand, butter, peach, blush, lilac, mist, mint, sage.
  brand: ['#E8DFD0', '#F1E2B3', '#F2C4A8', '#EBC3C8', '#D8D1E8', '#C2DCE0', '#C9E7DA', '#8FC7AE'],
  // The reference reel's pastels.
  iridescent: ['#F7B2D9', '#E3B8F2', '#C9B6FF', '#B8C6FF', '#A8E6CF', '#D8F0B0', '#FFE7A3', '#FFC3A0'],
  mono: ['#E8DFD0', '#D6D2C9', '#C9C6BE', '#A3A3A3', '#6B6B6B', '#A3A3A3', '#C9C6BE', '#D6D2C9'],
}
// The accent family: the heaviest glyphs, the latent title, the signals and the pointer's wake.
const SAGE = '#54AB8B'
const SAGE_LIGHT = '#C9E7DA'
const SAGE_DEEP = '#24664E'
/** Warm greys: the words stepped back, and the lighter glyphs and resting marks. */
const GREY = '#A19E97'
const GREY_LIGHT = '#C2BFB7'
/** The evolving forms' light: soft pastels run as one psychedelic loop, pink, lilac, sky, mint, lemon, peach. */
const IRI = ['#F6CFE3', '#DDD3FA', '#CFE2FA', '#CDEFE0', '#F2EEBF', '#F8D6C4']
/** The same loop a step stronger, for the vivid tone. */
const IRI_VIVID = ['#EFA3CB', '#BDA9F2', '#9FC6F2', '#9EDDC3', '#E9E08F', '#F2B49A']
/** Systems' colour at a register step (0 to 4): from the sage, once round the hue wheel and home. */
function sysColour(step: number): string {
  const h = (157 + 90 * step) % 360
  const s = 0.42
  const l = 0.56
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const c = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))))
  return '#' + [c(0), c(8), c(4)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}

/** Seconds a point of the pointer's trail lives. */
const WAKE_LIFE = 1.6
/** The nav's height, CSS px: the hero runs up behind it, and leaves as it slides under it. */
const NAV = 80
/** Plex Mono's cap height, em. */
const CAP_EM = 0.698

/** The grid node nearest the section's centre, where the one mark sits and the glyphs go out from. */
function centreOf(l: Layout) {
  const g = l.grid
  return {
    x: l.x0 + Math.round((l.w / 2 - l.x0) / g) * g,
    y: Math.round(l.h / 2 / g) * g,
  }
}

/** The order designer's fill turns through: blush, peach, butter, mint, sage, mist, lilac. */
const FILL_ORDER = [3, 2, 1, 6, 7, 5, 4]

/** Designer's fill at x (one step an ink): holds each ink, then morphs to the next. */
function fillColour(inks: string[], x: number): string {
  const k = Math.floor(Math.max(0, x))
  const e = easeIO(Math.min(1, Math.max(0, (x - k - 0.45) / 0.55)))
  const a = rgb(inks[FILL_ORDER[k % 7]])
  const b = rgb(inks[FILL_ORDER[(k + 1) % 7]])
  return '#' + a.map((v, i) => Math.round(255 * (v + (b[i] - v) * e)).toString(16).padStart(2, '0')).join('').toUpperCase()
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const pad = (n: number, w: number) => String(Math.floor(n)).padStart(w, '0')
const grouped = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const easeIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
/** 0 before a, 1 after b, smooth between. */
const band = (x: number, a: number, b: number) => easeIO(Math.min(1, Math.max(0, (x - a) / (b - a))))

/** Counts taken from the title's mask: intelligent's dots at the dot pitch, and systems' grid modules. */
interface Counts {
  dots: number
  modules: number
}

/** Counts what the shader will draw, from mask A (device px): a dot wherever its centre is inside a letter. */
function count(l: Layout, mask: HTMLCanvasElement, dpr: number, dot: number): Counts {
  const ctx = mask.getContext('2d')!
  // Reads back only the band the first two lines stand in: a readback stalls the main thread.
  const y0 = Math.max(0, Math.floor(l.lines[0].capTop * dpr) - 2)
  const y1 = Math.min(mask.height, Math.ceil(l.lines[1].baseline * dpr) + 2)
  const W = mask.width
  const px = ctx.getImageData(0, y0, W, Math.max(1, y1 - y0)).data
  const at = (x: number, y: number, ch: number) => px[((Math.round(y * dpr) - y0) * W + Math.round(x * dpr)) * 4 + ch] > 127
  let dots = 0
  const li = l.lines[0]
  for (let y = Math.ceil(li.capTop / dot) * dot; y <= li.baseline; y += dot) {
    for (let x = li.ink0; x <= li.ink0 + li.width; x += dot) if (at(x, y, 0)) dots++
  }
  const mods = new Set<string>()
  const ls = l.lines[1]
  for (let y = Math.ceil(ls.capTop / dot) * dot; y <= ls.baseline; y += dot) {
    for (let x = ls.ink0; x <= ls.ink0 + ls.width; x += dot) {
      if (at(x, y, 1)) mods.add(`${Math.floor((x - l.x0) / l.grid)},${Math.floor(y / l.grid)}`)
    }
  }
  return { dots, modules: mods.size }
}

/**
 * The readout: one true figure per scene, as a target the display eases toward. The title's glyphs as
 * they resolve (and, in the return, as they go); the dots intelligent is drawn in; systems' colour, its
 * hex turning with the hue as the register steps; designer's fill, its hex turning with the word's colour.
 * A new key restarts the count and plays the value in.
 */
interface Read {
  key: string
  label: string
  n: number
  fmt: (n: number) => string
  swatch?: boolean
}
function readout(f: Frame, l: Layout, c: Counts, fill: { x: number; at: (x: number) => string }): Read {
  const glyphs = l.lines.reduce((n, line) => n + line.text.length, 0)
  switch (f.scene) {
    case 'intelligent':
      return {
        key: 'dots',
        label: 'INTELLIGENT / DOTS',
        n: c.dots,
        fmt: grouped,
      }
    case 'systems':
      return {
        key: 'colour',
        label: `SYSTEMS / ${c.modules} MODULES, ONE COLOUR`,
        n: f.step,
        fmt: sysColour,
        swatch: true,
      }
    case 'designer':
      return {
        key: 'fill',
        label: `DESIGNER / ONE FILL, ${FILL_ORDER.length} INKS`,
        n: fill.x,
        fmt: fill.at,
        swatch: true,
      }
    default: {
      const n = l.lines.reduce((s, line, i) => s + f.form[i] * line.text.length, 0)
      const label = n < glyphs - 0.5 ? `GLYPHS / OF ${glyphs}` : 'GLYPHS / THREE WORDS, ONE GRID'
      return { key: 'glyphs', label, n, fmt: x => pad(Math.round(x), 2) }
    }
  }
}

/** The readout plays a value and label in with this when it changes key. */
const ENTER: Keyframe[] = [
  { opacity: 0, transform: 'translateY(10px)', filter: 'blur(6px)' },
  { opacity: 1, transform: 'none', filter: 'none' },
]
const ENTER_TIMING: KeyframeAnimationOptions = {
  duration: 700,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

interface SignalHeroProps {
  /** Tuning; defaults to the approved settings. The dev-only lab passes its own. */
  values?: SignalValues
  /** Forces reduced motion (lab); otherwise follows the OS setting. */
  reducedMotion?: boolean
  /** The lab's main is padded for the nav; there the hero pulls up behind it, as it sits on the live page. */
  lab?: boolean
}

export default function SignalHero({ values = SIGNAL_SETTINGS, reducedMotion: forced, lab = false }: SignalHeroProps) {
  const osReduced = usePrefersReducedMotion()
  const reducedMotion = forced ?? osReduced
  const copy = HERO_COPY
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const probeRef = useRef<HTMLDivElement>(null)
  const footRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const guidesRef = useRef<HTMLDivElement>(null)
  const readRef = useRef<HTMLDivElement>(null)
  const readValueRef = useRef<HTMLDivElement>(null)
  const readLabelRef = useRef<HTMLDivElement>(null)
  const footBox = useRef({ x0: 0, y0: 0, x1: 0, y1: 0 })
  const [lay, setLay] = useState<Layout | null>(null)
  const [glFailed, setGlFailed] = useState(false)
  const active = useActive(sectionRef)

  const v = useLatest(values)
  const rm = useLatest(reducedMotion)
  const activeRef = useLatest(active)
  const layRef = useLatest(lay)
  const showBarRef = useLatest(Boolean(values.hud))
  // Pause: motion that loops for more than five seconds has to be stoppable (WCAG 2.2.2).
  const [paused, setPaused] = useState(false)
  const pausedRef = useLatest(paused)
  const pauseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: process.env.NODE_ENV !== 'production',
    })
    if (!gl) {
      setGlFailed(true)
      return
    }
    // A lost context (a phone's GPU reset, or too many contexts) leaves a blank canvas: set the title as type.
    const onLost = () => setGlFailed(true)
    canvas.addEventListener('webglcontextlost', onLost)
    const shaders = [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ].map(([type, src]) => {
      const sh = gl.createShader(type as number)!
      gl.shaderSource(sh, src as string)
      gl.compileShader(sh)
      return sh
    })
    const prog = gl.createProgram()!
    shaders.forEach(sh => gl.attachShader(prog, sh))
    gl.linkProgram(prog)
    // The shader is large: where the browser can, it compiles off the main thread, and the loop waits for it
    // rather than blocking on the status.
    const parallel = gl.getExtension('KHR_parallel_shader_compile')
    let linked = false
    const buf = gl.createBuffer()
    // True once the program is linked and set up; false while it compiles, or for good when it failed.
    const ready = () => {
      if (linked) return true
      if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) return false
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        if (!gl.isContextLost()) {
          console.error('[signal]', shaders.map(sh => gl.getShaderInfoLog(sh)).join('\n') || gl.getProgramInfoLog(prog))
          setGlFailed(true)
        }
        return false
      }
      linked = true
      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const aPos = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
      gl.uniform1i(U('uMaskA'), 0)
      gl.uniform1i(U('uMaskB'), 1)
      return true
    }

    const locs: Record<string, WebGLUniformLocation | null> = {}
    const U = (name: string) => (name in locs ? locs[name] : (locs[name] = gl.getUniformLocation(prog, name)))
    const f1 = (name: string, x: number) => gl.uniform1f(U(name), x)

    const masks = [document.createElement('canvas'), document.createElement('canvas')]
    const tex = masks.map((_, i) => {
      const t = gl.createTexture()!
      gl.activeTexture(gl.TEXTURE0 + i)
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]))
      return t
    })

    const family = display.style.fontFamily
    let size = { w: 1, h: 1, dpr: 1 }
    let centre = { x: 0, y: 0 }
    let counts: Counts = { dots: 0, modules: 0 }
    let alive = true
    let dirty = true

    // Measures after the fonts load, as the foot's copy can rewrap and move the space the title gets. Only the
    // real face is loaded: next/font's fallback face points at a local font (Courier New) that Android lacks,
    // and asking for the whole stack rejects there. A failed load still lays out, in whatever face there is.
    const face = family.split(',')[0].trim()
    const resize = async () => {
      try {
        await document.fonts.ready
        await document.fonts.load(`700 100px ${face}`)
      } catch {}
      if (!alive) return
      const r = section.getBoundingClientRect()
      const probe = probeRef.current!.getBoundingClientRect()
      const foot = footRef.current!.getBoundingClientRect()
      const w = Math.round(r.width)
      const h = Math.round(r.height)
      // Phones get a lighter fill: the dither is drawn in CSS px, so it holds at 1.5.
      const dpr = cappedDpr(w < 768 ? 1.5 : 2)
      size = { w, h, dpr }
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const x0 = Math.round(probe.left - r.left)
      const x1 = Math.round(probe.right - r.left)
      footBox.current = {
        x0: foot.left - r.left,
        y0: foot.top - r.top,
        x1: foot.right - r.left,
        y1: foot.bottom - r.top,
      }
      const l = layout(w, h, x0, x1, foot.top - r.top - 32, family, Number(v.current.size ?? 1))
      centre = centreOf(l)
      rasterise(l, family, dpr, masks[0], masks[1])
      counts = count(l, masks[0], dpr, Number(v.current.dot))
      masks.forEach((m, i) => {
        gl.activeTexture(gl.TEXTURE0 + i)
        gl.bindTexture(gl.TEXTURE_2D, tex[i])
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, m)
      })
      setLay(l)
      dirty = true
    }
    const ro = new ResizeObserver(() => void resize())
    ro.observe(section)
    ro.observe(footRef.current!)
    let lastSize = v.current.size
    let lastDot = v.current.dot
    void resize()

    // The pointer's wake: a trail of points, laid every few px, each living WAKE_LIFE s. Faster strokes
    // lay stronger points, so a flick reads brighter than a drift.
    const trail: { x: number; y: number; t: number; s: number }[] = []
    // Where a mouse is over the section, for the words' hover plays.
    let pointer = { x: 0, y: 0, in: false }
    const trailBuf = new Float32Array(TRAIL * 4)
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const now = performance.now()
      const lastPt = trail[trail.length - 1]
      const d = lastPt ? Math.hypot(x - lastPt.x, y - lastPt.y) : Infinity
      if (lastPt && d < 10 && now - lastPt.t < 60) return
      const speed = lastPt ? d / Math.max(0.008, (now - lastPt.t) / 1000) : 0
      trail.push({ x, y, t: now, s: Math.min(1, 0.4 + speed / 1500) })
      if (trail.length > TRAIL) trail.shift()
      pointer = { x, y, in: e.pointerType === 'mouse' }
    }
    const onLeave = () => {
      pointer.in = false
    }
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)

    let raf = 0
    let last = performance.now()
    let loopT = 0
    let fieldT = 0
    // The opening plays once a session. Coming back to the page, the title stands set and stays: the words
    // play only under the pointer, and the field keeps its slow drift.
    let idle = false
    try {
      if (v.current.intro !== false && sessionStorage.getItem('signal:intro')) {
        loopT = AT.form + 2.2
        idle = true
      }
      sessionStorage.setItem('signal:intro', '1')
    } catch {}
    // Hover plays: each word's amount (eased) and its own clock while it plays.
    const hov = [0, 0, 0]
    const hClock = [0, 0, 0]
    // The readout's eased state: the shown number and its key.
    let readKey = ''
    let shownN = 0
    // Under reduced motion the loop draws only when something changed: the setting itself (the OS answer
    // arrives after the first frames), or the layout.
    let lastReduced = rm.current
    let lastLay = layRef.current

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const vals = v.current
      if (vals.size !== lastSize || vals.dot !== lastDot) {
        lastSize = vals.size
        lastDot = vals.dot
        void resize()
      }
      if (!activeRef.current || !ready()) return
      const reduced = rm.current
      if (reduced !== lastReduced || layRef.current !== lastLay) {
        lastReduced = reduced
        lastLay = layRef.current
        dirty = true
      }
      if (reduced && !dirty) return
      dirty = false

      const hold = Number(vals.hold)
      const speed = Number(vals.speed)
      const L = loopLength(hold)
      const frozen = reduced ? sceneTime('title', hold) : vals.t !== undefined ? Number(vals.t) : sceneTime(String(vals.scene), hold)
      const still = pausedRef.current
      if (!reduced && !still) fieldT += dt * speed
      const l = layRef.current
      // Hover: over a word while the title stands quiet, the word plays in place and the loop waits.
      const quietT = frameAt(loopT, hold, 1)
      const quiet = frozen === null && !still && quietT.form.every(x => x >= 1) && quietT.apart.every(x => x === 0) && quietT.sparks + quietT.sys + quietT.outline + quietT.fuse < 0.01
      const over =
        l && quiet && pointer.in ? l.lines.findIndex(line => pointer.x > line.ink0 - 8 && pointer.x < line.ink0 + line.width + 8 && pointer.y > line.capTop - 8 && pointer.y < line.baseline + 8) : -1
      for (let i = 0; i < 3; i++) {
        hov[i] += ((over === i ? 1 : 0) - hov[i]) * (1 - Math.exp(-dt * 6))
        if (over === i) hClock[i] += dt
        else if (hov[i] < 0.01) hClock[i] = 0
      }
      let t: number
      if (frozen !== null) {
        t = frozen
      } else {
        if (!still && !idle && over < 0) loopT += dt * speed
        const restAt = AT.hold + hold * 0.5
        if (vals.once && loopT > restAt) loopT = restAt
        if (loopT >= L) loopT -= L
        t = loopT
      }

      const { w, h, dpr } = size
      const reach = Math.hypot(Math.max(centre.x, w - centre.x), Math.max(centre.y, h - centre.y))
      const f = frameAt(t, hold, reach)
      // The hover plays, on top of the loop's: intelligent's signals, systems' register stepping round,
      // designer's outline and fill; the other words step back.
      if (Math.max(...hov) > 0.001) {
        f.sparks = Math.max(f.sparks, hov[0])
        if (hov[1] > 0.001) {
          const x = hClock[1] * 1.1
          f.sys = Math.max(f.sys, hov[1])
          f.step = (Math.floor(x) % 4) + easeIO(Math.min(1, Math.max(0, (x - Math.floor(x) - 0.35) / 0.65)))
        }
        f.outline = Math.max(f.outline, hov[2])
        f.fill = Math.max(f.fill, hov[2] * Math.min(1, Math.max(0, (hClock[2] - 0.3) / 0.8)))
        f.guidesD = Math.max(f.guidesD, hov[2])
        for (let i = 0; i < 3; i++) f.dim[i] = Math.max(f.dim[i], ...hov.filter((_, j) => j !== i))
        const lead = hov.indexOf(Math.max(...hov))
        if (hov[lead] > 0.5) f.scene = (['intelligent', 'systems', 'designer'] as const)[lead]
      }
      // Leaving: nothing goes while it is still in view. Each part leaves as it slides up under the nav, by
      // its own place on screen, so the hero never empties ahead of the page: intelligent drifts off left,
      // designer right, systems runs its register, and the field dissolves under the nav in ordered dither.
      const top = section.getBoundingClientRect().top
      const leaving = vals.exit !== false && !reduced
      const leave = (y0: number, y1: number) => (leaving ? Math.min(1, Math.max(0, (NAV + 24 - (top + y0)) / (y1 - y0 + 24))) : 0)
      const exitW = l ? l.lines.map(line => easeIO(leave(line.capTop, line.baseline))) : [0, 0, 0]
      const sysExit = exitW[1] > f.sys
      if (sysExit) {
        f.sys = exitW[1]
        f.step = 3 * exitW[1]
      }
      const off = l ? l.apart.map((a, i) => a * f.apart[i] + [-0.08, 0, 0.08][i] * w * exitW[i]) : [0, 0, 0]
      const fr = footBox.current

      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(U('uRes'), w, h)
      f1('uDpr', dpr)
      f1('uTime', fieldT)
      const dot = Number(vals.dot)
      f1('uDot', dot)
      f1('uDotFill', Number(vals.dotFill))
      // Dot centres on whole multiples of the pitch from a grid node, so every node is a dot's centre.
      gl.uniform2f(U('uOrigin'), l ? l.x0 - dot / 2 : 0, -dot / 2)
      gl.uniform3fv(U('uPaper'), rgb(PAPER))
      gl.uniform3fv(U('uInk'), rgb(INK))
      gl.uniform3fv(U('uGrey'), rgb(GREY))
      gl.uniform3fv(U('uGreyLight'), rgb(GREY_LIGHT))
      const vivid = vals.formTone === 'vivid'
      gl.uniform3fv(U('uIri'), (vivid ? IRI_VIVID : IRI).flatMap(rgb))
      f1('uEvoS', vivid ? 1.3 : 1)
      gl.uniform3f(U('uDim'), ...f.dim)
      // The dissolve under the nav comes in over the first few px of scroll, so the hero at rest is untouched.
      f1('uExit', leaving ? band(-top, 0, 40) : 0)
      f1('uTop', top)
      f1('uNav', NAV)
      gl.uniform3f(U('uExitW'), exitW[0], exitW[1], exitW[2])
      // Designer's fill: one colour, turning ink to ink from when the fill comes in (or while hovered).
      const inks = PALETTES[String(vals.palette)] ?? PALETTES.brand
      const fillX = Math.max(0, hov[2] > 0.001 ? hClock[2] - 0.3 : t - (AT.d + 0.6)) * 1.1
      const fill = { x: fillX, at: (x: number) => fillColour(inks, x) }
      gl.uniform3fv(U('uFill'), rgb(fill.at(fillX)))
      gl.uniform3fv(U('uSage'), rgb(SAGE))
      gl.uniform3fv(U('uSageLight'), rgb(SAGE_LIGHT))
      gl.uniform3fv(U('uSageDeep'), rgb(SAGE_DEEP))
      // Leaving, systems' modules are drawn in grey, not its colours.
      gl.uniform3fv(U('uSysCol'), rgb(sysExit ? GREY : sysColour(f.step)))
      f1('uHalftone', Number(vals.halftone))
      f1('uRound', Number(vals.round))
      gl.uniform3f(U('uOff'), off[0], off[1], off[2])
      gl.uniform3f(U('uForm'), ...f.form)
      f1('uI', f.sparks)
      gl.uniform2f(U('uS'), f.sys, f.step)
      gl.uniform2f(U('uD'), f.outline, f.fill)
      const dl = l?.lines[2]
      gl.uniform4f(U('uDBox'), dl ? dl.ink0 : 0, dl ? dl.capTop : 0, dl ? dl.ink0 + dl.width : 0, dl ? dl.baseline : 0)
      f1('uAdv', dl ? dl.adv : 1)
      const sl = l?.lines[1]
      gl.uniform4f(U('uSBox'), sl ? sl.ink0 : 0, sl ? sl.capTop : 0, sl ? sl.ink0 + sl.width : 0, sl ? sl.baseline : 0)
      f1('uFuse', f.fuse)
      gl.uniform2f(U('uCenter'), centre.x, centre.y)
      f1('uBit', f.bit)
      f1('uBloomR', f.bloomR)
      f1('uLatent', f.latent)
      // The evolving forms: centred right of the title on desktop (under it, narrower), as large as the
      // title block, running in under the words; they come with the genesis, go with the made world in the
      // return, and as the hero leaves.
      // The evolving forms: big, on a grid node in the upper right, cropped by the edges and running in
      // behind the title.
      const blockH = l ? l.lines[2].baseline - l.lines[0].capTop : 0
      const evoX = l ? l.x0 + Math.round(((l.x1 - l.x0) * (l.desktop ? 0.84 : 0.86)) / l.grid) * l.grid : 0
      const evoY = l ? l.lines[0].capTop + Math.round((blockH * 0.32) / l.grid) * l.grid : 0
      gl.uniform3f(U('uEvo'), evoX, evoY, blockH * (l?.desktop ? 1.15 : 1.3))
      f1('uEvoA', Math.min(1, f.bloomR / Math.max(1, reach)))
      f1('uEvoT', fieldT)
      f1('uGridStep', l ? l.grid : 64)
      gl.uniform2f(U('uGridOrigin'), l ? l.x0 : 0, 0)
      f1('uGrid', Number(vals.grid))
      gl.uniform4f(U('uQuiet'), fr.x0, fr.y0, fr.x1, fr.y1)
      gl.uniform2f(U('uBands'), 88, 32)
      while (trail.length && now - trail[0].t > WAKE_LIFE * 1000) trail.shift()
      trailBuf.fill(0)
      trail.forEach((p, i) => trailBuf.set([p.x, p.y, (now - p.t) / 1000 / WAKE_LIFE, p.s], i * 4))
      gl.uniform4fv(U('uTrail'), trailBuf)
      f1('uWake', reduced ? 0 : Number(vals.wake))
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // Overlays, written straight to the DOM: no React render per frame.
      const set = (el: HTMLElement | null, text: string) => {
        if (el && el.textContent !== text) el.textContent = text
      }
      // The progress bar: one segment a scene, each filling as its scene plays.
      const starts = sceneStarts(hold)
      const bar = barRef.current
      if (bar) {
        Array.from(bar.children).forEach((seg, i) => {
          const fill = seg.firstElementChild as HTMLElement | null
          const u = Math.min(1, Math.max(0, (t - starts[i]) / (starts[i + 1] - starts[i])))
          if (fill) fill.style.transform = `scaleX(${u})`
        })
        // Idle, there is no sequence to show progress through.
        bar.style.opacity = showBarRef.current && !idle ? '1' : '0'
      }
      const pb = pauseRef.current
      if (pb) {
        pb.style.opacity = reduced ? '0' : '1'
        pb.style.visibility = reduced ? 'hidden' : ''
      }

      // Designer's type guides, moving with the word.
      const guides = guidesRef.current
      if (guides) {
        guides.style.opacity = String(f.guidesD)
        guides.style.transform = `translateX(${off[2]}px)`
      }

      const read = readRef.current
      const rv = readValueRef.current
      if (read && rv && l) {
        const r = readout(f, l, counts, fill)
        // The shown number eases toward the target; a new key counts up from nothing and plays in.
        if (r.key !== readKey) {
          if (readKey) {
            shownN = 0
            rv.animate(ENTER, ENTER_TIMING)
            readLabelRef.current?.animate(ENTER, {
              ...ENTER_TIMING,
              delay: 80,
            })
          } else shownN = r.n
          readKey = r.key
        }
        shownN += (r.n - shownN) * (1 - Math.exp(-dt * 7))
        // A colour shows exactly what is on the page, so its hex and swatch track the word without easing.
        if (frozen !== null || r.swatch) shownN = r.n
        set(rv.lastChild as HTMLElement, r.fmt(shownN))
        const sw = rv.firstChild as HTMLElement
        sw.style.display = r.swatch ? '' : 'none'
        if (r.swatch) sw.style.background = r.fmt(shownN)
        set(readLabelRef.current, r.label)
        // A steady size, so the figure doesn't jump from scene to scene. On desktop: two grid steps of cap, or
        // what the right column fits of eight characters (seven and a swatch), its cap on designer's cap line,
        // under the evolving forms.
        // Narrower: a grid step and a bit of cap, on the row under the title, from the left.
        const room = l.x1 - Math.max(...l.lines.map((line, i) => line.ink0 + l.apart[i] + line.width)) - l.grid
        const px = l.desktop ? Math.max(24, Math.min((2 * l.grid) / CAP_EM, room / (8.8 * 0.6))) : Math.max(20, (1.25 * l.grid) / CAP_EM)
        const fs = `${px.toFixed(1)}px`
        if (rv.style.fontSize !== fs) rv.style.fontSize = fs
        const readTop = l.desktop ? l.lines[2].capTop - 0.177 * px : l.lines[2].baseline + 2 * l.grid - 0.177 * px
        const gone = easeIO(leave(readTop, readTop + px + 24))
        const slide = (gone * 48).toFixed(1)
        read.style.top = `${readTop}px`
        if (l.desktop) {
          read.style.left = ''
          read.style.right = `${l.w - l.x1}px`
          read.style.transform = `translateX(${slide}px)`
        } else {
          read.style.left = `${l.x0}px`
          read.style.right = ''
          read.style.transform = `translateX(${slide}px)`
        }
        read.style.textAlign = l.desktop ? 'right' : 'left'
        rv.style.justifyContent = l.desktop ? 'flex-end' : 'flex-start'
        read.style.opacity = String(1 - gone)
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('webglcontextlost', onLost)
      // Free what this effect made; losing the context would break the next mount on the same canvas.
      tex.forEach(t => gl.deleteTexture(t))
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
    // The loop reads values, motion and activity through refs; set up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const starts = sceneStarts(Number(values.hold))
  const dl = lay?.lines[2]

  return (
    // The hero runs up behind the transparent nav (80px).
    <section
      ref={sectionRef}
      className={`relative ${lab ? '-mt-20' : ''} overflow-hidden select-none ${display.className}`}
      style={{
        background: PAPER,
        minHeight: 'calc(clamp(560px, 74vh, 780px) + 80px)',
        touchAction: 'pan-y pinch-zoom',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Measures the lattice content box for the layout. */}
      <div className="lattice absolute inset-x-0 top-0 h-0" aria-hidden>
        <div ref={probeRef} className="w-full h-0" />
      </div>

      {/* The real title: read by search and screen readers, shown as type when there is no WebGL. */}
      <h1 className={glFailed ? 'relative z-10 lattice pt-36 font-mono font-bold text-text-primary text-[clamp(40px,8vw,120px)] leading-[0.94] uppercase' : 'sr-only'}>
        {glFailed
          ? copy.headline[0].split(' ').map(word => (
              <span key={word} className="block">
                {word}
              </span>
            ))
          : copy.headline[0]}
        <span className="sr-only">. {copy.headline[1]}</span>
      </h1>

      <div className="absolute inset-0 pointer-events-none font-mono text-text-secondary" aria-hidden style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
        {/* Designer's type guides: its cap height and baseline. */}
        {dl && (
          <div ref={guidesRef} className="absolute inset-0" style={{ opacity: 0 }}>
            {[dl.capTop, dl.baseline].map((y, k) => (
              <div
                key={k}
                className="absolute h-px bg-text-tertiary"
                style={{
                  left: dl.ink0 - 8,
                  width: dl.width + 16,
                  top: Math.round(y),
                }}
              />
            ))}
          </div>
        )}

        {/* The readout: one true figure per scene, in the right column. */}
        <div ref={readRef} className="absolute transition-opacity duration-500" style={{ opacity: 0 }}>
          <div ref={readValueRef} className="flex items-center justify-end gap-[0.2em] font-bold leading-none tabular-nums">
            <span className="inline-block shrink-0 w-[0.7em] h-[0.7em]" style={{ display: 'none' }} />
            <span />
          </div>
          <div ref={readLabelRef} className="mt-2 text-[10px] md:text-[11px] tracking-wide whitespace-nowrap" />
        </div>
      </div>

      {/* The player: pause, and a hairline of progress along the foot, a segment a scene. */}
      <div className="lattice absolute inset-x-0 bottom-[17px] z-10 flex items-center gap-3 pointer-events-none" style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
        {!glFailed && (
          <button
            ref={pauseRef}
            type="button"
            onClick={() => setPaused(p => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play the title animation' : 'Pause the title animation'}
            className="pointer-events-auto -m-2 p-2 text-text-tertiary hover:text-text-primary focus-visible:text-text-primary transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
              {paused ? <path d="M1.5 0.5 L9 5 L1.5 9.5 Z" /> : <path d="M1 0.5 H3.6 V9.5 H1 Z M6.4 0.5 H9 V9.5 H6.4 Z" />}
            </svg>
          </button>
        )}
        <div ref={barRef} className="flex flex-1 gap-[3px]" style={{ opacity: 0 }} aria-hidden>
          {starts.slice(0, -1).map((a, i) => (
            <div key={i} className="relative h-[2px] bg-text-tertiary/25 overflow-hidden" style={{ flexGrow: starts[i + 1] - a, flexBasis: 0 }}>
              <div className="absolute inset-0 bg-text-tertiary origin-left" style={{ transform: 'scaleX(0)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* The foot: the subtitle over seven columns, and the call to action under it, two columns wide.
          Real and always there. */}
      <div
        ref={footRef}
        className="lattice absolute inset-x-0 bottom-16 z-10 flex flex-col items-start gap-6 font-normal"
        // Shown from the first paint, with or without the loop: it is the page's first real content.
        style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
      >
        <div className="md:w-[round(calc((100%-11*16px)/12*7+6*16px),1px)]">
          <p className="font-mono text-[17px] md:text-subhead leading-[1.3] text-text-primary">{copy.headline[1]}.</p>
          <p className="mt-2 font-mono text-[14px] md:text-[15px] leading-[1.5] text-text-secondary">{copy.subhead[0]}</p>
        </div>
        <Link href={copy.cta.href} className="btn-primary hero-cta inline-flex justify-between cta-2col shrink-0" style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
          <span className="font-mono text-label uppercase tracking-wide">{copy.cta.label}</span>
          <svg className="hero-cta-arrow w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
