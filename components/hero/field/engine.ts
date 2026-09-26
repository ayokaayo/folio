'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import type { HeroValues } from '../settings'
import { HIGHLIGHT, LATENT, colour, highlightHex, palette, resetTokens } from '../palettes'
import { cappedDpr, useActive, useLatest } from './hooks'
import { cellOrigin, CELL } from './glyphInputs'
import { MAX_MASK, fragment, vertex } from './shader'

/**
 * Moiré engine: renderer, line measurement for the highlights, palette, and a render loop
 * the caller drives through `step` (sets motion uniforms, returns whether still moving).
 * Loaded lazily by components/hero/HeroSection.tsx so three.js never blocks the copy.
 */

function hexToVec3(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

export type Uniforms = Record<string, THREE.IUniform>

export interface Frame {
  u: Uniforms
  dt: number
  now: number
  w: number
  h: number
  values: HeroValues
  reducedMotion: boolean
}

interface Options {
  sectionRef: RefObject<HTMLElement>
  copyRef: RefObject<HTMLDivElement>
  canvasRef: RefObject<HTMLCanvasElement>
  values: HeroValues
  reducedMotion: boolean
  step: (f: Frame) => boolean
}

export function useMoire({ sectionRef, copyRef, canvasRef, values, reducedMotion, step }: Options) {
  const active = useActive(sectionRef)
  const [glFailed, setGlFailed] = useState(false)

  const v = useLatest(values)
  const rm = useLatest(reducedMotion)
  const activeRef = useLatest(active)
  const stepRef = useLatest(step)
  const raf = useRef<number | null>(null)
  const kick = useRef<() => void>(() => {})
  const size = useRef({ w: 1, h: 1 })
  const copyRect = useRef({ x0: 0, x1: 1 })
  // Vertical extent of the copy column rule: the copy block's top to the CTA's bottom.
  const copySpan = useRef({ top: 0, bottom: 0 })
  const lineKind = useRef<string[]>([])
  const entranceStart = useRef(0)
  const glyphClock = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'low-power',
        // Dev only: keeps the last frame readable so scripts/checks/hero can sample pixels.
        preserveDrawingBuffer: process.env.NODE_ENV !== 'production',
      })
    } catch {
      setGlFailed(true)
      return
    }
    const blank = new THREE.DataTexture(new Uint8Array([128, 0, 0, 255]), 1, 1)
    blank.needsUpdate = true

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uDpr: { value: 1 },
        uTheta: { value: 0 },
        uScale: { value: 1 },
        uPitch: { value: 4 },
        uCoverage: { value: 0.32 },
        uInkAlpha: { value: 0.22 },
        uPaper: { value: hexToVec3('#F7F5F0') },
        uInk: { value: hexToVec3('#2A2A2C') },
        uInk2: { value: hexToVec3('#338467') },
        uInk3: { value: hexToVec3('#C8553D') },
        uHueByForm: { value: 1 },
        uHueByEnergy: { value: 0 },
        uLatent: { value: 0 },
        uLatentAmp: { value: 0 },
        uCenter: { value: new THREE.Vector2(0, 0) },
        uRadius: { value: 300 },
        uBump: { value: new THREE.Vector4(0, 0, 100, 0) },
        uField: { value: blank },
        uFieldAmp: { value: 0 },
        uFieldTexel: { value: new THREE.Vector2(12, 12) },
        uMask: { value: Array.from({ length: MAX_MASK }, () => new THREE.Vector4()) },
        uMaskCount: { value: 0 },
        uHiStyle: { value: new Array(MAX_MASK).fill(0) },
        uHiStrength: { value: 0.2 },
        uHiInk: { value: 0.3 },
        uHiPad: { value: 8 },
        uHiRadius: { value: 4 },
        uHiGap: { value: 4 },
        uHiColor: { value: hexToVec3('#338467') },
        uEdgeFade: { value: 0 },
        uGrain: { value: 0.008 },
        uTime: { value: 0 },
        uDrift: { value: 0 },
        uEnergy: { value: 0 },
        uAngle: { value: 0 },
        uBottomFade: { value: 96 },
        uEntrance: { value: 0 },
        uCopyFade: { value: new THREE.Vector3(0, 1, 1) },
        uCellOrigin: { value: new THREE.Vector2(0, 0) },
        uCtaBox: { value: new THREE.Vector4(0, 0, 0, 0) },
        uCopyCol: { value: new THREE.Vector4(0, 0, 0, 0) },
        uGlyphCenter: { value: new THREE.Vector2(0, 0) },
        uGlyphs: { value: 0 },
        uGlyphT: { value: 0 },
        uGlyphRest: { value: 0.8 },
        uGlyphWake: { value: 1 },
        uGlyphMutate: { value: 0.5 },
        uGlyphInkMax: { value: 0.7 },
        uGlyphDeepen: { value: 0.8 },
        uGlyphScale: { value: 9 },
        uGlyphChurn: { value: 1.5 },
        uGlyphRestTop: { value: 6 },
        uGlyphRain: { value: 0.12 },
        uInkDeep: { value: hexToVec3('#184937') },
        uPivot: { value: new THREE.Vector2(0, 0) },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const u = material.uniforms
    if (process.env.NODE_ENV !== 'production') {
      ;(window as unknown as { __hero?: unknown }).__hero = { u, size: () => size.current }
    }
    const scene = new THREE.Scene()
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)
    const camera = new THREE.Camera()

    // One box per rendered line of the headline and subtitle, for the highlight.
    const measureLines = (r: DOMRect) => {
      const copy = copyRef.current
      const list = u.uMask.value as THREE.Vector4[]
      let n = 0
      if (copy) {
        const range = document.createRange()
        copy.querySelectorAll<HTMLElement>('[data-line]').forEach(el => {
          const lines: DOMRect[] = []
          range.selectNodeContents(el)
          for (const b of Array.from(range.getClientRects())) {
            if (b.width < 1) continue
            const same = lines.find(o => Math.abs(o.top - b.top) < 4)
            if (same) {
              const x0 = Math.min(same.left, b.left)
              const x1 = Math.max(same.right, b.right)
              lines[lines.indexOf(same)] = new DOMRect(x0, same.top, x1 - x0, same.height)
            } else lines.push(b)
          }
          // Glyph boxes are taller than the line pitch and overlap; size each chip to the
          // element's line-height, centred on the glyphs, so stacked chips keep their gap.
          const lh = parseFloat(getComputedStyle(el).lineHeight) || 0
          for (const b of lines) {
            if (n >= MAX_MASK) break
            lineKind.current[n] = el.dataset.line || 'head'
            const mid = (b.top + b.bottom) / 2 - r.top
            const half = lh > 0 ? lh / 2 : b.height / 2
            list[n++].set(b.left - r.left, mid - half, b.right - r.left, mid + half)
          }
        })
      }
      u.uMaskCount.value = n
      // The CTA sits outside the highlight boxes; glyphs keep clear of it too.
      const cta = copyRef.current?.querySelector('a')?.getBoundingClientRect()
      if (cta) (u.uCtaBox.value as THREE.Vector4).set(cta.left - r.left, cta.top - r.top, cta.right - r.left, cta.bottom - r.top)
      const block = copyRef.current?.getBoundingClientRect()
      if (block) copySpan.current = { top: block.top - r.top, bottom: (cta ?? block).bottom - r.top }
    }

    const resize = () => {
      const r = section.getBoundingClientRect()
      const dpr = cappedDpr(2)
      renderer.setPixelRatio(dpr)
      renderer.setSize(r.width, r.height, false)
      u.uRes.value.set(r.width, r.height)
      u.uDpr.value = dpr
      size.current = { w: r.width, h: r.height }
      const c = copyRef.current?.getBoundingClientRect()
      if (c) copyRect.current = { x0: c.left - r.left, x1: c.right - r.left }
      measureLines(r)
      kick.current()
    }

    // Guards against callbacks (fonts, timers, pointer) that land after unmount.
    let alive = true
    let last = 0
    const frame = (now: number) => {
      raf.current = null
      if (!alive) return
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60)
      last = now
      const vals = v.current
      const [i1, i2, i3] = palette(vals.palette)
      u.uInk.value.copy(hexToVec3(colour(i1)))
      u.uInk2.value.copy(hexToVec3(colour(i2)))
      u.uInk3.value.copy(hexToVec3(colour(i3)))
      u.uPaper.value.copy(hexToVec3(String(vals.paper)))
      u.uHueByForm.value = Number(vals.hue)
      u.uPitch.value = Number(vals.pitch)
      u.uCoverage.value = Number(vals.coverage)
      u.uInkAlpha.value = Number(vals.inkAlpha)
      if (vals.latent !== undefined) u.uLatent.value = LATENT[String(vals.latent)] ?? 0
      u.uTime.value = now / 1000
      // Arrival: once per mount, after fonts are in and the lines are measured, the ruling
      // eases in over 450 ms (ease-out cubic). Reduced motion shows it at once.
      if (rm.current) u.uEntrance.value = 1
      else if (entranceStart.current > 0) {
        const t = Math.min(1, (now - entranceStart.current) / 450)
        u.uEntrance.value = 1 - Math.pow(1 - t, 3)
      }
      u.uAngle.value = (Number(vals.angle) * Math.PI) / 180
      const hs = u.uHiStyle.value as number[]
      const head = HIGHLIGHT[String(vals.highlight)] ?? 0
      const sub = HIGHLIGHT[String(vals.hiSub)] ?? 0
      for (let i = 0; i < MAX_MASK; i++) hs[i] = lineKind.current[i] === 'sub' ? sub : head
      u.uHiStrength.value = Number(vals.hiStrength)
      u.uHiInk.value = Number(vals.hiInk)
      u.uHiPad.value = Number(vals.hiPad)
      u.uHiRadius.value = Number(vals.hiRadius)
      u.uHiGap.value = Number(vals.hiGap)
      u.uHiColor.value.copy(hexToVec3(colour(highlightHex(vals))))
      // Broad fade across the copy column: from the copy's left edge to well past its right edge.
      const cr = copyRect.current
      u.uCopyFade.value.set(cr.x0, cr.x1 + size.current.w * 0.18, 1 - Number(vals.copyFade))
      u.uCopyCol.value.set(cr.x0, cr.x1, copySpan.current.top, copySpan.current.bottom)
      // Glyph layer: cells on the page lattice, rows anchored to the bottom edge; the clock stops
      // (at 0) under reduced motion so the frame is a composed still.
      const org = cellOrigin(cr.x0, size.current.h)
      u.uCellOrigin.value.set(org.x, org.y)
      u.uGlyphCenter.value.set((size.current.w / 2 - org.x) / CELL, (size.current.h / 2 - org.y) / CELL)
      u.uGlyphs.value = vals.glyphs === false ? 0 : 1
      u.uGlyphRest.value = Number(vals.glyphRest)
      u.uGlyphWake.value = Number(vals.glyphWake)
      u.uGlyphMutate.value = Number(vals.glyphMutate)
      u.uGlyphInkMax.value = Number(vals.glyphInkMax)
      u.uGlyphDeepen.value = Number(vals.glyphDeepen)
      u.uGlyphScale.value = Number(vals.glyphScale)
      u.uGlyphChurn.value = Number(vals.glyphChurn)
      u.uGlyphRestTop.value = Number(vals.glyphRestTop)
      u.uGlyphRain.value = Number(vals.glyphRain)
      u.uInkDeep.value.copy(hexToVec3(colour('@accent-deep')))
      if (rm.current) glyphClock.current = 0
      else glyphClock.current = (glyphClock.current + dt * Number(vals.glyphSpeed)) % 3600
      u.uGlyphT.value = glyphClock.current

      const moving = stepRef.current({ u, dt, now, w: size.current.w, h: size.current.h, values: vals, reducedMotion: rm.current })
      renderer.render(scene, camera)
      if (moving && !rm.current && activeRef.current) raf.current = requestAnimationFrame(frame)
      else last = 0
    }
    kick.current = () => {
      if (raf.current === null) raf.current = requestAnimationFrame(frame)
    }

    let pending = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(resize)
    })
    ro.observe(section)
    resize()
    document.fonts.ready.then(() => {
      if (!alive) return
      resize()
      if (entranceStart.current === 0) entranceStart.current = performance.now()
      kick.current()
    })

    const onLost = (e: Event) => {
      e.preventDefault()
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      raf.current = null
      ro.disconnect()
      kick.current = () => {}
      setGlFailed(true)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    // Site palette switch (dev preview): re-resolve tokens and redraw.
    const mo = new MutationObserver(() => {
      resetTokens()
      kick.current()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-palette'] })

    return () => {
      alive = false
      kick.current = () => {}
      mo.disconnect()
      ro.disconnect()
      cancelAnimationFrame(pending)
      canvas.removeEventListener('webglcontextlost', onLost)
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      raf.current = null
      mesh.geometry.dispose()
      material.dispose()
      blank.dispose()
      renderer.dispose()
    }
  }, [sectionRef, copyRef, canvasRef, v, rm, activeRef, stepRef])

  useEffect(() => {
    kick.current()
  }, [values, reducedMotion, active])

  return { kick, glFailed, size }
}

