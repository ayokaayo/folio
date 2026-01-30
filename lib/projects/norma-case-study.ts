import type { SideProject } from './types'

export const norma: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'norma',
  hashtag: '#AI',
  year: '2024',
  title: 'Norma',
  subtitle: 'Legal workflow automation built for Philippine law firms that actually need it',
  status: 'building',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description: 'AI-powered practice management for small Philippine law firms. Handles document generation, matter tracking, and client management. Built because my wife\'s lawyer colleagues were using ChatGPT for legal work with zero awareness of compliance risks. Started as a side project, now a working proof of concept.',
  cardSummary: 'AI-powered practice management for Philippine law firms. Document generation, matter tracking, client management. Currently in development.',
  imageUrl: '/img/projects/norma/hero.png',
  imageAlt: 'Norma interface showing a demand letter being generated with AI enhancement',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: 'October 2024 - Present (2 months active development)',
  role: 'Solo founder, designer, developer',
  techStack: ['Next.js 14', 'TypeScript', 'Claude Sonnet 4', 'Supabase', 'Clerk', 'Vercel'],

  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'Test the Prototype',
      url: 'https://norma-orcin.vercel.app/',
      type: 'live',
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // MISSION
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement: 'Build legal automation that small Philippine firms can actually afford and trust.',

    spark: 'My wife studied law. Over the years, conversations with her lawyer colleagues kept circling back to the same frustration: they wanted to adopt AI tools but had no idea where to start. Some were using ChatGPT, copying and pasting legal documents with zero awareness of compliance issues or data security. Others were just drowning in repetitive work. When a Canadian lawyer friend visited Barcelona and described the same problems, something clicked. I could build this. I had access to real users, real feedback, and the technical skills. Two months in, I have a working proof of concept and access to real users for feedback when it\'s ready.',

    intent: [
      'Create something purpose-built for Philippine law firms, not a patched-together Western tool',
      'Make AI enhancement trustworthy enough for actual legal work',
      'Start with document automation because that is what kills small firm productivity',
      'Price it so solo practitioners can actually afford it, not just mid-sized firms',
      'Ship fast, iterate based on real lawyer feedback, not assumptions',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'Small law firms in the Philippines run on Word documents, Excel spreadsheets, and manual processes. The lawyers I spoke with juggle client management, document drafting, deadline tracking, and billing with no integrated system. Enterprise legal software exists but costs thousands of dollars per month and is built for US firms with different workflows and legal standards. Generic AI tools like ChatGPT are free and powerful, but lawyers paste sensitive client information into public interfaces with no encryption, no audit trails, and no understanding of the compliance risks. The gap is not features; it\'s trust, affordability, and local context.',

    opportunity: 'Claude Sonnet 4 made this possible. Previous models either hallucinated legal citations or produced generic corporate language. Sonnet 4 can maintain Philippine jurisdiction awareness, understand local legal terminology, and generate documents that sound like they came from an actual lawyer. Combine that with a purpose-built interface, proper security, and local pricing, and suddenly small firms have access to tools that were only realistic for enterprise before.',

    audience: 'Solo practitioners and firms with 2 to 5 lawyers. Provincial practices and Metro Manila firms both need this, but for slightly different reasons. Provincial lawyers have fewer resources and need affordability. Metro Manila firms face higher competition and need efficiency. Both groups are tech-curious but cautious. They will adopt if it works reliably and does not feel like gambling with client data.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'I ran interviews with 5 lawyers to map out their actual workflows. Not what they wished they had, but what they do every single day. Document generation came up in every conversation. Demand letters, contracts, motions, discovery requests. Repetitive but not automatable with simple templates because context matters. I built the prototype around a modular architecture: forms library, matter management, document generation, AI enhancement. Each module can work independently but connects when needed. Claude and Cursor handled most of the code. I focused on design decisions, testing flows, and making sure the AI outputs felt professional enough for real legal work.',

    features: [
      {
        title: 'Smart Forms Library',
        description: 'Template system with variable substitution and AI enhancement. Users start with a base form, fill in client details and case context, then trigger Claude to refine language, add legal reasoning, and format properly. Not just mail merge. The AI understands what type of document it is handling and adapts tone and structure accordingly. Common documents: demand letters, lease agreements, complaints, affidavits.',
      },
      {
        title: 'Matter Management',
        description: 'Cases are organized as "matters" with associated clients, documents, and saved variables. If you represent a client in multiple cases, their information carries across. Variables like jurisdiction, property addresses, and opposing counsel get stored per matter so you are not retyping the same details in every document. Simple, but this alone saves hours per week.',
      },
      {
        title: 'Document Lifecycle Tracking',
        description: 'Documents move through states: draft, reviewed, executed, filed. Each document gets a serial number for reference. Version control tracks changes. Not revolutionary, but small firms often lose track of which version was actually sent to the court. This prevents that.',
      },
      {
        title: 'Professional Text Editor',
        description: 'Tried multiple solutions before landing on one that handles Philippine legal formatting requirements: proper indentation, numbered paragraphs, signature blocks, and font flexibility so documents print correctly. Legal documents have strict formatting standards. Generic rich text editors break those standards constantly.',
      },
    ],

    images: [
      {
        url: '/img/projects/norma/library.png',
        alt: 'Forms library showing categorized legal templates across practice areas',
        caption: 'Template library organized by practice area with search and filtering. Each form shows category tags and descriptions so lawyers find what they need in seconds instead of scrolling through generic document lists.',
      },
      {
        url: '/img/projects/norma/form-filled.png',
        alt: 'Employment agreement form with variable fields populated',
        caption: 'Variables filled but not yet enhanced. Left panel captures case-specific details while the right panel shows the document structure in real time. This is the baseline before AI refinement.',
      },
      {
        url: '/img/projects/norma/form-processing.png',
        alt: 'AI processing indicator showing document generation in progress',
        caption: 'Claude processes the document on the server. Takes 2-5 seconds. Users see progress instead of waiting blind. Transparency builds trust when dealing with legal work.',
      },
      {
        url: '/img/projects/norma/form-enhanced.png',
        alt: 'AI-enhanced document showing professional legal structure and citations',
        caption: 'Enhanced output with proper legal structure, citations, and professional language. AI adds succession provisions, triggering event definitions, and standard legal phrasing that would take 30+ minutes to draft manually.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'Chose Claude Sonnet 4 over GPT-4 for accuracy, compliance awareness, and safety focus. Legal work cannot tolerate hallucinations.',
      'User-triggered AI enhancement instead of automatic. Gives lawyers control and keeps API costs predictable. They decide when to use AI, not the system.',
      'Server-side AI processing. API keys never touch the client. Better security, easier rate limiting, clearer billing model.',
      'Terminology shift from "Prompts" to "Forms" after a lawyer corrected me. Philippine legal culture uses "forms" for templates. "Prompts" sounded tech-forward but confused the actual users.',
      'Modular database architecture from day one. Forms module ships first, but calendar, alerts, and task management can activate later without rewriting the schema.',
      'Next.js and Vercel for deployment. Zero infrastructure management. Focus on features, not servers.',
    ],

    exploration: 'The text editor was brutal. Legal documents require specific formatting: numbered paragraphs, proper indentation, signature blocks positioned exactly right, font consistency for printing. Generic rich text editors failed these requirements constantly. I tried three solutions before finding one that worked. Added font flexibility so documents render and print impeccably regardless of system. Not glamorous work, but it is the difference between a prototype and something lawyers will actually trust with client documents.',

    image: {
      url: '/img/projects/norma/architecture.png',
      alt: 'Database schema showing modular structure with forms, matters, documents, and user tables',
      caption: 'Modular schema designed for expansion from day one. Forms, matters, and documents connect logically but remain independent. Adding calendar or billing modules later requires zero schema rewrites. This architecture decision saved weeks of refactoring.',
      isZoomable: true,
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'Working proof of concept that generates professional documents matching Philippine legal standards. The AI enhancement produces output that feels like it came from an experienced lawyer, not a template engine. Still building and testing before showing it to law firms. Legal work has zero tolerance for errors, so I am taking the validation phase seriously.',

    notes: [
      'The forms library concept makes sense immediately. Lawyers understand it in seconds.',
      'Text editor quality matters more than I expected. Lawyers notice formatting details.',
      'Pricing model still being figured out. Needs to be affordable for solo practitioners but sustainable.',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'Building for a specific market with local context is a competitive advantage, not a limitation. Generic legal software ignores the Philippines. That creates opportunity. The lawyers I spoke with deserve tools built for them, not patchy Western software adapted poorly. That sentiment drove every design decision. Also, AI quality is downstream of implementation quality. The same Claude API that produces generic summaries can generate professional legal documents if you design the prompts and context correctly.',

    openQuestions: [
      'What price point works for solo practitioners while keeping this sustainable?',
      'How much testing is enough before launching with real law firms?',
      'Should I expand features before launch or ship minimal and iterate?',
    ],

    nextSteps: [
      'Finish validation testing with at least 5 more lawyers using real case files',
      'Refine the AI prompts based on edge cases discovered during testing',
      'Build onboarding flow and documentation so lawyers can self-serve',
      'Finalize pricing model and prepare billing infrastructure',
      'Plan launch strategy: bar association partnerships, law school workshops, referrals',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/norma/editor.png',
      alt: 'Professional text editor showing employment agreement with variable substitution',
      caption: 'Custom editor built specifically for legal formatting requirements. Handles numbered articles, proper indentation, signature blocks, and variable substitution. Font flexibility ensures documents print correctly regardless of system settings. This component took the longest to get right but makes everything else possible.',
    },
    {
      url: '/img/projects/norma/documents-detail.png',
      alt: 'Document detail panel showing version history and status management',
      caption: 'Full document lifecycle tracking. Version history shows every edit with timestamps and attribution. Status progression from draft to reviewed to executed to filed. Download as PDF or TXT. Small firms lose track of which version was sent to court. This prevents that entirely.',
    },
    {
      url: '/img/projects/norma/matter-light.png',
      alt: 'Matter creation modal for organizing cases and clients',
      caption: 'Matter management connects documents to cases and clients. Auto-generated matter numbers, practice area tagging, status tracking. Once you create a matter, all its variables carry forward to future documents. No retyping client names or addresses across multiple filings.',
    },
    {
      url: '/img/projects/norma/matter-dark.png',
      alt: 'Matter management interface in dark mode showing case organization and client details',
      caption: 'Dark mode interface for extended work sessions. Same matter management with reduced eye strain. Lawyers working late nights on case prep appreciate the visual comfort without sacrificing functionality.',
    },
    {
      url: '/img/projects/norma/new-template.png',
      alt: 'Template creation interface with variable detection and firm-wide sharing',
      caption: 'Lawyers can create their own templates with variable placeholders. System auto-detects variables from the text or lets you add them manually. Share firm-wide or keep private. This turns institutional knowledge into reusable infrastructure instead of locked in senior partner brains.',
    },
    {
      url: '/img/projects/norma/settings.png',
      alt: 'Settings panel showing font customization and AI prompt configuration',
      caption: 'Font control and AI prompt customization. Users pick their preferred typeface for document rendering. Advanced users can modify the AI enhancement prompts to match their firm\'s style. Most legal software forces one way of working. This adapts to how each firm actually operates.',
    },
  ],
}
