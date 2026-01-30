'use client'

/**
 * Footer — MONO EDITION
 *
 * - All text: IBM Plex Mono
 * - Accent: Forest green
 * - Built on 12-column grid
 */

import { useState } from 'react'
import { copyEmailToClipboard } from '@/lib/utils/email'
import { SITE } from '@/lib/constants'
import { GRID_GAP } from './ExposedGrid'

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    const success = await copyEmailToClipboard()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-surface divider-dashed-grid relative z-10">
      <div
        className="max-w-content mx-auto py-16"
        style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px` }}
      >
        {/* 3-column layout using flexbox grid */}
        <div
          className="flex flex-col md:flex-row"
          style={{ gap: `${GRID_GAP}px` }}
        >
          {/* Contact - 4 columns */}
          <div style={{ flex: '4 4 0%' }}>
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-body text-text-primary">
                  *****@miguelangelo.tech
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="font-mono text-caption uppercase tracking-wide text-white bg-[#008FF0] hover:bg-[#0077CC] px-3 py-1.5 rounded transition-colors duration-150"
                  aria-label="Copy email to clipboard"
                  title="Copy real email address"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <a
                href={SITE.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-body text-text-primary hover:text-accent transition-colors duration-150"
              >
                LinkedIn →
              </a>
            </div>
          </div>

          {/* Resources - 4 columns */}
          <div style={{ flex: '4 4 0%' }}>
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Resources
            </h3>
            <a
              href="/cv/Miguel_Ferreira_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-mono text-body text-text-primary hover:text-accent transition-colors duration-150"
            >
              Download CV →
            </a>
          </div>

          {/* Status - 4 columns */}
          <div style={{ flex: '4 4 0%' }}>
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Status
            </h3>
            <div className="space-y-2 font-mono text-body">
              <p className="text-text-primary">
                <span className="text-text-tertiary uppercase tracking-wide text-label">BASED:</span> Barcelona
              </p>
              <p className="text-text-primary">
                <span className="text-text-tertiary uppercase tracking-wide text-label">OPEN:</span> Remote, Sr. Product Design, Design Ops
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 divider-dashed-grid">
          <p className="font-mono text-caption text-text-tertiary">
            © {currentYear} miguelangelo.tech
          </p>
        </div>
      </div>
    </footer>
  )
}
