import type { CaseStudy } from './types'

export const dropdownBuilder: CaseStudy = {
  id: 'dropdown-builder',
  title: 'Advanced Dropdown Builder',
  subtitle: 'Transformed 200+ field chaos into intelligent progressive disclosure',
  hashtag: '#0 to 1',
  company: 'Fast Track AI',
  year: '2023',
  linkText: 'Read case study',
  imageUrl: '/img/dropdown/HeaderDropdownWide.png',
  imageAlt: 'Advanced Dropdown Builder interface showing progressive disclosure interface',
  impact: {
    title: 'Impact',
    items: [
      'Selection efficiency: Single-field picks: 60+ seconds → <5 seconds (typical flow)',
      'Multi-condition segments: Minutes saved per build',
      'System-wide adoption: Zero support documentation needed - interface is self-explanatory',
      'Became platform standard for complex selections across all modules',
      '12+ months stable post-launch with no material rework',
      'Quality improvements: Eliminated mis-selections through clear previews and validation',
      'Reduced training overhead for new operators',
      'Converted technical debt into competitive advantage',
    ],
    quickItems: [
      '60+ seconds → <5 seconds selection time',
      'Zero support docs needed',
      '12+ months stable, no rework',
    ],
    deepItems: [
      'Selection efficiency: Single-field picks reduced from 60+ seconds to <5 seconds (typical flow). Multi-condition segments save minutes per build.',
      'System-wide adoption: Became platform standard for complex selections across all modules. Zero support documentation needed - interface is self-explanatory.',
      '12+ months stable post-launch with no material rework. Quality improvements eliminated mis-selections through clear previews and validation.',
      'Reduced training overhead for new operators by 70% - interface teaches itself through use.',
      'Converted technical debt into competitive advantage - what was our worst component became our best.',
    ],
  },
  problem: {
    title: 'The Problem',
    context: "Fast Track AI's iGaming CRM processes millions in daily transactions. Our data selection interface had become a bottleneck:",
    quickContext: '200+ fields in one dropdown. Users lost, errors common, complaints rising.',
    issues: [
      '200+ fields scattered in pure alphabetical order',
      'No search, no grouping - users scrolled endlessly',
      'Zero context for what fields meant until after selection',
      'Free-text date entry causing format errors and silent corrections',
      'Poor performance with large datasets',
      'Training overhead increased with every new field',
    ],
    quickIssues: [
      '200+ fields in alphabetical chaos',
      'No context until after selection',
      'Free-text dates causing daily errors',
    ],
    whyItMattered: [
      'In iGaming CRM, precision is non-negotiable. Mis-selecting a segment or trigger can mis-target campaigns at scale.',
      'Partner complaints about usability',
      'Selection errors costing time and money',
      'Scalability issues as we added more fields monthly',
    ],
  },
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
      },
      {
        title: '3. Eliminate free-text inputs',
        decision: 'Calendar widgets for dates, validated number inputs, unit selectors',
        rationale: 'Format drift and out-of-range values were causing errors',
        result: 'Faster selections, fewer mistakes',
      },
    ],
  },
  designDecisions: [
    {
      title: 'Category Taxonomy',
      description: 'Groups match how work is actually done (not database schema). Categories named in operator language. Intentional duplicates (e.g., "Last Login Date" appears in both "Login" and "Date" categories).',
    },
    {
      title: 'Contextual Information Density',
      description: 'Real-time feedback shows: Audience coverage (how many users affected), Sample values (what data looks like), Data type hints (string, number, date, boolean), Distribution stats (min/max/mean for numeric fields). Enough signal to act quickly, never so much it slows you down.',
    },
    {
      title: 'Type-Aware Inputs',
      description: 'Each data type gets appropriate controls: Dates: Calendar or relative picker (no free-text), Numbers: Validated input with unit selector, Booleans: Clear switches, Strings: Searchable with examples. Condition labels consistent across entire product.',
    },
  ],
  implementation: {
    title: 'Implementation',
    technical: [
      'Built as reusable component with full specs and API contract',
      'Design system integration with accessibility notes',
      'Performance budgets - long lists virtualized, metadata cached',
      'Analytics built-in - tracks adoption, timing, errors',
    ],
    quickTechnical: [
      'Reusable component architecture',
      'Performance optimized (virtualization)',
      'Analytics tracking built-in',
    ],
    rollout: [
      'Weeks 1-3: Ideation - Gathered evidence, built field dictionary, prototyped flows',
      'Weeks 4-9: Platform Integration - Embedded in Segment Builder, Data Explorer, Campaign Creator',
      'Weeks 10-12: Rollout - QA, pilot testing, launch with monitoring',
      'Shipped on time, single quarter from start to production.',
    ],
  },
  validation: {
    title: 'Validation & Results',
    outcomes: [
      'Selection speed dramatically improved (qualitative feedback + usage telemetry)',
      'Support tickets for field selection essentially disappeared',
      'Adoption reached all relevant modules within one quarter',
      'Component adopted by other teams for different product areas',
    ],
    quickOutcomes: [
      'Speed improved from 60+ to <5 seconds',
      'Support tickets eliminated',
      'Platform-wide adoption achieved',
    ],
    feedback: [
      '"Makes complex features much easier to find and use"',
      '"Reduced training time for new team members"',
      '"Finally feels like a modern enterprise product"',
    ],
    technical: [
      'Zero critical incidents post-launch',
      'No material rework needed for 12+ months',
      'Performance targets met - interactions feel instant',
    ],
  },
  learned: {
    title: 'What I Learned',
    worked: [
      'Card sorting revealed operator mental models - categories became obvious',
      'Progressive disclosure reduced noise - faster decisions',
      'Removing free-text dates eliminated common errors',
      'Shared field dictionary kept teams aligned',
    ],
    challenges: [
      {
        challenge: 'Overlapping categories',
        solution: 'Allowed deliberate duplicates, documented why',
      },
      {
        challenge: '200+ fields to document',
        solution: 'Combined database exports with manual review',
      },
      {
        challenge: 'Typed dates causing errors',
        solution: 'Replaced with validated calendar/relative pickers',
      },
      {
        challenge: 'Early resistance to change',
        solution: 'Framed as platform modernization, proved value with small wins',
      },
    ],
    insight: 'Consistency multiplies value. One taxonomy, one component = easy reuse, reduced variance across product.',
    quickInsight: 'Progressive disclosure beats comprehensive display every time.',
  },
  process: {
    title: 'Process',
    content: [
      'Discovery: Conducted card sorting with 12 operators to understand mental models. Combined database exports with manual review to document all 200+ fields.',
      'Design: Prototyped three approaches - search-first, browse-first, hybrid. Browse-first won in testing.',
      'Validation: A/B tested with pilot group. Measured task completion time and error rates.',
      'Implementation: Built as reusable component with full API contract. Integrated analytics from day one.',
      'Rollout: Phased deployment across modules. Feature flags for quick rollback if needed.',
    ],
  },
  timeline: 'Q3 2023 (single quarter delivery)',
  team: '5 (Product Design lead, 2 Engineers, QA, Product Manager)',
}

