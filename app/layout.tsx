import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import StructuredData from '@/components/StructuredData'
import EasterEgg from '@/components/EasterEgg'
import { SITE } from '@/lib/constants'
import { PALETTE_BOOT } from '@/lib/palette/preview'
import { REVEAL_BOOT } from '@/lib/reveal'

// MONO ONLY: IBM Plex Mono for all typography
const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Miguel Angelo · Intelligent Systems Designer',
  description: 'Intelligent Systems Designer turning LLMs into tools that teams can trust. Over a decade of highly regulated B2B products, from iGaming and localisation to enterprise software.',
  keywords: 'intelligent systems design, AI systems design, agent harnesses, evals, design systems, product design, B2B SaaS, iGaming, enterprise software, localisation',
  authors: [{ name: 'Miguel Angelo' }],
  creator: 'Miguel Angelo',
  publisher: 'Miguel Angelo',
  metadataBase: new URL('https://miguelangelo.tech'),
  alternates: {
    canonical: SITE.URL,
  },
  icons: {
    icon: '/cv/MAF.jpg',
  },
  openGraph: {
    title: 'Miguel Angelo · Intelligent Systems Designer',
    description: 'Turning LLMs into tools that teams can trust, after over a decade of highly regulated B2B products, from iGaming and localisation to enterprise software.',
    url: SITE.URL,
    siteName: 'Miguel Angelo Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE.URL}${SITE.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: 'Miguel Angelo · Intelligent Systems Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miguel Angelo · Intelligent Systems Designer',
    description: 'Turning LLMs into tools that teams can trust, after over a decade of highly regulated B2B products, from iGaming and localisation to enterprise software.',
    images: [`${SITE.URL}${SITE.OG_IMAGE}`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Boot scripts set attributes on <html> before hydration (reveal state; the dev palette).
    <html lang="en" className={`${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Scroll reveal; see lib/reveal.ts */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
        {/* Dev-only palette preview; see lib/palette/preview.ts */}
        {process.env.NODE_ENV !== 'production' && <script dangerouslySetInnerHTML={{ __html: PALETTE_BOOT }} />}
      </head>
      <body className={`${ibmPlexMono.className} antialiased`}>
        <EasterEgg />
        <StructuredData />
        <ErrorBoundary>
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <Navigation />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
      {SITE.GA_ID && <GoogleAnalytics gaId={SITE.GA_ID} />}
    </html>
  )
}
