import type { CaseStudy } from './types'

export const xpdna: CaseStudy = {
  id: 'xpdna',
  title: 'XPDNA',
  subtitle: 'Experience DNA: an AI-native product design harness where non-technical people design and prototype straight into production-ready code, with reach into every step of the product lifecycle. Every prototype is an organism grown from our own repositories. Hence the name.',
  hashtag: '#AI Experience',
  company: 'Fast Track AI',
  year: '2026',
  linkText: 'Read case study',
  cardSummary: 'An AI-native product design harness: design straight into production code. Roughly 4 components in three years became 12 in five months.',
  imageUrl: '/img/xpdna/cover.jpg',
  imageAlt: 'XPDNA cover: the DNA emoji and the XPDNA wordmark over the tagline design system management and prototyping, on a light paper field faintly sketched with wireframe design-system components',
  timeline: 'February 2026 to present (ongoing)',
  team: 'Built solo; adopted by design, frontend engineering, and product',

  impact: {
    title: 'Impact',
    items: [
      'The production component library gained 12 new components in five months, after gaining roughly 4 in the three years before',
      'A designer published a production-ready component in 9 minutes, from opening the request to automatic release, tests and documentation included',
      'Design became co-owner of the production component library: component changes now need design approval to ship',
      '81 AI-assisted contributions from 9 different people, designers and engineers alike',
      'Every change is checked automatically for code quality and experience quality before it ships',
    ],
    quickItems: [
      'Roughly 4 components in three years before; 12 in five months after',
      'A designer published a production component in 9 minutes',
      'Design became co-owner of the production component library',
      'Automatic quality checks on every change; 81 AI-assisted contributions from 9 people',
    ],
    deepItems: [
      'The production component library added roughly 4 net-new components in the three years before the harness (January 2023 to January 2026). In the five months after (February to June 2026), it added 12, authored by designers and engineers and shipped through the same review gates as any other code. Both numbers are counted directly from the library\'s git history, not estimated.',
      'In June 2026, a designer on the team requested a new button component at 08:54, and at 09:03 it was approved, released, and live in the production library. Nine minutes, tests and documentation included. Simple components now ship within a working day; only the biggest pieces still take real review time.',
      'By June, enough designer-shipped code was flowing through the pipeline that the existing review process could not absorb it. Senior engineering leadership resolved the governance question by making the design team code owners of the production component library, with at least one design approval required on component PRs. The system produced enough real output to force a process redesign, and the process was redesigned in design\'s favor.',
      'The harness was two weeks old when the first AI-assisted commit landed in the production library. By early July there were 81, from 9 different people: designers, frontend engineers, and me. Adoption here is measured in merged commits, not in survey answers.',
      'The eval layer is what made the velocity acceptable to engineering. Every PR is checked twice, once for code compliance and once for experience quality, and the findings land directly on the PR for everyone to see. The rules that can fail a build are deterministic ones; the AI\'s opinions never outrank them.',
    ],
    images: [
      {
        url: '/img/xpdna/nine-minutes.jpg',
        alt: 'Timeline graphic of a designer-authored pull request: opened at 08:54, merged at 09:03, npm release published automatically on merge',
        caption: 'Nine minutes from request to release: a designer\'s component, tests and docs included, published automatically',
      },
    ],
  },

  problem: {
    title: 'The Problem',
    context: 'The design organization treated Figma as the source of truth. The production codebase disagreed, silently, and had been disagreeing for years. When the harness later put a number on the gap, the audit was blunt: 839 components in the design library, 22 mapped to code, 0 verified as in sync. Those three numbers anchor everything that follows.\n\nThe gap was structural, not laziness. Every design shipped twice, once in pixels and once in code, and the translation step between the two was where fidelity and time went to die. After a founding sprint shipped 17 components, the library gained roughly 4 in the next three years, behind an approval gate the team\'s own planning decks described as weeks to months.\n\nMeanwhile, the knowledge that actually determined quality (how the team writes requirements, how it critiques design work, which patterns the product really uses) lived in individual heads and chat threads. And AI tooling was arriving regardless of whether that knowledge was ready for it.',
    quickContext: 'The design library and the production code had quietly told two different stories for years. XPDNA exists because closing that gap by hand never worked.',
    issues: [
      {
        category: 'Source-of-truth inversion',
        description: 'The org treated the design tool as canonical, but the product\'s real behavior lives in code. The design library was a mirror that had drifted for years, and nobody was measuring the drift.',
        impact: 'Design decisions were being made against a fiction, and any tooling built on top of the design library, human or AI, inherited the drift.',
      },
      {
        category: 'The handoff tax',
        description: 'Between design and production sat a translation step that consumed time, dropped fidelity, and produced components that matched neither the design nor each other.',
        impact: 'Ideas were priced out by the cost of shipping them.',
      },
      {
        category: 'Knowledge that does not compound',
        description: 'The team\'s conventions existed nowhere a tool could read them. Every new hire relearned them from scratch; every AI agent started blind.',
        impact: 'The team\'s most valuable asset was invisible to the tools that were about to do a growing share of the work.',
      },
    ],
    quickIssues: [
      'The design tool mirrored the product; code defined it. Nobody measured the drift',
      'Every design shipped twice: pixels first, code second, drift in between',
      'Roughly 4 new components shipped in three years',
      'Team knowledge lived in heads and threads, invisible to new hires and AI agents alike',
    ],
    whyItMattered: [
      'AI raised the cost of ambiguity: an agent with bad context does not fail politely, it ships the wrong thing faster and at scale',
      'The drift was invisible because nobody was measuring it, and a problem without a number can be deferred forever',
      'Design\'s leverage stopped at the handoff: whatever quality existed in the design tool, production was decided somewhere else',
      'The tooling shift was coming either way; the only real choice was whether the team\'s knowledge would be structured to feed it or left behind by it',
    ],
    images: [
      {
        url: '/img/xpdna/parity.jpg',
        alt: 'Component parity dashboard comparing the design library to the production codebase: 839 components in Figma, 22 mapped to code, 0 verified in sync',
        caption: 'The parity audit: drift became a number instead of a suspicion',
      },
    ],
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Code as the Source of Truth',
        decision: 'Demote the design tool to a synchronized mirror. The production library owns the tokens and the truth; a parity audit measures drift instead of pretending it does not exist.',
        rationale: 'You cannot build reliable automation on top of a fiction. Production behavior is defined by code, so the harness treats code as canonical and keeps the design tool as a synchronized mirror. Once truth has one home, drift stops being a philosophical argument and becomes a measurable quantity.',
        result: 'Drift became a number on a dashboard: the audit at the top of this case study. You can argue with an opinion; you cannot argue with a coverage bar.',
      },
      {
        title: '2. Team Knowledge as Versioned Skills',
        decision: 'Codify how the team works (writing PRDs, critiquing designs, generating prototypes, translating design to code) as versioned, reviewable skills that any harness session loads on demand.',
        rationale: 'Knowledge in heads and threads evaporates; knowledge in versioned files compounds. If a convention matters, it should exist in a form both a new hire and an agent can execute. The registry includes a meta-skill that manufactures new skills and registers them, so the system extends itself under the same review rules it started with.',
        result: '9 registered skills plus a marketplace plugin. When a frontend engineer improved the design-to-code skill, every subsequent session got better for everyone. That compounding is what the old process never had.',
      },
      {
        title: '3. Evals Before Trust',
        decision: 'Put a two-layer evaluation harness (code compliance plus experience quality) on every prototype and every PR before asking anyone to trust the output.',
        rationale: 'AI output is not trustworthy by default, and engineering knows it. The core design principle: deterministic rules own the error tier, and AI-judge findings are capped at warning and suggested, so hard results never flip between runs. Advisory first: the CLI always exits 0 and lets the findings do the persuading before any gate turns hard.',
        result: '138 test cases across 20 files stand behind the harness. CI posts findings directly on every PR, and a retroactive audit of 122 existing prototypes surfaced 768 compliance issues the old process had silently accepted.',
      },
      {
        title: '4. Same Door as Engineers',
        decision: 'No parallel design pipeline. Harness output ships as ordinary PRs with tests, docs, and semver releases, through the team\'s existing review gates.',
        rationale: 'A separate lane for design-generated code would have made that code forever second-class: reviewed by different rules, trusted by nobody. The same instinct drove the extension-over-replacement decision in my Fast Track AI work. New capability earns trust fastest when it flows through the interfaces people already rely on.',
        result: 'Designers\' components merged in minutes and auto-published to npm. The org\'s trust followed the process, not the promise.',
      },
      {
        title: '5. Portable by Design',
        decision: 'Keep the architecture company-agnostic: the knowledge layer is plain machine-readable files (tokens, briefs, rules, inventories) that any capable agent can consume. The current runtime binding is Claude.',
        rationale: 'A harness welded to one company or one vendor is an integration; a harness with a clean knowledge layer is a capability. Everything the agent needs to know lives in plain files with schemas, so nothing in the operating model depends on where it happens to be installed.',
        result: 'XPDNA is installable rather than bespoke: swapping the company or the agent is a configuration problem, not a rewrite.',
      },
      {
        title: '6. Links, Not Licenses',
        decision: 'Every prototype deploys from the repository to a live link, organized in a portal where projects live in folders anyone on the team can browse, open, and share.',
        rationale: 'Design tools gate participation behind seats, licenses, and one more app to learn. A link is universal. The portal pairs a folder tree for managing projects with one shareable link per prototype (deployment runs on Cloudflare Pages: push a branch, get a URL), so nothing sits between design and production anymore. This is the philosophy of the whole harness: the work stems directly from our repositories, so every prototype is a living organism generated from our own DNA, not a picture of the product. Automating the path from design to production is how AI empowers individuals and teams to ship, not just to suggest.',
        result: 'The portal replaced the design tool as the place where work is shown and decided. I stopped opening Figma almost entirely: stakeholders open a link to a running interface, and feedback lands on the real thing.',
      },
    ],
    images: [
      {
        url: '/img/xpdna/architecture.jpg',
        alt: 'Architecture diagram of the XPDNA harness positioned between the design tool and the production component library, with tokens, skills, and evals as connecting layers',
        caption: 'The harness sits between the design tool and production: code owns the truth, the design tool holds a synchronized mirror, and skills and evals run the loop between them',
      },
      {
        url: '/img/xpdna/eval-scorecard.jpg',
        alt: 'Evaluation findings report for a sample prototype showing a severity table of error, warning, and suggested findings across code compliance and experience quality checks',
        caption: 'The eval scorecard on a sample prototype: machine-checkable rules fail builds, AI judges only advise',
      },
      {
        url: '/img/xpdna/portal.jpg',
        alt: 'The prototype portal: a folder tree on the left for managing projects, a grid of prototype tiles on the right, each deployed to a shareable link',
        caption: 'The portal\'s folder view: coded prototypes organized by project, one live link each',
      },
    ],
  },

  designDecisions: [
    {
      title: 'Token Allowlist as a Hard Build Error',
      description: 'The token pipeline compiles every color, spacing, and typography decision from a single source into CSS, SCSS, and TypeScript outputs. Anything outside the allowlist fails the build. Neither an agent nor a human can invent a color: the design system is enforced at compile time, not in review comments.',
    },
    {
      title: '16 Codified Page Briefs',
      description: 'I scanned the live product and inventoried 34 platform pages with 135 reference screenshots, then distilled 16 of them into structured page briefs: layout regions, components in play, interaction patterns, content rules. Prototypes start from how the product actually works instead of from a blank canvas and a guess.',
    },
    {
      title: 'Schema-Validated Mapping Manifests',
      description: 'Every mapped component in the production library carries a manifest connecting it to its design counterpart, validated against a JSON Schema: 33 manifests at last count. The parity dashboard is computed from these files.',
    },
    {
      title: 'Hard Gates on the Prototype Pipeline',
      description: 'The pipeline started advisory and earned its teeth. Lint now blocks push: deterministic checks on token compliance, content rules, and structure must pass before a prototype ships, while AI-judge findings stay advisory. Gates are only hard where results are reproducible.',
    },
    {
      title: 'Doctor-First Onboarding',
      description: 'The harness ships with a doctor command that verifies every dependency, credential, and path before first use, built after watching onboarding fail in practice. A tool that only works on its author\'s machine is a prototype; doctor is what turned the harness into something a team can install.',
    },
    {
      title: 'Telemetry from Day One',
      description: 'Every session logs who ran it, in what role, which skills loaded, and what was produced. I made no time-saved claims from it; its job is adoption truth. It showed which skills earned reuse and where onboarding broke, and it gave the rollout numbers instead of anecdotes.',
    },
  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'Token pipeline: a custom Node builder compiles 83 color, 64 semantic, 21 typography, and 8 spacing tokens into CSS custom properties, SCSS, and a typed TypeScript composable; the production library owns the runtime values and the harness maintains a synchronized W3C-format mirror',
      'Skills registry: versioned skills covering PRD writing, design critique, prototype generation, and design-to-code translation, including a meta-skill that manufactures and self-registers new skills',
      'Platform scanner and inventory: the live product scanned page by page into an inventory of screenshots and structured page briefs that ground every prototype in real product patterns',
      'Eval CLI and CI action: two evaluation layers (code: runtime checks plus static lint; experience: deterministic content rules plus an AI design judge and an AI content judge); a composite action posts a sticky findings comment on every PR',
      'CI hardening: actions SHA-pinned, judge prompts carrying prompt-injection defenses, and the error tier reserved exclusively for deterministic rules',
      'Prototype portal: prototypes deploy from the repository to Cloudflare Pages behind hard lint gates, so stakeholders review running interfaces instead of static mocks',
      'Session telemetry: every harness session logs user, role, skills used, and output, giving adoption its own dataset from day one',
    ],
    quickTechnical: [
      'Token pipeline with CSS, SCSS, and TypeScript outputs; code owns the truth',
      'Versioned team skills, including a skill that builds skills',
      'Two-layer eval harness posting findings on every PR in CI',
      'Platform scanner, 16 page briefs, prototype portal, session telemetry',
    ],
    rollout: [
      {
        phase: 'February 2026: Proof of Concept',
        activities: [
          'Started the harness as a personal repo: the token pipeline first, then the first components wired end to end from design intent to production code',
          'Shared the repo with the team on February 9; the first AI-co-authored commit landed in the production library on February 20',
          'What began as a proof of concept became a 187-commit build over the next five and a half months, essentially solo throughout',
        ],
      },
      {
        phase: 'March to April: Ground Truth',
        activities: [
          'Scanned the live product page by page and codified its real patterns into structured page briefs',
          'Stood up the prototype pipeline so generated work published to a shared portal instead of living on my machine',
          'A design manager requested an executive summary in late March; session telemetry began posting to its own channel in early April',
          'Telemetry went team-wide in late April, with 9 people joining the channel in its first two days',
        ],
      },
      {
        phase: 'April to June: From Tool to Product',
        activities: [
          'Moved the harness to versioned releases, v0.8 through v0.10',
          'Opened the plugin marketplace and shipped the first company-wide plugin',
          'Turned the prototype pipeline gates hard: lint blocks push, deterministic checks became non-negotiable',
        ],
      },
      {
        phase: 'June: Evals in CI',
        activities: [
          'Landed the eval harness in CI, checking every PR on both evaluation layers',
          'A frontend engineer contributed the design-to-code skill to the harness',
          'Review volume outgrew the process, forcing a governance decision that went design\'s way',
        ],
      },
      {
        phase: 'July: Team Harness',
        activities: [
          'Hardened onboarding around the doctor command after an audit showed the pipeline failing for its second user',
          'A cross-team pilot opened around the discovery-to-implementation loop, the harness\'s first project outside the design team\'s own backlog',
          'Ran the full parity audit that produced the numbers at the top of this case study',
        ],
      },
    ],
    images: [
      {
        url: '/img/xpdna/lifecycle.jpg',
        alt: 'Loop diagram of the XPDNA lifecycle: discover, brief, generate, eval gate, PR and review, production, and telemetry, feeding back into discovery, with the four replaced gaps marked',
        caption: 'The delivery loop from discover to telemetry, and back around. The four stages that used to be gaps carry their before state: manual translation, optional review, weeks-to-months approval, no measurement',
      },
      {
        url: '/img/xpdna/terminal-eval.jpg',
        alt: 'Terminal output of the prototype lint gate running the deterministic code-compliance layer on a prototype and printing a findings summary grouped by severity',
        caption: 'A real run of the prototype lint gate: the deterministic code-compliance layer, findings summarized by severity. This gate is hard, errors exit non-zero and block the push',
      },
      {
        url: '/img/xpdna/skills.jpg',
        alt: 'Registry of nine XPDNA skills displayed as cards, each with a name, purpose, and owner role',
        caption: 'The skills registry: the team\'s working knowledge, reviewable like code and loadable by any session',
      },
    ],
  },

  validation: {
    title: 'Validation',
    outcomes: [
      {
        category: 'Shipping',
        results: [
          'Every component shipped with unit tests, documentation, and a schema-validated mapping manifest, through the team\'s ordinary review gates, with automated releases on merge',
          'Simple components merged in minutes to hours; the one large composite honestly took weeks. Fast where it should be, careful where it must be',
          'More than 40 coded prototypes live in the shared portal today',
        ],
      },
      {
        category: 'Organization',
        results: [
          'The review-process redesign settled with design approval as a required step on component changes',
          'A head of product championed a prototype-first delivery process and used the harness in his own sessions',
          'The arc is documented, not remembered: a personal repo shared in February, an executive summary requested in March, team-wide telemetry in April, versioned releases through June, a cross-team pilot in July',
        ],
      },
      {
        category: 'Adoption',
        results: [
          'The AI-assisted commit trail spans designers and frontend engineers, not one power user',
          'Designers shipped production components; frontend engineers contributed skills and reviews back into the harness',
          'An engineer on the infrastructure side picked the harness up unprompted for a portal redesign',
          'The plugin marketplace shipped its first company-wide plugin',
        ],
      },
    ],
    testimonials: [
      {
        quote: 'A lot of us have so much more context around the solutions that we can much easier deliver the whole thing end-to-end instead of having to involve someone, explain and then wait for the solution. It kind of kills productivity.',
        company: 'Fast Track',
        role: 'Head of product',
      },
      {
        quote: 'A coded prototype, intended for any dev to take over. Most of the time, the code might already be 100% working and correct?',
        company: 'Fast Track',
        role: 'Head of product',
      },
      {
        quote: 'I don\'t want to block Product/Design from contributing or shipping simple things. Agree that would be a step backwards.',
        company: 'Fast Track',
        role: 'Frontend lead',
      },
      {
        quote: 'Definitely looks like an improvement upon first glance.',
        company: 'Fast Track',
        role: 'Frontend engineer',
      },
    ],
    technical: [
      'The production library the harness feeds holds a measured quality bar: roughly 90% of components written in TypeScript, 36 test files, and pre-commit lint gates',
      'The per-component mapping manifests keep the parity numbers computable rather than curated',
      '32 per-component documentation pages maintained alongside the code',
      'Test standards are calibrated per component type, so every new component inherits an explicit bar instead of a reviewer\'s mood',
    ],
    quickOutcomes: [
      '12 components in five months, through the ordinary review gates',
      'Design approval now required on component changes',
      '9 people co-authoring with AI; unprompted cross-team pickup',
      'More than 40 prototypes in the shared portal, one link each',
    ],
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'Evals bought the trust that demos never could. Engineering did not extend trust because the output looked good; they extended it because every PR carried a findings report and the rules that could fail a build were deterministic. The eval layer was not overhead on the system; it was the system\'s admission ticket.',
      'Shipping through existing gates beat building parallel ones. Every artifact left the harness as an ordinary PR with tests and docs, reviewed like anyone else\'s work. When volume grew past what the process could absorb, the organization widened the door instead of closing it. A parallel pipeline would have been easier to build and impossible to trust.',
      'Codified knowledge compounds; tribal knowledge evaporates. Once critique standards, page patterns, and design-to-code conventions became versioned files, they started improving under review the way code does. One engineer\'s improvement to one skill upgraded every subsequent session, for everyone.',
    ],
    challenges: [
      {
        challenge: 'The second-user problem. A June audit was blunt: the pipeline did not work for anyone but me. Everything undocumented in my head (paths, credentials, assumptions) was a silent failure on a colleague\'s machine. A harness that works for its author is a prototype',
        solution: 'I treated onboarding as the product. July went to hardening: the doctor preflight, setup docs written against a clean machine, defaults that survive someone else\'s environment. The honest arc of this system is that it hardened from a personal tool into a team harness, and the second user is where that happened.',
      },
      {
        challenge: 'The politics of velocity. By June the pipeline was producing more designer-shipped code than the review process was built to absorb. Speed created a governance question the tooling could not answer: who reviews this, who owns it, who is accountable when it breaks',
        solution: 'I did not route around the process; I let the volume force the conversation and stayed in the room for it. Leadership\'s answer was ownership. Velocity that forces a process redesign, and wins it, is the strongest adoption evidence a system can produce.',
      },
    ],
    insight: 'The thing XPDNA really changed is what happens when someone on the team has an idea. Before, an idea entered a queue: mockups, handoff, translation, waiting. Now the same person grows it from the team\'s own DNA into something running, shareable, and one review away from production. Design stopped ending at the handoff, and it will never go back to that.\n\nThat is the real product: a team where shipping is no longer gated by who can code, and where everything the team learns makes the system permanently better. One person\'s improvement becomes everyone\'s superpower the next morning. The harness turned a way of working into infrastructure, and infrastructure scales.\n\nWe built this at the moment AI made it possible, which means we are early, not unique. Product teams everywhere are about to work this way. Ours already does.',
    quickInsight: 'Design stopped ending at the handoff: anyone with an idea can grow it into production-ready reality. Product teams everywhere are about to work this way. Ours already does.',
  },
}
