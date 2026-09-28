'use client'

/**
 * B. Blueprint fields on the paper. The millimetric 16px grid is drawn inside the column and every
 * field is measured on it: a one-cell tab sitting on the top line, a three-cell writing line with an
 * underline on the lattice, and one cell between fields. The message is ruled like writing paper,
 * a text line every two cells. Name and email share a row where the column allows it.
 */

import { useRef, type FormEvent, type ReactNode } from 'react'
import { LIMITS, type ContactField } from '@/lib/contact'
import { FAILED, useAutoGrow, type VariantProps } from './shared'

export default function Blueprint({ draft, uid }: VariantProps) {
  const { values, errors, status } = draft
  const refs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const message = useRef<HTMLTextAreaElement | null>(null)
  useAutoGrow(message, values.message, 32, 0, 5)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const first = draft.trySend()
    if (first) refs.current[first]?.focus()
  }

  const id = (f: ContactField) => `${uid}-${f}`

  const field = (f: ContactField, index: string, label: string, control: ReactNode) => (
    <div className="cl-bp-field" data-invalid={errors[f] ? '' : undefined}>
      <label htmlFor={id(f)} className="cl-bp-tab">
        <span className="cl-bp-index">{index}</span>
        {label}
      </label>
      {control}
      {errors[f] && (
        <p id={`${id(f)}-error`} className="cl-bp-error">
          {errors[f]}
        </p>
      )}
    </div>
  )

  const input = (f: Exclude<ContactField, 'message'>) => (
    <input
      id={id(f)}
      ref={el => {
        refs.current[f] = el
      }}
      className="cl-bp-input"
      type={f === 'email' ? 'email' : 'text'}
      inputMode={f === 'email' ? 'email' : undefined}
      spellCheck={f === 'email' ? false : undefined}
      autoComplete={f === 'company' ? 'organization' : f}
      maxLength={LIMITS[f]}
      value={values[f]}
      aria-invalid={errors[f] ? true : undefined}
      aria-describedby={errors[f] ? `${id(f)}-error` : undefined}
      onChange={e => draft.set(f, e.target.value)}
    />
  )

  if (status === 'sent') {
    return (
      <div className="cl-bp cl-bp-sent" role="status">
        <span className="cl-bp-tab cl-bp-tab-solid">
          Sent
        </span>
        <p className="cl-bp-sent-line">
          Sent. I&apos;ll reply to <span className="text-accent-dark">{values.email.trim()}</span>.
        </p>
        <button type="button" className="cl-link" onClick={draft.reset}>
          Send another
        </button>
      </div>
    )
  }

  return (
    <form className="cl-bp" noValidate onSubmit={onSubmit} aria-label="Contact form">
      <div className="cl-bp-pair">
        {field('name', '01', 'Name', input('name'))}
        {field('email', '02', 'Email', input('email'))}
      </div>
      {field('company', '03', 'Company or role, optional', input('company'))}
      {field(
        'message',
        '04',
        'Message',
        <textarea
          id={id('message')}
          ref={el => {
            refs.current.message = el
            message.current = el
          }}
          className="cl-bp-ruled"
          rows={1}
          maxLength={LIMITS.message}
          value={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${id('message')}-error` : undefined}
          onChange={e => draft.set('message', e.target.value)}
        />,
      )}

      <div className="cl-bp-foot">
        <button type="submit" className="btn-primary cl-send cta-2col-track" aria-disabled={status === 'sending' || undefined}>
          <span>{status === 'sending' ? 'Sending...' : 'Send message'}</span>
          <span className="cl-send-arrow" aria-hidden>
            →
          </span>
        </button>
        <span className="cl-bp-count" aria-hidden>
          {values.message.length.toLocaleString('en-GB')} / {LIMITS.message.toLocaleString('en-GB')}
        </span>
      </div>
      <p aria-live="polite" className="cl-status">
        {status === 'error' && FAILED}
      </p>
    </form>
  )
}
