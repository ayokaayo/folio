'use client'

import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import MillimetricPaper from '@/components/MillimetricPaper'
import GridLabel, { GridLabelMuted } from '@/components/GridLabel'
import { GridRow } from '@/components/ExposedGrid'
import { REGISTRY } from './registry'
import { SITE_PALETTES, getSitePalette, setSitePalette, type SitePalette } from '@/lib/palette/preview'
import { HERO_COPY } from './shared/copy'
import type { Param, ParamValue, VariantProps } from './types'

/**
 * Hero lab gallery. The selected variant renders full-width exactly where the
 * live hero sits; a floating panel switches variants and tweaks parameters.
 * State lives in the URL (?v=id&p.key=value&rm=1&w=375) so tuned versions can be bookmarked.
 * `embed=1` hides the panel; the width presets use it to render the page in an iframe
 * so viewport media queries behave as they would on that device.
 */

const AUTHOR_LABEL = { baseline: 'Live today', claude: 'Claude', codex: 'Codex Astra', together: 'Claude × Codex' }
const WIDTHS = ['full', '1280', '1024', '768', '375']

function parseValue(param: Param, raw: string | null): ParamValue {
  if (raw === null) return param.default
  if (param.type === 'range') return Number.isFinite(Number(raw)) ? Number(raw) : param.default
  if (param.type === 'toggle') return raw === '1'
  return raw
}

function encodeValue(v: ParamValue) {
  return typeof v === 'boolean' ? (v ? '1' : '0') : String(v)
}

