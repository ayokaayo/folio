# Miguel Angelo Portfolio

A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion, showcasing Miguel Angelo's product design work and case studies.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **IBM Plex Fonts** - Serif for headings, Sans for body

## Features

- Responsive design optimized for all devices
- Smooth scroll animations and transitions
- Case studies from Fast Track AI work
- Projects showcase
- About page with skills and experience
- SEO optimized
- Vercel deployment ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is configured for Vercel deployment:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Project Structure

```
folio/
├── app/              # Next.js App Router pages
│   ├── page.tsx     # Home page
│   ├── work/        # Work/case studies page
│   ├── projects/    # Projects page
│   └── about/       # About page
├── components/       # React components
│   ├── Navigation.tsx
│   ├── WorkCard.tsx
│   ├── ProjectCard.tsx
│   └── CaseStudyDetail.tsx
├── lib/             # Data and utilities
│   └── caseStudies.ts
└── docs/            # Source content (case studies)
```

## Customization

- Update personal information in `app/about/page.tsx`
- Modify case studies in `lib/caseStudies.ts`
- Adjust colors in `tailwind.config.js`
- Update metadata in `app/layout.tsx`

## License

Private - All rights reserved


