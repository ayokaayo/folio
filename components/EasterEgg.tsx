'use client'

import { useEffect } from 'react'

export default function EasterEgg() {
  useEffect(() => {
    console.log(
      '%c👋 HELLO THERE, CURIOUS INSPECTOR!',
      'font-size: 24px; font-weight: bold; color: #10b981;'
    )
    console.log(
      '%cYou\'re viewing the portfolio of Miguel Angelo, Systems Designer.\n%cLike what you see? Let\'s build something together.\n%c→ hi@miguelangelo.tech',
      'font-size: 14px; color: #e5e7eb;',
      'font-size: 14px; color: #9ca3af; font-style: italic;',
      'font-size: 14px; color: #3b82f6; font-weight: bold;'
    )
  }, [])

  return (
    <div
      data-easter-egg="true"
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      ╔══════════════════════════════════════════════════════════════════╗
      ║                                                                  ║
      ║   👋 HELLO THERE, SOURCE CODE EXPLORER!                          ║
      ║                                                                  ║
      ║   You&apos;re looking at the portfolio of Miguel Angelo,          ║
      ║   a Systems Designer who builds infrastructure for               ║
      ║   high-stakes operations.                                        ║
      ║                                                                  ║
      ║   Built with Next.js · Tailwind CSS · TypeScript                 ║
      ║                                                                  ║
      ║   Like what you see? Let&apos;s build something together.            ║
      ║   → hi@miguelangelo.tech                                         ║
      ║                                                                  ║
      ╚══════════════════════════════════════════════════════════════════╝
    </div>
  )
}
