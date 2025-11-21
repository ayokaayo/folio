import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Work - Miguel Angelo',
  description: 'Case studies showcasing product design work combining workshops, data analysis, and a growth mindset. Examples of B2B SaaS, AI-driven products, and design systems.',
  openGraph: {
    title: 'Work - Miguel Angelo',
    description: 'Case studies showcasing product design work combining workshops, data analysis, and a growth mindset.',
    url: `${SITE.URL}/work`,
    images: [
      {
        url: `${SITE.URL}${SITE.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: 'Work - Miguel Angelo Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work - Miguel Angelo',
    description: 'Case studies showcasing product design work combining workshops, data analysis, and a growth mindset.',
    images: [`${SITE.URL}${SITE.OG_IMAGE}`],
  },
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

