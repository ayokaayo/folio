import type { SideProject } from './types'

export const norma: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'norma',
  hashtag: '#SaaS',
  year: '2026',
  title: 'Norma',
  subtitle: 'A multi-tenant platform running architecture studios, from first lead to final building permit',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description: 'Multi-tenant platform for architecture studios. Each tenant gets a branded public website plus a backoffice: CRM, approvals tracking, client portal, and an AI secretary. In production with its first studio since May 2026; financed under Romania\'s PNRR (EU NextGenerationEU).',
  cardSummary: 'Multi-tenant SaaS running architecture studios: branded website, CRM, client portal, AI secretary. In production, PNRR-funded.',
  imageUrl: '/img/projects/norma/cover.jpg',
  imageAlt: 'Norma cover: white Norma wordmark over a darkened photo of an Architecture for Humans building, with the official EU NextGenerationEU, Government of Romania, and PNRR funding badges',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: 'Oct 2024 to present · in production since May 2026',
  role: 'Founder, designer, developer',
  techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'shadcn/ui', 'Cloudflare Workers', 'Supabase Postgres', 'Drizzle', 'Clerk', 'Vercel AI SDK (Claude + Grok)', 'Inngest'],
  tags: ['multi-tenant', 'AI agent', 'GDPR'],

  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'Live Site',
      url: 'https://afharchi.com',
      type: 'live',
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // MISSION
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement: 'Give small architecture studios the operational infrastructure big practices take for granted.',

    spark: 'Norma started in October 2024 as a legal document automation proof of concept. My wife studied law, her colleagues were pasting client documents into ChatGPT, and I wanted to build something safer. The prototype worked. Validation stalled. I kept the lesson and shelved the product.\n\nA year later I rebuilt it from scratch on a production-grade stack, still aimed at law firms. Then the real client appeared: **[Architecture for Humans](http://afharchi.com/)**, an architecture practice in Romania. They design buildings, but no architect gets to design in a bureaucratic vacuum. Every project drags a second job behind it: approvals, authorizations, filings, and a deadline attached to each one. Practices routinely hire legal help purely to survive the paperwork. Different discipline, same disease as the law firms: intake in inboxes, deadlines in heads, documents in folders named final_v3. Their digitalization project had won PNRR funding (EU NextGenerationEU), and they needed a platform, not a promise.\n\nIn April 2026 I pivoted the codebase to architecture studios. A month later it was live on afharchi.com. The law-firm version survives in an archive branch.',

    intent: [
      'Run the entire studio in one system instead of email plus Excel: leads, clients, projects, approvals, offers, documents',
      'Take the repetitive compliance work off the architects and hand it to software that never forgets a deadline',
      'Give every tenant a branded public website and a private backoffice from the same codebase',
      'Make the AI a secretary, not a gimmick: real tools, real actions, real guardrails',
      'Treat GDPR and tenant isolation as foundations, not features',
      'Build for one real studio first, generalize second',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'Before a building permit lands, a construction project can require dozens of separate approvals: utilities, environment, road administration, heritage, fire safety, each with its own issuer, validity window, and expiry date. In Romania that chain is long and unforgiving, and small studios track all of it by hand: deadlines in someone\'s head, documents in email threads, status updates by phone whenever the client gets nervous. None of it is design work, and none of it is unstructured either. The process is rigid, legally defined, and repeats for every project, but the tooling is Word, Excel, and WhatsApp. Enterprise practice-management software exists and fits none of it: wrong language, wrong legal system, wrong price.',

    opportunity: 'Two waves crossed. Romania\'s recovery plan opened PNRR/C9/I3, "Digitalizarea IMM-urilor", funding small companies to digitalize. And language models got good enough to do real secretarial work: draft the email, create the record, check the schedule. A five-person studio could suddenly afford custom infrastructure, and the infrastructure could suddenly include a competent assistant.',

    audience: 'Architecture studios of one to ten people, and their clients: families building a house, companies developing property. Two very different user groups: the studio lives in the backoffice daily; the client visits the portal a few times per project, usually anxious.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'One codebase, two worlds. Each tenant gets a branded public website for portfolio, services, AI chat, and contact, plus a private backoffice: CRM, approvals tracking, documents, client portal. The marketing site and the platform share auth, design tokens, and data, so a chat lead becomes an inquiry becomes a customer becomes a project without ever leaving the system.\n\nI built it solo over a phased plan: multi-tenant shell, data foundation, backoffice, client portal, automations. Claude wrote most of the code while I owned the architecture, the design system, and every product decision.',

    features: [
      {
        title: 'Admin CRM',
        description: 'Customers, projects, offers, and documents in one place. Offers move through a tracked funnel (shown, viewed, accepted), documents generate as PDF and DOCX, including full customer reports, and every record links back to its project. The studio stopped reconstructing project history from email threads.',
        image: {
          url: '/img/projects/norma/crm-customers.png',
          alt: 'Norma admin CRM showing the customer list for an architecture studio',
          caption: 'The CRM backbone: customers, projects, offers, and documents, cross-linked. Romanian-language UI: the product ships in the tenant\'s language.',
        },
      },
      {
        title: 'The approvals register',
        description: 'The heart of the domain. Each project carries its own register of approvals and authorizations: status, issuer, validity, expiry. Scheduled reminders fire before anything expires: "three days out" is a business rule the system owns, not a calendar entry someone hopefully remembered. Everything exports cleanly when authorities ask.',
        image: {
          url: '/img/projects/norma/avize.png',
          alt: 'Project detail view with the approvals register showing statuses and expiry dates',
          caption: 'One register per project: every clearance with its status, issuer, and deadline. Inngest-scheduled reminders mean nothing lapses silently.',
        },
      },
      {
        title: 'Client portal',
        description: 'Clients sign in to see project status, approval progress, documents (signed URLs, no public buckets), offers they can accept online, and a message thread with the studio. Admins can impersonate a client to see exactly what they see, with a banner making the borrowed identity impossible to forget.',
        image: {
          url: '/img/projects/norma/portal.png',
          alt: 'Client portal dashboard showing project status and documents for a customer',
          caption: 'The client-facing world: status without phone calls. Anxious clients check the portal instead of calling the architect.',
        },
      },
      {
        title: 'Norma, the AI secretary',
        description: 'The platform\'s namesake. Inside the backoffice, a 21-tool agent drafts replies, creates customers and projects, queries the schedule, and files inquiries. Every write sits behind a whitelisted tool with per-tenant spend caps. On the public site, the same brain runs the chat widget that turns visitors into qualified leads at 2 a.m.',
        image: {
          url: '/img/projects/norma/agent.png',
          alt: 'Norma AI agent panel open in the admin backoffice',
          caption: 'The secretary at work: 21 tools across 5 permission tiers. It acts, but only through whitelisted operations, and the audit log sees everything.',
        },
      },
      {
        title: 'Lead inbox',
        description: 'Chat conversations, form submissions, and callback requests land in one inbox. Replies go out through a rich email composer with attachments and an optional booking link. The distance from "stranger asked a question" to "consultation scheduled" is one screen.',
        image: {
          url: '/img/projects/norma/inbox.png',
          alt: 'Inquiries inbox showing lead conversations and the email reply composer',
          caption: 'Every lead channel converges here. Reply with attachments and a booking CTA without leaving the platform.',
        },
      },
      {
        title: 'Tenant provisioning',
        description: 'A new studio is a super-admin workflow, not a deployment: brand, colors, locale, domain with ownership verification, and seeded starter content. The second tenant costs an afternoon, not a rebuild.',
      },
      {
        title: 'The branded website',
        description: 'Each tenant\'s public face ships from the same source tree as the backoffice: portfolio, services, consulting packages, contact, plus the legally required PNRR transparency pages with funding announcements and attachments. For [Architecture for Humans](http://afharchi.com/) this is afharchi.com: their actual production website, SEO\'d, with consent-gated analytics.',
        image: {
          url: '/img/projects/norma/site-home.jpg',
          alt: 'Architecture for Humans marketing website homepage, served by the Norma platform',
          caption: 'The branded website: afharchi.com in production. Same codebase, same design tokens, different world.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'Three-layer tenant isolation: an auth wrapper on every route, a tenant-scoped query wrapper on every database call, and Postgres row-level security underneath, backed by a cross-tenant integration test suite. Any single layer can fail without leaking a row.',
      'Clerk without Clerk Organizations: tenant and role live on user metadata. Simpler mental model, and roles stay portable across the four personas: super admin, tenant admin, staff, client.',
      'Cloudflare Workers via OpenNext, with Hyperdrive for Postgres at the edge and a Durable Object rate limiter. No servers to manage; bundle size and cold starts become design constraints instead.',
      'Dual AI backend behind one interface (Grok primary, Claude alternate) with sandboxed tool-calling, sanitized output, and per-tenant spend caps. Model choice is a config value, not an architecture decision.',
      'GDPR as infrastructure: self-service data export and erasure, an append-only audit log, a public subprocessor register, and PII-scrubbed logging.',
      'Host-based Romanian/English i18n with next-intl, no URL prefixes, and a CI key-drift guard so the two message catalogues cannot silently diverge.',
      'Tested like it matters: unit and DB integration suites, Playwright E2E across 14 zones, deployed smoke tests, and a canary probing production every 15 minutes.',
    ],

    exploration: 'Multi-tenancy is where the honest cost lives. It is easy to demo (a slug column and a WHERE clause) and easy to get quietly, catastrophically wrong. Every convenience argues against the third layer: the query wrapper already filters, the auth wrapper already checks, row-level security feels redundant right up until a refactor drops a filter at 1 a.m. I kept all three layers and wrote the cross-tenant tests that try to break them. Paranoia, but engineered.',

    image: {
      url: '/img/projects/norma/design-system.png',
      alt: 'Norma design system page showing typography scale and UI primitives',
      caption: 'The platform design system: shadcn/ui primitives over custom tokens. Warm off-white and dark themes, sharp corners, yellow as the single primary. Documented on a live /design-system page inside the product itself.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'Norma is in production at afharchi.com, running [Architecture for Humans](http://afharchi.com/) SRL, public website and backoffice, since May 2026. The build was financed under Romania\'s National Recovery and Resilience Plan: call PNRR/C9/I3 "Digitalizarea IMM-urilor", financing contract 7009/rue/i3/c9, funded by the European Union through NextGenerationEU. The funding transparency pages are part of the product; the plaque below is part of the deal.',

    notes: [
      'One codebase serves the marketing site, admin CRM, client portal, and super-admin console: four roles, two locales, 26 database migrations.',
      '356 commits in eight months, solo, AI-assisted. Production cutover a month after the pivot to architecture studios.',
      'The pivot preserved almost everything: customers, documents, offers, and inquiries translated across industries. Only the domain objects, the approvals register, were new.',
    ],

    image: {
      url: '/img/projects/norma/pnrr-banner.png',
      alt: 'Official funding banner: European Union NextGenerationEU, Government of Romania, and PNRR logos',
      caption: 'Financed by the European Union through NextGenerationEU and Romania\'s PNRR (Planul Național de Redresare și Reziliență).',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'Building against one real tenant beats designing for ten imagined ones. Every abstraction in Norma earned its place by serving [Architecture for Humans](http://afharchi.com/) first, measured against a single question: does this hand an architect back an hour they would otherwise lose to paperwork? Multi-tenancy included: the second studio was always the plan, but its shape came from the first one\'s reality.\n\nThe other lesson is about sunk cost: the law-firm version was eighteen months of conviction, and killing it took one honest look at the market. A pivot is cheaper than loyalty to a dead idea. The machinery survived; only the story changed.\n\nAnd quietly, the biggest one: a designer with AI leverage can ship production SaaS alone. Not a prototype: a platform with a funding contract, a production domain, and a client who calls when something breaks.',

    openQuestions: [
      'When does the second tenant come on board, and what breaks first when it does?',
      'Productize with self-serve onboarding, or stay bespoke: white-glove, higher touch, higher price?',
      'How much autonomy can the AI secretary take on before studios stop trusting it, and what earns that trust back?',
    ],

    nextSteps: [
      'Onboard the second tenant and measure what provisioning actually costs',
      'Take WhatsApp automations out of dry-run once business verification lands',
      'Expand analytics from funnel counts to real cohort behavior',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/norma/editor.png',
      alt: 'Document editor showing a rich-text offer document with export options',
      caption: 'The document editor: rich text over templates, with PDF and DOCX export. Offers and documents share the same editing surface.',
    },
    {
      url: '/img/projects/norma/customer-detail.png',
      alt: 'Customer detail page with project history and report generation buttons',
      caption: 'Customer detail with one-click PDF and DOCX reports: the answer to "send me everything about this client."',
    },
    {
      url: '/img/projects/norma/jurnal.png',
      alt: 'Project journal showing a chronological log of project events',
      caption: 'The project journal: an append-only log of everything that happened on a project, exportable when authorities or clients ask for history.',
    },
    {
      url: '/img/projects/norma/dark-mode.png',
      alt: 'Norma admin backoffice in dark mode',
      caption: 'Dark theme across the backoffice: same tokens, flipped values. Theme init runs before first paint, so no flash.',
    },
    {
      url: '/img/projects/norma/site-pnrr.png',
      alt: 'PNRR funding transparency page on the public marketing site',
      caption: 'The PNRR transparency pages on the public site: funding announcements, attachments, and the official plaque. A legal obligation designed as a feature.',
    },
  ],
}
