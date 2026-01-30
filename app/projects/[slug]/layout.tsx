import type { Metadata } from 'next'
import { getProjectBySlug } from '@/lib/projects'
import { SITE } from '@/lib/constants'

interface ProjectDetailLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found - Miguel Angelo',
      description: 'The requested project could not be found.',
    }
  }

  const title = `${project.title} - Miguel Angelo`
  const description = project.subtitle || project.description
  const imageUrl = project.imageUrl ? `${SITE.URL}${project.imageUrl}` : `${SITE.URL}${SITE.OG_IMAGE}`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.URL}/projects/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE.URL}/projects/${params.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} - Side Project`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function ProjectDetailLayout({ children }: ProjectDetailLayoutProps) {
  return children
}
