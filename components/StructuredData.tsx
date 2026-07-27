import { SITE } from '@/lib/constants'

export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Angelo',
    jobTitle: 'AI Systems Designer',
    description: 'AI Systems Designer building high-stakes product infrastructure: agent harnesses, design systems, and evals, plus the adoption work that makes them stick. Led design through 15× revenue growth at Fast Track AI.',
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
      'Localization',
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



