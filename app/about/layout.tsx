import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About - Miguel Angelo',
  description: 'Senior Product Designer with 10+ years shipping B2B platforms at scale. Systems thinking, AI products, and multi-market expertise.',
  alternates: {
    canonical: `${SITE.URL}/about`,
  },
  openGraph: {
    title: 'About - Miguel Angelo',
    description: 'Senior Product Designer with 10+ years shipping B2B platforms at scale. Systems thinking, AI products, and multi-market expertise.',
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
    description: 'Senior Product Designer with 10+ years shipping B2B platforms at scale. Systems thinking, AI products, and multi-market expertise.',
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
