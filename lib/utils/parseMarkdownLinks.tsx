import React from 'react'
import Link from 'next/link'

/**
 * Parses markdown link syntax [text](url) from a string and returns React elements
 * Handles mixed content with both plain text and links
 * 
 * @param text - String that may contain markdown links
 * @returns Array of React elements (text nodes and Link components)
 */
export function parseMarkdownLinks(text: string): React.ReactNode[] {
  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    
    // Extract link text and URL
    const linkText = match[1]
    const url = match[2]
    
    // Check if it's an external URL (starts with http/https)
    const isExternal = url.startsWith('http://') || url.startsWith('https://')
    
    // Add the link
    if (isExternal) {
      parts.push(
        <Link
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline"
        >
          {linkText}
        </Link>
      )
    } else {
      parts.push(
        <Link
          key={`link-${match.index}`}
          href={url}
          className="text-primary hover:text-primary/80 underline"
        >
          {linkText}
        </Link>
      )
    }
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  // If no links were found, return the original text
  if (parts.length === 0) {
    return [text]
  }
  
  return parts
}

/**
 * Strips markdown link syntax [text](url) down to just "text".
 * Useful when you want plain text (e.g. inside a clickable card)
 * to avoid nested <a> tags that break hydration.
 */
export function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
}

