# Case Study File Specification

This document provides the exact specification for writing case study files that will integrate seamlessly with the portfolio codebase.

## File Location & Naming

- **Location**: `lib/caseStudies/[case-study-id].ts`
- **Naming**: Use kebab-case (e.g., `dropdown-builder.ts`, `sms-characters.ts`)
- **Export**: Must export a named constant matching the file name (e.g., `export const dropdownBuilder: CaseStudy = { ... }`)

## Required Import

```typescript
import type { CaseStudy } from './types'
```

## Complete CaseStudy Interface Structure

### Top-Level Required Fields

```typescript
{
  id: string                    // Unique identifier (kebab-case, matches filename)
  title: string                 // Main title (Title Case)
  subtitle: string              // Brief description (sentence case)
  hashtag: string               // Category tag (e.g., "#0 to 1", "#Growth design")
  company: string               // Company name
  year: string                  // Year (e.g., "2023", "2024")
  linkText: string              // Link text (e.g., "Read case study")
  timeline: string              // Project timeline (e.g., "Q3 2023 (single quarter delivery)")
  team: string                  // Team composition (e.g., "5 (Product Design lead, 2 Engineers, QA, Product Manager)")
  
  // Optional top-level fields
  linkUrl?: string              // External link (if applicable)
  imageUrl?: string              // Hero image path (e.g., "/img/dropdown/HeaderDropdownWide.png")
  imageAlt?: string             // Hero image alt text
  coverImageUrl?: string         // Cover image path (alternative to imageUrl)
  coverImageAlt?: string        // Cover image alt text
  images?: ImageWithCaption[]   // Top-level image gallery (see Image Structure below)
}
```

### Image Structure

All images use the `ImageWithCaption` interface:

```typescript
{
  url: string        // REQUIRED: Path from /public (e.g., "/img/dropdown/interface.png")
  alt: string        // REQUIRED: Alt text for accessibility
  caption?: string   // OPTIONAL: Caption displayed below image
}
```

**Example:**
```typescript
images: [
  {
    url: '/img/dropdown/interface-screenshot.png',
    alt: 'Dropdown interface showing progressive disclosure',
    caption: 'The new interface with category selection'
  }
]
```

### Section Structures

#### 1. Impact Section (REQUIRED)

```typescript
  impact: {
    title: string                    // Section title (Title Case: "Impact")
    items: string[]                  // REQUIRED: Full list of impact items
    quickItems?: string[]            // OPTIONAL: Shortened list for quick read mode
    deepItems?: string[]             // OPTIONAL: Expanded list for deep dive mode
    images?: ImageWithCaption[]      // OPTIONAL: Images for this section (rendered automatically)
  }
```

**Mode Logic:**
- Quick mode: Uses `quickItems` if available, otherwise first 4 items from `items`
- Deep mode: Uses `deepItems` if available, otherwise all `items`

**Example:**
```typescript
impact: {
  title: 'Impact',
  items: [
    'Selection efficiency: Single-field picks: 60+ seconds → <5 seconds',
    'System-wide adoption: Zero support documentation needed',
    '12+ months stable post-launch with no material rework',
  ],
  quickItems: [
    '60+ seconds → <5 seconds selection time',
    'Zero support docs needed',
    '12+ months stable, no rework',
  ],
  images: [
    {
      url: '/img/dropdown/impact-metrics.png',
      alt: 'Metrics dashboard showing improvement',
      caption: 'Measured improvements over 6 months'
    }
  ]
}
```

#### 2. Problem Section (REQUIRED)

```typescript
problem: {
  title: string                    // Section title (Title Case: "The Problem")
  context: string                  // REQUIRED: Full context description
  issues: string[]                 // REQUIRED: List of issues (can be strings or objects)
  whyItMattered: string[]         // REQUIRED: Why the problem mattered
  quickContext?: string            // OPTIONAL: Shortened context for quick mode
  quickIssues?: string[]           // OPTIONAL: Shortened issues list for quick mode
  images?: ImageWithCaption[]      // OPTIONAL: Images for this section (rendered automatically)
}
```

**Issues can be strings OR objects:**

**String format:**
```typescript
issues: [
  '200+ fields scattered in pure alphabetical order',
  'No search, no grouping - users scrolled endlessly',
]
```

**Object format (for structured issues):**
```typescript
issues: [
  {
    category: 'Market Barriers',
    description: 'Brazil operators explicitly required a Portuguese interface...',
    impact: 'Zero market access in three high-value regions'
  },
  {
    category: 'Operational Pain',
    description: 'Support teams were manually calculating SLA windows...',
    impact: 'Lost productivity, increased support load'
  }
]
```

