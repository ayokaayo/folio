'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IBM_Plex_Mono } from 'next/font/google'
import { HERO_COPY } from '@/components/hero/copy'
import { cappedDpr, useActive, useLatest } from '@/components/hero/field/hooks'
import type { VariantProps } from '../../types'
import { lensesAt } from './lenses'
import { SCRIPTED, TRAIL, fragment, vertex } from './shader'
import { layout, rasterise, type Layout } from './stage'
import { AT, SCENES, frameAt, loopLength, sceneStarts, sceneTime, type Frame } from './timeline'

// The title is set in the site mono at 700, a weight the site itself doesn't load.
const display = IBM_Plex_Mono({ weight: ['700'], subsets: ['latin'], display: 'block' })

const PAPER = '#F7F5F0'
const INK = '#2A2A2C'
// Eight inks each; the field dithers between neighbours, so the order is the order of the blends.
const PALETTES: Record<string, string[]> = {
  // A pastel spectrum anchored on the sage: sand, butter, peach, blush, lilac, mist, mint, sage.
  brand: ['#E8DFD0', '#F1E2B3', '#F2C4A8', '#EBC3C8', '#D8D1E8', '#C2DCE0', '#C9E7DA', '#8FC7AE'],
  // The first pass: sand, the mints toward the accent, and peaches toward the hero's rust.
  'brand-warm': ['#E8DFD0', '#C9E7DA', '#9FD3BE', '#54AB8B', '#9FD3BE', '#F2C4A8', '#E9A58C', '#F2C4A8'],
  // Full strength: the accent greens and the rust.
  'brand-bold': ['#E8DFD0', '#9FD3BE', '#54AB8B', '#338467', '#C8553D', '#F2C4A8', '#E9A58C', '#C9E7DA'],
  'brand-cool': ['#E8DFD0', '#C9E7DA', '#9FD3BE', '#54AB8B', '#338467', '#24664E', '#54AB8B', '#C2DCE0'],
  // The reference reel's pastels.
  iridescent: ['#F7B2D9', '#E3B8F2', '#C9B6FF', '#B8C6FF', '#A8E6CF', '#D8F0B0', '#FFE7A3', '#FFC3A0'],
  mono: ['#E8DFD0', '#D6D2C9', '#C9C6BE', '#A3A3A3', '#6B6B6B', '#A3A3A3', '#C9C6BE', '#D6D2C9'],
}
// The accent family the pointer's wake is inked in.
const SAGE = '#54AB8B'
const SAGE_LIGHT = '#C9E7DA'
const SAGE_DEEP = '#24664E'
/** Seconds a point of the pointer's trail lives. */
const WAKE_LIFE = 1.6
/** Plex Mono's cap height, em. */
const CAP_EM = 0.698
/** The three lines over zero, one and beyond, in a few voices to try in the lab. */
const CAPTION_SETS: Record<string, string[]> = {
  'zero-one': ['FROM ZERO', 'TO ONE', 'AND BEYOND'],
  'blank-page': ['A BLANK PAGE', 'A FIRST MARK', 'A LIVING SYSTEM'],
  idea: ['NOTHING, YET', 'AN IDEA', 'EVERYTHING IT BECOMES'],
  numerals: ['0', '1', '1 → ∞'],
  none: [],
}
/** The DNA glyphs' lightest ink, as on the case study's cover. */
const TAN = '#C4B394'
/** Warm greys for depth: the words stepped back, and the resting marks. */
const GREY = '#A19E97'
const GREY_LIGHT = '#C2BFB7'
/** The DNA mark's ink: a deep warm grey, so the title is the one black on the page. */
const GREY_DEEP = '#55534E'

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

