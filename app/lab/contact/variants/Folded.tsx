'use client'

/**
 * C. Folded: one line that opens. This is the direction the live footer uses (components/ContactForm.tsx),
 * kept here as its own copy so the lab never sends anything and its toggles can force the Sent and Error
 * states. The styles are the live ones (.contact-fold and friends in app/globals.css), so the preview
 * cannot drift from the footer; only the delivery, spam traps and analytics are left out.
 */

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react'
import { LIMITS } from '@/lib/contact'
import { FAILED, useAutoGrow, type LabField, type VariantProps } from './shared'

const CTA = 'Start a conversation'
const ORDER: LabField[] = ['message', 'name', 'email']

export default function Folded({ draft, uid }: VariantProps) {
  const { values, errors, status } = draft
  const [open, setOpen] = useState(false)
  const refs = useRef<Partial<Record<LabField, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const message = useRef<HTMLTextAreaElement | null>(null)
  const cta = useRef<HTMLButtonElement>(null)
  const opened = useRef(false)
  // 7px + 1px border above and below, then 32px lines: 16 + 32n, always whole cells.
  useAutoGrow(message, values.message, 32, 16, 3)

  // The forced Error state needs the form on screen.
  useEffect(() => {
    if (status === 'error') setOpen(true)
  }, [status])

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
    cta.current?.focus()
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault()
      fold()
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const first = draft.trySend(ORDER)
    if (first) refs.current[first]?.focus()
  }

  const id = (f: LabField) => `${uid}-${f}`
  const panelId = `${uid}-panel`

  if (status === 'sent') {
    return (
      <div className="contact-confirm" role="status">
        <p className="contact-confirm-line">
          <span className="min-w-0 break-words">
            Message sent. I&apos;ll reply to <span className="text-accent-dark">{values.email.trim()}</span>.
          </span>
        </p>
        <button
          type="button"
          className="contact-link"
          onClick={() => {
            draft.reset()
            unfold()
          }}
        >
          Send another
        </button>
      </div>
    )
  }

  const input = (f: 'name' | 'email', label: string) => (
    <div className="contact-fold-cell" data-field={f}>
      <label htmlFor={id(f)} className="contact-fold-label">
        {label}
      </label>
      <input
        id={id(f)}
        ref={el => {
          refs.current[f] = el
        }}
        className="contact-fold-input"
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

  const shownErrors = ORDER.filter(f => errors[f])
  const sending = status === 'sending'

  return (
    <div className="contact-fold" data-open={open ? '' : undefined} onKeyDown={onKeyDown}>
      <button
        ref={cta}
        type="button"
        className="btn-tertiary contact-fold-cta"
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

      <div className="contact-fold-panel" id={panelId} {...(open ? {} : ({ inert: '' } as unknown as { inert: boolean }))}>
        <div className="contact-fold-inner">
          <form className="contact-fold-form" noValidate onSubmit={onSubmit} aria-label="Contact form">
            <div className="contact-fold-head">
              <label htmlFor={id('message')} className="contact-fold-label">
                Message
              </label>
              <button type="button" className="contact-fold-close" onClick={fold} aria-label="Close the message form">
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
              className="contact-fold-message"
              rows={1}
              maxLength={LIMITS.message}
              placeholder="What's on your mind?"
              value={values.message}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? `${id('message')}-error` : undefined}
              onChange={e => draft.set('message', e.target.value)}
            />
            <div className="contact-fold-row">
              {input('name', 'Your name')}
              {input('email', 'Email')}
              <button type="submit" className="btn-primary contact-send contact-fold-send" aria-disabled={sending || undefined}>
                <span>Send</span>
                <span className="contact-send-arrow" aria-hidden>
                  {sending ? <span className="contact-send-dots" /> : '→'}
                </span>
              </button>
            </div>
            {shownErrors.length > 0 && (
              <div className="contact-fold-errors">
                {shownErrors.map(f => (
                  <p key={f} id={`${id(f)}-error`} className="contact-error">
                    {errors[f]}
                  </p>
                ))}
              </div>
            )}
            <p aria-live="polite" className="contact-status">
              {status === 'error' && FAILED}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
