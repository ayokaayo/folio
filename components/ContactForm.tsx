'use client'

/**
 * Footer contact form, folded into one line that opens. The column keeps a single tertiary CTA; pressing
 * it unfolds a compact form (grid rows 0fr to 1fr with a fade, instant under reduced motion): the message
 * first in a hairline box, then name and email with Send at the end of their row. Close, Escape or the
 * CTA again folds it back and returns focus to the CTA. Posts straight to Web3Forms from the browser
 * (lib/contact.ts) and renders nothing while no access key is set.
 *
 * Lattice: every box is a whole number of 16px cells. The CTA is three cells (.btn-tertiary), labels two,
 * inputs and Send three, and the message 16px of padding and border plus 32px lines, so it grows by two
 * cells at a time. Fields fill the column, whose edges are lattice lines. The layout follows the width of
 * the column, not the viewport (a container query, see .contact-fold in app/globals.css): from 400px name,
 * email and an 80px Send share a row, with the name rounded down to whole cells; below that each field
 * takes the whole column and Send is two lattice columns wide.
 *
 * Spam: a hidden Web3Forms `botcheck` box, an off-screen `website` field, a minimum fill time counted
 * from the moment the form is unfolded, blank values rejected and a double-submit guard. A tripped trap
 * sends nothing, fires no event and shows the normal confirmation, so a bot learns nothing.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type TransitionEvent } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics'
import {
  CONTACT_KEY,
  FIELDS,
  LIMITS,
  MIN_FILL_MS,
  resolveContactKey,
  sendMessage,
  validate,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '@/lib/contact'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMPTY: ContactValues = { name: '', email: '', message: '' }

const CTA = 'Start a conversation'
const FAILED = "That didn't go through. Try again, or copy my email above."

// The message box: 7px of padding and a 1px border above and below, then 32px lines (16 + 32n), from
// three lines up to eight, after which it scrolls.
const MESSAGE_BASE = 16
const MESSAGE_LINE = 32
const MESSAGE_MIN_LINES = 3
const MESSAGE_MAX_LINES = 8

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ContactForm() {
  const [key, setKey] = useState(CONTACT_KEY)
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<ContactValues>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [sentTo, setSentTo] = useState('')
  const [ready, setReady] = useState(false)

  const shownAt = useRef(0)
  const inFlight = useRef(false)
  // Set when the fold is opened by hand, so focus goes into the message once it is rendered open.
  const focusOnOpen = useRef(false)
  const openTracked = useRef(false)
  const botcheck = useRef<HTMLInputElement>(null)
  const website = useRef<HTMLInputElement>(null)
  const cta = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const confirmation = useRef<HTMLDivElement>(null)
  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const message = useRef<HTMLTextAreaElement | null>(null)
  const pathname = usePathname()
  const id = useId()

  useEffect(() => {
    setKey(resolveContactKey(window.location.search))
    setReady(true)
  }, [])

  // The footer outlives client navigations, so contact_open is counted once per page, not per visit.
  useEffect(() => {
    openTracked.current = false
  }, [pathname])

  useEffect(() => {
    if (status === 'sent') confirmation.current?.focus()
    // A failure answered after the fold was closed would otherwise go unseen.
    if (status === 'error') setOpen(true)
  }, [status])

  useEffect(() => {
    if (!open || !focusOnOpen.current) return
    focusOnOpen.current = false
    message.current?.focus({ preventScroll: true })
    // Without a transition to wait for, bring the whole form into view straight away.
    if (reducedMotion()) formRef.current?.scrollIntoView({ block: 'nearest' })
    // status too: "Send another" asks for focus while the fold is already open.
  }, [open, status])

  // Grow the message in whole two-cell lines, so its height stays on the lattice.
  useLayoutEffect(() => {
    const el = message.current
    if (!el) return
    el.style.height = `${MESSAGE_BASE + MESSAGE_MIN_LINES * MESSAGE_LINE}px`
    const lines = Math.min(MESSAGE_MAX_LINES, Math.max(MESSAGE_MIN_LINES, Math.ceil((el.scrollHeight - MESSAGE_BASE) / MESSAGE_LINE)))
    el.style.height = `${MESSAGE_BASE + lines * MESSAGE_LINE}px`
  }, [values.message, status])

  const unfold = () => {
    focusOnOpen.current = true
    // The fill clock starts when a person can first see the fields.
    if (!shownAt.current) shownAt.current = Date.now()
    if (!openTracked.current) {
      openTracked.current = true
      track('contact_open')
    }
    setOpen(true)
  }

  const fold = () => {
    cta.current?.focus()
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      fold()
    }
  }

  // Once the fold has finished opening, make sure the whole form is on screen.
  const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== panel.current || event.propertyName !== 'grid-template-rows' || !open) return
    formRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const onChange = useCallback((field: ContactField, value: string) => {
    setValues(v => ({ ...v, [field]: value }))
    // Errors appear on submit; after that each one updates as its field is edited, and clears once fixed.
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      const e = validateField(field, value)
      if (e) next[field] = e
      else delete next[field]
      return next
    })
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current) return

    const found = validate(values)
    setErrors(found)
    const first = FIELDS.find(f => found[f])
    if (first) {
      track('contact_failed', { reason: 'validation' })
      fieldRefs.current[first]?.focus()
      return
    }

    // Spam traps: no request, no event, the ordinary confirmation. A submit from a form never unfolded
    // (shownAt still 0) can only be a script.
    const trapped =
      botcheck.current?.checked === true ||
      (website.current?.value ?? '') !== '' ||
      !shownAt.current ||
      Date.now() - shownAt.current < MIN_FILL_MS
    if (trapped) {
      setSentTo(values.email.trim())
      setStatus('sent')
      return
    }

    inFlight.current = true
    setStatus('sending')
    const result = await sendMessage(key, values)
    inFlight.current = false
    if (result === 'ok') {
      track('contact_sent')
      setSentTo(values.email.trim())
      setStatus('sent')
    } else {
      track('contact_failed', { reason: result })
      setStatus('error')
    }
  }

  // Back to an empty form, already open, with the fill clock restarted.
  const sendAnother = () => {
    setValues(EMPTY)
    setErrors({})
    setSentTo('')
    shownAt.current = Date.now()
    focusOnOpen.current = true
    setOpen(true)
    setStatus('idle')
  }

  if (!key) return null

  if (status === 'sent') {
    return (
      <div
        ref={confirmation}
        tabIndex={-1}
        role="status"
        className="contact-confirm mt-8"
        data-contact=""
        data-contact-sent=""
      >
        <p className="contact-confirm-line">
          <span className="min-w-0 break-words">
            Message sent. I&apos;ll reply to <span className="text-accent-dark">{sentTo}</span>.
          </span>
        </p>
        <button type="button" onClick={sendAnother} className="contact-link">
          Send another
        </button>
      </div>
    )
  }

  const sending = status === 'sending'
  const panelId = `${id}-panel`
  const fieldId = (f: ContactField) => `${id}-${f}`
  const errorId = (f: ContactField) => `${fieldId(f)}-error`
  const shownErrors = FIELDS.filter(f => errors[f])
  const described = (f: ContactField) => ({
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? errorId(f) : undefined,
  })

  const input = (f: 'name' | 'email', label: string) => (
    <div className="contact-fold-cell" data-field={f}>
      <label htmlFor={fieldId(f)} className="contact-fold-label">
        {label}
      </label>
      <input
        id={fieldId(f)}
        ref={el => {
          fieldRefs.current[f] = el
        }}
        name={f}
        className="contact-fold-input"
        type={f === 'email' ? 'email' : 'text'}
        inputMode={f === 'email' ? 'email' : undefined}
        spellCheck={f === 'email' ? false : undefined}
        autoComplete={f}
        aria-required
        maxLength={LIMITS[f]}
        value={values[f]}
        {...described(f)}
        onChange={e => onChange(f, e.target.value)}
      />
    </div>
  )

  return (
    <div className="contact-fold mt-8" data-contact="" data-open={open ? '' : undefined} onKeyDown={onKeyDown}>
      <button
        ref={cta}
        type="button"
        className="btn-tertiary contact-fold-cta"
        style={{ '--chars': CTA.length } as CSSProperties}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? fold() : unfold())}
        data-contact-toggle=""
      >
        <span>{CTA}</span>
        <span className="arrow" aria-hidden>
          {open ? '↓' : '→'}
        </span>
      </button>

      {/* Folded, the panel is out of the tab order and the accessibility tree. React 18 has no inert
          prop, so the attribute is passed as a string. */}
      <div
        ref={panel}
        id={panelId}
        className="contact-fold-panel"
        onTransitionEnd={onTransitionEnd}
        {...(open ? {} : ({ inert: '' } as unknown as { inert: boolean }))}
      >
        <div className="contact-fold-inner">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="contact-fold-form relative"
            aria-label="Contact form"
            data-contact-form=""
            data-contact-ready={ready ? '' : undefined}
          >
            <div className="contact-fold-head">
              <label htmlFor={fieldId('message')} className="contact-fold-label">
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
              id={fieldId('message')}
              ref={el => {
                fieldRefs.current.message = el
                message.current = el
              }}
              name="message"
              className="contact-fold-message"
              rows={1}
              autoComplete="off"
              aria-required
              maxLength={LIMITS.message}
              placeholder="What's on your mind?"
              value={values.message}
              {...described('message')}
              onChange={e => onChange('message', e.target.value)}
            />

            <div className="contact-fold-row">
              {input('name', 'Your name')}
              {input('email', 'Email')}
              <button
                type="submit"
                aria-disabled={sending || undefined}
                data-sending={sending ? '' : undefined}
                className="btn-primary contact-send contact-fold-send"
              >
                <span>Send</span>
                <span className="contact-send-arrow" aria-hidden>
                  {sending ? <span className="contact-send-dots" /> : '→'}
                </span>
              </button>
            </div>

            {shownErrors.length > 0 && (
              <div className="contact-fold-errors">
                {shownErrors.map(f => (
                  <p key={f} id={errorId(f)} className="contact-error" data-error-for={f}>
                    {errors[f]}
                  </p>
                ))}
              </div>
            )}

            {/* Honeypots, invisible to people and to assistive technology. */}
            <input ref={botcheck} type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />
            <div aria-hidden="true" className="contact-trap">
              <label>
                Website
                <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>

            <p aria-live="polite" className="contact-status" data-contact-status="">
              {status === 'error' && FAILED}
            </p>
            {/* Its own region, so the announcement never adds a visible line while sending. */}
            <p aria-live="polite" className="sr-only">
              {sending && 'Sending your message.'}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
