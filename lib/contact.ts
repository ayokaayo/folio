/**
 * Footer contact form (components/ContactForm.tsx). Messages go from the browser straight to Web3Forms,
 * which emails them to the owner; the site itself stores nothing. See app/privacy/page.tsx.
 *
 * API, checked against docs.web3forms.com (API reference, JavaScript guide, honeypot, from_name,
 * subject): POST https://api.web3forms.com/submit with a JSON body and Content-Type: application/json.
 * `access_key` is required; `email` becomes the reply-to address; `subject` and `from_name` set the
 * notification's subject line and sender name; `botcheck` is their honeypot checkbox. Any other field
 * is forwarded as is. A success is HTTP 200 with { success: true }.
 */

/**
 * The Web3Forms access key. NEXT_PUBLIC_WEB3FORMS_KEY overrides it. If both are empty the form is not
 * rendered and the footer looks as it did before.
 */
// An alias for the owner's inbox, public by design (it ships in the page), not a secret.
export const WEB3FORMS_KEY = '41a28822-f602-4608-95b9-7db82a40cdd6'

export const CONTACT_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || WEB3FORMS_KEY

export const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

/** Used only in development by ?contact=test, so the form renders without a real key. Checks intercept the API. */
export const DEV_TEST_KEY = '00000000-0000-4000-8000-000000000000'

/**
 * The key in use. In development, ?contact=test forces DEV_TEST_KEY and ?contact=off forces no key,
 * so scripts/checks/contact.check.mjs can exercise both without restarting the dev server. Production
 * builds drop this branch and always use CONTACT_KEY.
 */
export function resolveContactKey(search: string): string {
  if (process.env.NODE_ENV !== 'production') {
    const flag = new URLSearchParams(search).get('contact')
    if (flag === 'test') return DEV_TEST_KEY
    if (flag === 'off') return ''
  }
  return CONTACT_KEY
}

/** Submits sooner than this after the form renders are treated as bots. */
export const MIN_FILL_MS = 3000

/** A request that has not answered by then counts as a network failure, so the button never hangs. */
export const REQUEST_TIMEOUT_MS = 15000

export type ContactField = 'name' | 'email' | 'company' | 'message'
export type ContactValues = Record<ContactField, string>
export type ContactErrors = Partial<Record<ContactField, string>>

export const LIMITS = {
  name: 100,
  email: 254,
  company: 100,
  messageMin: 10,
  message: 4000,
} as const

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The error for one field, or '' when it is fine. Values are judged trimmed, so blanks never pass. */
export function validateField(field: ContactField, raw: string): string {
  const value = raw.trim()
  switch (field) {
    case 'name':
      if (!value) return 'Add your name.'
      if (value.length > LIMITS.name) return `Keep your name under ${LIMITS.name} characters.`
      return ''
    case 'email':
      if (!value) return 'Add your email address, so I can reply.'
      if (value.length > LIMITS.email || !EMAIL.test(value)) return "That email address doesn't look right."
      return ''
    case 'company':
      if (value.length > LIMITS.company) return `Keep this under ${LIMITS.company} characters.`
      return ''
    case 'message':
      if (!value) return 'Write a message.'
      if (value.length < LIMITS.messageMin) return `Write at least ${LIMITS.messageMin} characters.`
      if (value.length > LIMITS.message) return 'Keep the message under 4,000 characters.'
      return ''
  }
}

export const FIELDS: ContactField[] = ['name', 'email', 'company', 'message']

export function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  for (const f of FIELDS) {
    const e = validateField(f, values[f])
    if (e) errors[f] = e
  }
  return errors
}

/** Exactly what is sent to Web3Forms. */
export function buildPayload(key: string, values: ContactValues) {
  const name = values.name.trim()
  return {
    access_key: key,
    name,
    email: values.email.trim(),
    company: values.company.trim(),
    message: values.message.trim(),
    subject: `Portfolio message from ${name}`,
    from_name: 'miguelangelo.tech',
    // Their honeypot: always false here, since a ticked box never gets this far.
    botcheck: false,
  }
}

export type SendResult = 'ok' | 'network' | 'server'

/** Posts the message. Never throws: a failure to reach the API is 'network', any other failure 'server'. */
export async function sendMessage(key: string, values: ContactValues): Promise<SendResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(key, values)),
      signal: controller.signal,
    })
  } catch {
    clearTimeout(timer)
    return 'network'
  }
  try {
    const data = await res.json()
    return res.ok && data && data.success === true ? 'ok' : 'server'
  } catch {
    return 'server'
  } finally {
    clearTimeout(timer)
  }
}
