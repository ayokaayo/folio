import type { CaseStudy } from './types'

export const timeManagement: CaseStudy = {
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
}

