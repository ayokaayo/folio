import { SITE } from '@/lib/constants'

export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Angelo',
    jobTitle: 'Intelligent Systems Designer',
    description: 'Intelligent Systems Designer converting raw compute into trustworthy tools and products for the new era.',
    url: SITE.URL,
    email: SITE.EMAIL,
    sameAs: [
      SITE.LINKEDIN,
    ],
    knowsAbout: [
      'AI Systems Design',
      'Agent Harnesses',
      'Evals',
      'Design Systems',
      'Product Design',
      'UX Design',
      'B2B SaaS',
      'Localisation',
    ],
  }

  const portfolioSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE.URL}/#website`,
    url: SITE.URL,
    name: SITE.NAME,
    description: SITE.DESCRIPTION,
    author: {
      '@type': 'Person',
      name: 'Miguel Angelo',
    },
    publisher: {
      '@type': 'Person',
      name: 'Miguel Angelo',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
    </>
  )
}



