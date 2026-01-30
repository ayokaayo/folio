'use client'

/**
 * Navigation — MONO EDITION
 *
 * - Height: 80px
 * - Logo: avatar, IBM Plex Mono
 * - Links: IBM Plex Mono, 11px
 * - Mobile: hamburger icon (animates to X), smooth menu panel, Figma-style nav items
 */

import Link from 'next/link'
import ImageWithLoader from './ImageWithLoader'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NAV_ITEMS } from '@/lib/constants'

/** Hamburger icon that animates to X when open. Rotations use viewBox center (12,12) so the X is centered. */
const X_CENTER = '12px 12px'

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="w-6 h-6 text-text-secondary transition-colors duration-150 group-hover:text-text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Top line — rotate around viewBox center so X is centered */}
      <line
        x1="4"
        y1="7"
        x2="20"
        y2="7"
        className="transition-transform duration-300 ease-out"
        style={{
          transformOrigin: X_CENTER,
          transform: open ? 'translateY(5px) rotate(45deg)' : 'translateY(0) rotate(0)',
        }}
      />
      {/* Middle line */}
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        className="transition-opacity duration-200 ease-out"
        style={{ opacity: open ? 0 : 1 }}
      />
      {/* Bottom line — rotate around viewBox center */}
      <line
        x1="4"
        y1="17"
        x2="20"
        y2="17"
        className="transition-transform duration-300 ease-out"
        style={{
          transformOrigin: X_CENTER,
          transform: open ? 'translateY(-5px) rotate(-45deg)' : 'translateY(0) rotate(0)',
        }}
      />
    </svg>
  )
}

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
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border-subtle group-hover:border-accent transition-colors duration-200 relative">
                <ImageWithLoader
                  src="/cv/MAF.jpg"
                  alt="Miguel Angelo"
                  width={40}
                  height={40}
                  objectFit="cover"
                  className="grayscale group-hover:grayscale-0 transition-all duration-200"
                  containerClassName="bg-bg-grid"
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

            {/* Mobile: hamburger / close button — 44px min touch target, above panel */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden group relative z-[60] flex items-center justify-center min-w-[44px] min-h-[44px] p-3 -mr-2 rounded cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 touch-manipulation"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              <span className="pointer-events-none">
                <HamburgerIcon open={isMobileMenuOpen} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel — always in DOM for smooth enter/leave */}
      <div
        id="mobile-nav-panel"
        className="fixed inset-0 z-40 bg-bg-surface md:hidden transition-[opacity,transform] duration-300 ease-out"
        style={{
          top: '80px',
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-12px)',
        }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-4 py-6 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className="btn-primary group w-full inline-flex items-center justify-between py-4 px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50"
              >
                <span className="font-mono text-label uppercase tracking-wide">{item.name}</span>
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
