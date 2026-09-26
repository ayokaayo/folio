'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Grid lab. Renders a page in iframes at real device widths (so media queries fire as they
 * would on the device) and audits every `.lattice` container inside: the content box must
 * start on a whole pixel and every direct child edge must sit on the 16px lattice.
 * "Overlay" draws a hard red 16px lattice from each container's origin to compare by eye.
 */

const PAGES = ['/', '/work', '/projects', '/about']
const WIDTHS = [1920, 1440, 1366, 1280, 1024, 834, 768, 430, 390, 375, 360]
const CELL = 16

interface Audit {
  containers: number
  bad: string[]
  content: number
  margin: number
}

function audit(doc: Document): Audit {
  const bad: string[] = []
  const win = doc.defaultView!
  const cols = parseInt(win.getComputedStyle(doc.documentElement).getPropertyValue('--grid-columns'), 10) || 12
  const els = Array.from(doc.querySelectorAll<HTMLElement>('.lattice'))
  const off = (x: number) => {
    const o = ((x % CELL) + CELL) % CELL
    return Math.min(o, CELL - o)
  }
  let content = 0
  let margin = 0
  els.forEach((el, i) => {
    const cs = win.getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const origin = r.left + parseFloat(cs.paddingLeft)
    const w = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    if (i === 0) {
      content = w
      margin = origin
    }
    const tag = `#${i} ${el.tagName.toLowerCase()}`
    if (Math.abs(origin - Math.round(origin)) > 0.01) bad.push(`${tag} origin ${origin.toFixed(2)}`)
    // W = 16·(cols·n − 1): every column a whole number of cells, every gutter one cell.
    if (Math.abs(((w + CELL) / (cols * CELL)) % 1) > 0.01) bad.push(`${tag} width ${w.toFixed(2)}`)
    // Every track of a grid or flex row with a 16px gutter, at any depth, must start and end on a line.
    el.querySelectorAll<HTMLElement>('*').forEach(parent => {
      if (parent.closest('[data-lattice-overlay]')) return
      const ps = win.getComputedStyle(parent)
      const tracks = ps.display.includes('grid') || (ps.display.includes('flex') && !ps.flexDirection.startsWith('column'))
      if (!tracks || ps.columnGap !== '16px') return
      Array.from(parent.children).forEach((c, j) => {
        const cr = (c as HTMLElement).getBoundingClientRect()
        if (!cr.width) return
        // A bordered box overhangs by its right border, so that border line is what must sit on the lattice.
        const right = cr.right - parseFloat(win.getComputedStyle(c).borderRightWidth)
        if (off(cr.left - origin) > 0.05 || off(right - origin) > 0.05)
          bad.push(`${tag} track ${j} ${(cr.left - origin).toFixed(1)}..${(cr.right - origin).toFixed(1)}`)
      })
    })
    el.querySelectorAll<HTMLElement>('.cta-2col').forEach(c => {
      const cr = c.getBoundingClientRect()
      if (off(cr.left - origin) > 0.05 || off(cr.right - origin) > 0.05) bad.push(`${tag} cta ${(cr.right - origin).toFixed(1)}`)
    })
  })
  return { containers: els.length, bad, content, margin }
}

function overlay(doc: Document, on: boolean) {
  doc.querySelectorAll('[data-lattice-overlay]').forEach(n => n.remove())
  if (!on) return
  doc.querySelectorAll<HTMLElement>('.lattice').forEach(el => {
    const cs = doc.defaultView!.getComputedStyle(el)
    if (cs.position === 'static') el.style.position = 'relative'
    const o = doc.createElement('div')
    o.setAttribute('data-lattice-overlay', '')
    Object.assign(o.style, {
      position: 'absolute', top: '0', bottom: '0', pointerEvents: 'none', zIndex: '9999',
      // One pixel past the content box so the closing line lands at [W, W + 1), like the paper's.
      left: cs.paddingLeft, right: `calc(${cs.paddingRight} - 1px)`,
      backgroundImage: `linear-gradient(to right, rgba(255,0,0,.45) 1px, transparent 1px)`,
      backgroundSize: `${CELL}px 100%`,
    })
    el.appendChild(o)
  })
}

function Frame({ path, width, scale, showOverlay }: { path: string; width: number; scale: number; showOverlay: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [result, setResult] = useState<Audit | null>(null)
  const height = 1100

  const run = useCallback(() => {
    const doc = ref.current?.contentDocument
    if (!doc) return
    overlay(doc, showOverlay)
    setResult(audit(doc))
  }, [showOverlay])

  useEffect(() => {
    run()
    const t = setInterval(run, 1500)
    return () => clearInterval(t)
  }, [run])

  const ok = result && result.containers > 0 && result.bad.length === 0
  return (
    <figure className="shrink-0" style={{ width: width * scale }}>
      <figcaption className="font-mono text-[11px] mb-2 flex justify-between gap-2">
        <span>{width}px</span>
        <span style={{ color: result ? (ok ? '#2F6B4F' : '#B3261E') : '#888' }}>
          {result ? (ok ? `✓ ${result.containers} aligned · ${result.content}px · m ${result.margin}` : `✗ ${result.bad.length}`) : '…'}
        </span>
      </figcaption>
      <div style={{ width: width * scale, height: height * scale, overflow: 'hidden', border: '1px solid #ddd' }}>
        <iframe
          ref={ref}
          src={path}
          onLoad={run}
          style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0', border: 0 }}
        />
      </div>
      {result && result.bad.length > 0 && (
        <pre className="font-mono text-[10px] mt-1 whitespace-pre-wrap" style={{ color: '#B3261E' }}>
          {result.bad.slice(0, 8).join('\n')}
        </pre>
      )}
    </figure>
  )
}

export default function GridLab() {
  const [path, setPath] = useState('/')
  const [showOverlay, setShowOverlay] = useState(true)
  const [scale, setScale] = useState(0.3)

  return (
    <main className="p-6 font-mono text-[12px]" style={{ background: '#fff', minHeight: '100vh' }}>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <strong>Grid lab</strong>
        {PAGES.map(p => (
          <button key={p} onClick={() => setPath(p)} className="px-2 py-1 border" style={{ background: p === path ? '#111' : '#fff', color: p === path ? '#fff' : '#111' }}>
            {p}
          </button>
        ))}
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={showOverlay} onChange={e => setShowOverlay(e.target.checked)} /> red lattice overlay
        </label>
        <label className="flex items-center gap-1">
          scale <input type="range" min={0.2} max={1} step={0.05} value={scale} onChange={e => setScale(Number(e.target.value))} /> {scale}
        </label>
      </div>
      <div className="flex flex-wrap gap-6 items-start">
        {WIDTHS.map(w => (
          <Frame key={`${path}-${w}`} path={path} width={w} scale={scale} showOverlay={showOverlay} />
        ))}
      </div>
    </main>
  )
}
