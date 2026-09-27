import { NextResponse, type NextRequest } from 'next/server'
import { caseStudies } from '@/lib/caseStudies'
import { projects } from '@/lib/projects'

/**
 * Unknown case studies and projects answer with a 404 status. Their pages call notFound(), but the root
 * loading state (app/loading.tsx) has already started the response by then, so it would go out as 200
 * with the not-found page drawn only on the client. Rewritten here to a path no route matches (folders
 * starting with _ are private in the App Router), with a 404 status, it renders the root not-found page on
 * the server; the browser keeps the original URL, and usePathname reports it, so that page picks the
 * case-study or project copy from the path (components/NotFoundHero.tsx).
 */
const KNOWN: Record<string, Set<string>> = {
  work: new Set(caseStudies.map(cs => cs.id)),
  projects: new Set(projects.map(p => p.id)),
}

export function middleware(req: NextRequest) {
  const [, section, id] = req.nextUrl.pathname.split('/')
  if (id && !KNOWN[section]?.has(id)) return NextResponse.rewrite(new URL('/_missing' + req.nextUrl.pathname, req.url), { status: 404 })
  return NextResponse.next()
}

// Next 14's dev server did not match named single-segment patterns here (/work/:id), so match the sections.
export const config = { matcher: ['/work/:path+', '/projects/:path+'] }
