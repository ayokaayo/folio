'use client'

/**
 * C. Folded: one line that opens. The footer keeps a single tertiary CTA; pressing it unfolds a
 * compact form (grid rows 0fr to 1fr with a fade, instant under reduced motion). The message comes
 * first in a hairline box, then name and email share a row with Send at its end. Company is left
 * out to keep the fold short. Close folds it back and returns focus to the CTA.
 */

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { LIMITS, type ContactField } from '@/lib/contact'
import { FAILED, useAutoGrow, type VariantProps } from './shared'

const CTA = 'Start a conversation'

export default function Folded({ draft, uid }: VariantProps) {
  const { values, errors, status } = draft
  const [open, setOpen] = useState(false)
  const refs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const message = useRef<HTMLTextAreaElement | null>(null)
  const cta = useRef<HTMLButtonElement>(null)
  const opened = useRef(false)
  const panel = useRef<HTMLDivElement>(null)
  // 7px + 1px border above and below, then 32px lines: 16 + 32n, always whole cells.
  useAutoGrow(message, values.message, 32, 16, 3)

  // The forced Error state needs the form on screen.
  useEffect(() => {
    if (status === 'error') setOpen(true)
  }, [status])

  // A folded panel is out of the tab order and the accessibility tree (set directly, as React 18 has no inert prop).
  useEffect(() => {
    panel.current?.toggleAttribute('inert', !open)
  }, [open])

  // Focus the message once the fold has opened by hand.
  useEffect(() => {
    if (open && opened.current) {
      message.current?.focus({ preventScroll: true })
      opened.current = false
    }
  }, [open])

  const unfold = () => {
    opened.current = true
    setOpen(true)
  }

  const fold = () => {
    setOpen(false)
    cta.current?.focus()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const first = draft.trySend()
    if (first) refs.current[first]?.focus()
  }

  const id = (f: ContactField) => `${uid}-${f}`
  const panelId = `${uid}-panel`

  if (status === 'sent') {
    return (
      <div className="cl-fold-sent" role="status">
        <p>
          <span>
            Sent. I&apos;ll reply to <span className="text-accent-dark">{values.email.trim()}</span>.
          </span>
        </p>
        <button
          type="button"
          className="cl-link"
          onClick={() => {
            draft.reset()
            setOpen(false)
          }}
        >
          Start another
        </button>
      </div>
    )
  }

  const input = (f: 'name' | 'email', label: string) => (
    <div className="cl-fold-cell" data-field={f}>
      <label htmlFor={id(f)} className="cl-fold-label">
        {label}
      </label>
      <input
        id={id(f)}
        ref={el => {
          refs.current[f] = el
        }}
        className="cl-fold-input"
        type={f === 'email' ? 'email' : 'text'}
        inputMode={f === 'email' ? 'email' : undefined}
        spellCheck={f === 'email' ? false : undefined}
        autoComplete={f}
        maxLength={LIMITS[f]}
        value={values[f]}
        aria-invalid={errors[f] ? true : undefined}
        aria-describedby={errors[f] ? `${id(f)}-error` : undefined}
        onChange={e => draft.set(f, e.target.value)}
      />
    </div>
  )

  const shownErrors = (['message', 'name', 'email'] as ContactField[]).filter(f => errors[f])

  return (
    <div className="cl-fold" data-open={open ? '' : undefined}>
      <button
        ref={cta}
        type="button"
        className="btn-tertiary group cl-fold-cta"
        style={{ '--chars': CTA.length } as CSSProperties}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? fold() : unfold())}
      >
        <span>{CTA}</span>
        <span className="arrow" aria-hidden>
          {open ? '↓' : '→'}
        </span>
      </button>

      <div ref={panel} className="cl-fold-panel" id={panelId}>
        <div className="cl-fold-inner">
          <form className="cl-fold-form" noValidate onSubmit={onSubmit} aria-label="Contact form">
            <div className="cl-fold-head">
              <label htmlFor={id('message')} className="cl-fold-label">
                Message
              </label>
              <button type="button" className="cl-fold-close" onClick={fold} aria-label="Close the message form">
                <span aria-hidden>Close</span>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <textarea
              id={id('message')}
              ref={el => {
                refs.current.message = el
                message.current = el
              }}
              className="cl-fold-message"
              rows={1}
              maxLength={LIMITS.message}
              placeholder="What's on your mind?"
              value={values.message}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? `${id('message')}-error` : undefined}
              onChange={e => draft.set('message', e.target.value)}
            />
            <div className="cl-fold-row">
              {input('name', 'Your name')}
              {input('email', 'Email')}
              <button type="submit" className="btn-primary cl-send cl-fold-send" aria-disabled={status === 'sending' || undefined}>
                <span>{status === 'sending' ? 'Sending' : 'Send'}</span>
                <span className="cl-send-arrow" aria-hidden>
                  →
                </span>
              </button>
            </div>
            {shownErrors.length > 0 && (
              <div className="cl-fold-errors">
                {shownErrors.map(f => (
                  <p key={f} id={`${id(f)}-error`}>
                    {errors[f]}
                  </p>
                ))}
              </div>
            )}
            <p aria-live="polite" className="cl-status">
              {status === 'error' && FAILED}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
