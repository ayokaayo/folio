import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About - Miguel Angelo',
  description: 'Natural problem solver specializing in product design, systems thinking, and multi-market platforms.',
  openGraph: {
    title: 'About - Miguel Angelo',
    description: 'Natural problem solver specializing in product design, systems thinking, and multi-market platforms.',
    url: `${SITE.URL}/about`,
    images: [
      {
        url: `${SITE.URL}${SITE.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: 'About - Miguel Angelo Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Miguel Angelo',
    description: 'Natural problem solver specializing in product design, systems thinking, and multi-market platforms.',
    images: [`${SITE.URL}${SITE.OG_IMAGE}`],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

