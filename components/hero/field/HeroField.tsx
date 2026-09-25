'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { RefObject } from 'react'
import type { HeroValues } from '../settings'
import { newAmbient, restForm, stepAmbient, useMoire, usePointer, type Frame } from './engine'

const DEG = Math.PI / 180
const CELL = 10 // CSS px per field cell

/** 2D damped wave equation on a coarse grid, uploaded as a texture (R height, G energy). */
class WaveField {
  cols = 1
  rows = 1
  h = new Float32Array(1)
  prev = new Float32Array(1)
  energy = new Float32Array(1)
  bytes = new Uint8Array(4)
  texture = new THREE.DataTexture(this.bytes, 1, 1)

  resize(w: number, h: number) {
    const cols = Math.max(2, Math.ceil(w / CELL) + 1)
    const rows = Math.max(2, Math.ceil(h / CELL) + 1)
    if (cols === this.cols && rows === this.rows) return
    this.cols = cols
    this.rows = rows
    this.h = new Float32Array(cols * rows)
    this.prev = new Float32Array(cols * rows)
    this.energy = new Float32Array(cols * rows)
    this.bytes = new Uint8Array(cols * rows * 4)
    this.texture.dispose()
    this.texture = new THREE.DataTexture(this.bytes, cols, rows)
    this.texture.magFilter = THREE.LinearFilter
    this.texture.minFilter = THREE.LinearFilter
    this.upload()
  }

  /** Push the surface down along a segment, in CSS px. */
  deposit(x0: number, y0: number, x1: number, y1: number, amount: number) {
    const len = Math.hypot(x1 - x0, y1 - y0)
    const n = Math.max(1, Math.ceil(len / (CELL * 0.75)))
    const per = amount / n
    for (let k = 1; k <= n; k++) {
      const t = k / n
      const cx = (x0 + (x1 - x0) * t) / CELL
      const cy = (y0 + (y1 - y0) * t) / CELL
      for (let j = Math.floor(cy) - 2; j <= Math.ceil(cy) + 2; j++) {
        for (let i = Math.floor(cx) - 2; i <= Math.ceil(cx) + 2; i++) {
          if (i < 1 || j < 1 || i >= this.cols - 1 || j >= this.rows - 1) continue
          const d2 = (i - cx) ** 2 + (j - cy) ** 2
          this.h[j * this.cols + i] -= per * Math.exp(-d2 / 1.6)
        }
      }
    }
  }

  /** Flatten the surface (used when reduced motion takes over mid-visit). */
  clear() {
    this.h.fill(0)
    this.prev.fill(0)
    this.energy.fill(0)
    this.upload()
  }

  /** One step of the damped wave equation. */
  step(c2: number, damping: number) {
    const { cols, rows, h, prev, energy } = this
    for (let j = 1; j < rows - 1; j++) {
      for (let i = 1; i < cols - 1; i++) {
        const k = j * cols + i
        const lap = h[k - 1] + h[k + 1] + h[k - cols] + h[k + cols] - 4 * h[k]
        const next = (2 * h[k] - prev[k] + c2 * lap) * damping
        prev[k] = next // swap below
        const a = Math.abs(next)
        energy[k] = Math.max(energy[k] * 0.965, Math.min(1, a * 3))
      }
    }
    // prev now holds next; rotate buffers.
    const t = this.h
    this.h = this.prev
    this.prev = t
  }

  upload() {
    const { h, energy, bytes } = this
    for (let k = 0; k < h.length; k++) {
      // Row 0 of the texture is the bottom of the page in GL; flip rows.
      const j = Math.floor(k / this.cols)
      const i = k - j * this.cols
      const o = ((this.rows - 1 - j) * this.cols + i) * 4
      bytes[o] = Math.max(0, Math.min(255, 128 + h[k] * 127))
      bytes[o + 1] = Math.max(0, Math.min(255, energy[k] * 255))
      bytes[o + 2] = 0
      bytes[o + 3] = 255
    }
    this.texture.needsUpdate = true
  }
}

export interface HeroFieldProps {
  sectionRef: RefObject<HTMLElement>
  copyRef: RefObject<HTMLDivElement>
  values: HeroValues
  reducedMotion: boolean
}

/**
 * The hero's WebGL layer: two line screens over a damped wave surface the pointer disturbs.
 * Renders only the canvas; HeroSection owns the copy and loads this lazily.
 */
export default function HeroField({ sectionRef, copyRef, values, reducedMotion }: HeroFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const field = useRef<WaveField>(null as unknown as WaveField)
  field.current ??= new WaveField()
  const pointer = useRef<ReturnType<typeof usePointer> | null>(null)
  const acc = useRef(0)
  const ambient = useRef(newAmbient())
  const wasStill = useRef(false)

  useEffect(() => {
    const f = field.current
    return () => f.texture.dispose()
  }, [])

  const step = (f: Frame) => {
    const { u, dt, w, h, values: vals, reducedMotion: still } = f
    const F = field.current
    const P = pointer.current?.current
    F.resize(w, h)
    let breath = 0
    let wx = 0
    let wy = 0
    // Entering reduced motion shows a composed still, not whatever wave was in flight.
    if (still && !wasStill.current) {
      F.clear()
      acc.current = 0
      if (P) {
        P.path.length = 0
        P.taps.length = 0
      }
      Object.assign(ambient.current, newAmbient())
      u.uDrift.value = 0
      u.uEnergy.value = 0
    }
    wasStill.current = still
    if (!still && P) {
      ;({ breath, wx, wy } = stepAmbient(ambient.current, P, f))
      const imp = Number(vals.impulse) * (P.down ? 2.2 : 1)
      for (const s of P.path) {
        const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0)
        F.deposit(s.x0, s.y0, s.x1, s.y1, imp * Math.min(1.5, len / 30))
      }
      P.path.length = 0
      // A quick tap on touch drops one small ripple.
      for (const t of P.taps) F.deposit(t.x, t.y, t.x, t.y, Number(vals.impulse) * 0.35)
      P.taps.length = 0
      if (P.down && P.inside) F.deposit(P.x, P.y, P.x, P.y, imp * 0.15)
      // Fixed 120 Hz simulation, independent of display rate.
      acc.current += dt
      while (acc.current >= 1 / 120) {
        F.step(Number(vals.waveSpeed), Number(vals.damping))
        acc.current -= 1 / 120
      }
      F.upload()
    }
    const rest = restForm(w, h)
    u.uTheta.value = (Number(vals.restAngle) + breath) * DEG
    u.uScale.value = 1
    u.uCenter.value.set(rest.x + wx, rest.y + wy)
    u.uRadius.value = rest.r
    u.uLatentAmp.value = Number(vals.latentAmp)
    u.uField.value = F.texture
    u.uFieldAmp.value = Number(vals.fieldAmp)
    u.uFieldTexel.value.set(CELL, CELL)
    u.uHueByEnergy.value = Number(vals.energyHue)
    u.uPivot.value.set(w / 2, h / 2)
    return !still
  }

  const m = useMoire({ sectionRef, copyRef, canvasRef, values, reducedMotion, step })
  pointer.current = usePointer(sectionRef, m.kick)

  if (m.glFailed) return null
  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full block" />
}
