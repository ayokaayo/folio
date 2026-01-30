'use client'

/**
 * Navigation — MONO EDITION
 * 
 * - Height: 80px
 * - Logo: MIGUEL ANGELO in IBM Plex Mono, 11px, uppercase
 * - Links: IBM Plex Mono, 11px, 40px spacing
 * - Active: 2px forest green underline, offset 8px below text
 * - Background: --bg-surface with 1px border-bottom --border-subtle
 * - Mobile: "Menu" / "×" toggle, NO animations
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NAV_ITEMS } from '@/lib/constants'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-bg-surface border-b border-border-subtle"
        style={{ height: '80px' }}
      >
        <div className="max-w-content mx-auto h-full" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <div className="flex items-center justify-between h-full">
            {/* Avatar */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Miguel Angelo home"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border-subtle group-hover:border-accent transition-colors duration-200">
                <img
                  src="/cv/MAF.jpg"
                  alt="Miguel Angelo"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-200"
                />
              </div>
            </Link>

            {/* Desktop Navigation — aligned right */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className="group relative font-mono text-label font-medium uppercase tracking-wide text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {item.name}
                    <span
                      className={`absolute left-0 right-0 h-0.5 bg-accent transition-transform duration-200 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                      style={{ bottom: '-8px' }}
                    />
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden font-mono text-label font-medium uppercase tracking-wide text-text-secondary hover:text-text-primary transition-colors duration-150 p-2 -mr-2"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? '×' : 'Menu'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay — NO animations per spec */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-bg-surface md:hidden"
          style={{ top: '80px' }}
        >
          <div className="px-6 py-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block font-mono py-4 border-b border-border-subtle text-subhead ${
                    isActive 
                      ? 'text-accent' 
                      : 'text-text-primary hover:text-accent transition-colors duration-150'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
