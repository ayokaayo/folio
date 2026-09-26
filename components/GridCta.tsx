import Link from 'next/link'
import type { CSSProperties } from 'react'

/**
 * Tertiary CTA sized to the lattice: three cells high, and as wide as the label plus arrow rounded
 * up to whole cells (see .btn-tertiary). The type is monospace, so the character count is enough;
 * the arrow has a fixed one-cell slot.
 */
interface GridCtaProps {
  href: string
  label: string
  external?: boolean
}

export default function GridCta({ href, label, external = false }: GridCtaProps) {
  const style = { '--chars': label.length } as CSSProperties
  const content = (
    <>
      <span>{label}</span>
      <span className="arrow" aria-hidden>→</span>
    </>
  )

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-tertiary group" style={style}>
      {content}
    </a>
  ) : (
    <Link href={href} className="btn-tertiary group" style={style}>
      {content}
    </Link>
  )
}
