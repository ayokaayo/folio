import type { CaseStudy } from './types'

export const smsCharacters: CaseStudy = {
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
}

