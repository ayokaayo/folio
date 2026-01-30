import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Side Projects - Miguel Angelo',
  description: 'Side projects and personal work building products that solve everyday problems. Design system evolution, AI-powered tools, and mobile applications.',
  alternates: {
    canonical: `${SITE.URL}/projects`,
  },
  openGraph: {
    title: 'Side Projects - Miguel Angelo',
    description: 'Side projects and personal work building products that solve everyday problems.',
    url: `${SITE.URL}/projects`,
    images: [
      {
        url: `${SITE.URL}${SITE.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: 'Side Projects - Miguel Angelo Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Side Projects - Miguel Angelo',
    description: 'Side projects and personal work building products that solve everyday problems.',
    images: [`${SITE.URL}${SITE.OG_IMAGE}`],
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

