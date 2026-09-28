import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { REVEAL } from '@/lib/reveal'

export const metadata: Metadata = {
  title: 'Privacy · Miguel Angelo',
  description: 'How this site measures visits: cookieless, anonymous and aggregated.',
  alternates: {
    canonical: `${SITE.URL}/privacy`,
  },
}

/** What visitors are told about analytics; keep it in step with lib/analytics.ts. */
export default function PrivacyPage() {
  return (
    <main id="main-content" className="pt-20 relative min-h-screen">
      <section className="relative py-12 md:py-16">
        <div className="lattice" {...REVEAL}>
          <h1 className="font-mono font-medium text-text-primary text-headline">
            Privacy
          </h1>
          <p className="font-mono text-body text-text-secondary max-w-2xl mt-6">
            No cookies, no ads, no tracking across sites.
          </p>
        </div>
      </section>

      <section className="relative lattice pb-24">
        <div className="max-w-2xl space-y-4 font-mono text-body text-text-secondary" {...REVEAL}>
          <p>
            I use Umami, a privacy-friendly analytics tool, to count visits and see which pages and case studies are
            read, which links are clicked, and roughly where visitors come from (country, device, referring site).
          </p>
          <p>It doesn&apos;t store personal data or IP addresses.</p>
          <p>
            Any visit identifier is anonymous and short-lived, so it can&apos;t build a profile of you or recognise
            you over time.
          </p>
          <p>Data is kept for a limited period, set by the analytics provider.</p>
          <p>Browsers that send Do Not Track are not counted.</p>
          <p>
            Messages sent through the contact form go straight to my inbox via Web3Forms; the site itself stores
            nothing.
          </p>
          <p>
            Questions: reach me via{' '}
            <a
              href={SITE.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary underline underline-offset-4 hover:text-accent transition-colors duration-150"
            >
              LinkedIn
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