export default function Lab() {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  const variantId = search.get('v') ?? REGISTRY[REGISTRY.length - 1].meta.id
  const entry = REGISTRY.find(e => e.meta.id === variantId) ?? REGISTRY[0]
  const embed = search.get('embed') === '1'
  const width = search.get('w') ?? 'full'
  const forceReduced = search.get('rm') === '1'

  const [osReduced, setOsReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setOsReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const values = useMemo(() => {
    const out: Record<string, ParamValue> = {}
    for (const p of entry.meta.params) out[p.key] = parseValue(p, search.get(`p.${p.key}`))
    return out
  }, [entry, search])

  const [Comp, setComp] = useState<ComponentType<VariantProps> | null>(null)
  const [mountKey, setMountKey] = useState(0)
  useEffect(() => {
    let live = true
    setComp(null)
    entry.load().then(mod => live && setComp(() => mod.default))
    return () => {
      live = false
    }
  }, [entry])

  const update = useCallback(
    (mutate: (q: URLSearchParams) => void) => {
      const q = new URLSearchParams(search.toString())
      mutate(q)
      router.replace(`${pathname}?${q.toString()}`, { scroll: false })
    },
    [router, pathname, search],
  )

  const selectVariant = useCallback(
    (id: string) =>
      update(q => {
        for (const k of Array.from(q.keys())) if (k.startsWith('p.')) q.delete(k)
        q.set('v', id)
      }),
    [update],
  )

  // Keyboard: 1-9 pick a variant, \ toggles the panel, r remounts.
  const [panelOpen, setPanelOpen] = useState(true)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, select, textarea')) return
      if (e.key === '\\') setPanelOpen(o => !o)
      else if (e.key === 'r') setMountKey(k => k + 1)
      else if (/^[1-9]$/.test(e.key) && REGISTRY[Number(e.key) - 1]) selectVariant(REGISTRY[Number(e.key) - 1].meta.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectVariant])

  const reducedMotion = forceReduced || osReduced

  // Site-wide palette preview: persists across pages locally (see lib/palette/preview.ts).
  const [sitePalette, setPaletteState] = useState<SitePalette>('sage')
  useEffect(() => setPaletteState(getSitePalette()), [])
  const choosePalette = (p: SitePalette) => {
    setSitePalette(p)
    setPaletteState(p)
  }

  const iframeSrc = useMemo(() => {
    const q = new URLSearchParams(search.toString())
    q.set('embed', '1')
    q.delete('w')
    return `${pathname}?${q.toString()}`
  }, [pathname, search])

  const stage =
    width === 'full' || embed ? (
      <div key={`${entry.meta.id}-${mountKey}`}>
        {Comp ? (
          <Comp copy={HERO_COPY} values={values} reducedMotion={reducedMotion} />
        ) : (
          <div className="h-[520px]" />
        )}
        <NextSectionPeek />
      </div>
    ) : (
      <div className="flex justify-center py-6">
        <iframe
          key={`${iframeSrc}-${mountKey}`}
          src={iframeSrc}
          title="Viewport preview"
          className="border border-border-subtle bg-bg-primary"
          style={{ width: `${width}px`, height: 'calc(100vh - 140px)' }}
        />
      </div>
    )

  return (
    <main className="pt-20 min-h-screen">
      {stage}

      {!embed && (
        <aside
          className="fixed bottom-4 right-4 z-[100] w-[320px] max-h-[calc(100vh-112px)] flex flex-col font-mono text-[11px] leading-[1.45] text-[#e9e6df] rounded-[6px] border border-white/10 shadow-2xl"
          style={{ background: 'rgba(24,24,26,0.94)', backdropFilter: 'blur(8px)' }}
        >
          <button
            onClick={() => setPanelOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2 border-b border-white/10 uppercase tracking-[0.08em] text-white/60 hover:text-white"
          >
            <span>Hero lab</span>
            <span>{panelOpen ? '− \\' : '+ \\'}</span>
          </button>

          {panelOpen && (
            <div className="p-3 space-y-4 overflow-auto min-h-0">
              <ol className="space-y-[2px] sticky -top-3 -mx-3 -mt-3 px-3 pt-3 pb-2 z-10" style={{ background: 'rgb(24,24,26)' }}>
                {REGISTRY.map((e, i) => {
                  const active = e.meta.id === entry.meta.id
                  return (
                    <li key={e.meta.id}>
                      <button
                        onClick={() => selectVariant(e.meta.id)}
                        className={`w-full text-left px-2 py-[6px] rounded-[3px] flex gap-2 ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                      >
                        <span className="text-white/30 w-3">{i + 1}</span>
                        <span className="flex-1">{e.meta.title}</span>
                        <span className="text-white/35">{AUTHOR_LABEL[e.meta.author]}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>

              <p className="text-white/55">{entry.meta.concept}</p>

              {entry.meta.params.length > 0 && (
                <div className="space-y-3 pt-1">
                  {entry.meta.params.map(p => (
                    <Control
                      key={p.key}
                      param={p}
                      value={values[p.key]}
                      onChange={v => update(q => q.set(`p.${p.key}`, encodeValue(v)))}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 pt-1">
                <span className="text-white/50 mr-1">Site palette</span>
                {SITE_PALETTES.map(p => (
                  <PanelButton key={p} active={sitePalette === p} onClick={() => choosePalette(p)}>
                    {p}
                  </PanelButton>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {WIDTHS.map(w => (
                  <button
                    key={w}
                    onClick={() => update(q => (w === 'full' ? q.delete('w') : q.set('w', w)))}
                    className={`px-2 py-1 rounded-[3px] border ${width === w ? 'border-white/40 text-white' : 'border-white/10 text-white/50 hover:text-white'}`}
                  >
                    {w === 'full' ? 'Full' : w}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                <PanelButton
                  active={forceReduced}
                  onClick={() => update(q => (forceReduced ? q.delete('rm') : q.set('rm', '1')))}
                >
                  Reduced motion{osReduced ? ' (OS on)' : ''}
                </PanelButton>
                <PanelButton onClick={() => setMountKey(k => k + 1)}>Remount (r)</PanelButton>
                <PanelButton
                  onClick={() =>
                    update(q => {
                      for (const k of Array.from(q.keys())) if (k.startsWith('p.')) q.delete(k)
                    })
                  }
                >
                  Reset
                </PanelButton>
                <PanelButton onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copy link</PanelButton>
              </div>
            </div>
          )}
        </aside>
      )}
    </main>
  )
}

function PanelButton({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-[3px] border ${active ? 'border-[#C9A227] text-[#E3C45A]' : 'border-white/10 text-white/60 hover:text-white'}`}
    >
      {children}
    </button>
  )
}

function Control({ param, value, onChange }: { param: Param; value: ParamValue; onChange: (v: ParamValue) => void }) {
  const label = (
    <div className="flex justify-between text-white/60 mb-1">
      <span>{param.label}</span>
      <span className="text-white/85 tabular-nums">{typeof value === 'number' ? +value.toFixed(3) : String(value)}</span>
    </div>
  )
  if (param.type === 'range')
    return (
      <label className="block">
        {label}
        <input
          type="range"
          min={param.min}
          max={param.max}
          step={param.step}
          value={Number(value)}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full accent-[#C9A227]"
        />
      </label>
    )
  if (param.type === 'color')
    return (
      <label className="flex items-center justify-between text-white/60">
        <span>{param.label}</span>
        <input type="color" value={String(value)} onChange={e => onChange(e.target.value)} className="w-8 h-5 bg-transparent" />
      </label>
    )
  if (param.type === 'toggle')
    return (
      <label className="flex items-center justify-between text-white/60">
        <span>{param.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)} className="accent-[#C9A227]" />
      </label>
    )
  return (
    <label className="flex items-center justify-between text-white/60">
      <span>{param.label}</span>
      <select value={String(value)} onChange={e => onChange(e.target.value)} className="bg-white/10 text-white px-1 py-[2px] rounded-[3px]">
        {param.options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

/** The top of the section that follows the hero on the live home page, for context. */
function NextSectionPeek() {
  return (
    <section className="relative" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
      {/* The grid fades in over 48px so it meets the hero's field instead of starting on a hard edge. */}
      <div
        className="absolute inset-0"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 48px)', maskImage: 'linear-gradient(to bottom, transparent, #000 48px)' }}
      >
        <MillimetricPaper opacity={0.5} zIndex={0} />
      </div>
      <div className="relative z-10">
        <GridRow style={{ marginBottom: '49px', height: '32px', alignItems: 'center' }}>
          <div className="flex-[3_3_32px] sm:flex-[4_4_48px] lg:flex-[8_8_112px]">
            <GridLabel size="md">Side Projects</GridLabel>
          </div>
          <div className="flex-[1_1_0px] sm:flex-[2_2_16px] lg:flex-[4_4_48px] text-right">
            <GridLabelMuted size="md">005</GridLabelMuted>
          </div>
        </GridRow>
        <div className="h-[240px]" />
      </div>
    </section>
  )
}