**Example:**
```typescript
problem: {
  title: 'The Problem',
  context: "Fast Track AI's iGaming CRM processes millions in daily transactions...",
  quickContext: '200+ fields in one dropdown. Users lost, errors common.',
  issues: [
    '200+ fields scattered in pure alphabetical order',
    'No search, no grouping - users scrolled endlessly',
  ],
  quickIssues: [
    '200+ fields in alphabetical chaos',
    'No context until after selection',
  ],
  whyItMattered: [
    'In iGaming CRM, precision is non-negotiable',
    'Partner complaints about usability',
  ],
  images: [
    {
      url: '/img/dropdown/problem-before.png',
      alt: 'Old interface showing chaotic dropdown',
      caption: 'Before: 200+ fields in alphabetical order'
    }
  ]
}
```

#### 3. Approach Section (REQUIRED)

```typescript
approach: {
  title: string                    // Section title (Title Case: "My Approach")
  decisions: Array<{               // REQUIRED: Array of decision objects
    title: string                  // Decision title (e.g., "1. Progressive disclosure")
    decision: string               // The decision made
    rationale: string             // Why this decision (shown in deep mode only)
    result: string                // Outcome of the decision
  }>
}
```

**Example:**
```typescript
approach: {
  title: 'My Approach',
  decisions: [
    {
      title: '1. Progressive disclosure over all-at-once',
      decision: 'Three-step flow (category → field → values)',
      rationale: 'Operators told us they don\'t always remember exact field names - they want to browse',
      result: 'Interface teaches as you use it, reducing cognitive load',
    },
    {
      title: '2. Real-time context at decision point',
      decision: 'Show audience coverage, sample values, data type hints as you select',
      rationale: 'Users want to see impact before committing',
      result: 'Reduced second-guessing and mis-selections',
    }
  ]
}
```

#### 4. Design Decisions Section (REQUIRED)

```typescript
designDecisions: Array<{
  title: string                    // Decision title
  description: string             // Detailed description
}>
```

**Example:**
```typescript
designDecisions: [
  {
    title: 'Category Taxonomy',
    description: 'Groups match how work is actually done (not database schema)...',
  },
  {
    title: 'Contextual Information Density',
    description: 'Real-time feedback shows: Audience coverage, Sample values...',
  }
]
```

**Note:** Design decisions are only shown in **deep dive mode**.

#### 5. Implementation Section (REQUIRED)

```typescript
implementation: {
  title: string                    // Section title (Title Case: "Implementation")
  technical: string[]              // REQUIRED: Technical approach items
  rollout: string[]                // REQUIRED: Rollout strategy (shown in deep mode only)
  quickTechnical?: string[]         // OPTIONAL: Shortened technical items for quick mode
  images?: ImageWithCaption[]      // OPTIONAL: Images for this section (rendered automatically)
}
```

**Rollout can be strings OR objects:**

**String format:**
```typescript
rollout: [
  'Weeks 1-3: Ideation - Gathered evidence, built field dictionary',
  'Weeks 4-9: Platform Integration - Embedded in Segment Builder',
]
```

**Object format (for structured rollout):**
```typescript
rollout: [
  {
    phase: 'Weeks 1-2: Audit',
    activities: [
      'We mapped out 8 unique time-measuring components',
      'Identified and tagged over 20,000 translatable strings',
    ]
  },
  {
    phase: 'Weeks 3-10: Parallel Development',
    activities: [
      'The timezone track focused on dual clocks',
      'Simultaneously, the localization track built out the translation pipeline',
    ]
  }
]
```

**Example:**
```typescript
implementation: {
  title: 'Implementation',
  technical: [
    'Built as reusable component with full specs and API contract',
    'Design system integration with accessibility notes',
    'Performance budgets - long lists virtualized, metadata cached',
  ],
  quickTechnical: [
    'Reusable component architecture',
    'Performance optimized (virtualization)',
  ],
  rollout: [
    'Weeks 1-3: Ideation - Gathered evidence, built field dictionary',
    'Weeks 4-9: Platform Integration - Embedded in Segment Builder',
  ],
  images: [
    {
      url: '/img/dropdown/system-architecture.png',
      alt: 'System architecture diagram',
      caption: 'Component integration points'
    }
  ]
}
```

#### 6. Validation Section (REQUIRED)

```typescript
validation: {
  title: string                    // Section title (Title Case: "Validation & Results")
  outcomes: string[]               // REQUIRED: Measured outcomes
  feedback: string[]               // REQUIRED: User feedback (shown in deep mode only)
  technical: string[]              // REQUIRED: Technical validation (shown in deep mode only)
  quickOutcomes?: string[]         // OPTIONAL: Shortened outcomes for quick mode
  images?: ImageWithCaption[]      // OPTIONAL: Images for this section (rendered automatically)
}
```

**Outcomes can be strings OR objects:**

**String format:**
```typescript
outcomes: [
  'Selection speed dramatically improved',
  'Support tickets for field selection essentially disappeared',
]
```

