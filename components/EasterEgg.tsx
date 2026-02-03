'use client'

import { useEffect } from 'react'

export default function EasterEgg() {
  useEffect(() => {
    console.log(
      '%c👋 HELLO THERE, CURIOUS INSPECTOR!',
      'font-size: 24px; font-weight: bold; color: #10b981;'
    )
    console.log(
      '%cYou\'re viewing the portfolio of Miguel Angelo — Systems Designer.\n%cLike what you see? Let\'s build something together.\n%c→ hi@miguelangelo.tech',
      'font-size: 14px; color: #e5e7eb;',
      'font-size: 14px; color: #9ca3af; font-style: italic;',
      'font-size: 14px; color: #3b82f6; font-weight: bold;'
    )
  }, [])

  return null
}
