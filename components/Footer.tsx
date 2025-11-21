'use client'

// Footer component - simple, clean, and functional
// Like a good design system, it does its job without calling attention to itself
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-text/10 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Links Section */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">Links</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://linkedin.com/in/ferreiramiguelangelo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text/70 hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="/Miguel_Ferreira_Resume_v2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text/70 hover:text-primary transition-colors"
              >
                Read CV
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">Contact</h3>
            <a
              href="mailto:hi@miguelangelo.tech"
              className="text-sm text-text/70 hover:text-primary transition-colors block"
            >
              Drop me an email
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-text/10 text-sm text-text/60">
          <p>© {new Date().getFullYear()} Miguel Angelo</p>
        </div>
      </div>
    </footer>
  )
}
