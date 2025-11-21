import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About - Miguel Angelo',
  description: 'Learn about Miguel Angelo, a Product Designer with 10+ years of experience in B2B SaaS, AI-driven products, and design systems. Background, skills, and journey.',
  openGraph: {
    title: 'About - Miguel Angelo',
    description: 'Learn about Miguel Angelo, a Product Designer with 10+ years of experience in B2B SaaS, AI-driven products, and design systems.',
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
    description: 'Learn about Miguel Angelo, a Product Designer with 10+ years of experience in B2B SaaS, AI-driven products, and design systems.',
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

