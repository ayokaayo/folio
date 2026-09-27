import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, projects } from '@/lib/projects'
import { SITE } from '@/lib/constants'

interface ProjectDetailLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

// Every slug is known at build time; any other renders the root not-found page at routing time, with a 404
// status (a notFound() from the page itself comes after app/loading.tsx has started a 200 response).
export const dynamicParams = false

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.id }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)

  // Unreachable for unknown ids (dynamicParams = false); narrows the type.
  if (!project) notFound()

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
