'use client'

/**
 * Footer: MONO EDITION
 *
 * - All text: IBM Plex Mono
 * - Accent: Forest green
 * - Built on 12-column grid
 */

import { useState } from 'react'
import { copyEmailToClipboard } from '@/lib/utils/email'
import { SITE } from '@/lib/constants'
import { GRID_GAP } from './ExposedGrid'
import { REVEAL } from '@/lib/reveal'

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
    <footer className="bg-bg-surface divider-dashed-grid lattice-origin relative z-10">
      <div className="lattice py-16">
        {/* 3 equal tracks (4 of 12 columns, 2 of 6); min-w-0 stops long content from widening a track off the lattice */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: `${GRID_GAP}px` }}
        >
          {/* Contact - 4 columns */}
          <div className="min-w-0" {...REVEAL}>
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-body text-text-primary">
                  *****@miguelangelo.tech
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="font-mono text-caption uppercase tracking-wide text-white bg-accent hover:bg-accent-hover px-3 py-1.5 rounded transition-colors duration-150"
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
                className="group inline-flex items-center gap-2 font-mono text-label uppercase tracking-wide text-[var(--quiet-text)] bg-[var(--quiet-bg)] border border-[var(--quiet-border)] px-3 py-1.5 rounded hover:bg-[var(--quiet-bg-hover)] hover:border-[var(--quiet-border-hover)] hover:text-[var(--quiet-text-hover)] transition-all duration-150"
              >
                LinkedIn
                <span className="text-[var(--quiet-arrow)] group-hover:text-[var(--quiet-text-hover)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>

          {/* Resources - 4 columns */}
          <div className="min-w-0" {...REVEAL}>
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Resources
            </h3>
            <a
              href="/cv/Miguel_Ferreira_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-label uppercase tracking-wide text-[var(--quiet-text)] bg-[var(--quiet-bg)] border border-[var(--quiet-border)] px-3 py-1.5 rounded hover:bg-[var(--quiet-bg-hover)] hover:border-[var(--quiet-border-hover)] hover:text-[var(--quiet-text-hover)] transition-all duration-150"
            >
              Download CV
              <span className="text-[var(--quiet-arrow)] group-hover:text-[var(--quiet-text-hover)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Status - 4 columns */}
          <div className="min-w-0" {...REVEAL}>
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Status
            </h3>
            <div className="space-y-3 font-mono text-body">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[var(--tag-text)] uppercase tracking-wide text-caption px-2 py-1 bg-[var(--tag-bg)] border border-[var(--tag-border)] rounded mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--tag-dot)]"></span>
                  BASED
                </span>
                <span className="block text-text-primary">Barcelona, Spain. Delivering Worldwide</span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[var(--tag-text)] uppercase tracking-wide text-caption px-2 py-1 bg-[var(--tag-bg)] border border-[var(--tag-border)] rounded mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--tag-dot)]"></span>
                  OPEN TO
                </span>
                <span className="block text-text-primary">Remote first. Intelligent Systems Design, Design Engineering, Design Ops, Product Design.</span>
              </div>
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
