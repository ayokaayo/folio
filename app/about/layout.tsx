import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About - Miguel Angelo',
  description: 'AI Systems Designer. I design the systems that let product teams build with AI: agent harnesses, design systems, evals, and the operations that make them stick.',
  alternates: {
    canonical: `${SITE.URL}/about`,
  },
  openGraph: {
    title: 'About - Miguel Angelo',
    description: 'AI Systems Designer. I design the systems that let product teams build with AI: agent harnesses, design systems, evals, and the operations that make them stick.',
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
    description: 'AI Systems Designer. I design the systems that let product teams build with AI: agent harnesses, design systems, evals, and the operations that make them stick.',
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
