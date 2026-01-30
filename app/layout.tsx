import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import StructuredData from '@/components/StructuredData'
import { SITE } from '@/lib/constants'

// MONO ONLY — IBM Plex Mono for all typography
const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Miguel Angelo — Systems Designer',
  description: 'Senior Product Designer with 10+ years designing infrastructure for high-stakes operations: B2B SaaS, iGaming, and AI-powered systems.',
  keywords: 'product design, UX design, UI design, B2B SaaS, iGaming, enterprise software, design systems, AI products',
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
    title: 'Miguel Angelo — Systems Designer',
    description: 'Senior Product Designer with 10+ years designing infrastructure for high-stakes operations.',
    url: SITE.URL,
    siteName: 'Miguel Angelo Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE.URL}${SITE.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: 'Miguel Angelo — Systems Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miguel Angelo — Systems Designer',
    description: 'Senior Product Designer with 10+ years designing infrastructure for high-stakes operations.',
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
    <html lang="en" className={`${ibmPlexMono.variable}`}>
      <body className={`${ibmPlexMono.className} antialiased`}>
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
