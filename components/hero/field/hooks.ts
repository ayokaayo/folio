'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

/** True while the element is on screen and the tab is visible. Use it to pause render loops. */
export function useActive(ref: RefObject<Element>): boolean {
  const [onScreen, setOnScreen] = useState(true)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return onScreen && visible
}

/** Latest value in a ref, so rAF loops can read props without re-subscribing. */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

/** Device pixel ratio capped for fill-rate sanity. */
export function cappedDpr(max = 2): number {
  if (typeof window === 'undefined') return 1
  return Math.min(window.devicePixelRatio || 1, max)
}
