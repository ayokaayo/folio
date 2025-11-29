import type { CaseStudy } from './types'

export const smsCharacters: CaseStudy = {
  id: 'sms-characters',
  title: 'SMS Characters: Count & Preview',
  subtitle: 'Preventing costly messaging errors through accurate counting and multi-language support',
  hashtag: '#Risk elimination',
  company: 'Fast Track AI',
  year: '2024',
  linkText: 'Read case study',
  imageUrl: '/img/sms/hero-dropdown-wide.png',
  imageAlt: 'SMS composer interface showing character count, encoding warnings, and mobile preview',
  timeline: 'Q2 2024 (3 months)',
  team: '6 (Product Designer + 3 Engineers + Product Manager + QA Engineer)',

  impact: {
    title: 'Impact',
    items: [
      'Zero billing disputes in 6+ months vs. multiple five-figure disputes previously',
      'Instant calculation, preview, and troubleshooting for all message types',
      'Delivered a trustworthy solution fit for enterprise-grade operations',
      'New markets enabled through right-to-left text support (Arabic, Hebrew)',
      'Support tickets for SMS issues decreased notably',
      'Partner self-service improved dramatically with self-documenting interface',
    ],
    quickItems: [
      'Zero billing disputes in 6+ months (previously multiple five-figure disputes)',
      'RTL language support unlocked Arabic and Hebrew markets',
      'SMS support tickets essentially eliminated',
    ],
    deepItems: [
      'We went from multiple five-figure billing disputes in a six-month period to zero disputes in the six months after launch. The best metric for prevention is absence.',
      'The solution enabled instant calculation, preview, and troubleshooting for all message types, including complex scenarios with emojis, variables, and special characters.',
      'RTL text support opened Arabic and Hebrew markets that had previously been inaccessible. Partners who were composing messages externally could now work entirely within the platform.',
      'Support tickets for SMS issues dropped significantly, and partner self-service improved dramatically because the interface now documented itself through contextual tooltips and warnings.',
      'QA approval safeguards prevented costly sending errors by requiring explicit acknowledgment of cost-impacting elements before campaigns could be sent.',
    ],
    images: [
      {
        url: '/img/sms/composer-preview.png',
        alt: 'Full SMS composer interface with message setup, text content with emojis, and real-time mobile device preview showing 4 SMS at 235 characters',
        caption: 'Complete solution: intelligent counting, visual feedback, and real-time mobile preview',
      },
    ],
  },

  problem: {
    title: 'The Problem',
    context: "Our enterprise CRM's SMS channel served partners across the globe, but shipped with a basic character counter that couldn't handle modern messaging requirements. The system failed with emojis, non-Latin scripts, and dynamic text fields, causing incorrect message counts and unexpected campaign costs. Partners were blindsided by inflated SMS charges when diacritics or Unicode characters silently pushed messages from one segment to three. Critical billing disputes forced urgent action, while Arabic and Hebrew partners composed messages externally because our RTL text rendered unreadably.",
    quickContext: 'Basic character counter failing with emojis and Unicode. Multiple five-figure billing disputes. RTL text completely broken.',
    issues: [
      {
        category: 'Financial Risk',
        description: 'Character miscounts were causing up to 3x message costs without warning. A single emoji triggers an encoding switch from 160 to 70 characters per message, potentially tripling costs. We had multiple five-figure refund demands within six months, partners were questioning platform reliability, and campaign ROI was being destroyed by unexpected overages.',
        impact: 'Enterprise financial exposure and damaged partner trust',
      },
      {
        category: 'Technical Limitations',
        description: 'Emojis were counted as 1 character while actually varying from 2-8 depending on the sequence. Extended GSM characters were triggering encoding switches silently. Dynamic variables showed static counts that bore no relation to actual message length. The input fields did not support rich-text features needed for proper preview.',
        impact: 'Systematic undercounting leading to billing surprises',
      },
      {
        category: 'Market Barriers',
        description: 'Partners were leaving our platform to use external tools for accurate calculations. Broken RTL text rendering made QA essentially impossible for Arabic and Hebrew content. This created competitive disadvantage in international expansion.',
        impact: 'Lost market access and reduced platform stickiness',
      },
    ],
    quickIssues: [
      'Emoji miscounting causing up to 3x cost overruns',
      'Multiple five-figure billing disputes in 6 months',
      'RTL text rendering completely broken for Arabic/Hebrew markets',
    ],
    whyItMattered: [
      'SMS encoding errors create enterprise financial risk: one emoji can triple message costs',
      'Most CRM platforms handle only ASCII, leaving enterprises vulnerable to billing surprises',
      'Partners using external tools signals fundamental platform trust issues',
      'Broken RTL support means zero market access in entire regions',
    ],
    images: [
      {
        url: '/img/sms/before-counter.png',
        alt: 'Old SMS interface showing broken RTL text with separated characters, left-aligned Arabic input, and confusing character count display',
        caption: 'Before: Broken RTL rendering, separated characters, confusing count display',
      },
      {
        url: '/img/sms/after-counter.png',
        alt: 'Redesigned SMS interface with proper RTL rendering, character highlighting toggle, accurate estimated counts, and contextual tooltips',
        caption: 'After: Proper RTL support, highlighting toggle, accurate counts with contextual warnings',
      },
    ],
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Crisis as Business Case',
        decision: 'Leveraged billing disputes to secure resources for comprehensive solution rather than band-aid fixes',
        rationale: 'Senior management initially viewed this as a minor technical issue until billing disputes revealed enterprise-level financial risk and market expansion barriers. Financial impact created undeniable urgency where user complaints had not. I continued development during regular sprints and kept working on a comprehensive solution, being ready when crisis struck validated the foresight.',
        result: 'Secured full team allocation for three-month sprint instead of incremental patches that would have created new vulnerabilities.',
      },
      {
        title: '2. Constraint Design Process',
        decision: 'Used support tickets and billing disputes as primary research data instead of traditional user research',
        rationale: 'With no time or resources for extensive user research, we leveraged support tickets and billing dispute details as our primary data source. Each dispute included screenshots, message content, and extra-cost calculations. We essentially crowdsourced our usability testing data from real-world failures.',
        result: 'Rapid problem identification without research timeline, with evidence directly tied to business impact.',
      },
      {
        title: '3. Real-time Detection Over Post-Composition',
        decision: 'Live encoding detection during typing rather than validation after message completion',
        rationale: 'Cost awareness must occur during composition, not after mental commitment to the message content. Once someone has written their message, asking them to rewrite feels punitive. Catching issues as they type lets them make informed trade-offs naturally.',
        result: 'Partners actively modified content to optimise costs during composition rather than discovering problems after the fact.',
      },
      {
        title: '4. Risk-First Implementation',
        decision: 'Eliminated financial risk before adding enhancement features',
        rationale: 'A risk elimination attitude ensured financial exposure was removed first. This prevented partial or patchy fixes that could create new vulnerabilities. Comprehensive solution over band-aids meant we would not be back here in six months.',
        result: 'No cascading issues from partial implementations, complete problem resolution in single release.',
      },
    ],
    images: [
      {
        url: '/img/sms/encoding-flowchart.png',
        alt: 'Flowchart showing character analysis cascade: Message Input through emoji detection, non-GSM chars, extended GSM, dynamic text checks to final count calculation',
        caption: 'Cascading detection system: evaluates characters in order of complexity for accuracy and performance',
      },
      {
        url: '/img/sms/strategic-approach.png',
        alt: 'Four strategy cards showing Constraint Design Process, Limited Executive Buy-in, One Quarter Timeline Mandate, and Legacy System Limitations, plus deliverables list',
        caption: 'Strategic constraints that shaped the solution: crisis-driven timeline, limited resources, legacy systems',
      },
    ],
  },

  designDecisions: [
    {
      title: 'Intelligent Counting Engine',
      description: 'Real-time encoding detection that handles the full complexity of modern messaging. Emoji sequence handling correctly counts compound emojis (family emoji = 8 characters, not 1). Dynamic variable estimation uses defensive defaults: names at 25 characters, offers at 50, URLs at 100. Nested variables calculated recursively. Undefined variables display as placeholder text (8 chars) to prevent underestimation that would cause billing surprises.',
    },
    {
      title: 'Visual Feedback System with Severity Coding',
      description: 'Different indicators for known versus uncertain costs because they require different mental models. Yellow warnings for uncertain costs (variables that might expand) align with conventions for intermediate alerts encouraging timely adjustments. Blue info indicators for known impacts (special characters with calculable cost) provide reliable context without false urgency. Toggle-controlled character highlighting aids debugging but can be disabled to show accurate final message appearance.',
      image: {
        url: '/img/sms/toggle-interface.png',
        alt: 'Message preview with highlight toggle in OFF state, showing clean final appearance for English and RTL Farsi messages',
        caption: 'Toggle-controlled highlighting: debugging mode vs. accurate final preview',
      },
    },
    {
      title: 'Contextual Tooltip System',
      description: 'Comprehensive tooltips explain how specific elements affect SMS encoding and segment count. Each tooltip type addresses a specific pain point: emoji impact on character limits, variable expansion estimates, special character encoding switches, hyperlink handling, and footer defaults. Partners can make informed decisions during composition rather than discovering impacts after sending.',
    },
    {
      title: 'Mobile Preview Interface',
      description: 'Full device mockup with real-time updates showing exactly how SMS will appear to recipients. Multi-segment pagination display shows message breaks. Variable field preview with sample data lets partners see realistic message rendering. This became the highest-valued feature per partner feedback because SMS is consumed on mobile, and preview builds send confidence.',
      image: {
        url: '/img/sms/composer-preview.png',
        alt: 'SMS composer with real-time mobile device preview showing message with emojis rendered exactly as recipients will see it',
        caption: 'Real-time mobile preview: highest-valued feature per partner feedback',
      },
    },
    {
      title: 'RTL Language Support',
      description: 'Bidirectional text implementation with proper cursor behaviour for Arabic and Hebrew composition. Mixed-direction content handling for messages combining RTL and LTR elements (like URLs in Arabic text). Integrated Arabic and Hebrew fonts. Partners who previously composed externally could now work entirely within the platform.',
      image: {
        url: '/img/sms/RTL-support.png',
        alt: 'Multi-language SMS composer showing English, Hindi, Chinese, and Farsi messages with proper text rendering and character counts',
        caption: 'Global language support: proper rendering across Latin, Devanagari, Chinese, and RTL scripts',
      },
    },
    {
      title: 'QA Approval Safeguards',
      description: 'Mandatory acknowledgment system prevents accidental cost overruns. Partners must explicitly confirm understanding of variable text impact before sending campaigns with dynamic content or special characters. Once acknowledged, financial responsibility transfers to partner. The system warns but cannot prevent high-cost sends if explicitly approved, which is the right balance for enterprise autonomy.',
    },
  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'Cascading detection system evaluates characters in order of complexity, optimising for both accuracy and performance',
      'Debounced checking at brief intervals delays evaluation during typing to minimise computational load while maintaining smooth interface performance',
      'Cached encoding for unchanged sections retains results for static message portions, avoiding redundant analysis',
      'Lazy evaluation for variable previews with defensive character estimates (names = 25, offers = 50, URLs = 100)',
      'Optimised regex patterns for instant character detection and encoding trigger identification',
      'Wrapper components built as interim solution while coordinating parallel system upgrade for rich-text input support',
      'RTL bidirectional text implementation with proper cursor behaviour and mixed-direction content handling',
    ],
    quickTechnical: [
      'Real-time GSM/UCS-2 encoding detection',
      'Debounced analysis for smooth typing performance',
      'Defensive variable estimation prevents undercount surprises',
      'RTL support for Arabic and Hebrew markets',
    ],
    rollout: [
      {
        phase: 'Weeks 1-4: Risk Elimination',
        activities: [
          'Mapped GSM encoding rules and all edge cases including emoji sequences and extended characters',
          'Analysed dispute patterns to identify highest-impact failure modes',
          'Implemented mandatory cost warnings for high-risk SMS containing encoding triggers',
          'Built basic mobile preview to validate message appearance before sending',
        ],
      },
      {
        phase: 'Weeks 5-8: Core Features',
        activities: [
          'Developed intelligent counting engine with real-time encoding detection',
          'Built visual feedback system with severity-coded warnings and info indicators',
          'Created comprehensive tooltip system explaining impact of each element type',
          'Implemented toggle-controlled character highlighting for debugging',
        ],
      },
      {
        phase: 'Weeks 9-12: Market Enabling',
        activities: [
          'Implemented RTL text support with bidirectional rendering and proper cursor behaviour',
          'Built advanced character highlighting with mixed-direction content handling',
          'Deployed QA approval interface with mandatory acknowledgment for cost-impacting elements',
          'Partner beta testing provided validation that synthetic testing could not achieve',
        ],
      },
    ],
    images: [
      {
        url: '/img/sms/tooltip-mapping.png',
        alt: 'Comprehensive tooltip documentation showing all variable types: Hyperlink Address, Default SMS footer, Variables, Special characters, Emoji characters, Firstname with sample values, and warning message examples',
        caption: 'Complete tooltip system: each element type has contextual guidance explaining impact on character count',
      },
      {
        url: '/img/sms/character-count.png',
        alt: 'Real-time character counting comparison: top shows exact count (88 chars, blue info), bottom shows estimated count with variable (130 chars, yellow warning)',
        caption: 'Real-time counting: exact counts for static content, estimated counts with warnings for dynamic variables',
      },
    ],
  },

  validation: {
    title: 'Validation & Results',
    outcomes: [
      {
        category: 'Risk Elimination',
        results: [
          'Zero billing disputes in 6+ months post-launch versus multiple five-figure disputes previously',
          'Reduced financial exposure from SMS campaigns through accurate pre-send cost visibility',
          'Eliminated recurring refund requests that had been damaging partner relationships',
        ],
      },
      {
        category: 'Operational Efficiency',
        results: [
          'Support tickets for SMS issues decreased notably as interface became self-documenting',
          'QA approval process streamlined with clear warnings making review straightforward',
          'Partner self-service improved dramatically with contextual guidance at every step',
        ],
      },
      {
        category: 'Market Expansion',
        results: [
          'Arabic and Hebrew markets now accessible through proper RTL support',
          'Competitive parity achieved with specialised SMS platforms',
          'Foundation laid for additional messaging channels (MMS, WhatsApp Business API)',
        ],
      },
    ],
    quickOutcomes: [
      'Zero billing disputes in 6+ months (from multiple five-figure disputes)',
      'RTL markets unlocked (Arabic, Hebrew)',
      'SMS support tickets essentially eliminated',
    ],
    feedback: [
      'Mobile preview became highest-valued feature per partner feedback',
      'Positive reviews specifically mentioning SMS functionality',
      'Partners confidently using features they previously avoided',
      'Internal team SMS literacy improved through self-documenting interface',
    ],
    technical: [
      'Character counting accuracy validated across GSM, UCS-2, and mixed encoding scenarios',
      'High toggle usage for character highlighting indicated clear user value for the debugging feature',
      'Zero confusion reported in post-launch support tickets about warning indicators',
      'Performance maintained with debounced checking even for extended message composition',
    ],
    images: [
      {
        url: '/img/sms/qa-validation.png',
        alt: 'QA approval interface showing English and Farsi messages with selection checkboxes and green acknowledgment bar for variable cost confirmation',
        caption: 'QA safeguards: mandatory acknowledgment before sending messages with cost-impacting elements',
      },
      {
        url: '/img/sms/toggle-interface.png',
        alt: 'Message preview interface with highlight toggle in OFF state, showing clean English and properly-rendered RTL Farsi messages',
        caption: 'Toggle-controlled highlighting: aids debugging when on, shows accurate final appearance when off',
      },
    ],
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'Crisis as business case proved essential. Financial impact created undeniable urgency where user complaints had not moved the needle. Quantifiable loss in five-figure disputes drove prioritisation in a way that usability concerns never had.',
      'Defensive design philosophy paid off significantly. Estimated labelling and comprehensive warnings prevented new issues while solving the core problem. Building for worst-case scenarios prevented the cascading issues that partial fixes would have created.',
      'Constraint-driven research worked better than expected. Support tickets and billing disputes as primary data gave us real-world failure modes with business impact already quantified. We essentially crowdsourced usability testing from actual problems.',
    ],
    challenges: [
      {
        challenge: 'Legacy system limitations preventing rich-text display in input components',
        solution: 'Built wrapper components as interim solution while coordinating parallel system upgrade. This ensured we did not block on dependencies while still delivering the core functionality partners needed.',
      },
      {
        challenge: 'International QA gaps for RTL language validation',
        solution: 'Partner beta testing provided better validation than synthetic testing could achieve. Real operators in Arabic and Hebrew markets caught edge cases and workflow gaps our internal testing missed.',
      },
      {
        challenge: 'Support knowledge gaps around encoding nuances',
        solution: 'Self-documenting interface reduced dependency on support team understanding GSM versus UCS-2 encoding. The tooltips taught users directly rather than requiring support escalation.',
      },
    ],
    insight: "Prevention economics matter more than most teams realise. Reactive fixes cost multiples of proactive solutions, and early investment prevents compound costs. Simple surface features can hide significant technical depth affecting enterprise relationships. This project also taught me that constraints focus innovation: limited resources forced us to build only essential features, and that comprehensive approach prevented the partial-fix problems that plague incremental work. The foundation we built now enables future expansion into MMS with media preview, WhatsApp Business API integration, template libraries with pre-validated content, and eventually AI-powered message optimisation.",
    quickInsight: "Prevention economics: reactive fixes cost multiples of proactive solutions. The best metric for prevention is absence.",
  },

  process: {
    title: 'Process',
    content: [
      'Discovery: Second major billing dispute hit and created crisis-driven urgency. I had been developing a comprehensive solution during regular sprints, so we were ready when senior management finally allocated resources.',
      'Research: Used support tickets and billing dispute details as primary data source. Each dispute included screenshots, message content, and exact cost calculations. This gave us real failure modes with business impact already quantified.',
      'Strategy: Adopted risk elimination attitude to ensure financial exposure was removed before adding enhancement features. Chose comprehensive fix over band-aids to prevent cascading issues from partial implementations.',
      'Development: Three-month sprint with phased delivery. Weeks 1-4 focused on risk elimination (mandatory warnings, basic preview). Weeks 5-8 built core features (intelligent counting, visual feedback). Weeks 9-12 enabled market expansion (RTL support, QA safeguards).',
      'Validation: Partner beta testing in each target market provided feedback that synthetic testing could never match. They caught terminology issues, workflow gaps, and edge cases that would have caused problems at scale.',
      'Launch: June 2024 deployment with immediate monitoring. Success manifested through what did not happen: no disputes, no escalations, no partner churn. The best validation for preventive design is when nothing goes wrong.',
    ],
  },
}