**Object format (for structured outcomes):**
```typescript
outcomes: [
  {
    category: 'Production Stability',
    results: [
      'Zero critical incidents occurred post-launch',
      'No performance degradation from the new features',
    ]
  },
  {
    category: 'Market Activation',
    results: [
      'Brazil saw multiple enterprise partners successfully onboarded',
      'LatAm partners across 5 countries activated',
    ]
  }
]
```

**Feedback can be strings OR objects:**

**String format:**
```typescript
feedback: [
  '"Makes complex features much easier to find and use"',
  '"Reduced training time for new team members"',
]
```

**Object format (for attributed feedback):**
```typescript
feedback: [
  {
    quote: 'Finally we can serve our Brazilian clients properly',
    source: 'Enterprise partner, Brazil'
  },
  {
    quote: 'The Chinese localization is better than competitors',
    source: 'APAC strategic account'
  }
]
```

**Example:**
```typescript
validation: {
  title: 'Validation & Results',
  outcomes: [
    'Selection speed dramatically improved (qualitative feedback + usage telemetry)',
    'Support tickets for field selection essentially disappeared',
  ],
  quickOutcomes: [
    'Speed improved from 60+ to <5 seconds',
    'Support tickets eliminated',
  ],
  feedback: [
    '"Makes complex features much easier to find and use"',
    '"Reduced training time for new team members"',
  ],
  technical: [
    'Zero critical incidents post-launch',
    'No material rework needed for 12+ months',
  ],
  images: [
    {
      url: '/img/dropdown/results-chart.png',
      alt: 'Results chart showing improvement',
      caption: 'Measured outcomes over 6 months'
    }
  ]
}
```

#### 7. Learned Section (REQUIRED)

```typescript
learned: {
  title: string                    // Section title (Title Case: "What I Learned")
  worked: string[]                 // REQUIRED: What worked well (shown in deep mode only)
  insight: string                  // REQUIRED: Main insight
  challenges: Array<{              // REQUIRED: Challenges and solutions (shown in deep mode only)
    challenge: string              // The challenge faced
    solution: string               // How it was solved
  }>
  quickInsight?: string            // OPTIONAL: Shortened insight for quick mode
}
```

**Example:**
```typescript
learned: {
  title: 'What I Learned',
  worked: [
    'Card sorting revealed operator mental models - categories became obvious',
    'Progressive disclosure reduced noise - faster decisions',
  ],
  challenges: [
    {
      challenge: 'Overlapping categories',
      solution: 'Allowed deliberate duplicates, documented why',
    },
    {
      challenge: '200+ fields to document',
      solution: 'Combined database exports with manual review',
    }
  ],
  insight: 'Consistency multiplies value. One taxonomy, one component = easy reuse, reduced variance across product.',
  quickInsight: 'Progressive disclosure beats comprehensive display every time.',
}
```

#### 8. Process Section (OPTIONAL - Deep Mode Only)

```typescript
process?: {
  title: string                    // Section title (Title Case: "Process")
  content: string[]                // Process steps/description
}
```

**Example:**
```typescript
process: {
  title: 'Process',
  content: [
    'Discovery: Conducted card sorting with 12 operators to understand mental models.',
    'Design: Prototyped three approaches - search-first, browse-first, hybrid.',
    'Validation: A/B tested with pilot group. Measured task completion time.',
  ]
}
```

## Complete Example Template

