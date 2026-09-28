'use client'

/**
 * Footer contact form. Posts straight to Web3Forms from the browser (lib/contact.ts); renders nothing
 * while no access key is set.
 *
 * Lattice: every box is a whole number of 16px cells. Labels and single-line error rows are two cells,
 * inputs three, the textarea eight, and fields are one cell apart. Fields fill the column, whose edges
 * are lattice lines, and the button is two columns wide (.cta-2col-track).
 *
 * Spam: a hidden Web3Forms `botcheck` box, an off-screen `website` field, a minimum fill time, blank
 * values rejected and a double-submit guard. A tripped trap sends nothing, fires no event and shows
 * the normal confirmation, so a bot learns nothing.
 */

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
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

const EMPTY: ContactValues = { name: '', email: '', company: '', message: '' }

const LABELS: Record<ContactField, string> = {
  name: 'Name',
  email: 'Email',
  company: 'Company or role (optional)',
  message: 'Message',
}

const AUTOCOMPLETE: Record<ContactField, string> = {
  name: 'name',
  email: 'email',
  company: 'organization',
  message: 'off',
}

export default function ContactForm() {
  const [key, setKey] = useState(CONTACT_KEY)
  const [values, setValues] = useState<ContactValues>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [sentTo, setSentTo] = useState('')
  const [ready, setReady] = useState(false)

  const shownAt = useRef(0)
  const inFlight = useRef(false)
  const botcheck = useRef<HTMLInputElement>(null)
  const website = useRef<HTMLInputElement>(null)
  const confirmation = useRef<HTMLDivElement>(null)
  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const id = useId()

  useEffect(() => {
    setKey(resolveContactKey(window.location.search))
  }, [])

  // The fill clock starts when the form is on screen, and again for "Send another".
  useEffect(() => {
    if (key && status === 'idle' && !shownAt.current) shownAt.current = Date.now()
    setReady(true)
  }, [key, status])

  useEffect(() => {
    if (status === 'sent') confirmation.current?.focus()
  }, [status])

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

    // Spam traps: no request, no event, the ordinary confirmation.
    const trapped =
      botcheck.current?.checked === true ||
      (website.current?.value ?? '') !== '' ||
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

  const sendAnother = () => {
    setValues(EMPTY)
    setErrors({})
    setSentTo('')
    shownAt.current = 0
    setStatus('idle')
  }

  if (!key) return null

  if (status === 'sent') {
    return (
      <div
        ref={confirmation}
        tabIndex={-1}
        role="status"
        className="contact-confirm mt-8 font-mono text-body text-text-primary"
        data-contact-sent=""
      >
        <p className="break-words">
          Message sent. I&apos;ll reply to <span className="text-accent-dark">{sentTo}</span>.
        </p>
        <button type="button" onClick={sendAnother} className="contact-link">
          Send another
        </button>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <form onSubmit={onSubmit} noValidate className="contact-form relative mt-8" aria-label="Contact form" data-contact-form="" data-contact-ready={ready ? '' : undefined}>
      <h4 className="contact-row-2 font-mono text-label uppercase tracking-wide text-text-secondary">Or send a message</h4>

      <div className="flex flex-col gap-4">
        {FIELDS.map(field => {
          const inputId = `${id}-${field}`
          const errorId = `${inputId}-error`
          const error = errors[field]
          const common = {
            id: inputId,
            name: field,
            value: values[field],
            autoComplete: AUTOCOMPLETE[field],
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? errorId : undefined,
            'aria-required': field === 'company' ? undefined : true,
            className: 'contact-field',
          } as const
          return (
            <div key={field}>
              <label htmlFor={inputId} className="contact-label font-mono text-label uppercase tracking-wide text-text-secondary">
                {LABELS[field]}
              </label>
              {field === 'message' ? (
                <textarea
                  {...common}
                  ref={el => {
                    fieldRefs.current[field] = el
                  }}
                  maxLength={LIMITS.message}
                  onChange={e => onChange(field, e.target.value)}
                />
              ) : (
                <input
                  {...common}
                  ref={el => {
                    fieldRefs.current[field] = el
                  }}
                  type={field === 'email' ? 'email' : 'text'}
                  inputMode={field === 'email' ? 'email' : undefined}
                  spellCheck={field === 'email' ? false : undefined}
                  maxLength={LIMITS[field]}
                  onChange={e => onChange(field, e.target.value)}
                />
              )}
              {error && (
                <p id={errorId} className="contact-error font-mono text-caption">
                  {error}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Honeypots, invisible to people and to assistive technology. */}
      <input ref={botcheck} type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />
      <div aria-hidden="true" className="contact-trap">
        <label>
          Website
          <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button
        type="submit"
        aria-disabled={sending || undefined}
        className="btn-primary contact-send cta-2col-track mt-8 justify-between"
      >
        <span>{sending ? 'Sending...' : 'Send message'}</span>
        <svg className="contact-send-arrow w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>

      <p aria-live="polite" className="contact-status font-mono text-caption" data-contact-status="">
        {status === 'error' && "That didn't go through. Try again, or copy my email above."}
        {sending && <span className="sr-only">Sending your message.</span>}
      </p>
    </form>
  )
}
