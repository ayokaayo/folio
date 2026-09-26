'use client'

import { useEffect, type RefObject } from 'react'

const CELL = 16
const PHONE = '(max-width: 639.98px)'

/**
 * On phones, where card heights follow their content, rounds a card's height up to whole 16px cells
 * (plus the 1px border overhang, see .figma-frame in globals.css) so whatever follows stays on the
 * lattice. From 640px up, card heights are fixed in CSS and this does nothing.
 */
export function useCellHeight(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia(PHONE)

    const snap = () => {
      el.style.minHeight = ''
      if (!mq.matches) return
      const natural = el.getBoundingClientRect().height
      el.style.minHeight = `${Math.ceil((natural - 1) / CELL) * CELL + 1}px`
    }

    // Only width changes re-wrap text; reacting to height too would loop on our own min-height.
    let width = 0
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w === width) return
      width = w
      snap()
    })
    ro.observe(el)
    mq.addEventListener('change', snap)
    document.fonts?.ready.then(snap)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', snap)
    }
  }, [ref])
}
