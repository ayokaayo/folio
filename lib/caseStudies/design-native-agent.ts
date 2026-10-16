import type { CaseStudy } from './types'

export const designNativeAgent: CaseStudy = {
  id: 'design-native-agent',
  title: 'DNA, the intelligence-first Design System',
  kicker: 'DNA · Design-Native Agent',
  subtitle: 'Traditional design systems were written for people to read. With agents now building the screens, DNA turns every component into a contract, a set of rules written in code, that an agent is checked against as it writes, and the whole system is [live to explore](https://dna.miguelangelo.tech).',
  hashtag: '#Design Systems',
  company: 'Personal project',
  year: '2026',
  linkText: 'Read case study',
  cardSummary: 'An agent-first design system: components as checkable contracts, so the screens agents build stay on the system.',
  imageUrl: '/img/dna-native/cover.jpg',
  imageAlt: 'DNA cover: on a dark grid, the three-lobe DNA logo, one cell dividing in two with a third lobe floating above, drawn in glowing pine green glyphs, while faint scattered marks labelled guidelines settle into ordered bands labelled contracts, over the kicker DNA, design-native agent, and the title DNA, the intelligence-first Design System',
  timeline: '2026',
  team: 'Solo',
  techStack: ['Claude Code', 'Codex', 'React', 'React Native', 'TypeScript', 'Tailwind CSS', 'Zod', 'Vercel'],

  impact: {
    title: 'Impact',
    items: [
      'A [working design system](https://dna.miguelangelo.tech) that people and agents use together: 65 ready-made building blocks, from buttons to whole page layouts, built once for the web and for phone apps',
      'When an agent built ten test screens with DNA, an automatic accessibility check found nothing to flag, in light or dark mode, while the same agent working without it left an average of 32 problems per screen in light mode and 14 in dark, such as text too faint to read',
      'Twenty building blocks made for working with agents, so a product has a ready, consistent way for an agent to ask permission, show its plan or explain what it changed',
      'A new brand look comes from a short list of about twenty choices, such as colour, font and spacing, and the system checks that every text colour is readable against its background in both modes before the look goes live',
    ],
    quickItems: [
      'A live design system that people and agents use together',
      '65 building blocks that work on the web and on phones',
      'Automatic checks found no accessibility problems in screens an agent built with it',
      'Ready-made ways for an agent to ask permission and show its work',
    ],
    deepItems: [
      'The test: ten screen briefs, each built three ways by the same agent (Codex), thirty screens in all and every one of them rendered and passed its code checks; average accessibility problems per screen in light and dark mode were 32.4 and 13.8 without DNA, and 0 and 0 with it',
      'Without DNA the agent typed colours and sizes by hand about 530 times per screen, which is allowed but hard to keep consistent; with DNA it typed none, because every value came from the system',
      'The latest release ran about a thousand automated tests, and the default look passes 46 readability checks across light and dark mode',
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
      'Contracts: every component is described in code, with what it is for, the options it accepts, what can go inside it, how it is announced to screen readers and worked examples',
      'A checker that reads a screen an agent describes in DNA\'s format and returns each mistake with its exact location and, where it can, a suggested fix',
      'One set of components drawn twice, with React on the web and React Native on the phone',
      'A theme generator that turns about twenty brand choices into a full set of colours, fonts and spacing, and proves every text colour is readable',
      'A one-page guide that Claude Code and Codex both read to use the system, and a live studio with the library, the canvas and the checks',
    ],
    quickTechnical: [
      'Every component described in code',
      'A checker that tells an agent what is wrong and where',
      'The same components on the web and on phones',
      'A brand look generated from about twenty choices',
    ],
    rollout: [
      {
        phase: 'Foundations',
        activities: [
          'The first components, and the generator that turns brand choices into a full look',
        ],
      },
      {
        phase: 'The Vocabulary',
        activities: [
          'Navigation, page layouts and the twenty components for working with agents, on the web and the phone',
          'An independent review by two agents that put evidence first and kept DNA a toolkit rather than a framework',
        ],
      },
      {
        phase: 'The Evidence',
        activities: [
          'The checker, the guide agents read and the catalogue of every component',
          'The ten-brief test, and three very different brand looks on the same screens',
        ],
      },
      {
        phase: 'Live',
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
        solution: 'I narrowed it to a kit that never calls a model and works with any agent, and wrote down what it would not become, which kept every piece of work pointed at one clear outcome.',
      },
      {
        challenge: 'Clean results can hide unmet briefs, because a screen can pass every check and still leave out what was asked for',
        solution: 'Every stored screenshot was reviewed against its brief, the omissions are recorded beside the numbers, and the limits are stated as plainly as the wins.',
      },
      {
        challenge: 'A new system by one author has no adoption to show yet, beyond one pilot app built on it',
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
