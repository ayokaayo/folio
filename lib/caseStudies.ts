export interface CaseStudy {
  id: string
  title: string
  subtitle: string
  hashtag: string
  company: string
  year: string
  linkText: string
  linkUrl?: string
  imageUrl?: string
  imageAlt?: string
  coverImageUrl?: string
  coverImageAlt?: string
  impact: {
    title: string
    items: string[]
    quickItems?: string[]
    deepItems?: string[]
  }
  problem: {
    title: string
    context: string
    issues: string[]
    whyItMattered: string[]
    quickContext?: string
    quickIssues?: string[]
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
    quickTechnical?: string[]
  }
  validation: {
    title: string
    outcomes: string[]
    feedback: string[]
    technical: string[]
    quickOutcomes?: string[]
  }
  learned: {
    title: string
    worked: string[]
    challenges: Array<{
      challenge: string
      solution: string
    }>
    insight: string
    quickInsight?: string
  }
  process?: {
    title: string
    content: string[]
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
    imageUrl: '/img/dropdown/HeaderDropdownWide.png',
    imageAlt: 'Advanced Dropdown Builder interface showing progressive disclosure interface',
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
      title: 'THE PROBLEM',
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
      title: 'VALIDATION & RESULTS',
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
      quickInsight: 'Progressive disclosure beats comprehensive display every time.',
    },
    process: {
      title: 'PROCESS',
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
      whyItMattered: [
        'Trust eroding with every billing dispute',
        'Sales blocked in Middle East markets',
        'Competitors winning on basic functionality we lacked',
      ],
    },
    approach: {
      title: 'MY APPROACH',
      decisions: [
        {
          title: '1. Real-Time Detection vs Post-Composition',
          decision: 'Live encoding detection during typing',
          rationale: 'Cost awareness must happen during composition, not after mental commitment',
          result: 'Partners actively modified content to optimize costs',
        },
        {
          title: '2. Visual Warning System',
          decision: 'Different icons for known vs uncertain costs',
          rationale: 'Variables (uncertain) require different mental model than special characters (calculable)',
          result: 'Zero confusion in post-launch support tickets',
        },
        {
          title: '3. Mobile Device Preview',
          decision: 'Full device mockup with real-time rendering',
          rationale: 'SMS consumed on mobile - preview builds send confidence',
          result: 'Became highest-valued feature per partner feedback',
        },
      ],
    },
    designDecisions: [
      {
        title: 'Character Highlighting Toggle',
        description: 'Optional highlighting of cost-impacting characters. Highlighting aids debugging but misrepresents final appearance. High toggle usage indicated clear user value.',
      },
      {
        title: 'Encoding Intelligence',
        description: 'Real-time detection of GSM-7, Extended GSM, and UCS-2 encodings. Visual indicators: 🟡 Yellow for uncertain costs (variables), 🔵 Blue for known impacts (special chars).',
      },
      {
        title: 'RTL Support Architecture',
        description: 'Bidirectional text implementation for Arabic/Hebrew. Mixed-direction content handling. Proper cursor behavior. Font stack supporting all Unicode ranges.',
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
        'Visual warning system (🟡 uncertain, 🔵 known)',
        'Mobile device preview with actual rendering',
      ],
      rollout: [
        'Week 1-2: Crisis response planning and solution design',
        'Week 3-6: Core encoding detection engine built',
        'Week 7-8: RTL support and international testing',
        'Week 9-10: Partner beta testing with dispute victims',
        'Week 11-12: Phased rollout with monitoring',
      ],
    },
    validation: {
      title: 'VALIDATION & RESULTS',
      outcomes: [
        'Zero billing disputes in 6+ months post-launch',
        'Reduced financial exposure from SMS campaigns',
        'Eliminated recurring refund requests',
        'Support tickets for SMS issues dropped 87%',
        'QA approval process streamlined - 50% faster',
        'Partner self-service improved dramatically',
        'Arabic/Hebrew markets now accessible',
        'Competitive parity with specialized platforms achieved',
        'Foundation for additional messaging channels laid',
      ],
      quickOutcomes: [
        '6+ months with zero billing disputes',
        '87% reduction in support tickets',
        'Middle East markets unlocked',
      ],
      feedback: [
        '"Finally we can trust the platform with SMS campaigns"',
        '"The preview feature alone justified the wait"',
        '"Now matches what Twilio offers, but integrated"',
      ],
      technical: [
        '100% encoding accuracy validated across all Unicode ranges',
        'Performance impact <50ms for real-time detection',
        'Zero false positives in character counting',
      ],
    },
    learned: {
      title: 'WHAT I LEARNED',
      worked: [
        'Crisis as catalyst: Financial impact created urgency where user complaints hadn\'t',
        'Defensive design: "Estimated" labeling prevented new issues while solving core problem',
        'Partner validation: Beta testing with actual victims provided perfect validation',
      ],
      challenges: [
        {
          challenge: 'International QA gaps',
          solution: 'Partner beta testing provided better validation than synthetic testing',
        },
        {
          challenge: 'Support knowledge gaps',
          solution: 'Self-documenting interface reduced dependency on support understanding',
        },
        {
          challenge: 'Competitive pressure',
          solution: 'Exceeded external tools through native integration',
        },
      ],
      insight: 'Reactive fixes cost multiples of proactive solutions. Early investment prevents compound costs.',
      quickInsight: 'Crisis creates urgency. Use it to fix root causes, not symptoms.',
    },
    process: {
      title: 'PROCESS',
      content: [
        'Discovery: Analyzed 6 months of billing disputes to identify patterns. Every dispute included emoji or special characters.',
        'Technical Research: Deep dive into GSM-7 vs UCS-2 encoding standards. Discovered the 160→70 character threshold.',
        'Iteration: Started with basic character counter, evolved to full encoding detection after discovering complexity.',
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
      quickItems: [
        '3 major markets unlocked (Brazil, LatAm, APAC)',
        '3 industry awards won',
        'Timezone issues eliminated',
      ],
      deepItems: [
        'Market expansion delivered: Brazil (pt-BR) with major regional operators onboarded. LatAm (es-ES) with multiple partners across Central/South America. APAC (zh-CN) with strategic accounts activated.',
        'Industry recognition: AIBC Awards 2024 (Best AI Solution), SBC Latin America 2024 (Best Acquisition & Retention), SiGMA Americas 2025 (Best Retention Partner).',
        'Operational improvements: Timezone issues dropped from top-10 support category to barely registering. Zero critical incidents post-launch. Stable platform integration with no performance degradation.',
        'Financial impact: Each market represents 7-figure annual revenue potential. Brazil alone projected at $3M ARR.',
        'Competitive advantage: First iGaming CRM with native Chinese support. Only platform with true dual-timezone display.',
      ],
    },
    problem: {
      title: 'THE PROBLEM',
      context: "Fast Track AI's iGaming CRM serves teams from US East Coast to New Zealand (24+ timezones), but shipped with fundamental limitations:",
      quickContext: 'English-only UI. Single timezone. Markets blocked. Operators confused.',
      issues: [
        'English-only UI blocking non-English markets',
        'Single timezone display causing scheduling errors',
        'Manual time conversions prone to mistakes',
        'DST transitions creating critical event timing issues',
        'Brazil operators explicitly requiring Portuguese',
        'Colombian teams unable to onboard without Spanish',
        'Chinese partnerships impossible without localization',
        'Support teams manually calculating SLA windows',
        'Campaign triggers firing at wrong times during DST',
        'Lost productivity from constant manual conversions',
      ],
      quickIssues: [
        'English-only blocked 3 major markets',
        'Single timezone causing daily errors',
        'DST transitions breaking campaigns',
      ],
      whyItMattered: [
        'Brazil: Largest LatAm opportunity. Portuguese was explicit dealbreaker in sales',
        'Colombia & LATAM: Spanish required for regional expansion',
        'APAC: Zero localization = zero market access',
        'Operations: Manual time conversion eating hours daily',
      ],
    },
    approach: {
      title: 'MY APPROACH',
      decisions: [
        {
          title: '1. Dual-Track Development',
          decision: 'Parallel development of timezone tools and localization',
          rationale: 'Different teams could work simultaneously without dependencies',
          result: 'Delivered both features in same release, maximizing impact',
        },
        {
          title: '2. Display-Layer Architecture',
          decision: 'Keep UTC in database, add conversion layer on top',
          rationale: 'Zero risk to core scheduling logic, easy rollback if needed',
          result: 'No database migration needed, deployment risk minimized',
        },
        {
          title: '3. Machine + Human Translation',
          decision: 'LLM for initial translation, humans for industry terms',
          rationale: 'Speed of automation with accuracy where it matters',
          result: 'Completed 20,000+ strings in 4 weeks instead of 4 months',
        },
      ],
    },
    designDecisions: [
      {
        title: 'Enhanced Sidebar with Dual Timezone',
        description: 'Dual clock showing system + local time. Color-coded for clarity. Both 12hr and 24hr formats. User preference persistence. Solved the "what time is it there?" problem permanently.',
      },
      {
        title: 'Contextual Tooltip System',
        description: 'Hover shows timezone conversions without cluttering UI. Primary timezone + unlimited additional zones. Color warnings for date boundary conflicts. 300ms delay prevents accidental triggers.',
      },
      {
        title: 'Platform Localization Strategy',
        description: 'Phase 1: Portuguese (Brazil), Spanish (LatAm), Chinese (APAC). Phase 2 ready: Arabic/Hebrew RTL support. Machine translation + human validation + partner review. Regional formats for dates, numbers, currency.',
      },
    ],
    implementation: {
      title: 'IMPLEMENTATION',
      technical: [
        'Display-layer architecture - UTC unchanged in database',
        'Translation pipeline: 20,000+ strings managed',
        'Font system supporting Latin, Chinese, future Arabic scripts',
        'Performance: <100ms language switching',
        'Timezone calculations client-side for speed',
        'Feature flags per market for controlled rollout',
        'Regional format detection and application',
        'DST transition handling for all zones',
      ],
      quickTechnical: [
        'Display-layer only (database unchanged)',
        '<100ms language switching',
        '3 pilot partners validated each language',
      ],
      rollout: [
        'Weeks 1-2: Audit - Found 8 timezone components, 20,000+ strings',
        'Weeks 3-10: Parallel development of both features',
        'Weeks 11-14: Integration and cross-feature testing',
        'Weeks 15-20: Staged deployment with pilot partners',
        'Week 20: Full launch across all markets',
      ],
    },
    validation: {
      title: 'VALIDATION & RESULTS',
      outcomes: [
        'Production stability: Zero critical incidents post-launch',
        'Performance maintained: No degradation from new features',
        'Brazil: Multiple enterprise partners onboarded successfully',
        'LatAm: Partners across 5 countries activated',
        'APAC: Strategic accounts using Chinese interface daily',
        'Trade show success: SiGMA Americas demo generated 12 qualified leads',
        'Support impact: Timezone questions essentially eliminated',
        'User confidence: Operators completing tasks without assistance',
      ],
      quickOutcomes: [
        '3 markets successfully entered',
        '3 industry awards won',
        'Zero post-launch incidents',
      ],
      feedback: [
        '"Finally we can serve our Brazilian clients properly"',
        '"The Chinese localization is better than competitors"',
        '"Timezone features should have existed from day one"',
      ],
      technical: [
        '99.9% uptime maintained during rollout',
        'Language switching performance <100ms achieved',
        'All 3 languages validated by native speakers',
      ],
    },
    learned: {
      title: 'WHAT I LEARNED',
      worked: [
        'Domain expertise as research proxy: Deep operational knowledge replaced traditional user research',
        'Dual-track development: Parallel workstreams accelerated delivery without compromising quality',
        'Partner validation: Real operators provided better feedback than any internal testing',
      ],
      challenges: [
        {
          challenge: 'Chinese font incompatibility',
          solution: 'Implemented dedicated font system for non-Latin languages',
        },
        {
          challenge: 'Timezone abbreviation confusion (CST)',
          solution: 'Always display full names + GMT offset',
        },
        {
          challenge: 'Portuguese text 20% longer breaking layouts',
          solution: 'Flexible CSS grid with expansion zones',
        },
      ],
      insight: 'Localization isn\'t translation - it\'s removing friction from every interaction. The real barrier wasn\'t language, it was confidence.',
      quickInsight: 'Markets don\'t wait. Localization is expansion strategy, not nice-to-have.',
    },
    process: {
      title: 'PROCESS',
      content: [
        'Audit: Mapped every timezone touchpoint and translatable string in the system. Found 8 unique time components and 20,000+ strings.',
        'Strategy: Decided on display-layer approach to minimize risk. Chose 3 pilot markets based on revenue potential.',
        'Development: Parallel tracks for timezone and localization. Daily syncs to ensure compatibility.',
        'Validation: Each market had dedicated pilot partner. Weekly feedback sessions during development.',
        'Rollout: Feature flags per market. Could disable per-language if issues arose. Monitored every metric.',
        'Awards: Submitted to industry awards immediately after launch. Won all three we entered.',
      ],
    },
    timeline: 'Q4 2023 - Q1 2024 (6 months)',
    team: '6 (Product Designer, 5 Engineers)',
  },
]
