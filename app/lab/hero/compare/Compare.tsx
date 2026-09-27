'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Compare page for the four glyph upgrades (spec amendment 2026-09-26): the base hero beside each
 * upgrade on its own and all four combined, plus a "Mine" tile built from any combination. Each tile
 * is the lab in an iframe (embed=1); "Open in lab" loads the same toggles with the panel.
 */

const FX = [
  { key: 'fxFringe', label: 'Fringes', note: 'rest glyphs follow the moiré’s interference bands' },
  { key: 'fxFlurry', label: 'Flurries', note: 'each cell holds, then bursts through quick swaps' },
  { key: 'fxWrite', label: 'Writing streams', note: 'a passing head leaves glyphs that fade over 1 to 3 s' },
  { key: 'fxEdges', label: 'Wave edges', note: 'the burst’s expanding edge draws a ring' },
] as const

type FxKey = (typeof FX)[number]['key']

const TILES: { title: string; note: string; on: FxKey[] }[] = [
  { title: 'Base', note: 'the locked look, no upgrades', on: [] },
  ...FX.map(f => ({ title: `+ ${f.label}`, note: f.note, on: [f.key] as FxKey[] })),
  { title: 'All four', note: 'every upgrade combined', on: FX.map(f => f.key) },
]

const VIEWPORTS = [
  { id: '720', w: 720, h: 450, label: '720 × 450' },
  { id: '1440', w: 1440, h: 900, label: '1440 × 900 (desktop layout)' },
]

function labUrl(on: FxKey[], embed: boolean) {
  const q = new URLSearchParams({ v: 'moire-wake' })
  if (embed) q.set('embed', '1')
  for (const k of on) q.set(`p.${k}`, '1')
  return `/lab/hero?${q.toString()}`
}

export default function Compare() {
  const [mine, setMine] = useState<FxKey[]>(['fxFringe', 'fxFlurry'])
  const [vpId, setVpId] = useState('720')
  const [reload, setReload] = useState(0)
  const vp = VIEWPORTS.find(v => v.id === vpId) ?? VIEWPORTS[0]

  // Two tiles per row: the scale fits the tile viewport to half the grid's width.
  const grid = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  useEffect(() => {
    const el = grid.current
    if (!el) return
    const fit = () => setScale(Math.min(1, (el.clientWidth - GAP) / 2 / vp.w))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [vp.w])

  const toggle = (k: FxKey) => setMine(m => (m.includes(k) ? m.filter(x => x !== k) : FX.map(f => f.key).filter(x => x === k || m.includes(x))))
  const mineTitle = mine.length ? FX.filter(f => mine.includes(f.key)).map(f => f.label).join(' + ') : 'Base'

  return (
    <main className="pt-20 pb-16 min-h-screen font-mono text-[12px] leading-[1.5] text-text-primary">
      <div className="px-4 md:px-8 space-y-4">
        <header className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-4">
          <h1 className="text-[14px] font-medium">Glyph upgrades, side by side</h1>
          <span className="text-text-secondary">Hover or drag in a tile to start a burst; each tile runs its own hero.</span>
        </header>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border-subtle py-3">
          <span className="uppercase tracking-[0.08em] text-text-secondary">Mine</span>
          {FX.map(f => (
            <label key={f.key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={mine.includes(f.key)} onChange={() => toggle(f.key)} className="accent-[#338467]" />
              {f.label}
            </label>
          ))}
          <span className="flex-1" />
          <label className="flex items-center gap-2">
            <span className="text-text-secondary">Tile viewport</span>
            <select value={vpId} onChange={e => setVpId(e.target.value)} className="bg-transparent border border-border-subtle px-1 py-[2px]">
              {VIEWPORTS.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => setReload(r => r + 1)} className="border border-border-subtle px-2 py-[2px] hover:border-text-primary">
            Restart all
          </button>
        </div>

        <div ref={grid} className="grid grid-cols-2" style={{ gap: GAP }}>
          <Tile title={`Mine: ${mineTitle}`} note="any combination, from the checkboxes above" on={mine} vp={vp} scale={scale} reload={reload} highlight />
          {TILES.map(t => (
            <Tile key={t.title} title={t.title} note={t.note} on={t.on} vp={vp} scale={scale} reload={reload} />
          ))}
        </div>
      </div>
    </main>
  )
}

const GAP = 16

function Tile({
  title,
  note,
  on,
  vp,
  scale,
  reload,
  highlight,
}: {
  title: string
  note: string
  on: FxKey[]
  vp: { w: number; h: number }
  scale: number
  reload: number
  highlight?: boolean
}) {
  const src = labUrl(on, true)
  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline gap-3 pb-2">
        <span className={`font-medium ${highlight ? 'text-accent' : ''}`}>{title}</span>
        <span className="text-text-secondary truncate flex-1">{note}</span>
        <a href={labUrl(on, false)} target="_blank" rel="noreferrer" className="underline underline-offset-2 shrink-0 hover:text-accent">
          Open in lab
        </a>
      </figcaption>
      <div className="relative overflow-hidden border border-border-subtle" style={{ width: vp.w * scale, height: vp.h * scale }}>
        <iframe
          key={`${src}-${vp.w}-${reload}`}
          src={src}
          title={title}
          className="absolute left-0 top-0 border-0 origin-top-left"
          style={{ width: vp.w, height: vp.h, transform: `scale(${scale})` }}
        />
      </div>
    </figure>
  )
}
