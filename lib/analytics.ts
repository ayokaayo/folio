/**
 * Cookieless analytics (Umami). See app/privacy/page.tsx for what visitors are told.
 *
 * Only the event names below are ever sent, each with a few predefined properties. Never pass free
 * text, email addresses, clipboard contents or full URLs with query strings: use sanitiseUrl() or a
 * hostname. Umami keeps nothing in cookies or storage, and when the script is absent (no website ID,
 * a blocker, Do Not Track, or a non production domain) track() does nothing.
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

declare global {
  interface Window {
    umami?: { track: (event: string, data?: AnalyticsData) => unknown }
  }
}

/** The Umami website ID; with none set, the layout loads no script. */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || ''

export function track(event: AnalyticsEvent, data?: AnalyticsData): void {
  if (typeof window === 'undefined') return
  try {
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('analytics') === 'debug') {
      console.info('[analytics]', event, data ?? {})
    }
    window.umami?.track(event, data)
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

/** The case study or project id from a /work/<id> or /projects/<id> path, or '' elsewhere. */
export function pageIdFromPath(pathname: string): string {
  const m = /^\/(?:work|projects)\/([^/?#]+)/.exec(pathname)
  return m ? m[1] : ''
}

/**
 * For a click delegated to a container: the hostname of the external http(s) link that was clicked,
 * or '' when the click was not on one. Only the hostname leaves the page, never the path or query.
 */
export function outboundHost(target: EventTarget | null): string {
  if (typeof window === 'undefined' || !(target instanceof Element)) return ''
  const a = target.closest('a[href]')
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
 * A missing path as it may be sent with not_found: pathname only, anything that looks like an email
 * address replaced, and cut to 60 characters.
 */
export function notFoundPath(pathname: string): string {
  let path = pathname
  try {
    path = decodeURIComponent(pathname)
  } catch {
    // Keep the raw path when it is not valid percent encoding.
  }
  path = sanitiseUrl(path, 'https://x.invalid').replace('https://x.invalid', '') || '/'
  path = path.replace(/[^\s/@]+@[^\s/@]+/g, '[email]')
  return path.slice(0, 60)
}
