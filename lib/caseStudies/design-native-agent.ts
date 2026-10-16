import type { CaseStudy } from './types'

export const designNativeAgent: CaseStudy = {
  id: 'design-native-agent',
  title: 'The design system agents can\'t ignore',
  kicker: 'DNA · Design-Native Agent',
  subtitle: 'Design systems were written for people to read, but agents now build the screens, so DNA turns every component into a contract an agent is checked against as it writes, and the whole system is [live to explore](https://dna.miguelangelo.tech), from the [component library](https://dna.miguelangelo.tech/#/library/catalog) to the [live canvas](https://dna.miguelangelo.tech/#/canvas) and the [system checks](https://dna.miguelangelo.tech/#/checks), as a separate project from the [Fast Track DNA workstation](/work/dna).',
  hashtag: '#Design Systems',
  company: 'Personal project',
  year: '2026',
  linkText: 'Read case study',
  cardSummary: 'An agent-first design system: components as checkable contracts, so the screens agents build stay on the system.',
  imageUrl: '/img/dna-native/cover.jpg',
  imageAlt: 'DNA cover: on a dark grid, the three-lobe DNA logo, one cell dividing in two with a third lobe floating above, drawn in glowing pine green glyphs, while faint scattered marks labelled guidelines settle into ordered bands labelled contracts, over the kicker DNA, design-native agent, and the title The design system agents can\'t ignore',
  timeline: 'October 2026: first commit on 12 October, live on 16 October',
  team: 'Designed and directed solo, with Claude and Codex as builders and independent reviewers',

  impact: {
    title: 'Impact',
    items: [
      'A [live design system](https://dna.miguelangelo.tech) built for people and agents together: 65 components, each one a typed contract with its own rules, examples and accessibility promise, drawn on the web and on the phone from the same source',
      'In a test of ten screen briefs, the same agent building with DNA produced no automated accessibility findings in light or dark mode, against an average of 32 affected elements per screen in light mode and 14 in dark when it worked with no design system, even though every run was told to keep its contrast readable in both modes',
      'Twenty components made for working with agents, from approvals and plans to questions, change reviews and background runs, so a product never has to improvise how an agent asks for permission or shows what it did',
      'Themes are generated, not hand-picked: about twenty parameters produce more than two hundred tokens, and every text colour is proved against its background in both modes before a theme can ship, with the evidence on the [checks page](https://dna.miguelangelo.tech/#/checks)',
    ],
    quickItems: [
      'A live design system built for people and agents together',
      '65 components, each one a set of rules an agent is checked against',
      'No automated accessibility findings in agent-built screens, across a ten-brief test',
      'Components for working with agents, such as approvals and plans',
    ],
    deepItems: [
      'Eval of 15 October 2026, one agent (Codex, CLI defaults): 30 of 30 runs rendered and valid; mean axe affected nodes (light / dark) 32.4 / 13.8 for plain React, 0 / 0 for React with DNA and 0 / 0 for DNA screen specs',
      'Raw styling values in the source: 532.2 per run for plain React (allowed in that condition, so a description of style, not a defect score) against 0 for both DNA conditions',
      'Themes compile from about twenty parameters to DTCG tokens, CSS variables and a native JSON theme; the default theme carries 46 contrast checks, and the release CI ran about a thousand automated tests and six screen spec validations',
    ],
    images: [
      {
        url: '/img/dna-native/home.jpg',
        alt: 'The DNA home page: the heading a design system you can talk to, describe it, build it, ship it, links to the component library and system checks, an open canvas button, and the same dashboard drawn side by side on desktop and mobile, with the DNA assistant docked on the right',
        caption: 'The live site: library, canvas and checks in one place, with the assistant panel beside them, switched off on the public site for now',
      },
    ],
  },

  problem: {
    title: 'The Problem',
    context: 'Design systems were written for people: a documentation site, a Figma library and a set of guidelines that rely on a designer\'s judgement to be read, understood and followed. That worked while people built every screen, but more and more interfaces are now drafted by agents, which read the documentation literally, fill every gap with a confident guess, and produce screens that look right while quietly breaking the rules underneath, from contrast that disappears in dark mode to values typed by hand instead of taken from the system.\n\nDocumentation cannot enforce anything, so the old safeguard, a reviewer who knows the system, now has to catch mistakes at the speed and volume an agent produces them, and agents bring needs of their own that no traditional system planned for, such as asking permission before acting, showing a plan, or saying clearly what a machine wrote.',
    quickContext: 'Design systems were written for people to read, but agents now build many screens, and they follow guidance literally, guess at the gaps and break rules nobody can see until review.',
    issues: [
      {
        category: 'Guidance is not a guarantee',
        description: 'Guidelines describe what good looks like, but nothing stops an agent from ignoring them, and its screens look convincing enough to pass a quick glance.',
        impact: 'Rules only hold as far as a person has time to check them.',
      },
      {
        category: 'The wrong reader',
        description: 'Documentation sites, Figma files and examples are made for people to browse, while an agent needs exact, complete and machine-readable answers: which props exist, which values are allowed and what goes inside what.',
        impact: 'Every gap in the documentation becomes a guess in the product.',
      },
      {
        category: 'No vocabulary for agents',
        description: 'Traditional systems have buttons, forms and tables, but nothing for an agent asking permission, showing its plan, proposing a change or reporting what it is still doing.',
        impact: 'Each product improvises those moments, and trust is lost in the improvising.',
      },
    ],
    quickIssues: [
      'Guidelines describe the rules, but nothing makes an agent follow them',
      'Documentation is written for people to browse, not for agents to read exactly',
      'Nothing in a traditional system covers an agent asking permission or showing its work',
    ],
    whyItMattered: [
      'Agents can now produce screens faster than any team can review them, so the system itself has to do the checking',
      'Accessibility failures such as text that vanishes in dark mode are invisible in a quick review and expensive once they ship',
      'People will only hand work to agents they can see, steer and stop, and that is a design problem before it is an engineering one',
    ],
    images: [
      {
        url: '/img/dna-native/eval-release-react-dark.jpg',
        alt: 'A release review screen built by an agent in plain React, in dark mode: polished at a glance, but the change titles in the table, the metric figures and the name in the cut-by line are almost invisible against the dark background',
        caption: 'Convincing at a glance: the same agent without DNA, where the change titles all but vanish in dark mode',
      },
    ],
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Every Component Is a Contract',
        decision: 'Make the source of truth a contract for each component, written in code, instead of a documentation page or a Figma file, and generate everything people and agents read from those contracts.',
        rationale: 'A contract is layered so that each layer answers a question an agent would otherwise guess at. Intent says what the component is for, when to use it and, just as importantly, when to use something else and what. Props are typed with their limits, such as a title of at most 80 characters or a risk of low, medium or high. Slots say exactly which components may sit inside and how many. Placement and composition rules say where it may live, such as one primary action per dialog. Events name what it can report back, a loading ghost says how it looks before its data arrives, an accessibility promise states its role and how it is announced, and examples show it in use. Because the catalogue agents read is generated from the same contracts, it can never drift from the components themselves.',
        result: '65 contracts, each one rendered and tested, with a [library](https://dna.miguelangelo.tech/#/library/catalog) people browse and a generated plain text catalogue agents read, and each contract carries a status and a version, so 8 are stable while 57 are still marked experimental and say so.',
      },
      {
        title: '2. Layers That Are Enforced',
        decision: 'Organise the system from chemistry to biology, from elements (the tokens) to atoms, molecules, compounds, organisms and ecosystems, and make the order a rule rather than a suggestion: a slot only accepts components from its own layer or below.',
        rationale: 'Atomic design has always been a way for people to think about a system, but an agent needs it to be a constraint, so a button can never hold a page and a chat message can hold a code block but never a whole screen. Turning the layers into a rule the checker enforces keeps every screen an agent writes structurally sound before anyone looks at it.',
        result: 'Composition errors are caught by the system at the exact place they happen, rather than by a reviewer who happens to notice.',
      },
      {
        title: '3. Guardrails Over Guidelines',
        decision: 'Replace advice with checks that answer in a form an agent can act on: every problem comes back with a code, the exact place in the screen and, where possible, a suggestion such as "did you mean".',
        rationale: 'An agent repairs by rule far better than it interprets prose, so the loop is short and mechanical: read the catalogue, write the screen, check it, look at it, fix it. Around that loop, a lint rule refuses raw colours and hand-typed sizes, the type checker refuses props that do not exist, and every web component example is tested for accessibility automatically. The whole instruction set an agent needs fits on a single page, which is also why DNA needs no special server for agents: any agent that can read a file and run a command can use it.',
        result: 'An agent works inside the system by construction, and the checks catch what it gets wrong before a person ever has to.',
      },
      {
        title: '4. Themes Are Parameters, Not Hand-Picked Tokens',
        decision: 'Generate each theme from about twenty decisions, such as a master colour, fonts, density, corner radius and motion speed, instead of hundreds of hand-chosen values.',
        rationale: 'A person, or an agent, can describe a brand in twenty choices, and the generator does the rest, walking each text colour along its scale until it meets its contrast minimum in light and dark mode. When subtle text was found at 3.5:1 on a form field, the fix was one rule in the generator, and every theme received it at once.',
        result: 'A brand goes onto the system without breaking it, with contrast proved before a theme ships (46 checks for the default theme), and three very different identities so far running on the same screens.',
      },
      {
        title: '5. The Agent Is a Participant, Not a Feature',
        decision: 'Treat the moments where a person and an agent work together as first-class components, held to the same contracts as everything else: messages, plans, approvals, questions, sources, change reviews, background runs and a meter for how much the model can still hold in mind.',
        rationale: 'Three of the principles behind them: say what the agent made and what it is still doing, in words and not only motion; keep the person in control, so any action with side effects can be put to them first, any plan can be edited before it runs and stop is always one press away; and show the work folded, so the reasoning and tools are there to inspect while the answer leads.',
        result: 'Twenty components for working with agents, on the web and the phone, so a product never improvises how an agent asks for permission or shows what it did.',
      },
    ],
    images: [
      {
        url: '/img/dna-native/contract.jpg',
        alt: 'The ApprovalRequest page in the DNA library: tagged compound and experimental, its purpose as human in the loop, a live example asking to send three emails with medium risk, Deny and Approve buttons and a do not ask again option, and below it when to use it and which component to consider instead',
        caption: 'A contract made visible: what the component is for, its live example, when to use it and what to use instead',
      },
      {
        url: '/img/dna-native/canvas.jpg',
        alt: 'The DNA canvas showing a project dashboard built only from DNA components: four metrics, a projects list, an invoices table with status badges and a team row, with a screen selector, a theme selector set to zero and the assistant panel on the right',
        caption: 'The canvas: a whole screen described as data, checked against the contracts and drawn with the current theme',
      },
    ],
  },

  designDecisions: [
    {
      title: 'From Traditional to Agent-First',
      description: 'Documentation becomes contracts, guidelines become checks, hand-picked tokens become generated themes, a library people browse becomes a catalogue agents read, and the design file gives way to a canvas where a whole screen is data that a person or an agent can change, preview and undo.',
    },
    {
      title: 'A Kit, Not a Framework',
      description: 'DNA never calls a model and does not depend on any one agent, so it is the thing an agent uses rather than an agent itself, open and themeable in the way shadcn is, and the assistant on the live site is a separate layer built on top of it.',
    },
    {
      title: 'One Contract, Two Platforms',
      description: 'Every contract is drawn by two renderers, React on the web and React Native on the phone, with layout rules that respond to the space a component actually has rather than the size of the window, so a screen an agent writes once is drawn on both, checked on the phone through a browser preview and tests, while a real device pass is still to come.',
    },
  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'Contracts: one Zod schema per component through defineContract, carrying intent, typed props, slots with accepted components and limits, placement and composition rules, events, a loading ghost, an accessibility promise and examples',
      'Layer taxonomy enforced in the validator: a slot accepts only contracts of its own rank or below (atom, molecule, compound, organism, ecosystem)',
      'A dna command that validates screen specs with stable issue codes, paths and suggestions, writes the agent catalogue (llms.txt and one JSON file per component), previews and screenshots any screen on web and phone, and checks, exports and mints themes',
      'Renderers: React 19 with React Aria Components and Tailwind on the web; React Native with react-native-svg on the phone, previewed through react-native-web; axe on every web example',
      'Guardrails: an ESLint rule that refuses raw colours, raw lengths and arbitrary Tailwind values; strict TypeScript on every prop; contrast proved inside the theme generator',
      'An Agent Skill of one page that Claude Code and Codex both pick up, and a hosted studio (library, canvas, checks) whose assistant runs locally on the owner\'s machine and stays off on the public site until it is given its own credentials',
    ],
    quickTechnical: [
      'Every component is a contract written in code',
      'A checker that tells an agent exactly what is wrong and where',
      'Themes generated from about twenty choices, with contrast proved',
      'The same components drawn on the web and on the phone',
    ],
    rollout: [
      {
        phase: '12 October: Foundations',
        activities: [
          'Token pipeline, the first contracts and a theme generator with a live playground',
        ],
      },
      {
        phase: '13 to 14 October: The Vocabulary',
        activities: [
          'Navigation, page structures and the twenty components for working with agents, built on web and phone',
          'A direction review by two independent agents that set the order as evidence first, then themes, then one complete workflow, and dropped the idea of a framework',
        ],
      },
      {
        phase: '15 October: The Evidence',
        activities: [
          'Validation with codes and suggestions, the agent catalogue and the Agent Skill',
          'The eval: ten briefs, three conditions, thirty runs, and three contrasting themes on the same screens',
        ],
      },
      {
        phase: '16 October: Live',
        activities: [
          'The studio published at dna.miguelangelo.tech, with the library, canvas and checks',
        ],
      },
    ],
    images: [
      {
        url: '/img/dna-native/checks.jpg',
        alt: 'The DNA checks page: component contracts passed, text contrast passed with 46 generated checks in light and dark, a note on what the checks do not certify, and a table of text roles, backgrounds, measured ratios and minimums',
        caption: 'Checks with evidence, including a plain statement of what they do not cover',
      },
    ],
  },

  validation: {
    title: 'Validation',
    outcomes: [
      {
        category: 'The test',
        results: [
          'Ten screen briefs, from a release review to a team page, each built by the same agent in three ways: plain React with no design system, React with DNA, and DNA screen specs, for thirty runs that all rendered and passed their checks',
          'Both DNA conditions produced no automated accessibility findings in either mode, while plain React averaged 32 affected elements per screen in light mode and 14 in dark',
          'The DNA screens kept their type, controls and themes consistent, while several plain React screens with thoughtful layouts lost their text contrast in dark mode',
        ],
      },
      {
        category: 'The honest limits',
        results: [
          'Passing the checks is not the same as meeting the brief: some DNA screens still left things out, such as avatars placed apart from the names they belonged to',
          'One agent, one run per brief and condition and no blind visual panel, so this shows a strong signal rather than a general rule',
          'Automated checks cover the specification and the theme, not keyboard use, screen readers or physical devices',
        ],
      },
    ],
    quickOutcomes: [
      'Thirty agent-built screens, all of them rendered and valid',
      'No automated accessibility findings with DNA, in light or dark',
      'Consistent type, controls and themes across every DNA screen',
      'Valid is not the same as complete, and the limits are on record',
    ],
    technical: [
      'Eval harness in the repository: fresh workspaces outside the repo, one AGENTS.md per condition plus a shared one-page task note (which asks every condition for readable contrast in light and dark) as the only guidance, scored automatically on completion, validity, axe affected nodes in light and dark, raw values, checks run, turns and time',
      'Release CI: build, typecheck, lint, about a thousand automated tests and six screen spec validations; browser checks across all 65 component pages and responsive widths; phone rendering verified through react-native-web, not yet on a device',
    ],
    images: [
      {
        url: '/img/dna-native/eval-release-react-dna-dark.jpg',
        alt: 'The same release review brief built by the same agent with DNA, in dark mode: every change title, author and badge is clearly readable, with consistent tables, a warning banner and a release approval form',
        caption: 'The same brief and the same agent with DNA: every title readable in dark mode, with no automated findings',
      },
    ],
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'Changing the reader changes everything: once I designed the system for an agent first, the contracts, the checks and the generated catalogue followed almost naturally, and the same precision makes the system easier for people to read too, because every piece says exactly what it is for and what to use instead.',
      'Asking agents to review the direction, not only the code, paid off early, because two independent reviews agreed that evidence had to come before more tooling, which is why the eval and the checks exist at all.',
    ],
    challenges: [
      {
        challenge: 'I built the library site before the agent loop, and breadth of components before the polish of a few',
        solution: 'The direction review reset the order to evidence first, so the validation codes, the agent catalogue, the Agent Skill and the eval came next, and only then the themes and the studio.',
      },
      {
        challenge: 'The project drifted towards becoming a framework, with a runtime, a platform and support for other organisations',
        solution: 'I narrowed it to a kit that never calls a model and works with any agent, and wrote down what it would not become, which kept five days of work pointed at one clear outcome.',
      },
      {
        challenge: 'Clean results can hide unmet briefs, because a screen can pass every check and still leave out what was asked for',
        solution: 'Every stored screenshot was reviewed against its brief, the omissions are recorded beside the numbers, and the limits are stated as plainly as the wins.',
      },
      {
        challenge: 'Five days of work by one author has no adoption to show yet, beyond one pilot app built on it',
        solution: 'I treat the live site as the invitation rather than the proof, with the next gates written down: a complete workflow on a real phone, and a person who has never seen DNA finishing it without help.',
      },
    ],
    insight: 'A design system for the intelligence era is not a better documentation site but a set of promises a machine can check, because once agents build screens, the rules only count if they are enforced at the moment of writing, and the moments where people and agents work together need components as carefully designed as any button.\n\nDNA is my answer to both: contracts in place of guidelines, checks in place of hope, and a vocabulary for trust between a person and an agent.',
    quickInsight: 'When agents build the screens, a design system has to be a set of rules a machine can check, not a guide a person hopes will be read.',
  },

  process: {
    title: 'See It Live',
    content: [
      'Home: [dna.miguelangelo.tech](https://dna.miguelangelo.tech), the studio with the library, canvas and checks in one place',
      'Component library: [the catalogue](https://dna.miguelangelo.tech/#/library/catalog) of all 65 components by layer, each with its contract, live examples and when to use something else',
      'A contract in full: [ApprovalRequest](https://dna.miguelangelo.tech/#/library/ApprovalRequest), the component an agent uses to ask before it acts',
      'Live canvas: [whole screens](https://dna.miguelangelo.tech/#/canvas) drawn from data, on desktop and phone, with themes you can change and undo',
      'System checks: [the evidence](https://dna.miguelangelo.tech/#/checks) for every contract and every generated contrast ratio',
    ],
  },
}
