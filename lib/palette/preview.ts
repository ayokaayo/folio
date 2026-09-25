/**
 * Site palette preview (dev only). The palette is a data attribute on <html>;
 * app/globals.css holds the overrides. The hero lab toggles it, and this key keeps
 * the choice while browsing the rest of the site locally. Production never reads it.
 */
export const PALETTE_KEY = 'folio-palette'
export const SITE_PALETTES = ['sage', 'blue'] as const
export type SitePalette = (typeof SITE_PALETTES)[number]

/** Runs before first paint (inlined in app/layout.tsx) so a preview never flashes the default. */
export const PALETTE_BOOT = `(function(){try{var q=new URLSearchParams(location.search).get('palette');if(q)localStorage.setItem('${PALETTE_KEY}',q);var p=localStorage.getItem('${PALETTE_KEY}');if(p&&p!=='sage')document.documentElement.dataset.palette=p}catch(e){}})()`

export function setSitePalette(p: SitePalette) {
  try {
    localStorage.setItem(PALETTE_KEY, p)
  } catch {}
  if (p === 'sage') delete document.documentElement.dataset.palette
  else document.documentElement.dataset.palette = p
}

export function getSitePalette(): SitePalette {
  const p = typeof document !== 'undefined' ? document.documentElement.dataset.palette : undefined
  return p === 'blue' ? 'blue' : 'sage'
}
