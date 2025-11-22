export interface CaseStudy {
  id: string
  title: string
  subtitle: string
  hashtag: string
  company: string
  year: string
  linkText: string
  linkUrl?: string
  imageUrl?: string // Path to preview image in /public folder for card display (e.g., '/img/dropdown/preview.jpg')
  imageAlt?: string // Alt text for the preview image
  coverImageUrl?: string // Path to cover image in /public folder for detail page (e.g., '/img/dropdown/cover.jpg')
  coverImageAlt?: string // Alt text for the cover image (optional, falls back to imageAlt)
  impact: {
    title: string
    items: string[]
    quickItems?: string[] // Condensed impact points for Quick mode
    deepItems?: string[] // Full impact points for Deep mode
  }
  problem: {
    title: string
    context: string
    issues: string[]
    whyItMattered: string[]
    quickContext?: string // Condensed context for Quick mode
    quickIssues?: string[] // Condensed issues for Quick mode
  }
  approach: {
    title: string
    decisions: Array<{
      title: string
      decision: string
      rationale: string
      result: string
    }>
  }
  designDecisions: Array<{
    title: string
    description: string
  }>
  implementation: {
    title: string
    technical: string[]
    rollout: string[]
    quickTechnical?: string[] // Condensed technical points for Quick mode
  }
  validation: {
    title: string
    outcomes: string[]
    feedback: string[]
    technical: string[]
    quickOutcomes?: string[] // Condensed outcomes for Quick mode
  }
  learned: {
    title: string
    worked: string[]
    challenges: Array<{
      challenge: string
      solution: string
    }>
    insight: string
    quickInsight?: string // Condensed insight for Quick mode
  }
  process?: {
    title: string
    content: string[] // Process section (hidden in Quick mode)
  }
  timeline: string
  team: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'dropdown-builder',
    title: 'Advanced Dropdown Builder',
    subtitle: 'Transformed 200+ field chaos into intelligent progressive disclosure',
    hashtag: '#0 to 1',
    company: 'Fast Track AI',
    year: '2023',
    linkText: 'Read case study',
    // Preview image for cards: 1800x1200px (3:2) - optimized for ~800px display
    // Cover image for detail page: 3600x2225px - retina-ready for max 1280px display
    imageUrl: '/img/dropdown/HeaderDropdownWide.png',
    imageAlt: 'Advanced Dropdown Builder interface showing progressive disclosure interface',
    // coverImageUrl: '/img/dropdown/cover.jpg', // TODO: Upload cover image (3600x2225px)
    // coverImageAlt: 'Advanced Dropdown Builder full interface',
    impact: {
      title: 'IMPACT',
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
    },
    problem: {
      title: 'THE PROBLEM',
      context: "Fast Track AI's iGaming CRM processes millions in daily transactions. Our data selection interface had become a bottleneck:",
      issues: [
        '200+ fields scattered in pure alphabetical order',
        'No search, no grouping - users scrolled endlessly',
        'Zero context for what fields meant until after selection',
        'Free-text date entry causing format errors and silent corrections',
        'Poor performance with large datasets',
        'Training overhead increased with every new field',
      ],
      whyItMattered: [
        'In iGaming CRM, precision is non-negotiable. Mis-selecting a segment or trigger can mis-target campaigns at scale.',
        'Partner complaints about usability',
        'Selection errors costing time and money',
        'Scalability issues as we added more fields monthly',
      ],
    },
    approach: {
      title: 'MY APPROACH',
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
      title: 'IMPLEMENTATION',
      technical: [
        'Built as reusable component with full specs and API contract',
        'Design system integration with accessibility notes',
        'Performance budgets - long lists virtualized, metadata cached',
        'Analytics built-in - tracks adoption, timing, errors',
      ],
      rollout: [
        'Weeks 1-3: Ideation - Gathered evidence, built field dictionary, prototyped flows',
        'Weeks 4-9: Platform Integration - Embedded in Segment Builder, Data Explorer, Campaign Creator',
        'Weeks 10-12: Rollout - QA, pilot testing, launch with monitoring',
        'Shipped on time, single quarter from start to production.',
      ],
    },
    validation: {
      title: 'VALIDATION & RESULTS',
      outcomes: [
        'Selection speed dramatically improved (qualitative feedback + usage telemetry)',
        'Support tickets for field selection essentially disappeared',
        'Adoption reached all relevant modules within one quarter',
        'Component adopted by other teams for different product areas',
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
      title: 'WHAT I LEARNED',
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
    },
    timeline: 'Q3 2023 (single quarter delivery)',
    team: '5 (Product Design lead, 2 Engineers, QA, Product Manager)',
  },
  {
    id: 'sms-characters',
    title: 'SMS Characters: Count & Preview',
    subtitle: 'Eliminated enterprise billing risk through accurate encoding detection',
    hashtag: '#Growth design',
    company: 'Fast Track AI',
    year: '2024',
    linkText: 'Read case study',
    imageUrl: '/img/sms/HeadSMSWide.png',
    imageAlt: 'SMS Characters interface showing encoding detection and preview',
    impact: {
      title: 'IMPACT',
      items: [
        'Financial risk eliminated: Zero billing disputes in 6+ months (vs. multiple five-figure refund demands quarterly)',
        'Prevented 3× cost overruns from emoji/unicode encoding switches',
        'Enterprise trust restored - platform now viewed as financially reliable',
        'Market expansion enabled: RTL language support (Arabic, Hebrew) unlocked Middle East markets',
        'Multi-script accuracy validated for global operations',
        'Competitive parity achieved with specialized messaging platforms',
        'Operational efficiency: Support tickets for SMS issues dropped significantly',
        'Partners stopped using external tools for character counting',
        'QA approval process streamlined with clear warnings',
      ],
      quickItems: [
        'Zero billing disputes (was 5-figure quarterly)',
        '3× cost overruns prevented',
        'Arabic/Hebrew markets unlocked',
      ],
      deepItems: [
        'Financial risk eliminated: Zero billing disputes in 6+ months (vs. multiple five-figure refund demands quarterly). Enterprise trust restored - platform now viewed as financially reliable.',
        'Prevented 3× cost overruns from emoji/unicode encoding switches. Single emoji was silently switching encoding from 160 to 70 characters per SMS segment, tripling costs without warning.',
        'Market expansion enabled: RTL language support (Arabic, Hebrew) unlocked Middle East markets. Multi-script accuracy validated for global operations. Competitive parity achieved with specialized messaging platforms.',
        'Operational efficiency: Support tickets for SMS issues dropped 87%',
        'Partners stopped using external tools for character counting - full platform adoption',
        'QA approval process streamlined with clear warnings - 50% faster campaign launches',
      ],
    },
    problem: {
      title: 'THE PROBLEM',
      context: 'Multiple five-figure billing disputes within 6 months. Partners were blindsided by SMS charges when emojis or diacritics silently pushed messages from 1 segment to 3.',
      quickContext: 'Emojis silently tripled SMS costs. Partners demanded refunds. Crisis mode.',
      issues: [
        'Financial Risk: Single emoji switches encoding from 160 to 70 characters/SMS (potential 3× cost)',
        'Character miscounts causing unexpected campaign overages',
        'Partners questioning platform reliability',
        'Campaign ROI destroyed by billing surprises',
        'Technical Limitations: System counted emoji as 1 character (actually varies 2-8)',
        'Extended GSM characters triggering encoding switches',
        'Dynamic variables showing static counts',
        'No preview of actual device rendering',
        'Market Barriers: RTL text (Arabic/Hebrew) rendering broken and unreadable',
        'Partners using external tools for accurate calculations',
        'Competitive disadvantage vs. specialized platforms',
      ],
      quickIssues: [
        'Single emoji = 3× cost surprise',
        'System counted emoji wrong (said 1, was 2-8)',
        'Arabic/Hebrew completely broken',
      ],
      whyItMattered: [],
    },
    approach: {
      title: 'MY APPROACH',
      decisions: [
        {
          title: 'Strategic Framing',
          decision: 'Initially viewed as "minor technical issue" by management. Second billing dispute created urgency - I had a comprehensive solution ready.',
          rationale: '',
          result: '',
        },
        {
          title: 'Constraint-Driven Design',
          decision: 'Limited resources, no user research time: Data source: Support tickets + billing dispute details became "user research"',
          rationale: 'Each dispute included screenshots, message content, cost calculations',
          result: 'Crowdsourced usability testing data from real enterprise pain',
        },
        {
          title: 'Crisis timeline',
          decision: 'Comprehensive fix over band-aid solution',
          rationale: 'Prevent cascading issues from partial implementations',
          result: 'One-time investment eliminated recurring problems',
        },
      ],
    },
    designDecisions: [
      {
        title: '1. Real-Time Detection vs. Post-Composition',
        description: 'Live encoding detection during typing. Cost awareness must happen during composition, not after mental commitment. Performance overhead for immediate feedback. Partners actively modified content to optimize costs.',
      },
      {
        title: '2. Visual Warning System',
        description: 'Different icons for known vs. uncertain costs. Variables (uncertain) require different mental model than special characters (calculable). Yellow warning = Uncertain costs (dynamic variables). Blue info = Known impacts (emojis, special characters). Zero confusion in post-launch support tickets.',
      },
      {
        title: '3. Character Highlighting Toggle',
        description: 'Optional highlighting of cost-impacting characters. Highlighting aids debugging but misrepresents final appearance. Added interface complexity. High toggle usage indicated clear user value.',
      },
      {
        title: '4. Mobile Device Preview',
        description: 'Full device mockup with real-time rendering. SMS consumed on mobile - preview builds send confidence. Became highest-valued feature per partner feedback.',
      },
    ],
    implementation: {
      title: 'THE SOLUTION',
      technical: [
        'Real-time character analysis as you type',
        'Encoding detection (GSM-7, Extended GSM, UCS-2)',
        'Dynamic variable estimation with defensive calculations',
        'Emoji sequence handling (accounts for multi-byte characters)',
        'Debounced checking (smooth typing performance)',
        'Cached encoding for unchanged sections',
        'Lazy evaluation for variable previews',
        'Optimized regex for character detection',
      ],
      quickTechnical: [
        'Real-time encoding detection',
        'Visual warning system',
        'Mobile device preview',
      ],
      rollout: [],
    },
    validation: {
      title: 'VALIDATION & RESULTS',
      outcomes: [
        'Zero billing disputes in 6+ months post-launch',
        'Reduced financial exposure from SMS campaigns',
        'Eliminated recurring refund requests',
        'Support tickets for SMS issues dropped significantly',
        'QA approval process streamlined',
        'Partner self-service improved dramatically',
        'Arabic/Hebrew markets now accessible',
        'Competitive parity with specialized platforms achieved',
        'Foundation for additional messaging channels laid',
      ],
      quickOutcomes: [
        '6+ months with zero billing disputes proves solution worked',
      ],
      feedback: [
        'Partner confidence restored (direct feedback)',
        'Positive reviews mentioning SMS functionality',
        'Platform perceived as enterprise-ready',
      ],
      technical: [],
    },
    learned: {
      title: 'WHAT I LEARNED',
      worked: [
        'Crisis as business case: Financial impact created urgency where user complaints hadn\'t. Quantifiable loss drives prioritization.',
        'Defensive design philosophy: "Estimated" labeling and comprehensive warnings prevented new issues while solving core problem.',
        'Risk-first approach: Building for worst-case scenarios prevented cascading issues.',
      ],
      challenges: [
        {
          challenge: 'International QA gaps',
          solution: 'Partner beta testing provided better validation than synthetic testing could achieve',
        },
        {
          challenge: 'Support knowledge gaps',
          solution: 'Self-documenting interface reduced dependency on support understanding encoding nuances',
        },
        {
          challenge: 'Competitive pressure',
          solution: 'Exceeded external tools through native integration rather than feature matching',
        },
      ],
      insight: 'Reactive fixes cost multiples of proactive solutions. Early investment prevents compound costs.',
      quickInsight: 'Crisis creates urgency. Use it to fix root causes, not symptoms.',
    },
    process: {
      title: 'PROCESS',
      content: [
        'Discovery: Analyzed 6 months of billing disputes to identify patterns. Every dispute included emoji or special characters.',
        'Iteration: Started with basic character counter, evolved to full encoding detection after discovering GSM-7 vs UCS-2 complexity.',
        'Validation: Beta tested with 3 partners who had disputes. All confirmed solution would have prevented their issues.',
        'Rollout: Phased deployment with monitoring. Feature flags for quick rollback. Zero incidents during launch.',
      ],
    },
    timeline: 'Q2 2024 (3-month sprint)',
    team: '6 (Product Designer, 3 Engineers, Product Manager, QA)',
  },
  {
    id: 'time-management',
    title: 'Time Management & Localization Tools',
    subtitle: 'Enabled 24/7 global operations and unlocked 3 major markets',
    hashtag: '#Growth design',
    company: 'Fast Track AI',
    year: '2024',
    linkText: 'Read case study',
    imageUrl: '/img/localisation/HeaderLocalisationWide.png',
    imageAlt: 'Time Management & Localization Tools interface',
    impact: {
      title: 'IMPACT',
      items: [
        'Market expansion delivered: Brazil (pt-BR) - Onboarded major regional operators',
        'LatAm (es-ES) - Multiple partners across Central/South America',
        'APAC (zh-CN) - Strategic accounts activated',
        'Industry recognition: AIBC Awards 2024 - Best AI Solution',
        'SBC Latin America 2024 - Best Acquisition & Retention',
        'SiGMA Americas 2025 - Best Retention Partner',
        'Operational improvements: Timezone issues dropped from top-10 support category to barely registering',
        'Zero critical incidents post-launch',
        'Stable platform integration with no performance degradation',
      ],
    },
    problem: {
      title: 'THE PROBLEM',
      context: "Fast Track AI's iGaming CRM serves teams from US East Coast to New Zealand (24+ timezones), but shipped with:",
      issues: [
        'English-only UI blocking non-English markets',
        'Single timezone display causing scheduling errors',
        'Manual time conversions prone to mistakes',
        'DST transitions creating critical event timing issues',
      ],
      whyItMattered: [
        'Brazil (Largest LatAm Opportunity): Operators insisted on Portuguese interface. English-only was explicit dealbreaker in sales conversations.',
        'Colombia & LATAM: Spanish required for regional expansion. Local teams couldn\'t onboard without native language.',
        'APAC: Simplified Chinese essential for China/Hong Kong partnerships. Zero localization = zero market access.',
        'Cross-timezone coordination: Support teams manually calculating SLA windows. Campaign triggers firing at wrong times (especially during DST). Operators double-checking times outside platform. Lost productivity from constant manual conversions.',
      ],
    },
    approach: {
      title: 'MY APPROACH',
      decisions: [
        {
          title: 'Strategic Framework',
          decision: 'Dual-track development: 1. Timezone tooling (immediate operator value), 2. Localization (market unlock)',
          rationale: 'Risk mitigation: Display-layer architecture (no database changes), Feature flags for controlled rollout, Pilot partners per language for validation',
          result: 'Enhance existing UI without touching core system time (UTC) - preserving stability while adding capability.',
        },
      ],
    },
    designDecisions: [
      {
        title: '1. Enhanced Sidebar with Dual Timezone Display',
        description: 'Users needed constant time awareness without sacrificing screen space. Evolution: Main window clock (too disruptive) → Top bar integration (insufficient space) → Dual clock on sidebar with configurable settings. Key Features: System time + local time (color-coded), Optional removal of system time, Both 12hr and 24hr formats, Persistent state per user.',
      },
      {
        title: '2. Contextual Tooltip System',
        description: 'Display complex timezone information without cluttering interface. Information density based on user intent. Primary timezone + indefinite additional zones. Color-coded offset conflicts. AM/PM toggle support. Implementation: 300ms hover delay (prevents accidental triggers), Consistent positioning (no overlap), Smart screen space detection, Color coding for offset warnings.',
      },
      {
        title: '3. Platform Localization Strategy',
        description: 'Phase 1 - Core Markets: Portuguese (pt-BR): Brazilian market priority, Spanish (es-ES): Colombian/LatAm operations, Simplified Chinese (zh-CN): APAC partnerships. Phase 2 - Expansion Ready: Architecture supports additional languages, RTL preparation (Arabic/Hebrew), Flexible character encoding for all scripts. Quality Assurance Model: Machine translation (LLM API), Human review for critical terms, Partner validation for regional industry terminology, Continuous refinement through feedback.',
      },
    ],
    implementation: {
      title: 'IMPLEMENTATION PLAN',
      technical: [
        'Phase 1: Audit (Weeks 1-2) - Discovered: 8 unique time-measuring components across system, 20,000+ translatable strings to manage, Critical user flows requiring both features',
        'Documentation: Mapped every timezone interaction point, Tagged all translatable content, Identified edge cases (DST, GMT+13/-11 offsets)',
      ],
      rollout: [
        'Phase 2: Parallel Development (Weeks 3-10) - Timezone Track: Enhanced sidebar with dual clocks, Contextual tooltips for time conversions, Calendar components with multi-zone awareness, Visual indicators for timezone offset overlaps. Localization Track: Translation pipeline (machine + human validation), Language switcher (instant toggle), Regional formats (dates, numbers, currency), Font support for non-Latin scripts (Chinese)',
        'Phase 3: Integration (Weeks 11-14) - Unified Configuration: Single settings page controlling both language + timezone, Cross-feature testing (timezone displays work in all 3 languages), Performance benchmarking (<100ms language switching)',
        'Phase 4: Rollout (Weeks 15-20) - Staged deployment: Feature flags per market, 3 pilot partners (1 per language), Real-time monitoring during rollout, Edge case validation (DST transitions, extreme offsets)',
      ],
    },
    validation: {
      title: 'VALIDATION & RESULTS',
      outcomes: [
        'Zero critical incidents post-launch',
        'No performance degradation from new features',
        'Seamless integration with existing workflows',
        'Brazil: Successfully onboarded multiple enterprise partners. Major regional operator using platform in production.',
        'LatAm: Partners across Central/South America activated. Consistent positive feedback on Spanish localization.',
        'APAC: Strategic accounts onboarded. Incredible trade show reception (SiGMA Americas demo).',
      ],
      feedback: [
        'Operator feedback: Completed scheduling tasks without assistance',
        'Described experience as "clear and reliable"',
        'Timezone confusion essentially eliminated',
      ],
      technical: [
        'Significant reduction in: Timezone conversion questions, "What time is it?" clarifications, Scheduling-related tickets',
      ],
    },
    learned: {
      title: 'WHAT I LEARNED',
      worked: [
        'Domain expertise as research proxy: Deep understanding of operational needs enabled rapid, accurate decisions without traditional user research.',
        'Dual-track development: Parallel workstreams prevented dependencies and accelerated delivery while maintaining cohesion.',
        'Partner validation: Beta testing with real operators in each market provided validation synthetic testing couldn\'t match.',
      ],
      challenges: [
        {
          challenge: 'Chinese character font incompatibility',
          solution: 'New font system for all non-Latin languages',
        },
        {
          challenge: 'Timezone abbreviation confusion (CST = Central/China?)',
          solution: 'Always display full timezone names + GMT offset',
        },
        {
          challenge: 'Text expansion breaking layouts (Portuguese +20% longer)',
          solution: 'Flexible CSS grid system with expansion zones',
        },
      ],
      insight: 'Real friction wasn\'t in the UI itself - it was in the cognitive load of constant manual conversion and the confidence gap from language barriers.',
    },
    timeline: 'Q4 2023 - Q1 2024 (6 months)',
    team: '6 (Product Designer, 5 Engineers)',
  },
]


