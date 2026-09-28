'use client'

/**
 * Contact lab: three directions for the footer contact form, side by side. Each one sits in a mock
 * of the footer's Contact column (4 of 12 lattice columns, 432px at 1440) under the masked email,
 * Copy and LinkedIn, then again at phone width (358px). Every instance has its own draft and
 * toggles for the Sent and Error states. Nothing here is ever sent.
 */

import { useId, useState, type ComponentType } from 'react'
import GridLabel from '@/components/GridLabel'
import { SITE } from '@/lib/constants'
import Letter from './variants/Letter'
import Blueprint from './variants/Blueprint'
import Folded from './variants/Folded'
import { useDraft, type Preview, type VariantProps } from './variants/shared'

interface Direction {
  key: string
  letter: string
  name: string
  rationale: string
  Component: ComponentType<VariantProps>
}

const DIRECTIONS: Direction[] = [
  {
    key: 'a',
    letter: 'A',
    name: 'A letter you fill in',
    rationale: 'Reads as a note to a person, not a form, so writing to me feels like a conversation.',
    Component: Letter,
  },
  {
    key: 'b',
    letter: 'B',
    name: 'Blueprint fields on the paper',
    rationale: 'The form is drawn on the same 16px grid as the rest of the site, precise and technical.',
    Component: Blueprint,
  },
  {
    key: 'c',
    letter: 'C',
    name: 'Folded: one line that opens',
    rationale: 'The footer stays as quiet as it is today; the form appears only for those who ask for it.',
    Component: Folded,
  },
]

const PREVIEWS: { value: Preview; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'sent', label: 'Sent' },
  { value: 'error', label: 'Error' },
]

/** The Contact column's own content above the form, as in components/Footer.tsx. */
function ColumnHead() {
  const [copied, setCopied] = useState(false)
  return (
    <>
      <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">Contact</h3>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-body text-text-primary">*****@miguelangelo.tech</span>
          <button
            type="button"
            onClick={() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="font-mono text-caption uppercase tracking-wide text-white bg-accent hover:bg-accent-hover px-3 py-1.5 rounded transition-colors duration-150"
            aria-label="Copy email to clipboard (mock)"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <a
          href={SITE.LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-mono text-label uppercase tracking-wide text-[var(--quiet-text)] bg-[var(--quiet-bg)] border border-[var(--quiet-border)] px-3 py-1.5 rounded hover:bg-[var(--quiet-bg-hover)] hover:border-[var(--quiet-border-hover)] hover:text-[var(--quiet-text-hover)] transition-all duration-150"
        >
          LinkedIn
          <span className="text-[var(--quiet-arrow)] group-hover:text-[var(--quiet-text-hover)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </>
  )
}

function Controls({ draft, label }: { draft: ReturnType<typeof useDraft>; label: string }) {
  const current: Preview = draft.status === 'sent' ? 'sent' : draft.status === 'error' ? 'error' : 'live'
  return (
    <div className="cl-controls" role="group" aria-label={`Preview controls for ${label}`}>
      <div className="cl-seg">
        {PREVIEWS.map(p => (
          <button key={p.value} type="button" aria-pressed={current === p.value} onClick={() => draft.preview(p.value)}>
            {p.label}
          </button>
        ))}
      </div>
      <button type="button" className="cl-ctl" onClick={draft.fillSample}>
        Fill sample
      </button>
      <button type="button" className="cl-ctl" onClick={draft.reset}>
        Reset
      </button>
    </div>
  )
}

function Instance({ direction, phone }: { direction: Direction; phone?: boolean }) {
  const draft = useDraft()
  const uid = useId()
  const { Component } = direction
  const column = (
    <div className="cl-column" data-variant={direction.key} data-phone={phone ? '' : undefined}>
      <ColumnHead />
      <div className="cl-slot">
        <Component draft={draft} uid={uid} />
      </div>
    </div>
  )
  return (
    <>
      <Controls draft={draft} label={`${direction.letter}${phone ? ' at phone width' : ''}`} />
      {phone ? (
        <div className="cl-phone" data-phone-frame={direction.key}>
          {column}
        </div>
      ) : (
        column
      )}
    </>
  )
}

function Caption({ direction }: { direction: Direction }) {
  return (
    <div className="cl-caption">
      <div className="flex items-center gap-4">
        <GridLabel>{direction.letter}</GridLabel>
        <h2 className="font-mono text-title-sm font-medium text-text-primary">{direction.name}</h2>
      </div>
      <p className="font-mono text-body text-text-secondary">{direction.rationale}</p>
    </div>
  )
}

export default function ContactLab() {
  return (
    <main className="pt-20 relative">
      <section className="lattice py-16">
        <GridLabel>Lab</GridLabel>
        <h1 className="mt-8 font-mono text-headline font-medium tracking-headline text-text-primary">Contact form directions</h1>
        <p className="mt-4 max-w-[656px] font-mono text-body text-text-secondary">
          Three ways the footer form could look, each in the real Contact column. Type, tab through, press send to see the
          validation (nothing is sent), and use the toggles to see the Sent and Error states.
        </p>
      </section>

      <section className="bg-bg-surface divider-dashed-grid lattice-origin relative" aria-label="Desktop, footer column at 1440">
        <div className="lattice py-16">
          <p className="cl-band-label">Desktop: the footer Contact column, 4 of 12 columns</p>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
            {DIRECTIONS.map(d => (
              <div key={d.key} className="min-w-0" data-desktop={d.key}>
                <Caption direction={d} />
                <Instance direction={d} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lattice py-16" aria-label="Phone width, 358px column">
        <p className="cl-band-label">Phone: the same column at 358px</p>
        <div className="cl-phones">
          {DIRECTIONS.map(d => (
            <div key={d.key} className="cl-phone-card">
              <div className="flex items-center gap-4 mb-4">
                <GridLabel>{d.letter}</GridLabel>
                <span className="font-mono text-label text-text-secondary">{d.name}</span>
              </div>
              <Instance direction={d} phone />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
