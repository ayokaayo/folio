import type { SideProject } from './types'

/**
 * TEMPLATE: Side Project Entry
 * 
 * Philosophy: Side projects exist for the joy of creation.
 * Impact is a consequence, never the goal.
 * Lead with MISSION — the creative intent, the spark, the "why."
 * 
 * Copy this file and rename to your project slug (e.g., 'design-system.ts')
 * Target read time: ~5 minutes
 * Structure: Mission → Context → Creation → Craft → Outcome → Reflection
 */

export const templateProject: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'project-slug',                         // URL-safe slug
  hashtag: '#Category',                        // e.g., '#Design System', '#Mobile App', '#AI Tool'
  year: '2024',                                // Single year or range '2023-2024'
  title: 'Project Name',                       // Clear, memorable title
  subtitle: 'The creative intent in one line',
  status: 'live',                              // 'live' | 'beta' | 'archived' | 'building'
  
  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // This appears on the /projects listing page
  // ─────────────────────────────────────────────────────────────
  description: 'Two to three sentences that capture the spirit of the project. What is this? What drove you to build it? Focus on the idea, not the outcomes.',
  imageUrl: '/img/projects/project-slug/hero.png',
  imageAlt: 'Descriptive alt text for accessibility and SEO',
  
  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // Quick context for the detail page header
  // ─────────────────────────────────────────────────────────────
  timeline: 'Q2 2024 (6 weeks)',               // When + duration
  role: 'Design & Development',                // Your role(s)
  techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Figma'],
  
  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // Side projects live outside portfolios — these get prominence
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'Live Site',
      url: 'https://example.com',
      type: 'live',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/username/repo',
      type: 'code',
    },
    {
      label: 'Figma Prototype',
      url: 'https://figma.com/file/...',
      type: 'design',
    },
  ],
  
  // ─────────────────────────────────────────────────────────────
  // MISSION SECTION (~30 seconds)
  // 
  // Why does this exist? What's the creative intent?
  // This is NOT about impact or outcomes — those are consequences.
  // This is about the spark, the curiosity, the thing you wanted to make.
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement: 'One sentence that captures why this project exists. Not what it does — why it matters to you.',
    
    spark: 'What triggered this? A frustration you kept hitting? A curiosity you couldn\'t shake? An idea that wouldn\'t leave you alone? Be specific and personal.',
    
    intent: [
      'What you set out to explore or create — framed as intent, not achievement',
      'Another aspect of the creative goal',
      'A third thing you wanted to figure out or build',
      // 2-4 items. These are intentions, not outcomes.
    ],
  },
  
  // ─────────────────────────────────────────────────────────────
  // CONTEXT SECTION (~1 minute)
  // 
  // The space this project lives in.
  // Not "the problem" (that's case study framing) —
  // rather, the situation or observation that made you act.
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'What situation, observation, or experience led to this project? What were you noticing or thinking about? Set the scene without framing it as a "business problem."',
    
    opportunity: 'What gap or possibility did you see? What could exist that didn\'t? This is about creative opportunity, not market opportunity.',
    
    audience: 'Who might find this useful or interesting? Optional — some projects are just for you, and that\'s valid.',
  },
  
  // ─────────────────────────────────────────────────────────────
  // CREATION SECTION (~2 minutes)
  // 
  // What you built and how you approached it.
  // Frame features as creative choices, not "solutions."
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'How did you tackle this? What shaped your choices? What constraints did you embrace? This is about your creative process, not a methodology.',
    
    features: [
      {
        title: 'Feature or Element Name',
        description: 'What this is and why you made it this way. Focus on the craft and the choice, not the user benefit.',
        image: {
          url: '/img/projects/project-slug/feature-1.png',
          alt: 'Feature screenshot or mockup',
          caption: 'Caption explaining what we\'re seeing',
        },
      },
      {
        title: 'Second Feature',
        description: 'Same pattern: what you made and why you made it that way.',
      },
      {
        title: 'Third Feature',
        description: 'Three features is usually enough. Quality over quantity.',
      },
    ],
    
    images: [
      {
        url: '/img/projects/project-slug/creation-overview.png',
        alt: 'Full interface or system view',
        caption: 'Caption for context',
      },
    ],
  },
  
  // ─────────────────────────────────────────────────────────────
  // CRAFT NOTES (~1 minute, optional)
  // 
  // For projects where the making is interesting.
  // Show your thinking, trade-offs, evolution.
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'A key decision you made and why — show the trade-off',
      'Another choice that shaped the work',
      'Something you tried that didn\'t work, and what you learned',
      // 3-4 decisions. These show your thinking.
    ],
    
    exploration: 'How did the project evolve? What did you try? What surprised you? This is about the journey, not the destination.',
    
    image: {
      url: '/img/projects/project-slug/craft.png',
      alt: 'Design iterations, system diagram, or process artifact',
      caption: 'Optional caption',
    },
  },
  
  // ─────────────────────────────────────────────────────────────
  // OUTCOME SECTION (optional)
  // 
  // What emerged AFTER you shipped — as natural consequences,
  // not as success metrics. Only include if something
  // interesting actually happened.
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'What happened after you put this into the world? Feedback, adoption, surprises? This is observational, not promotional.',
    
    notes: [
      'An observation or piece of feedback that was interesting',
      'Something unexpected that happened',
      // Optional. Only include genuine, interesting outcomes.
    ],
  },
  
  // ─────────────────────────────────────────────────────────────
  // REFLECTION (~30 seconds, optional)
  // 
  // What you took away personally.
  // This is about your growth, not the project's "success."
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'What did this project teach you? One clear thought that you carry forward.',
    
    openQuestions: [
      'Something you\'re still thinking about',
      'A question this project raised but didn\'t answer',
      // Optional. Shows intellectual honesty.
    ],
    
    nextSteps: [
      'Where this might go, if anywhere',
      'Not a roadmap — just possibilities',
      // Optional. Only include if genuinely planned.
    ],
  },
  
  // ─────────────────────────────────────────────────────────────
  // GALLERY (optional)
  // Additional images for visual projects
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/project-slug/gallery-1.png',
      alt: 'Descriptive alt text',
      caption: 'What this shows',
    },
  ],
}

/**
 * TONE GUIDELINES
 * 
 * Side projects ≠ case studies. Different voice.
 * 
 * DO:
 * - Lead with creative intent, not business outcomes
 * - Be personal — this is YOUR project, not a client's
 * - Show curiosity and exploration
 * - Admit what you're still figuring out
 * - Frame features as choices, not "solutions"
 * 
 * DON'T:
 * - Lead with impact metrics (save that for case studies)
 * - Use business/consulting language ("stakeholders", "ROI", "KPIs")
 * - Treat this like a pitch deck
 * - Pretend everything was planned from the start
 * - Over-justify your choices
 * 
 * VOICE:
 * - Curious, not promotional
 * - Personal, not corporate
 * - Honest about uncertainty
 * - Passionate about the craft
 * 
 * REMEMBER:
 * Impact is a consequence we can measure later.
 * The mission — the creative intent — is why you built this.
 */
