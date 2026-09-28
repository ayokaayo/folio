/**
 * Cookieless analytics (Umami). See app/privacy/page.tsx for what visitors are told.
 *
 * Only the event names below are ever sent, each with a few predefined properties. Never pass free
 * text, email addresses, clipboard contents or full URLs with query strings: use sanitiseUrl() or a
 * hostname. Every payload the tracker sends (page views too) passes through beforeSend(), which strips
 * query strings and fragments. Umami keeps nothing in cookies or storage, and when the script is absent
 * (no website ID, development, a blocker, Do Not Track, or another domain) track() does nothing.
 */

export type AnalyticsEvent =
  | 'cv_download'
  | 'linkedin_click'
  | 'email_copy'
  | 'case_study_open'
  | 'project_open'
  | 'live_product_click'
  | 'proof_open'
  | 'hero_play'
  | 'not_found'

export type AnalyticsData = Record<string, string | number>

/** The fields of a tracker payload this module rewrites; the rest pass through untouched. */
export interface UmamiPayload {
  url?: string
  referrer?: string
  [key: string]: unknown
}

declare global {
  interface Window {
    umami?: { track: (event: string, data?: AnalyticsData) => unknown }
    umamiBeforeSend?: (type: string, payload: UmamiPayload) => UmamiPayload | false
  }
}

/** The Umami website ID; with none set, no script loads. */
// The site's Umami website ID (public by design: it appears in every page's source). An env var overrides it.
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || 'acc5c18d-50cf-494a-a9c9-5715294c24b3'
/** Hostnames that count. Overridable only so the production test build can count localhost. */
export const UMAMI_DOMAINS = process.env.NEXT_PUBLIC_UMAMI_DOMAINS || 'miguelangelo.tech,www.miguelangelo.tech'
/** The tracker loads only in a production build with an ID. */
export const TRACKER_ENABLED = process.env.NODE_ENV === 'production' && UMAMI_WEBSITE_ID !== ''

/** Marks the not-found page, so its page views and events report /404 rather than the missing path. */
export const NOT_FOUND_MARKER = 'data-not-found'

// Events fired before the tracker has loaded (a cold 404, a fast click) wait here, in memory only.
const MAX_QUEUE = 50
const queue: [AnalyticsEvent, AnalyticsData | undefined][] = []
let poll: ReturnType<typeof setInterval> | undefined

function flush(): boolean {
  const umami = window.umami
  if (!umami) return false
  while (queue.length) {
    const [event, data] = queue.shift()!
    try {
      umami.track(event, data)
    } catch {
      // Analytics must never break the page.
    }
  }
  return true
}

/** Called when the tracker script loads; also polled briefly in case the load event was missed. */
export function flushQueue(): void {
  if (typeof window !== 'undefined') flush()
}

export function track(event: AnalyticsEvent, data?: AnalyticsData): void {
  if (typeof window === 'undefined') return
  try {
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('analytics') === 'debug') {
      console.info('[analytics]', event, data ?? {})
    }
    if (flush()) {
      window.umami!.track(event, data)
      return
    }
    // Nothing will ever load: drop it rather than hold it.
    if (!TRACKER_ENABLED) return
    if (queue.length < MAX_QUEUE) queue.push([event, data])
    if (poll === undefined) {
      let tries = 0
      poll = setInterval(() => {
        if (flush() || ++tries > 80) {
          clearInterval(poll)
          poll = undefined
        }
      }, 250)
    }
  } catch {
    // Analytics must never break the page.
  }
}

/** Origin and pathname only: no query string, no hash. Returns '' for anything unparseable. */
export function sanitiseUrl(url: string, base?: string): string {
  try {
    const u = new URL(url, base ?? (typeof window !== 'undefined' ? window.location.href : undefined))
    return u.origin + u.pathname
  } catch {
    return ''
  }
}

const REF = /^[a-z0-9-]{1,32}$/i
const BASE = 'https://base.invalid'

/**
 * A page URL as it may be sent: no fragment and no query, except a well formed ?ref= tag (tagged links
 * such as ?ref=acme). Absolute input stays absolute, a path stays a path.
 */
export function cleanPageUrl(raw: string): string {
  if (!raw) return raw
  try {
    const u = new URL(raw, BASE)
    const ref = u.searchParams.get('ref')
    const keep = ref !== null && REF.test(ref) ? `?ref=${ref}` : ''
    const out = u.origin + u.pathname + keep
    return u.origin === BASE ? out.slice(BASE.length) : out
  } catch {
    return ''
  }
}

// Paths reported as /404 this session, so a page view that follows does not leak them as its referrer.
const notFoundPaths = new Set<string>()

function toNotFound(raw: string): string {
  try {
    const u = new URL(raw, BASE)
    return u.origin === BASE ? '/404' : `${u.origin}/404`
  } catch {
    return '/404'
  }
}

/**
 * Umami's data-before-send hook: sees every payload (page views, events, performance) before it leaves
 * the browser. Strips queries and fragments from url and referrer (keeping a valid ref), and on the
 * not-found page reports the url as /404.
 */
export function beforeSend(_type: string, payload: UmamiPayload): UmamiPayload | false {
  try {
    const out = { ...payload }
    const onNotFound = typeof document !== 'undefined' && document.querySelector(`[${NOT_FOUND_MARKER}]`) !== null
    if (typeof out.url === 'string') {
      if (onNotFound) {
        notFoundPaths.add(new URL(out.url, BASE).pathname)
        out.url = toNotFound(out.url)
      } else out.url = cleanPageUrl(out.url)
    }
    if (typeof out.referrer === 'string' && out.referrer) {
      const ref = cleanPageUrl(out.referrer)
      let path = ''
      try {
        const u = new URL(out.referrer, BASE)
        if (u.origin === BASE || (typeof window !== 'undefined' && u.origin === window.location.origin)) path = u.pathname
      } catch {}
      out.referrer = path && notFoundPaths.has(path) ? toNotFound(out.referrer) : ref
    }
    return out
  } catch {
    // Unsure what the payload holds: do not send it.
    return false
  }
}

/** The case study or project id from a /work/<id> or /projects/<id> path, or '' elsewhere. */
export function pageIdFromPath(pathname: string): string {
  const m = /^\/(?:work|projects)\/([^/?#]+)/.exec(pathname)
  return m ? m[1] : ''
}

/**
 * For a click delegated to a container: the hostname of the designated live-product link that was
 * clicked (an anchor marked data-live-product), or '' otherwise. Only the hostname leaves the page.
 */
export function liveProductHost(target: EventTarget | null): string {
  if (typeof window === 'undefined' || !(target instanceof Element)) return ''
  const a = target.closest('a[data-live-product]')
  if (!(a instanceof HTMLAnchorElement)) return ''
  try {
    const u = new URL(a.href, window.location.href)
    if (!/^https?:$/.test(u.protocol) || u.origin === window.location.origin) return ''
    return u.hostname
  } catch {
    return ''
  }
}

/**
 * A missing path as it may be sent with not_found: pathname only, decoded, lower case, only
 * [a-z0-9-_/.] kept, runs of five or more digits replaced with #, cut to 60 characters.
 */
export function notFoundPath(pathname: string): string {
  let path = pathname.split(/[?#]/)[0]
  try {
    path = decodeURIComponent(path)
  } catch {
    // Keep the raw path when it is not valid percent encoding.
  }
  path = path
    .toLowerCase()
    .replace(/[^a-z0-9\-_/.]/g, '')
    .replace(/[0-9]{5,}/g, '#')
  return (path || '/').slice(0, 60)
}
