/**
 * Copy for the not-found pages (British English), which reuse the home hero with a large 404 drawn in
 * glyphs. Dependency-free so node can test it directly (npm run test:hero).
 */

export interface Cta {
  label: string
  href: string
}

export interface NotFoundVariant {
  headline: string
  primary: Cta
  secondary: Cta
}

const HOME: Cta = { label: 'Back home', href: '/' }

export const NOT_FOUND: Record<'page' | 'work' | 'project', NotFoundVariant> = {
  page: { headline: 'This page drifted off the grid', primary: HOME, secondary: { label: 'View work', href: '/work' } },
  work: { headline: 'This case study drifted off the grid', primary: { label: 'All work', href: '/work' }, secondary: HOME },
  project: { headline: 'This project drifted off the grid', primary: { label: 'All projects', href: '/projects' }, secondary: HOME },
}

/** Which copy a missing path gets: an unknown case study or project names what was looked for. */
export function variantFor(pathname: string): keyof typeof NOT_FOUND {
  const [, section, id, ...rest] = pathname.split('/')
  if (!id || rest.length > 0) return 'page'
  return section === 'work' ? 'work' : section === 'projects' ? 'project' : 'page'
}

/** The longest path shown in full; longer ones keep both ends around a middle ellipsis. */
export const PATH_MAX = 40

/** Shortens text over max characters to max, keeping its start and end either side of an ellipsis. */
export function truncateMiddle(text: string, max = PATH_MAX): string {
  const chars = Array.from(text)
  if (chars.length <= max) return text
  const keep = max - 1
  const head = Math.ceil(keep / 2)
  return chars.slice(0, head).join('') + '…' + chars.slice(chars.length - (keep - head)).join('')
}

/** The path as the visitor typed it: percent escapes decoded where they form valid UTF-8. */
export function displayPath(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}