```typescript
import type { CaseStudy } from './types'

export const yourCaseStudy: CaseStudy = {
  id: 'your-case-study-id',
  title: 'Your Case Study Title',
  subtitle: 'Brief description of what was achieved',
  hashtag: '#Category',
  company: 'Company Name',
  year: '2024',
  linkText: 'Read case study',
  imageUrl: '/img/your-folder/hero-image.png',
  imageAlt: 'Description of hero image',
  timeline: '2024 (6 months)',
  team: '4 (Product Designer, 3 Engineers)',

  impact: {
    title: 'Impact',
    items: [
      'Full impact item 1',
      'Full impact item 2',
    ],
    quickItems: [
      'Quick impact item 1',
      'Quick impact item 2',
    ],
    images: [
      {
        url: '/img/your-folder/impact-image.png',
        alt: 'Impact image description',
        caption: 'Optional caption'
      }
    ]
  },

  problem: {
    title: 'The Problem',
    context: 'Full context description here...',
    quickContext: 'Short context for quick mode',
    issues: [
      'Issue 1',
      'Issue 2',
    ],
    quickIssues: [
      'Quick issue 1',
      'Quick issue 2',
    ],
    whyItMattered: [
      'Reason 1',
      'Reason 2',
    ],
    images: [
      {
        url: '/img/your-folder/problem-image.png',
        alt: 'Problem image description',
        caption: 'Optional caption'
      }
    ]
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Decision Title',
        decision: 'What was decided',
        rationale: 'Why this decision (deep mode only)',
        result: 'What happened as a result',
      }
    ]
  },

  designDecisions: [
    {
      title: 'Design Decision Title',
      description: 'Detailed description of the design decision',
    }
  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'Technical approach item 1',
      'Technical approach item 2',
    ],
    quickTechnical: [
      'Quick technical item 1',
    ],
    rollout: [
      'Rollout phase 1',
      'Rollout phase 2',
    ],
    images: [
      {
        url: '/img/your-folder/implementation-image.png',
        alt: 'Implementation image description',
        caption: 'Optional caption'
      }
    ]
  },

  validation: {
    title: 'Validation & Results',
    outcomes: [
      'Outcome 1',
      'Outcome 2',
    ],
    quickOutcomes: [
      'Quick outcome 1',
    ],
    feedback: [
      '"User feedback quote"',
    ],
    technical: [
      'Technical validation item 1',
    ],
    images: [
      {
        url: '/img/your-folder/validation-image.png',
        alt: 'Validation image description',
        caption: 'Optional caption'
      }
    ]
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'What worked 1',
      'What worked 2',
    ],
    challenges: [
      {
        challenge: 'Challenge description',
        solution: 'Solution description',
      }
    ],
    insight: 'Main insight paragraph',
    quickInsight: 'Quick insight for quick mode',
  },

  process: {
    title: 'Process',
    content: [
      'Process step 1',
      'Process step 2',
    ]
  }
}
```

## Image Path Guidelines

1. **Location**: All images go in `/public/img/[case-study-folder]/`
2. **Naming**: Use kebab-case (e.g., `hero-settings-interface.png`)
3. **Paths**: Always start with `/img/` (not `/public/img/`)
4. **Format**: Use `.png` or `.jpg` (Next.js will optimize automatically)
5. **Size**: Recommended 1600-2400px width for retina displays

**Example paths:**
- `/img/dropdown/HeaderDropdownWide.png`
- `/img/sms/HeadSMSWide.png`
- `/img/localisation/hero-settings-interface.png`

## Quick vs Deep Mode

### Quick Mode Shows:
- `quickItems` / `quickContext` / `quickIssues` / `quickOutcomes` / `quickInsight` (if available)
- Otherwise falls back to shortened versions of full content
- **Excludes**: `rationale` in decisions, `designDecisions`, `rollout`, `feedback`, `technical`, `challenges`, `worked`, `process`

### Deep Mode Shows:
- All content including `deepItems` (if available)
- Full `rationale` in decisions
- `designDecisions` section
- Full `rollout` details
- `feedback` and `technical` validation
- `challenges` and `worked` in learned section
- `process` section (if present)

## Title Case Requirements

All section titles must use **Title Case** (not ALL CAPS):
- ✅ `'Impact'` (not `'IMPACT'`)
- ✅ `'The Problem'` (not `'THE PROBLEM'`)
- ✅ `'My Approach'` (not `'MY APPROACH'`)
- ✅ `'Implementation'` (not `'IMPLEMENTATION'`)
- ✅ `'Validation & Results'` (not `'VALIDATION & RESULTS'`)
- ✅ `'What I Learned'` (not `'WHAT I LEARNED'`)

## Adding to Index

After creating your case study file, add it to `lib/caseStudies/index.ts`:

```typescript
import { yourCaseStudy } from './your-case-study-id'

export { yourCaseStudy }

export const caseStudies: CaseStudy[] = [
  dropdownBuilder,
  smsCharacters,
  timeManagement,
  yourCaseStudy,  // Add here
]
```

## Validation Checklist

Before submitting, ensure:
- [ ] File is in `lib/caseStudies/[id].ts`
- [ ] Exports named constant matching filename
- [ ] All required fields are present
- [ ] All section titles use Title Case
- [ ] Image paths start with `/img/`
- [ ] Images exist in `/public/img/[folder]/`
- [ ] Added to `lib/caseStudies/index.ts`
- [ ] TypeScript compiles without errors
- [ ] Quick/deep mode content is properly structured

## Common Mistakes to Avoid

1. ❌ Using ALL CAPS for titles → ✅ Use Title Case
2. ❌ Missing required fields → ✅ Check interface requirements
3. ❌ Wrong image path format → ✅ Use `/img/` not `/public/img/`
4. ❌ Forgetting to add to index.ts → ✅ Always update index.ts
5. ❌ Using `hero` object → ✅ Use `imageUrl` and `imageAlt` at top level
6. ❌ Nested structures not in interface → ✅ Stick to defined interface

## Support

If you encounter issues:
1. Check the `CaseStudy` interface in `lib/caseStudies/types.ts`
2. Compare with existing case studies (`dropdown-builder.ts`, `sms-characters.ts`)
3. Ensure TypeScript compiles: `npm run build`

