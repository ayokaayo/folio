'use client'

import Script from 'next/script'
import { TRACKER_ENABLED, UMAMI_DOMAINS, UMAMI_WEBSITE_ID, beforeSend, flushQueue } from '@/lib/analytics'

// The payload hook must exist before the tracker sends its first page view. This module runs when the
// client bundle loads, before next/script injects an afterInteractive script.
if (typeof window !== 'undefined') window.umamiBeforeSend = beforeSend

/**
 * Cookieless analytics (lib/analytics.ts), loaded straight from Umami Cloud in production builds with a
 * website ID. Counts only the listed domains and skips browsers that send Do Not Track.
 */
export default function Analytics() {
  if (!TRACKER_ENABLED) return null
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      strategy="afterInteractive"
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={UMAMI_DOMAINS}
      data-do-not-track="true"
      data-before-send="umamiBeforeSend"
      onLoad={flushQueue}
    />
  )
}
