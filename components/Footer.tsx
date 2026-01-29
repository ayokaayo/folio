'use client'

/**
 * Footer — MONO EDITION
 * 
 * - All text: IBM Plex Mono
 * - Accent: Forest green
 * - Email: Plain text with copy action
 */

import { useState } from 'react'
import { copyEmailToClipboard } from '@/lib/utils/email'
import { SITE } from '@/lib/constants'

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
    <footer className="bg-bg-surface border-t border-border-subtle">
      <div className="max-w-content mx-auto px-6 sm:px-[5vw] py-16">
        <div className="grid grid-cols-12 gap-[2vw]">
          {/* Contact */}
          <div className="col-span-12 md:col-span-4">
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-body text-text-primary">
                  {SITE.EMAIL}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="font-mono text-caption uppercase tracking-wide text-text-secondary hover:text-accent transition-colors duration-150"
                  aria-label="Copy email to clipboard"
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

          {/* Resources */}
          <div className="col-span-12 md:col-span-4">
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

          {/* Status */}
          <div className="col-span-12 md:col-span-4">
            <h3 className="font-mono text-label uppercase tracking-wide text-text-secondary mb-4">
              Status
            </h3>
            <div className="space-y-2 font-mono text-body">
              <p className="text-text-primary">
                <span className="text-text-tertiary">Based:</span> Barcelona
              </p>
              <p className="text-text-primary">
                <span className="text-text-tertiary">Open:</span> Remote, Senior Product Design
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-caption text-text-tertiary">
              © {currentYear} Miguel Angelo
            </p>
            <p className="font-mono text-caption text-text-tertiary">
              Systems thinking, crafted
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
