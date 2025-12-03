import type { CaseStudy } from './types'

export const timeManagement: CaseStudy = {
  id: 'time-management',
  title: 'Time Management & Localization Tools',
  subtitle: 'Enabled 24/7 global operations and unlocked 3 major markets',
  hashtag: '#Growth design',
  company: 'Fast Track AI',
  year: '2024',
  linkText: 'Read case study',
  imageUrl: '/img/localisation/hero-settings-interface.png',
  imageAlt: 'Localization settings interface showing language and timezone configuration options',
  timeline: 'Q4 2023 - Q1 2024 (6 months)',
  team: '4 (Product Designer + 3 Engineers)',

  impact: {
    title: 'Impact',
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
      '3 industry awards won after rollout',
      'Timezone confusion eliminated from support queue',
    ],
    deepItems: [
      'Market expansion delivered across three regions: Brazil (pt-BR) with major regional operators onboarded, LatAm (es-ES) with multiple partners across Central and South America, and APAC (zh-CN) with strategic accounts activated.',
      'The work earned industry recognition through three awards: AIBC Awards 2024 (Best AI Solution), SBC Latin America 2024 (Best Acquisition & Retention), and SiGMA Americas 2025 (Best Retention Partner).',
      'Operationally, timezone issues dropped from being a top-10 support category to barely registering, we had zero critical incidents post-launch, and the platform remained stable with no performance degradation.',
    ],
    images: [
      {
        url: '/img/localisation/impact-awards.png',
        alt: 'Three industry award badges from AIBC, SBC Latin America, and SiGMA Americas',
        caption: 'All three awards won following localization rollout',
      },
      {
        url: '/img/localisation/after-dashboard.png',
        alt: 'English only dashboard interface',
        caption: 'Before: English only dashboard',
      },
      {
        url: '/img/localisation/before-dashboard.png',
        alt: 'Fully localised dashboard in Simplified Chinese with data and currency information',
        caption: 'After: Fully localised in Simplified Chinese, including data and currency information',
      },
    ],
  },

  problem: {
    title: 'The Problem',
    context: "Fast Track AI's iGaming CRM serves teams from US East Coast to New Zealand, spanning more than 24 timezones, but shipped with limitations actively blocking expansion and creating daily operational friction.",
    quickContext: 'English-only UI blocking three major markets. Single timezone causing daily scheduling errors. DST transitions breaking campaign timing.',
    issues: [
      {
        category: 'Market Barriers',
        description: 'Brazil operators explicitly required a Portuguese interface, and this was coming up as a dealbreaker in actual sales conversations. Similarly, Colombia and broader LatAm expansion needed Spanish, while APAC partnerships were essentially impossible without Simplified Chinese support.',
        impact: 'Zero market access in three high-value regions',
      },
      {
        category: 'Operational Pain',
        description: 'Support teams were manually calculating SLA windows across timezones, campaign triggers kept firing at the wrong times during DST transitions, and operators were leaving our platform to use external tools just to convert times properly.',
        impact: 'Lost productivity, increased support load, reduced platform trust',
      },
      {
        category: 'Technical Debt',
        description: 'The single timezone display meant users had no visibility into offset conflicts, manual conversions were naturally prone to human error, and non-native English speakers were misconfiguring critical settings more frequently than we were comfortable with.',
        impact: 'Scheduling mistakes affecting campaign ROI and partner satisfaction',
      },
    ],
    quickIssues: [
      'English-only UI blocked Brazil, Colombia, and APAC partnerships',
      'Single timezone display caused scheduling errors across global teams',
      'DST transitions triggered campaigns at wrong times',
    ],
    whyItMattered: [
      'Brazil: Largest LatAm opportunity. Portuguese was explicit dealbreaker in sales',
      'Colombia & LATAM: Spanish required for regional expansion',
      'APAC: Zero localization = zero market access',
      'Operations: Manual time conversion eating hours daily',
    ],
    images: [
      {
        url: '/img/localisation/before-calendar.png',
        alt: 'Old calendar interface showing single timezone, English only',
        caption: 'Before: Users leaving platform to manually convert times',
      },
      {
        url: '/img/localisation/after-calendar.png',
        alt: 'Calendar widget in English with single timezone',
        caption: 'After: Fully localised calendar with dual timezone',
      },
    ],
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Dual-Track Development',
        decision: 'Parallel development of timezone tools and localization features',
        rationale: 'Different teams could work simultaneously without creating dependencies between the two efforts. Both features were needed for market entry, but they served different immediate needs, so keeping them parallel made sense from both a timeline and resource perspective.',
        result: 'We delivered both features in the same release, avoiding the bottlenecks that would have come from sequential work.',
      },
      {
        title: '2. Display-Layer Architecture',
        decision: 'Keep UTC in database, add conversion layer on top',
        rationale: 'This approach meant zero risk to our core scheduling logic, made rollback trivially easy if we hit problems, and eliminated the need for any database migration work that would have added both time and risk to the project.',
        result: 'No database migration needed, deployment risk minimized to nearly zero, and we could validate everything in production without worrying about corrupting core data.',
      },
      {
        title: '3. Machine + Human Translation Pipeline',
        decision: 'Use LLM APIs for initial translation, then human validation for industry-specific terminology',
        rationale: 'Speed of automation with accuracy where it matters. iGaming has very specific terminology that generic translation gets wrong, but doing 20,000+ strings manually would have taken months we did not have.',
        result: 'Completed all 20,000+ strings in 4 weeks instead of 4 months, with quality that passed native speaker validation on the first review cycle.',
      },
      {
        title: '4. Partner Validation Over Synthetic Testing',
        decision: 'Beta test with one pilot partner per language before full rollout',
        rationale: 'Real operators using the platform in their actual workflows would catch issues that our internal testing never could. Each market had different expectations and usage patterns that we needed to validate.',
        result: 'Partners caught terminology issues, regional format preferences, and workflow gaps that would have caused problems at scale. Their validation gave us confidence for the full launch.',
      },
    ],
    images: [
      {
        url: '/img/localisation/approach-strategy-flow.png',
        alt: 'Design strategy diagram showing domain knowledge, partner feedback, and technical analysis converging into design strategy and deliverables',
        caption: 'Research triangulation: Domain expertise + partner feedback + technical analysis informed strategic decisions',
      },
    ],
  },

  designDecisions: [
    {
      title: 'Enhanced Sidebar with Dual Timezone Display',
      description: 'Dual clock showing system time and user-selected local time, color-coded for instant recognition. Supports both 12hr and 24hr formats with user preference persistence. Optional removal of system time for users who only need local. Solved the "what time is it there?" problem permanently without requiring users to leave the platform.',
    },
    {
      title: 'Contextual Tooltip System',
      description: 'Hover shows timezone conversions without cluttering the interface. Primary timezone plus unlimited additional zones for teams spanning multiple regions. Color warnings for date boundary conflicts (when an event is on different days in different zones). 300ms hover delay prevents accidental triggers while keeping information instantly accessible.',
    },
    {
      title: 'Timezone-Aware Calendar Widgets',
      description: 'Calendar components with native language labels, timezone indicator badges showing which zone is active, global time tooltips that display on-demand conversions, DST transition warnings when scheduled events might be affected, and full AM/PM format support for regions that prefer 12-hour time.',
    },
    {
      title: 'Complete UI Localization',
      description: 'Platform-wide translation of all interface text, metrics and calculations, help documentation, and error messages. Regional formats applied consistently for dates (DD/MM vs MM/DD), numbers (comma vs period separators), and currency displays. Each market gets native-feeling interface rather than mechanical translation.',
      image: {
        url: '/img/localisation/settings-interface.png',
        alt: 'Localization settings interface showing language and timezone configuration options',
        caption: 'Settings interface with language and timezone preferences',
      },
    },
    {
      title: 'Font System for Non-Latin Scripts',
      description: 'Dedicated font implementation for Simplified Chinese with proper fallback hierarchy for missing glyphs. Tested to ensure zero performance impact despite additional font assets. Future-ready for Arabic and Hebrew when we expand to RTL languages.',
    },

  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'Display-layer architecture keeps UTC unchanged in database, all conversion happens client-side',
      'Translation pipeline managed 20,000+ strings through LLM API + human validation workflow',
      'Font system supporting Latin, Chinese characters, with architecture ready for Arabic/Hebrew scripts',
      'Performance target: <100ms language switching achieved through cached translations and lazy loading',
      'Timezone calculations executed client-side using cached offset tables for speed',
      'Feature flags deployed per market for controlled rollout with instant disable capability',
      'Regional format detection and application for dates, numbers, currency throughout entire platform',
      'DST transition handling for all supported timezones with automatic offset adjustments',
    ],
    quickTechnical: [
      'Display-layer only (database unchanged)',
      '<100ms language switching',
      '3 pilot partners validated each language',
      'Feature flags per market',
    ],
    rollout: [
      {
        phase: 'Weeks 1-2: Audit',
        activities: [
          'Mapped out 8 unique time-measuring components scattered across the system',
          'Identified and tagged over 20,000 translatable strings requiring management',
          'Documented critical user flows requiring both timezone and localization features',
          'Created edge case catalog for DST transitions and extreme timezone offsets (GMT+13/-11)',
        ],
      },
      {
        phase: 'Weeks 3-10: Parallel Development',
        activities: [
          'Timezone track built dual clocks, contextual tooltips, and calendar components',
          'Localization track developed translation pipeline and language switcher',
          'Both tracks maintained daily sync to ensure integration compatibility',
          'Regional format system built for dates, numbers, currency across all interfaces',
        ],
      },
      {
        phase: 'Weeks 11-14: Integration & Testing',
        activities: [
          'Unified configuration page controlling both language and timezone preferences',
          'Cross-feature testing validated timezone displays worked correctly in all 3 languages',
          'Performance benchmarking confirmed <100ms language switching target',
          'Edge case validation for DST transitions and extreme offset scenarios',
        ],
      },
      {
        phase: 'Weeks 15-20: Staged Deployment',
        activities: [
          'Feature flags enabled per market for granular control',
          'One pilot partner per language validated features in production',
          'Real-time monitoring during rollout caught and fixed minor issues',
          'Full launch across all markets after validation period',
        ],
      },
    ],
    images: [
      {
        url: '/img/localisation/implementation-architecture.png',
        alt: 'System architecture diagram showing display-layer approach',
        caption: 'Display-layer architecture kept core system stable',
      },
    ],
  },

  validation: {
    title: 'Validation & Results',
    outcomes: [
      {
        category: 'Production Stability',
        results: [
          'Zero critical incidents post-launch',
          'No performance degradation from the new features',
          'Seamless integration with existing workflows meant users adopted the features naturally rather than experiencing disruption',
        ],
      },
      {
        category: 'Market Activation',
        results: [
          'Brazil saw multiple enterprise partners successfully onboarded once the Portuguese interface removed their primary objection',
          'LatAm partners across 5 countries activated and started using the Spanish interface daily in production',
          'APAC strategic accounts onboarded with the Chinese localization, opening accounts that weren\'t possible before',
          'The SiGMA Americas trade show demo generated 12 qualified leads, largely because prospects could see the localization working in their own language',
        ],
      },
      {
        category: 'Operational Efficiency',
        results: [
          'Timezone questions essentially disappeared from the support queue, freeing up the team to focus on higher-value issues',
          'Operators started completing scheduling tasks without needing any assistance, which was a strong signal that the interface was genuinely intuitive',
          'Platform trust improved significantly across all regions, which showed up in usage patterns and direct feedback',
        ],
      },
    ],
    quickOutcomes: [
      '3 markets successfully entered (Brazil, LatAm, APAC)',
      '3 industry awards won after localization rollout',
      'Zero post-launch critical incidents',
    ],
    technical: [
      'We maintained 99.9% uptime during the entire rollout, which kept user trust high even as we deployed major changes',
      'Language switching performance consistently achieved the under-100ms target, making the transitions feel instant',
      'All three languages were validated by native speakers who also understood the iGaming domain, catching nuances that pure translation would miss',
      'Zero rollback events were needed across the staged deployment, which suggested our validation process caught issues before they reached production',
    ],
    images: [
      {
        url: '/img/localisation/after-clock.png',
        alt: 'Calendar widget in Simplified Chinese with dual timezone display',
        caption: 'Fully localized system clock with dual timezone display',
      },
      {
        url: '/img/localisation/after-dual-clock.png',
        alt: 'Sidebar showing both system and local time with color coding',
        caption: 'Dual clock system solving timezone confusion',
      },
      {
        url: '/img/localisation/translation-backoffice.png',
        alt: 'Backoffice interface showing translation and localization features',
        caption: 'Translation pipeline: Machine-generated strings tracked through human validation workflow',
      },
    ],
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'Domain expertise proved to be a viable substitute for traditional user research timelines in this case. My deep operational knowledge of how teams actually used the platform let me make rapid, accurate decisions without spending weeks on discovery. This would not work in an unfamiliar domain, but when you truly understand the problem space, you can move much faster.',
      'Dual-track development prevented dependencies and accelerated delivery without compromising either quality or cohesion. The key was maintaining daily synchronization between the tracks, so integration did not become a nightmare at the end. If we had done this sequentially, we would still be shipping features months later.',
      'Partner validation with real operators in each market provided feedback that synthetic testing could never match. They caught edge cases early, validated terminology choices, and gave us confidence that the features would work in production environments rather than just in our test scenarios.',
    ],
    challenges: [
      {
        challenge: 'Chinese font incompatibility with existing system fonts',
        solution: 'We implemented a dedicated font system for non-Latin languages with a proper fallback hierarchy. The key was testing thoroughly to ensure zero performance impact, because adding fonts can easily bloat load times if not handled carefully.',
      },
      {
        challenge: 'Timezone abbreviation confusion (CST could mean Central or China Standard Time)',
        solution: 'We decided to always display full timezone names alongside the GMT offset, which removed ambiguity completely. Yes, it takes more screen space, but clarity matters more than brevity when scheduling campaigns.',
      },
      {
        challenge: 'Portuguese text expansion breaking layouts (consistently 20% longer than English)',
        solution: 'Built a flexible CSS grid system with defined expansion zones, then tested every single layout with the longest language to catch issues before deployment. This took extra time upfront but prevented a cascade of layout fixes later.',
      },
    ],
    insight: "Localization isn't translation, it's trust infrastructure. When operators commit six-figure campaign budgets, their native language isn't a nice-to-have; it's the signal that this platform was built for them. The interface speaks before you do.",
    quickInsight: "Localization isn't translation—it's the signal that the platform was built for them.",
  },

  process: {
    title: 'Process',
    content: [
      'Discovery: Sales team shared feedback that Portuguese was coming up as explicit dealbreaker in Brazil conversations. This created urgency around what had been viewed as a nice-to-have feature.',
      'Audit: Mapped every timezone touchpoint and translatable string in the system. Found 8 unique time-measuring components and 20,000+ strings requiring management.',
      'Strategy: Decided on dual-track parallel development and display-layer architecture to minimize risk. Chose 3 pilot markets (Brazil, Colombia, China) based on revenue potential.',
      'Development: Timezone and localization tracks worked simultaneously with daily synchronization. Translation pipeline used LLM API for speed with human validation for accuracy.',
      'Validation: Each market had dedicated pilot partner providing real-world feedback. Weekly sessions during development caught issues before they reached production.',
      'Rollout: Feature flags per market enabled controlled deployment. Could disable per-language if issues arose. Monitored every metric during staged launch.',
      'Recognition: Submitted to industry awards immediately after successful launch. Won all three awards we entered (AIBC, SBC Latin America, SiGMA Americas).',
    ],
  },
}
