'use client'

/**
 * Shared state for the contact lab variants. Each variant instance owns a draft: the values, the
 * errors from the real validator (lib/contact.ts), and a status. "Try send" validates exactly as the
 * live form does and then pretends: nothing is ever posted. The lab's toggles force the Sent and
 * Error states so each direction's endings can be judged without typing.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { LIMITS, validateField, type ContactField } from '@/lib/contact'

export type Status = 'idle' | 'sending' | 'sent' | 'error'
export type Preview = 'live' | 'sent' | 'error'

export type LabField = ContactField | 'company'
export type LabValues = Record<LabField, string>
export type LabErrors = Partial<Record<LabField, string>>

export const LAB_LIMITS = { ...LIMITS, company: 100 } as const

/** The order the first error is looked for in (for focus), unless a variant passes its own. */
const LAB_FIELDS: LabField[] = ['name', 'email', 'company', 'message']

function labValidateField(field: LabField, value: string): string {
  if (field !== 'company') return validateField(field, value)
  return value.trim().length > LAB_LIMITS.company ? `Keep this under ${LAB_LIMITS.company} characters.` : ''
}

function labValidate(values: LabValues): LabErrors {
  const errors: LabErrors = {}
  for (const f of LAB_FIELDS) {
    const e = labValidateField(f, values[f])
    if (e) errors[f] = e
  }
  return errors
}

export const EMPTY: LabValues = { name: '', email: '', company: '', message: '' }

export const SAMPLE: LabValues = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  message: "I'm building an agent review tool and would love your eye on how the evaluation screens explain themselves. Could we talk next week?",
}

export const FAILED = "That didn't go through. Try again, or copy my email above."

export interface Draft {
  values: LabValues
  errors: LabErrors
  status: Status
  set: (field: LabField, value: string) => void
  /** Validates; returns the first invalid field in `order` (for focus) or null when it "sends". */
  trySend: (order?: LabField[]) => LabField | null
  preview: (p: Preview) => void
  fillSample: () => void
  reset: () => void
}

export function useDraft(): Draft {
  const [values, setValues] = useState<LabValues>(EMPTY)
  const [errors, setErrors] = useState<LabErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  const set = useCallback((field: LabField, value: string) => {
    setValues(v => ({ ...v, [field]: value }))
    // As in the live form: errors appear on send, then update as the field is edited.
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      const e = labValidateField(field, value)
      if (e) next[field] = e
      else delete next[field]
      return next
    })
  }, [])

  const trySend = useCallback((order: LabField[] = LAB_FIELDS) => {
    const found = labValidate(values)
    setErrors(found)
    const first = order.find(f => found[f]) ?? null
    if (first) return first
    clearTimeout(timer.current)
    setStatus('sending')
    timer.current = setTimeout(() => setStatus('sent'), 700)
    return null
  }, [values])

  const preview = useCallback((p: Preview) => {
    clearTimeout(timer.current)
    setErrors({})
    if (p === 'live') {
      setStatus('idle')
      return
    }
    // An ending with blanks in it says nothing, so the forced states borrow the sample.
    setValues(v => (v.message.trim() ? v : SAMPLE))
    setStatus(p === 'sent' ? 'sent' : 'error')
  }, [])

  const fillSample = useCallback(() => {
    setValues(SAMPLE)
    setErrors({})
  }, [])

  const reset = useCallback(() => {
    clearTimeout(timer.current)
    setValues(EMPTY)
    setErrors({})
    setStatus('idle')
  }, [])

  return { values, errors, status, set, trySend, preview, fillSample, reset }
}

/**
 * Grows a textarea with its content in whole steps of `line`, starting from `base` (padding and
 * borders), so its height is always base + n lines and stays on the lattice.
 */
export function useAutoGrow(ref: RefObject<HTMLTextAreaElement>, value: string, line: number, base: number, minLines: number) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = `${base + minLines * line}px`
    const lines = Math.max(minLines, Math.ceil((el.scrollHeight - base) / line))
    el.style.height = `${base + lines * line}px`
  }, [ref, value, line, base, minLines])
}

export interface VariantProps {
  draft: Draft
  /** Unique per instance, for ids. */
  uid: string
}