/** The grid node nearest the section's centre, where the one mark sits and the glyphs go out from. */
function centreOf(l: Layout) {
  const g = l.grid
  return { x: l.x0 + Math.round((l.w / 2 - l.x0) / g) * g, y: Math.round(l.h / 2 / g) * g }
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const easeIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
/** 0 before a, 1 after b, smooth between. */
const band = (x: number, a: number, b: number) => easeIO(Math.min(1, Math.max(0, (x - a) / (b - a))))

const pad = (n: number, w: number) => String(Math.floor(n)).padStart(w, '0')
const grouped = (n: number, digits: number) => pad(n, digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function timecode(t: number) {
  const f = Math.floor(t * 30)
  return `00:${pad(f / 1800, 2)}:${pad((f / 30) % 60, 2)}:${pad(f % 30, 2)}`
}

/** The technical line over the title: what the scene is doing, in its own terms. */
function stat(f: Frame, l: Layout): string {
  switch (f.scene) {
    case 'word':
      return `WGHT 700  IBM PLEX MONO  GRID ${l.grid}`
    case 'intelligent':
      return `FLOW FIELD  AMPLITUDE ${f.flow.toFixed(2)}  SEED 0x5F3A`
    case 'systems':
      return `SHIFT REGISTER  STEP ${Math.min(4, Math.round(f.step))}/4  MODULE ${l.grid}PX`
    case 'designer':
      return `OUTLINE ${f.outline.toFixed(2)}  FILL ${f.fill.toFixed(2)}  08 INKS`
    case 'title':
      return '03 WORDS  01 TITLE'
    default:
      return ''
  }
}

/**
 * The big readout: the one number the scene is about, as a target the display eases toward. Zero, one,
 * then the marks the one becomes; the title's glyphs as they unfold; each word's own figure while it plays
 * (systems' is a colour, its hex turning with the hue); coherence as the words fuse. A new key restarts
 * the count and plays the value in.
 */
interface Read {
  key: string
  label: string
  n: number
  fmt: (n: number) => string
  swatch?: boolean
}
function readout(f: Frame, t: number, l: Layout, marks: number): Read {
  const glyphs = l.lines.reduce((n, line) => n + line.text.length, 0)
  const count = (n: number) => grouped(Math.round(n), 1)
  switch (f.scene) {
    case 'zero':
      return { key: 'marks', label: 'MARKS / A BLANK PAGE', n: 0, fmt: count }
    case 'one':
      return { key: 'marks', label: 'MARKS / ONE', n: 1, fmt: count }
    case 'beyond':
    case 'latent':
    case 'return':
      return { key: 'marks', label: f.scene === 'latent' ? 'MARKS / THE TITLE, LATENT' : 'MARKS / AND BEYOND', n: Math.max(f.bit > 0.5 ? 1 : 0, marks), fmt: count }
    case 'word': {
      const n = l.lines.reduce((s, line, i) => s + f.form[i] * line.text.length, 0)
      return { key: 'glyphs', label: `GLYPHS / OF ${glyphs}`, n, fmt: x => pad(Math.round(x), 2) }
    }
    case 'intelligent':
      return { key: 'signals', label: 'INTELLIGENT / SIGNALS FIRED', n: Math.max(0, t - AT.i) * 1361.7, fmt: x => grouped(x, 4) }
    case 'systems':
      return { key: 'colour', label: 'SYSTEMS / ONE COLOUR, FOUR STATES', n: f.step, fmt: sysColour, swatch: true }
    case 'designer': {
      const cap = l.lines[0].baseline - l.lines[0].capTop
      return { key: 'cap', label: `DESIGNER / CAP ${cap / l.grid}×${l.grid} GRID`, n: cap, fmt: x => `${Math.round(x)}PX` }
    }
    default:
      return { key: 'coherence', label: 'COHERENCE / THREE WORDS, ONE TITLE', n: f.coherence, fmt: x => x.toFixed(3) }
  }
}

/** The plays a value and label in with when the readout changes key. */
const ENTER: Keyframe[] = [
  { opacity: 0, transform: 'translateY(10px)', filter: 'blur(6px)' },
  { opacity: 1, transform: 'none', filter: 'none' },
]
const ENTER_TIMING: KeyframeAnimationOptions = { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }

export default function Signal({ values, reducedMotion }: VariantProps) {
  const copy = HERO_COPY
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const probeRef = useRef<HTMLDivElement>(null)
  const footRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const metaRef = useRef<HTMLSpanElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const totalRef = useRef<HTMLSpanElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const guidesRef = useRef<HTMLDivElement>(null)
  const statRef = useRef<HTMLDivElement>(null)
  const readRef = useRef<HTMLDivElement>(null)
  const readValueRef = useRef<HTMLDivElement>(null)
  const readLabelRef = useRef<HTMLDivElement>(null)
  const swatchRef = useRef<HTMLSpanElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const footBox = useRef({ x0: 0, y0: 0, x1: 0, y1: 0 })
  const [lay, setLay] = useState<Layout | null>(null)
  const [glFailed, setGlFailed] = useState(false)
  const active = useActive(sectionRef)

  const v = useLatest(values)
  const rm = useLatest(reducedMotion)
  const activeRef = useLatest(active)
  const layRef = useLatest(lay)
  const showHudRef = useLatest(Boolean(values.hud))

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: process.env.NODE_ENV !== 'production' })
    if (!gl) {
      setGlFailed(true)
      return
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
      return s
    }
    let prog: WebGLProgram
    try {
      prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertex))
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragment))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link')
    } catch (e) {
      console.error('[signal]', e)
      setGlFailed(true)
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

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
    gl.uniform1i(U('uMaskA'), 0)
    gl.uniform1i(U('uMaskB'), 1)

    const family = display.style.fontFamily
    let size = { w: 1, h: 1, dpr: 1 }
    let centre = { x: 0, y: 0 }
    let alive = true
    let dirty = true

    // Measures after the fonts load, as the foot's copy can rewrap and move the space the title gets.
    const resize = async () => {
      await document.fonts.ready
      await document.fonts.load(`700 100px ${family}`)
      if (!alive) return
      const r = section.getBoundingClientRect()
      const probe = probeRef.current!.getBoundingClientRect()
      const foot = footRef.current!.getBoundingClientRect()
      const dpr = cappedDpr(2)
      const w = Math.round(r.width)
      const h = Math.round(r.height)
      size = { w, h, dpr }
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const x0 = Math.round(probe.left - r.left)
      const x1 = Math.round(probe.right - r.left)
      footBox.current = { x0: foot.left - r.left, y0: foot.top - r.top, x1: foot.right - r.left, y1: foot.bottom - r.top }
      const l = layout(w, h, x0, x1, foot.top - r.top - 32, family, Number(v.current.size ?? 1))
      centre = centreOf(l)
      rasterise(l, family, dpr, masks[0], masks[1])
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
    void resize()

    // The pointer's wake: a trail of points, laid every few px, each living WAKE_LIFE s. Faster strokes
    // lay stronger points, so a flick reads brighter than a drift.
    const trail: { x: number; y: number; t: number; s: number }[] = []
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
      if (trail.length > TRAIL - SCRIPTED) trail.shift()
    }
    section.addEventListener('pointermove', onMove)

    let raf = 0
    let last = performance.now()
    let loopT = 0
    let fieldT = 0
    let first = true
    let fpsAcc = 0
    let fpsN = 0
    let fps = 60
    // The readout's eased state: the shown number and its key.
    let readKey = ''
    let shownN = 0

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const vals = v.current
      if (vals.size !== lastSize) {
        lastSize = vals.size
        void resize()
      }
      if (!activeRef.current) return
      const reduced = rm.current
      if (reduced && !dirty) return
      dirty = false
      fpsAcc += dt
      fpsN++
      if (fpsAcc > 0.5) {
        fps = Math.round(fpsN / fpsAcc)
        fpsAcc = 0
        fpsN = 0
      }

      const hold = Number(vals.hold)
      const speed = Number(vals.speed)
      const L = loopLength(hold)
      const frozen = reduced ? sceneTime('title', hold) : vals.t !== undefined ? Number(vals.t) : sceneTime(String(vals.scene), hold)
      if (!reduced) fieldT += dt * speed
      let t: number
      if (frozen !== null) {
        t = frozen
        first = false
      } else {
        loopT += dt * speed
        const restAt = AT.hold + hold * 0.5
        if (vals.once && loopT > restAt) loopT = restAt
        if (loopT >= L) {
          loopT -= L
          first = false
        }
        t = loopT
      }

      const { w, h, dpr } = size
      const reach = Math.hypot(Math.max(centre.x, w - centre.x), Math.max(centre.y, h - centre.y))
      const f = frameAt(t, hold, reach)
      const l = layRef.current
      // Leaving: how far the hero has scrolled away, and each word's share of it, staggered. Intelligent
      // drifts off left, designer right, and systems runs its register as they dissolve.
      const top = section.getBoundingClientRect().top
      const exit = vals.exit === false || reduced ? 0 : Math.min(1, Math.max(0, -top / (h * 0.8)))
      const exitW = [0, 1, 2].map(i => easeIO(Math.min(1, Math.max(0, (exit - 0.08 - i * 0.08) / 0.55))))
      const sysExit = exitW[1] > f.sys
      if (sysExit) {
        f.sys = exitW[1]
        f.step = 3 * exitW[1]
      }
      const off = l ? l.apart.map((a, i) => a * f.apart[i] + [-0.14, 0, 0.14][i] * w * exitW[i]) : [0, 0, 0]
      const fr = footBox.current

      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(U('uRes'), w, h)
      f1('uDpr', dpr)
      f1('uTime', fieldT)
      const dot = Number(vals.dot)
      f1('uDot', dot)
      f1('uDotFill', Number(vals.dotFill))
      f1('uNoiseScale', Number(vals.noiseScale))
      // Dot centres on whole multiples of the pitch from a grid node, so every node is a dot's centre.
      gl.uniform2f(U('uOrigin'), l ? l.x0 - dot / 2 : 0, -dot / 2)
      gl.uniform3fv(U('uPaper'), rgb(PAPER))
      gl.uniform3fv(U('uInk'), rgb(INK))
      gl.uniform3fv(U('uTan'), rgb(TAN))
      gl.uniform3fv(U('uGrey'), rgb(GREY))
      gl.uniform3fv(U('uGreyLight'), rgb(GREY_LIGHT))
      gl.uniform3fv(U('uGreyDeep'), rgb(GREY_DEEP))
      gl.uniform3f(U('uDim'), ...f.dim)
      f1('uExit', exit)
      gl.uniform3f(U('uExitW'), exitW[0], exitW[1], exitW[2])
      gl.uniform3fv(U('uPal'), (PALETTES[String(vals.palette)] ?? PALETTES.brand).flatMap(rgb))
      gl.uniform3fv(U('uSage'), rgb(SAGE))
      gl.uniform3fv(U('uSageLight'), rgb(SAGE_LIGHT))
      gl.uniform3fv(U('uSageDeep'), rgb(SAGE_DEEP))
      f1('uHalftone', Number(vals.halftone))
      f1('uRound', Number(vals.round))
      gl.uniform3f(U('uOff'), off[0], off[1], off[2])
      gl.uniform3f(U('uForm'), ...f.form)
      gl.uniform2f(U('uI'), f.flow, f.sparks)
      gl.uniform2f(U('uS'), f.sys, f.step)
      gl.uniform2f(U('uD'), f.outline, f.fill)
      const dl = l?.lines[2]
      gl.uniform4f(U('uDBox'), dl ? dl.ink0 : 0, dl ? dl.capTop : 0, dl ? dl.ink0 + dl.width : 0, dl ? dl.baseline : 0)
      f1('uAdv', dl ? dl.adv : 1)
      const sl = l?.lines[1]
      gl.uniform4f(U('uSBox'), sl ? sl.ink0 : 0, sl ? sl.capTop : 0, sl ? sl.ink0 + sl.width : 0, sl ? sl.baseline : 0)
      f1('uFuse', f.fuse)
      // Leaving, systems' modules are drawn in the light grey, not its colours.
      gl.uniform3fv(U('uSysCol'), rgb(sysExit ? GREY_LIGHT : sysColour(f.step)))
      // The right column: what the lines leave free at their widest apart, on the lattice's right edge.
      const room = l ? l.x1 - Math.max(...l.lines.map((line, i) => line.ink0 + l.apart[i] + line.width)) - l.grid : 0
      // The right column's one slot, centred on the title block: the readout's, and the DNA mark's while it plays.
      const blockH = l ? l.lines[2].baseline - l.lines[0].capTop : 0
      const slotY = l ? l.lines[0].capTop + blockH / 2 : 0
      const blobSize = l ? Math.min(room, blockH) * 0.8 : 0
      const blobOn = Boolean(l && l.desktop && room >= 3 * l.grid && f.blob > 0)
      const bx = l ? l.x1 - room / 2 : 0
      const by = slotY
      gl.uniform4f(U('uBlob'), bx, by, blobSize, blobOn ? f.blobScale * (1 - band(exit, 0.15, 0.6)) : 0)
      f1('uBlobT', f.blob)
      gl.uniform2f(U('uCenter'), centre.x, centre.y)
      f1('uBit', f.bit)
      f1('uBloomR', f.bloomR)
      f1('uLatent', f.latent)
      f1('uGridStep', l ? l.grid : 64)
      gl.uniform2f(U('uGridOrigin'), l ? l.x0 : 0, 0)
      f1('uGrid', Number(vals.grid))
      f1('uColour', f.colour * Number(vals.colour))
      gl.uniform4f(U('uQuiet'), fr.x0, fr.y0, fr.x1, fr.y1)
      gl.uniform2f(U('uBands'), 112, 44)
      while (trail.length && now - trail[0].t > WAKE_LIFE * 1000) trail.shift()
      trailBuf.fill(0)
      trail.forEach((p, i) => trailBuf.set([p.x, p.y, (now - p.t) / 1000 / WAKE_LIFE, p.s], i * 4))
      if (l && !reduced) {
        const words = l.lines.map((line, i) => ({ x0: line.ink0 + off[i], y0: line.capTop, x1: line.ink0 + off[i] + line.width, y1: line.baseline }))
        const geo = { w, h, cx: centre.x, cy: centre.y, reach, words }
        lensesAt(t, hold, geo, SCRIPTED).forEach((p, i) => trailBuf.set([p.x, p.y, p.age, p.s], (TRAIL - SCRIPTED + i) * 4))
      }
      gl.uniform4fv(U('uTrail'), trailBuf)
      f1('uWake', reduced ? 0 : Number(vals.wake))
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // HUD and overlays, written straight to the DOM: no React render per frame.
      const N = Math.floor(w / dot) * Math.floor(h / dot)
      const digits = String(N).length
      const set = (el: HTMLElement | null, text: string) => {
        if (el && el.textContent !== text) el.textContent = text
      }
      // Marks the made world holds: the grid nodes inside the wave's radius (roughly: a disc's share).
      const nodes = l ? (Math.floor((l.x1 - l.x0) / l.grid) + 1) * (Math.floor(h / l.grid) + 1) : 1
      const marks = Math.round(nodes * Math.min(1, (Math.PI * f.bloomR * f.bloomR) / (w * h)))
      set(labelRef.current, `${pad(f.index, 2)} / ${f.scene.toUpperCase()}`)
      set(metaRef.current, w < 768 ? `${w} × ${h} / ${fps} FPS` : `${w} × ${h} / ${fps} FPS / ${grouped(N, digits)} CELLS / 1-BIT ORDERED`)
      set(timeRef.current, timecode(t))
      set(totalRef.current, timecode(L))
      // The progress bar: one segment a scene, each filling as its scene plays.
      const starts = sceneStarts(hold)
      if (barRef.current) {
        Array.from(barRef.current.children).forEach((seg, i) => {
          const fill = seg.firstElementChild as HTMLElement | null
          const u = Math.min(1, Math.max(0, (t - starts[i]) / (starts[i + 1] - starts[i])))
          if (fill) fill.style.transform = `scaleX(${u})`
        })
      }

      const cap = captionRef.current
      if (cap) {
        const lines = CAPTION_SETS[String(vals.captions)] ?? CAPTION_SETS['zero-one']
        const text = f.caption >= 0 ? (lines[f.caption] ?? '') : ''
        const n = Math.round(f.typed * text.length)
        // A block cursor while it types, blinking once it has.
        const cursor = f.caption >= 0 && (n < text.length || t % 0.9 < 0.45) ? '█' : ' '
        set(cap, f.caption >= 0 && text ? text.slice(0, n) + cursor : '')
        cap.style.opacity = String(f.captionAlpha * (1 - band(exit, 0, 0.3)))
      }

      const guides = guidesRef.current
      if (guides) {
        Array.from(guides.children).forEach((el, i) => {
          const g = el as HTMLElement
          g.style.opacity = String((i === 2 ? Math.max(f.guides, f.guidesD) : f.guides) * (1 - exitW[i]))
          g.style.transform = `translateX(${off[i]}px)`
        })
      }

      const st = statRef.current
      if (st && l) {
        const text = stat(f, l)
        set(st, text)
        st.style.opacity = text ? String(1 - band(exit, 0.05, 0.3)) : '0'
      }

      const read = readRef.current
      const rv = readValueRef.current
      if (read && rv && l) {
        const r = readout(f, t, l, marks)
        // The shown number eases toward the target; a new key counts up from nothing and plays in.
        if (r.key !== readKey) {
          if (readKey) {
            shownN = 0
            rv.animate(ENTER, ENTER_TIMING)
            readLabelRef.current?.animate(ENTER, { ...ENTER_TIMING, delay: 80 })
          } else shownN = r.n
          readKey = r.key
        }
        shownN += (r.n - shownN) * (1 - Math.exp(-dt * 7))
        if (frozen !== null) shownN = r.n
        set(rv.lastChild as HTMLElement, r.fmt(shownN))
        set(readLabelRef.current, r.label)
        const sw = swatchRef.current
        if (sw) {
          sw.style.display = r.swatch ? '' : 'none'
          if (r.swatch) sw.style.background = r.fmt(shownN)
        }
        // A steady size: two grid steps of cap, or what the right column fits of nine characters (seven and a
        // swatch), so the figure doesn't jump in size from scene to scene. Centred on the title block, in the
        // slot it shares with the DNA mark: it gives way while the mark plays.
        const px = Math.max(24, Math.min((2 * l.grid) / CAP_EM, (room + l.grid) / (9 * 0.6)))
        const fs = `${px.toFixed(1)}px`
        if (rv.style.fontSize !== fs) rv.style.fontSize = fs
        read.style.top = `${slotY}px`
        read.style.right = `${l.w - l.x1}px`
        read.style.opacity = String((1 - band(exit, 0.05, 0.35)) * (blobOn ? 1 - Math.min(1, f.blobScale * 2) : 1))
        read.style.transform = `translate(${(band(exit, 0.05, 0.4) * 48).toFixed(1)}px, -50%)`
      }

      // Leaving, in order: the foot lifts away first, then the HUD and the readout, then the words.
      const foot = footRef.current
      if (foot) {
        const k = band(exit, 0, 0.3)
        foot.style.opacity = String(Math.min(1, (first ? t : 1) / 1.2) * (1 - k))
        foot.style.transform = k > 0 ? `translateY(${(-k * 48).toFixed(1)}px)` : ''
        foot.style.filter = k > 0 ? `blur(${(k * 6).toFixed(1)}px)` : ''
      }
      const hudK = band(exit, 0.08, 0.4)
      for (const el of [hudRef.current, playerRef.current]) if (el) el.style.translate = `0 ${(-hudK * 24).toFixed(1)}px`
      if (hudRef.current) hudRef.current.style.opacity = String(showHudRef.current ? 1 - hudK : 0)
      if (playerRef.current) playerRef.current.style.opacity = String(showHudRef.current ? 1 - band(exit, 0, 0.2) : 0)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      section.removeEventListener('pointermove', onMove)
      // Free what this effect made; losing the context would break the next mount on the same canvas.
      tex.forEach(t => gl.deleteTexture(t))
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
    // The loop reads values, motion and activity through refs; set up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showHud = Boolean(values.hud)
  const starts = sceneStarts(Number(values.hold))

  return (
    // The lab's main is padded for the nav; the hero runs up behind it, as the live one does.
    <section
      ref={sectionRef}
      className={`relative -mt-20 overflow-hidden select-none ${display.className}`}
      style={{ background: PAPER, minHeight: 'calc(clamp(560px, 74vh, 780px) + 80px)', touchAction: 'pan-y pinch-zoom' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Measures the lattice content box for the layout. */}
      <div className="lattice absolute inset-x-0 top-0 h-0" aria-hidden>
        <div ref={probeRef} className="w-full h-0" />
      </div>

      {/* The real title: read by search and screen readers, shown as type when there is no WebGL. */}
      <h1 className={glFailed ? 'relative z-10 lattice pt-36 font-mono font-bold text-text-primary text-[clamp(40px,8vw,120px)] leading-[0.94] uppercase' : 'sr-only'}>
        {copy.headline[0]}
        <span className="sr-only">. {copy.headline[1]}</span>
      </h1>

      <div className="absolute inset-0 pointer-events-none font-mono text-text-primary" aria-hidden style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
        {/* HUD: top row under the nav, bottom row along the foot. */}
        <div ref={hudRef} className="lattice absolute inset-x-0 top-[92px] flex justify-between text-[11px] tracking-wide text-text-secondary" style={{ opacity: showHud ? 1 : 0 }}>
          <span ref={labelRef} />
          <span ref={metaRef} />
        </div>
        {/* The player: time, a segment a scene, the loop's length. */}
        <div ref={playerRef} className="lattice absolute inset-x-0 bottom-5 flex items-center gap-4 text-[11px] tracking-wide text-text-secondary" style={{ opacity: showHud ? 1 : 0 }}>
          <span ref={timeRef} className="tabular-nums" />
          <div ref={barRef} className="flex flex-1 gap-[3px]">
            {starts.slice(0, -1).map((a, i) => (
              <div key={i} className="relative h-[3px] bg-text-tertiary/30 overflow-hidden" style={{ flexGrow: starts[i + 1] - a, flexBasis: 0 }}>
                <div className="absolute inset-0 bg-text-secondary origin-left" style={{ transform: 'scaleX(0)' }} />
              </div>
            ))}
          </div>
          <span ref={totalRef} className="tabular-nums text-text-tertiary" />
        </div>

        {/* The captions, under the point of light. */}
        {lay && (
          <div
            ref={captionRef}
            className="absolute -translate-x-1/2 whitespace-pre text-[11px] md:text-[14px] tracking-[0.34em]"
            style={{ left: centreOf(lay).x, top: centreOf(lay).y + 34, opacity: 0 }}
          />
        )}

        {/* Type guides: cap height and baseline on each word, moving with it. */}
        {lay && (
          <div ref={guidesRef}>
            {lay.lines.map((line, i) => (
              <div key={i} className="absolute inset-0" style={{ opacity: 0 }}>
                {[line.capTop, line.baseline].map((y, k) => (
                  <div key={k} className="absolute h-px bg-text-tertiary" style={{ left: line.ink0 - 8, width: line.width + 16, top: Math.round(y) }} />
                ))}
                <span className="absolute hidden md:block text-[10px] tracking-wide text-text-secondary" style={{ left: line.ink0 + line.width + 16, top: Math.round(line.capTop) - 6 }}>
                  CAP {Math.round(line.baseline - line.capTop)}
                </span>
                <span className="absolute hidden md:block text-[10px] tracking-wide text-text-secondary" style={{ left: line.ink0 + line.width + 16, top: Math.round(line.baseline) - 6 }}>
                  BASE {Math.round(line.baseline)}
                </span>
              </div>
            ))}
          </div>
        )}
        {lay && (
          <div
            ref={statRef}
            className="absolute hidden md:block bg-[#F7F5F0] pr-2 text-[11px] tracking-wide text-text-secondary transition-opacity duration-700"
            style={{ left: lay.x0, top: lay.lines[0].capTop - 24, opacity: 0 }}
          />
        )}
        <div ref={readRef} className="absolute hidden md:block text-right transition-opacity duration-500" style={{ opacity: 0 }}>
          <div ref={readValueRef} className="flex items-center justify-end gap-[0.2em] font-bold leading-none tabular-nums text-text-secondary">
            <span ref={swatchRef} className="inline-block w-[0.7em] h-[0.7em] mt-[-0.02em]" style={{ display: 'none' }} />
            <span />
          </div>
          <div ref={readLabelRef} className="mt-2 text-[11px] tracking-wide text-text-secondary" />
        </div>
      </div>

      {/* The foot: the subtitle over seven columns, and the call to action under it, two columns wide.
          Real and always there. */}
      <div
        ref={footRef}
        className="lattice absolute inset-x-0 bottom-16 z-10 flex flex-col items-start gap-6 font-normal"
        style={{ opacity: 0, fontFamily: 'var(--font-ibm-plex-mono)' }}
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