export interface PointerState {
  x: number
  y: number
  inside: boolean
  down: boolean
  /** Smoothed speed, CSS px per second. */
  speed: number
  /** Last movement, CSS px, consumed by the field (wake deposits). */
  path: { x0: number; y0: number; x1: number; y1: number }[]
  /** Quick stationary touch taps, CSS px, consumed by the field. */
  taps: { x: number; y: number }[]
}

/**
 * Pointer model. Mouse: enter/leave and press. Touch: a finger
 * that stays 120 ms becomes the pointer and a 450 ms hold is a press, so a scroll (which
 * cancels within ~100 ms) never disturbs the page.
 */
export function usePointer(sectionRef: RefObject<HTMLElement>, kick: RefObject<() => void>) {
  const state = useRef<PointerState>({ x: 0, y: 0, inside: false, down: false, speed: 0, path: [], taps: [] })
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const P = state.current
    let lastT = 0
    let touchTimer: number | undefined
    let holdTimer: number | undefined
    let liftTimer: number | undefined
    // A tap is a touch that ends within 250 ms and 8 px, not on a link or button.
    let tap: { x: number; y: number; t: number; far: boolean } | null = null
    const go = () => kick.current?.()

    const at = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const move = (e: PointerEvent) => {
      if (tap && e.pointerType === 'touch') {
        const q = at(e)
        if (Math.hypot(q.x - tap.x, q.y - tap.y) > 8) tap.far = true
      }
      if (!P.inside) return
      const q = at(e)
      const now = performance.now()
      const dt = Math.max(1, now - lastT) / 1000
      const d = Math.hypot(q.x - P.x, q.y - P.y)
      P.speed += (Math.min(4000, d / dt) - P.speed) * 0.35
      P.path.push({ x0: P.x, y0: P.y, x1: q.x, y1: q.y })
      if (P.path.length > 32) P.path.shift()
      P.x = q.x
      P.y = q.y
      lastT = now
      go()
    }
    const enter = (e: PointerEvent) => {
      const q = at(e)
      P.x = q.x
      P.y = q.y
      P.inside = true
      lastT = performance.now()
      go()
    }
    const lift = () => {
      tap = null
      window.clearTimeout(touchTimer)
      window.clearTimeout(holdTimer)
      P.inside = false
      P.down = false
      go()
    }
    const onEnter = (e: PointerEvent) => e.pointerType !== 'touch' && enter(e)
    const onLeave = (e: PointerEvent) => e.pointerType !== 'touch' && lift()
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        P.down = true
        go()
        return
      }
      const q = at(e)
      const onControl = (e.target as HTMLElement | null)?.closest('a, button')
      tap = onControl ? null : { x: q.x, y: q.y, t: performance.now(), far: false }
      touchTimer = window.setTimeout(() => enter(e), 120)
      holdTimer = window.setTimeout(() => {
        P.down = true
        go()
      }, 450)
    }
    const onUp = (e: PointerEvent) => {
      P.down = false
      if (e.pointerType === 'touch') {
        window.clearTimeout(touchTimer)
        window.clearTimeout(holdTimer)
        if (tap && !tap.far && performance.now() - tap.t < 250) {
          P.taps.push({ x: tap.x, y: tap.y })
          if (P.taps.length > 8) P.taps.shift()
        }
        tap = null
        window.clearTimeout(liftTimer)
        if (P.inside) liftTimer = window.setTimeout(lift, 1800)
      }
      go()
    }
    section.addEventListener('pointerenter', onEnter)
    section.addEventListener('pointerleave', onLeave)
    section.addEventListener('pointerdown', onDown)
    section.addEventListener('pointermove', move, { passive: true })
    section.addEventListener('pointercancel', lift)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.clearTimeout(touchTimer)
      window.clearTimeout(holdTimer)
      window.clearTimeout(liftTimer)
      section.removeEventListener('pointerenter', onEnter)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('pointerdown', onDown)
      section.removeEventListener('pointermove', move)
      section.removeEventListener('pointercancel', lift)
      window.removeEventListener('pointerup', onUp)
    }
  }, [sectionRef, kick])
  return state
}

