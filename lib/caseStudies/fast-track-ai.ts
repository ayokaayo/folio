import type { CaseStudy } from './types'

export const fastTrackAI: CaseStudy = {
  id: 'fast-track-ai',
  title: 'Fast Track AI',
  subtitle: "Designing iGaming's first conversational CRM that takes action, not just answers questions",
  hashtag: '#AI Product',
  company: 'Fast Track AI',
  year: '2025',
  linkText: 'Read case study',
  imageUrl: '/img/ftai/hero-welcome.png',
  imageAlt: 'Fast Track AI welcome interface showing natural language input and capability chips',
  timeline: 'Q3 2025 (2-month MVP)',
  team: '9 (Product Designer, Data Scientist, 2 Backend, 2 Frontend, CPO, CTO, Head of Product, Head of User Adoption)',

  impact: {
    title: 'Impact',
    items: [
      'Shipped functional MVP in 2 months with cross-functional senior team',
      'Now in production with early access partners across multiple markets',
      'Data analysis reduced from days between CRM and BI teams to minutes via conversation',
      'Campaign creation simplified from hours of configuration to natural language requests',
      'Featured in iGaming Business, European Gaming, and iGaming Future',
      'Foundation for company flagship product and next growth phase',
    ],
    quickItems: [
      '2-month MVP with CPO, CTO, Head of Product',
      'Days to minutes for data analysis',
      'In production with early access partners',
      'Featured in industry press',
    ],
    deepItems: [
      'Shipped a functional MVP in approximately 2 months, working alongside CPO, CTO, Head of Product, and a team of engineers. This timeline required ruthless prioritization and clear scope boundaries from day one.',
      'The capability shift was dramatic: data analysis that previously required days of back-and-forth between CRM and BI teams now happens in minutes through natural conversation. One partner noted this "made their life easier both from an execution perspective as well as reporting."',
      'Campaign creation, which previously meant hours configuring settings across multiple screens, can now be initiated through natural language. The AI populates existing modals with generated content, keeping users in familiar territory while removing the configuration burden.',
      'The product has been featured across industry publications including iGaming Business, European Gaming, and iGaming Future. It represents the company flagship offering going forward, with early access partners actively using the system in production.',
    ],
    images: [
      {
        url: '/img/ftai/hero-welcome.png',
        alt: 'Fast Track AI welcome screen with natural language input and quick-start chips',
        caption: 'Entry point designed to communicate capabilities and invite exploration',
      },
    ],
  },

  problem: {
    title: 'The Problem',
    context: "CRM teams at iGaming operators were bottlenecked by technical complexity. Getting insights required BI expertise or hours of manual Data Studio configuration. Campaign creation meant navigating complex settings across multiple screens. Ideas sat in queues waiting for technical resources, and by the time answers arrived, the moment had often passed. Meanwhile, competitors were adding 'AI' as a checkbox feature without genuine capability. We needed to build something that actually transformed how CRM teams work.",
    quickContext: 'Data analysis required BI expertise. Campaign creation took hours. CRM teams bottlenecked by technical barriers. Ideas died in queues.',
    issues: [
      {
        category: 'BI Bottleneck',
        description: 'To analyze player performance, users navigated to Data Studio, selected measures and dimensions, configured filters and time groupings, understood query logic, ran queries, and interpreted raw results. This required BI expertise that most CRM teams did not have. Questions sat in queues between departments, sometimes for days.',
        impact: 'Days of delay between question and answer. Missed opportunities. CRM teams unable to self-serve.',
      },
      {
        category: 'Configuration Complexity',
        description: 'Campaign creation required navigating multiple screens, understanding segment logic, configuring triggers, setting up actions across channels, and managing timing. Each step had dozens of options. Small mistakes meant campaigns misfired or never ran at all.',
        impact: 'Hours per campaign. High error rate. Creative ideas abandoned due to execution friction.',
      },
      {
        category: 'Technical Debt Reality',
        description: 'The existing platform had accumulated complexity over years of feature additions. Any new capability had to integrate cleanly without creating a parallel system or adding more confusion. We could not break what was already working to add something new.',
        impact: 'Constraint on how AI could be introduced. Extension architecture required, not replacement.',
      },
    ],
    quickIssues: [
      'Data analysis required BI expertise and days of waiting',
      'Campaign creation took hours of manual configuration',
      'Technical barriers blocked CRM team creativity',
      'Existing system debt constrained integration approach',
    ],
    whyItMattered: [
      'CRM teams had ideas but lacked technical ability to execute them quickly',
      'BI teams were bottlenecked serving multiple departments simultaneously',
      'Competitors adding AI as marketing checkbox, not genuine capability',
      'Platform needed differentiation for next growth phase',
    ],
    images: [
      {
        url: '/img/ftai/before-datastudio-dimensions.png',
        alt: 'Data Studio interface showing complex query configuration with measures, filters, dimensions, and time groupings',
        caption: 'Before: Getting player data required navigating Data Studio and understanding query logic',
      },
      {
        url: '/img/ftai/before-datastudio-measures.png',
        alt: 'Data Studio field selection showing deposit amounts, withdrawal counts, and other financial metrics',
        caption: 'Before: Users needed to know exact field names and relationships to build queries',
      },
    ],
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Extension Over Replacement',
        decision: 'AI as amplifier of existing platform, not a parallel system',
        rationale: 'I advocated for integration over isolation. Adding AI as a separate product would create two ways to do everything, neither complete. Users would context-switch constantly and never build confidence in either path. Instead, I designed AI to use existing modals and patterns wherever possible.',
        result: 'Partners adopted AI alongside existing workflows immediately. When AI creates an activity, it populates the same Activity modal users already know. New entry point, familiar execution. No retraining required.',
      },
      {
        title: '2. Dedicated Space Over Scattered Entry Points',
        decision: 'Single AI interface rather than contextual AI buttons throughout the platform',
        rationale: 'I evaluated three options: global command palette (Spotlight-style), contextual AI buttons on every screen, or a dedicated AI space. I chose dedicated space because enterprise users needed clear scope boundaries. Scattered entry points would create confusion about what AI could do where.',
        result: 'Users understand AI as a distinct capability with clear boundaries. The welcome screen chips communicate exactly what is possible before users invest time in queries.',
      },
      {
        title: '3. Honest Boundaries Over Confident Promises',
        decision: 'Constrain scope aggressively and communicate limits clearly upfront',
        rationale: 'Early prototypes let AI attempt any query. Testing revealed users were confused when AI confidently answered questions outside its actual capabilities. I redesigned the welcome experience to show specific capabilities (Data Mining, Reporting) rather than open-ended "Ask anything" framing.',
        result: 'Usage errors dropped significantly. Partners understood what AI could and could not do before investing time. Expectations matched reality.',
      },
      {
        title: '4. Conversational Error Recovery',
        decision: 'Errors as dialogue opportunities, not dead ends',
        rationale: 'Enterprise users committing real budgets need to trust the system even when it fails. I designed comprehensive error states where AI takes responsibility and always provides a recovery path. The tone is collaborative rather than blaming.',
        result: 'Partners reported feeling in control even when things went wrong. Trust maintained through transparency about what happened and what to do next.',
      },
    ],
    images: [
      {
        url: '/img/ftai/approach-welcome.png',
        alt: 'Welcome screen showing clear capability chips for Data Mining and Reporting',
        caption: 'Scope communication: Quick-start chips show exactly what AI can do, setting expectations upfront',
      },
    ],
  },

  designDecisions: [
    {
      title: 'Natural Language Entry Point',
      description: 'Clean welcome screen with personalized greeting, open input field with attachment and voice options, and capability chips below. The chips serve dual purpose: quick-starts for common tasks and scope communication showing what is possible. Persistent disclaimer about AI limitations visible from the start builds appropriate trust calibration.',
      image: {
        url: '/img/ftai/dd-welcome.png',
        alt: 'Fast Track AI welcome interface with input field and quick-start chips',
        caption: 'Entry point balances invitation with honest scope communication',
      },
    },
    {
      title: 'AI That Takes Action with Structured Confirmation',
      description: 'When asked to create activities, AI executes the request and shows structured confirmation: what was created, project assignment, schedule with specific times, configuration details, and suggested next steps. Created items are clickable links back to actual objects in the system. The output format mirrors how users think about activities, making verification natural rather than effortful.',
      image: {
        url: '/img/ftai/dd-activities-created.png',
        alt: 'AI response showing 5 created test activities with schedule and configuration details',
        caption: 'AI that acts: Structured confirmation shows exactly what was created',
      },
    },
    {
      title: 'Existing Modal Integration',
      description: 'AI-generated content populates existing platform modals rather than creating new confirmation interfaces. Activity creation uses the same Activity modal users already know, pre-filled with AI-generated settings. Users can review, modify, and save using familiar patterns. This was a key architectural decision: AI handles the complexity of configuration while existing UI handles the trust of final confirmation.',
      image: {
        url: '/img/ftai/dd-modal-integration.png',
        alt: 'Created activities list alongside existing Activity modal with pre-filled settings',
        caption: 'Extension pattern: AI output integrates with existing modal, keeping users in familiar territory',
      },
    },
    {
      title: 'Intelligent Analysis with Actionable Output',
      description: 'Complex analyses return structured reports with highlighted key metrics (positive in one color, concerns in another), priority action recommendations numbered by importance, expandable detail sections for deeper data, and one-click follow-up query suggestions. Chat history preserved in sidebar for context continuity across a working session. The goal is actionable insight, not just data display.',
      image: {
        url: '/img/ftai/dd-analysis.png',
        alt: 'Complex analysis output with highlighted metrics, priority actions, and follow-up suggestions',
        caption: 'Actionable insights: Key metrics highlighted, priority actions listed, one-click follow-ups available',
      },
    },
    {
      title: 'Comprehensive Error Handling System',
      description: 'Categorized error states for generic issues (query too complex, compilation failures), connection problems (dropped mid-run, fetch failures), and capacity limits (token caps, rate limiting). Each error type uses conversational language where AI takes responsibility ("I will simplify and retry", "This turned into more than I could handle") and always provides a clear recovery action. Every error is a path forward, not a wall.',
      image: {
        url: '/img/ftai/dd-errors.png',
        alt: 'Error handling states showing conversational recovery options for different failure types',
        caption: 'Trust infrastructure: Every error has a recovery path, AI takes responsibility',
      },
    },
    {
      title: 'Contextual Next Steps and Follow-ups',
      description: 'After any AI response, contextual action buttons appear based on what was just completed. After creating activities: "Add email action", "View all activities in project", "Delete all test activities". After analysis: "Analyze player churn trends", "Top performing games", "VIP player analysis". These reduce the gap between insight and next action, keeping users in flow rather than starting over.',
    },
  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'LangChain integration with enterprise database access, optimized for iGaming data structures',
      'Debounced query processing to handle rapid input without overwhelming backend systems',
      'Existing modal population via shared state management, preserving all validation rules',
      'Error categorization system mapping LangChain failures to user-friendly recovery flows',
      'Token usage tracking integrated but abstracted from user-facing interface',
      'Chat history persistence enabling context continuity across sessions',
      'Real-time response streaming for long analyses, showing progress rather than blank waiting',
      'Baseline defaults system for handling uncertainty without hallucination',
    ],
    quickTechnical: [
      'LangChain with enterprise data access',
      'Extension architecture (existing modals)',
      'Comprehensive error categorization',
      'Real-time streaming responses',
    ],
    rollout: [
      {
        phase: 'Weeks 1-3: Foundation',
        activities: [
          'Participated in strategy sessions with CPO, CTO, Head of Product to define scope',
          'Established extension architecture: AI uses existing modals, not parallel UI',
          'Designed entry point and core conversation interface patterns',
          'Created error handling framework mapping technical failures to recovery flows',
        ],
      },
      {
        phase: 'Weeks 4-6: Core Capabilities',
        activities: [
          'Built reporting and analysis output patterns with actionable formatting',
          'Developed activity creation flow with modal integration',
          'Implemented structured confirmation patterns showing what AI created',
          'Designed contextual follow-up suggestions based on completed actions',
        ],
      },
      {
        phase: 'Weeks 7-8: Polish and Validation',
        activities: [
          'Refined error states based on LangChain testing sessions',
          'Tightened scope communication after early user confusion',
          'Performance optimization for response streaming',
          'Internal testing and iteration before partner rollout',
        ],
      },
      {
        phase: 'September 2025: Early Access Launch',
        activities: [
          'Deployed to selected early access partners',
          'Collected feedback via Slack and direct communication',
          'Iterated on hallucination issues and scope boundaries',
          'Usage pattern analysis via LangSmith informed Phase 2 priorities',
        ],
      },
    ],
    images: [
      {
        url: '/img/ftai/impl-langsmith.png',
        alt: 'LangSmith analytics showing category breakdown of user queries across Platform Guidance, Market Strategy, Operational Monitoring, and other categories',
        caption: 'Data-informed iteration: Usage patterns directly shaped Phase 2 roadmap priorities',
      },
    ],
  },

  validation: {
    title: 'Validation & Results',
    outcomes: [
      {
        category: 'Partner Reception',
        results: [
          '"We can now analyse data very quickly... previously it took days to pass between CRM and BI teams. This has made their life easier both from an execution perspective as well as reporting."',
          '"The guys are loving Fast Track AI... They are excited to see how it can grow and reduce manual work."',
          '"Really good feedback overall, people are impressed with the capabilities."',
          '"Partners want to use it beyond reporting capabilities, looking forward to future updates for campaign creation."',
        ],
      },
      {
        category: 'Constructive Feedback Addressed',
        results: [
          'Token double-charging concerns raised and addressed with improved usage transparency',
          'Hallucination issues (AI inventing data names) caught and fixed by tightening scope boundaries',
          'Security concerns around email export permissions flagged for roadmap prioritization',
          'Demand for campaign creation capabilities validated Phase 2 direction',
        ],
      },
      {
        category: 'Usage Pattern Insights',
        results: [
          'Platform Guidance and Market Strategy queries dominated early usage',
          'Operational Monitoring and Scheduled Reporting showed strong adoption',
          'Campaign Performance queries indicated demand for action capabilities beyond reporting',
          'Usage data directly informed Phase 2 feature prioritization',
        ],
      },
    ],
    quickOutcomes: [
      'Partner: "Days to minutes for data analysis"',
      'Strong positive reception across early access partners',
      'Usage data validated Phase 2 direction',
    ],
    feedback: [
      '"We can now analyse data very quickly... previously it took days to pass between CRM and BI teams."',
      '"Really good feedback overall, people are impressed with the capabilities."',
      '"Partners want to use it beyond reporting capabilities."',
    ],
    technical: [
      'MVP shipped on 2-month timeline as planned',
      'Integration with existing platform maintained full stability',
      'LangChain error handling achieved acceptable reliability for production use',
      'Foundation architecture confirmed capable of supporting Phase 2 expansion',
    ],
    images: [
      {
        url: '/img/ftai/validation-langsmith.png',
        alt: 'LangSmith category breakdown showing query distribution across Platform Guidance, Market Strategy, Operational Monitoring, Scheduled Reporting, Cohort Funnels, and Campaign Performance',
        caption: 'Usage analysis revealed reporting and analysis as dominant use cases, validating Phase 1 focus',
      },
    ],
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'Extension beats replacement. Using existing modals for AI-generated content meant partners learned one new entry point, not an entirely new system. The AI handles complexity; familiar UI handles trust. I will apply this pattern to future AI integrations.',
      'Scope communication prevents confusion. Early versions with open-ended "ask anything" framing led to frustration when AI could not deliver. Redesigning the welcome screen to show specific capabilities upfront changed user expectations immediately. Constraints communicated clearly become features, not limitations.',
      'Error handling is trust infrastructure. Comprehensive, conversational error states with clear recovery paths prevented errors from becoming trust-breakers. Users forgive mistakes when they understand what happened and have a path forward. I invested heavily here and it paid off in partner confidence.',
      'Speed requires ruthless prioritization. Two-month timeline meant identifying which patterns had to be right from day one (error handling, trust signals, scope communication) versus what could iterate later (visual polish, edge cases). The key was knowing the difference and defending those priorities.',
    ],
    challenges: [
      {
        challenge: 'Hallucination control with large database access',
        solution: 'Tightened scope aggressively after early testing. Redesigned welcome experience to communicate boundaries clearly. Changed AI behavior to question when uncertain rather than guess confidently. Added baseline defaults for ambiguous situations that could not be resolved.',
      },
      {
        challenge: 'Integrating with platform technical debt',
        solution: 'Chose extension architecture over replacement. AI uses existing modals and patterns wherever possible. New entry point, familiar execution. This avoided creating parallel systems while respecting existing user knowledge and workflows.',
      },
      {
        challenge: 'Enterprise trust for AI that takes real actions',
        solution: 'Structured confirmations showing exactly what will happen before it happens. Existing modals for final review give users familiar control point. Clear undo paths for created items. Persistent disclaimer about AI limitations. Every design decision filtered through "does this increase or decrease user control?"',
      },
      {
        challenge: 'Cross-functional alignment under time pressure',
        solution: 'Daily syncs with engineering team. Active participation in strategy sessions with CPO and CTO rather than receiving requirements. Prototype-driven communication rather than specification documents. Decisions made in hours, not weeks.',
      },
    ],
    insight: "The real product is not the AI. It is confidence. Partners commit real budgets through this system. Every design decision must answer: does the user feel in control? Do they understand what will happen? Can they recover from mistakes? AI capability means nothing without the trust infrastructure to support it. The interface must say 'you are in control' at every step.",
    quickInsight: 'AI that acts requires different trust patterns than AI that answers. The real product is confidence, not capability.',
  },

  process: {
    title: 'Process',
    content: [
      'Strategy: Participated in ideation sessions with CPO, CTO, and Head of Product. Defined scope boundaries early: reporting and analysis first, campaign creation second. Established extension architecture over replacement as core principle.',
      'Research: Used LangChain testing sessions as design research. Every failure mode became a design requirement. Partner feedback from adjacent features informed expectations. No formal user research timeline available given speed requirements.',
      'Design: Rapid prototyping with daily engineering feedback. Focused on trust patterns first (error handling, scope communication, confirmation flows). Visual polish explicitly deferred to post-MVP iteration.',
      'Development: Eight-week sprint with continuous designer-engineer collaboration. Decisions made in prototype reviews, not specification handoffs. Scope adjusted weekly based on technical reality and testing findings.',
      'Validation: Early access rollout to selected partners in September 2025. Feedback collected via Slack and direct communication. Usage patterns tracked through LangSmith. Iteration priorities set by actual partner needs rather than assumptions.',
      'Current: In production with early access partners. Phase 2 (campaign creation) releasing. Continuous iteration based on usage data and partner feedback. Foundation validated for expansion.',
    ],
  },
}
