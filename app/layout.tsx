import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import StructuredData from '@/components/StructuredData'
import { SITE } from '@/lib/constants'

// Font configuration - IBM Plex chosen for its excellent readability
// and professional aesthetic that matches Miguel's design philosophy
const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
  preload: true,
})

const ibmPlexSerif = IBM_Plex_Serif({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-serif',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Miguel Angelo - Product Designer',
  description: 'Senior Product Designer with 10+ years building B2B platforms for localization, iGaming, and AI-powered systems.',
  keywords: 'product design, UX design, UI design, B2B SaaS, iGaming, enterprise software, design systems',
  authors: [{ name: 'Miguel Angelo' }],
  creator: 'Miguel Angelo',
  publisher: 'Miguel Angelo',
  metadataBase: new URL('https://miguelangelo.tech'),
  icons: {
    icon: '/cv/MAF.jpg',
  },
  openGraph: {
    title: 'Miguel Angelo - Product Designer',
    description: 'Senior Product Designer with 10+ years building B2B platforms for localization, iGaming, and AI-powered systems.',
    url: SITE.URL,
    siteName: 'Miguel Angelo Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE.URL}${SITE.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: 'Miguel Angelo - Product Designer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miguel Angelo - Product Designer',
    description: 'Senior Product Designer with 10+ years building B2B platforms for localization, iGaming, and AI-powered systems.',
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
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable}`}>
      <body className={`${ibmPlexSans.className}`}>
        <StructuredData />
        <ErrorBoundary>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
            Skip to main content
          </a>
          <Navigation />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
