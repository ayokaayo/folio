'use client'

/**
 * A. A letter you fill in. One composed note in the body type, with the fields as underlined blanks
 * inside the sentences. Every line is two cells (32px); the blanks are 48px tall for touch but give
 * 16px back through negative margins, so the text still sits on the 32px rhythm. The message is a
 * ruled textarea that grows a line at a time.
 */

import { useRef, type CSSProperties, type FormEvent } from 'react'
import type { ContactField } from '@/lib/contact'
import { FAILED, useAutoGrow, type VariantProps } from './shared'

const PLACEHOLDER: Record<ContactField, string> = {
  name: 'your name',
  company: 'company or role, optional',
  message: "what you'd like to talk about",
  email: 'you@example.com',
}

export default function Letter({ draft, uid }: VariantProps) {
  const { values, errors, status } = draft
  const refs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const message = useRef<HTMLTextAreaElement | null>(null)
  useAutoGrow(message, values.message, 32, 0, 3)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const first = draft.trySend()
    if (first) refs.current[first]?.focus()
  }

  if (status === 'sent') {
    return (
      <div className="cl-letter cl-letter-sent" role="status">
        <p className="cl-letter-readback">
          Hi Miguel, I&apos;m {values.name.trim()}
          {values.company.trim() && <> from {values.company.trim()}</>}. {values.message.trim()} You can reach me at{' '}
          {values.email.trim()}.
        </p>
        <p className="cl-letter-stamp">
          Sent. I&apos;ll reply to <span className="text-accent-dark">{values.email.trim()}</span>.
        </p>
        <button type="button" className="cl-link" onClick={draft.reset}>
          Write another
        </button>
      </div>
    )
  }

  const id = (f: ContactField) => `${uid}-${f}`
  const errorIds = (Object.keys(errors) as ContactField[]).map(f => `${id(f)}-error`)

  const blank = (field: Exclude<ContactField, 'message'>, label: string) => {
    const width = Math.max(values[field].length, PLACEHOLDER[field].length) + 1
    return (
      <>
        <label htmlFor={id(field)} className="sr-only">
          {label}
        </label>
        <input
          id={id(field)}
          ref={el => {
            refs.current[field] = el
          }}
          className="cl-blank"
          style={{ '--w': `${width}ch` } as CSSProperties}
          type={field === 'email' ? 'email' : 'text'}
          inputMode={field === 'email' ? 'email' : undefined}
          spellCheck={field === 'email' || field === 'name' ? false : undefined}
          autoComplete={field === 'company' ? 'organization' : field}
          placeholder={PLACEHOLDER[field]}
          value={values[field]}
          aria-invalid={errors[field] ? true : undefined}
          aria-describedby={errors[field] ? `${id(field)}-error` : undefined}
          onChange={e => draft.set(field, e.target.value)}
        />
      </>
    )
  }

  return (
    <form className="cl-letter" noValidate onSubmit={onSubmit} aria-label="Contact form">
      <p>Hi Miguel,</p>
      <p>
        I&apos;m {blank('name', 'Your name')} from {blank('company', 'Company or role (optional)')}.
      </p>
      <label htmlFor={id('message')} className="sr-only">
        Message
      </label>
      <textarea
        id={id('message')}
        ref={el => {
          refs.current.message = el
          message.current = el
        }}
        className="cl-letter-message"
        rows={1}
        placeholder={PLACEHOLDER.message}
        value={values.message}
        aria-invalid={errors.message ? true : undefined}
        aria-describedby={errors.message ? `${id('message')}-error` : undefined}
        onChange={e => draft.set('message', e.target.value)}
      />
      <p>You can reach me at {blank('email', 'Your email')}.</p>

      {errorIds.length > 0 && (
        <p className="cl-letter-errors">
          {(['name', 'company', 'message', 'email'] as ContactField[])
            .filter(f => errors[f])
            .map(f => (
              <span key={f} id={`${id(f)}-error`}>
                {errors[f]}{' '}
              </span>
            ))}
        </p>
      )}

      <button type="submit" className="btn-primary cl-send cta-2col-track" aria-disabled={status === 'sending' || undefined}>
        <span>{status === 'sending' ? 'Sending...' : 'Send it'}</span>
        <span className="cl-send-arrow" aria-hidden>
          →
        </span>
      </button>
      <p aria-live="polite" className="cl-status">
        {status === 'error' && FAILED}
      </p>
    </form>
  )
}
