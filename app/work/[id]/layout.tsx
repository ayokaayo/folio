import type { Metadata } from 'next'
import { caseStudies } from '@/lib/caseStudies'
import { SITE } from '@/lib/constants'

interface WorkDetailLayoutProps {
  children: React.ReactNode
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const caseStudy = caseStudies.find((cs) => cs.id === params.id)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found - Miguel Angelo',
      description: 'The requested case study could not be found.',
    }
  }

  // Metadata is plain text, so markdown links in the subtitle keep only their label
  const plainSubtitle = caseStudy.subtitle.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  return {
    title: `${caseStudy.title} - Miguel Angelo`,
    description: plainSubtitle,
    alternates: {
      canonical: `${SITE.URL}/work/${params.id}`,
    },
    openGraph: {
      title: `${caseStudy.title} - Miguel Angelo`,
      description: plainSubtitle,
      url: `${SITE.URL}/work/${params.id}`,
      images: [
        {
          url: caseStudy.imageUrl ? `${SITE.URL}${caseStudy.imageUrl}` : `${SITE.URL}${SITE.OG_IMAGE}`,
          width: 1200,
          height: 630,
          alt: `${caseStudy.title} - Case Study`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${caseStudy.title} - Miguel Angelo`,
      description: plainSubtitle,
      images: caseStudy.imageUrl ? [`${SITE.URL}${caseStudy.imageUrl}`] : [`${SITE.URL}${SITE.OG_IMAGE}`],
    },
  }
}

export default function WorkDetailLayout({ children }: WorkDetailLayoutProps) {
  return children
}



