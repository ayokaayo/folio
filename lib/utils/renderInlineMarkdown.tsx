import React from 'react'
import Link from 'next/link'

/** Matches the inline markdown we support in project copy: **bold** and [text](url) */
const INLINE_TOKEN = /(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g
const LINK_TOKEN = /^\[([^\]]+)\]\(([^)]+)\)$/

/**
 * Renders a paragraph of project copy, turning **bold** into <strong> and
 * [text](url) into a link. External URLs open in a new tab.
 *
 * @param text - A single paragraph (callers split on '\n\n' first)
 * @returns Array of React nodes ready to drop inside a <p>
 */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  return text.split(INLINE_TOKEN).map((part, index) => {
    if (!part) return null

    // Bold can wrap a link, so recurse into its contents
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="text-text font-semibold">
          {renderInlineMarkdown(part.slice(2, -2))}
        </strong>
      )
    }

    const link = LINK_TOKEN.exec(part)
    if (link) {
      const [, label, url] = link
      const isExternal = url.startsWith('http://') || url.startsWith('https://')
      return (
        <Link
          key={index}
          href={url}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-primary hover:text-primary/80 underline underline-offset-2"
        >
          {label}
        </Link>
      )
    }

    return part
  })
}
