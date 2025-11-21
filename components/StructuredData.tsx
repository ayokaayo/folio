import { SITE } from '@/lib/constants'

export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Angelo',
    jobTitle: 'Product Designer',
    description: 'Product Designer with 10+ years building B2B SaaS and AI-driven products. Led design through 15× revenue growth at Fast Track AI.',
    url: SITE.URL,
    email: SITE.EMAIL,
    sameAs: [
      SITE.LINKEDIN,
    ],
    knowsAbout: [
      'Product Design',
      'UX Design',
      'UI Design',
      'B2B SaaS',
      'AI Product Design',
      'Design Systems',
      'Product-led Growth',
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