/** Where the latent form sits by default: the open space right of (or below) the copy. */
export function restForm(w: number, h: number) {
  const wide = w > 1024
  return wide
    ? { x: w * 0.74, y: h * 0.5, r: Math.min(h * 0.62, w * 0.3) }
    : { x: w * 0.6, y: h * 0.82, r: w * 0.55 }
}

export interface Ambient {
  t: number
  drift: number
  energy: number
}

export function newAmbient(): Ambient {
  return { t: 0, drift: 0, energy: 0 }
}

/**
 * Always-on motion, intensified by the hand. Energy rises quickly with pointer speed
 * (and a press) and falls off slowly; the fringe flow and breathing speed up with it.
 * Integrates rates rather than scaling time, so changing speed never makes the field jump.
 * Returns the breathing turn (deg) and the form's wander offset (CSS px).
 */
export function stepAmbient(A: Ambient, P: PointerState | undefined, f: Frame) {
  const vals = f.values
  if (P) P.speed *= Math.pow(0.02, f.dt)
  const goal = P && P.inside ? Math.min(1, P.speed / Number(vals.speedFull) + (P.down ? 0.5 : 0)) : 0
  const rate = goal > A.energy ? 1 - Math.exp(-Number(vals.attack) * f.dt) : 1 - Math.exp(-f.dt / Number(vals.release))
  A.energy += (Math.min(1, goal) - A.energy) * rate
  const boost = 1 + Number(vals.flowBoost) * A.energy
  A.t += f.dt * (1 + A.energy)
  A.drift += Number(vals.flow) * boost * f.dt
  A.drift %= 1000
  const breath = Number(vals.breath) * (1 + A.energy) * Math.sin((2 * Math.PI * A.t) / Number(vals.breathPeriod))
  const wr = Number(vals.wander) * f.w
  const wx = wr * Math.sin((2 * Math.PI * A.t) / 23)
  const wy = wr * 0.6 * Math.sin((2 * Math.PI * A.t) / 31 + 1.3)
  f.u.uDrift.value = A.drift
  f.u.uEnergy.value = A.energy
  return { breath, wx, wy }
}
