import type { CaseStudy } from './types'

export const dna: CaseStudy = {
  id: 'dna',
  title: 'DNA',
  subtitle: 'A Design System Workstation: an AI harness that changes how an entire organisation prototypes. Anyone with a terminal turns an idea into a working prototype built from production code, safe and compliant by design, and the same path runs all the way into the live platform.',
  hashtag: '#AI Experience',
  company: 'Fast Track AI',
  year: '2026',
  linkText: 'Read case study',
  cardSummary: 'A Design System Workstation: an AI harness where anyone in the organisation prototypes in production code, safely and within the rules. Designers and non-technical teammates went from zero merged pull requests into the product to 31.',
  // Cover: to revert to the light paper version, use '/img/dna/cover-paper.jpg' with its alt below
  imageUrl: '/img/dna/cover-neon.jpg',
  imageAlt: 'DNA cover: a glowing magenta and cyan double helix whose rungs are design system components and code brackets, on a dark technical grid, above the DNA wordmark and the tagline design system workstation',
  // imageAlt (paper): 'DNA cover: the DNA emoji and the DNA wordmark over the tagline design system workstation, on a light paper field faintly sketched with a browser window, a terminal, a chat panel and design system components',
  timeline: 'February 2026 to present (ongoing)',
  team: 'Built solo; used across the organisation by designers, non-technical teammates and engineers',

  impact: {
    title: 'Impact',
    items: [
      'Prototyping no longer depends on a third-party design tool. Prototypes are built in code, from the platform\'s own components and brand rules, and shared as live links',
      'Designers and non-technical teammates went from zero merged pull requests on the product platform in the year before to 31 since February, 24 of them product features and fixes',
      'Coded prototypes grew from 5 at the end of April to 55 in September, made by 9 different people. Designers and non-technical teammates now make more than 90% of the commits to prototypes',
      'The production component library gained 12 new components in six months, after gaining a handful in the three years before',
    ],
    quickItems: [
      'Prototyping moved out of design files and into production code',
      'Designers and non-technical teammates: 0 merged product pull requests before, 31 since February',
      'Coded prototypes: 5 in April, 55 in September, made by 9 people',
      'Component library: a handful of new components in three years, then 12 in six months',
    ],
    images: [
      {
        url: '/img/dna/who-ships.jpg',
        alt: 'Before and after figures: merged product platform pull requests by designers and non-technical teammates went from 0 to 31, 24 of them features and fixes; component library pull requests by designers from 0 to 12; and coded prototypes from 5 to 55',
        caption: 'Who ships now: the same people, a different job description',
      },
    ],
  },

  problem: {
    title: 'The Problem',
    context: 'Prototyping across the organisation meant pictures. A designer drew the product in Figma, an engineer rebuilt it in code, and the two versions drifted apart from day one. When DNA put a number on the gap, it was blunt: 839 components in the design library, 31 tracked in code, 22 of them mapped to a design counterpart, and 0 verified in sync.\n\nEvery idea paid a translation tax. Feedback bounced between the design file and the build, and anything that needed code waited in an engineer\'s queue. The component library itself had gained only a handful of components in three years. Shipping was gated by who could code, not by who had the idea.',
    quickContext: 'The design files and the product told two different stories, and only engineers could turn an idea into software. DNA exists because closing that gap by hand never worked.',
    issues: [
      {
        category: 'Two sources of truth',
        description: 'The design library was treated as canonical, but the product\'s real behaviour lives in code. Nobody was measuring the drift between them.',
        impact: 'Decisions were made against a picture of the product, not the product.',
      },
      {
        category: 'The translation tax',
        description: 'Every design shipped twice, once in pixels and once in code, with rounds of back and forth in between.',
        impact: 'Good ideas were priced out by the cost of shipping them.',
      },
      {
        category: 'A gate called "can you code?"',
        description: 'Designers and non-technical teammates held the context but not the keys. Their ideas waited for someone else to build them.',
        impact: 'The people closest to the problem were furthest from the solution.',
      },
    ],
    quickIssues: [
      'Design files mirrored the product; code defined it. Nobody measured the drift',
      'Every idea shipped twice, with back and forth in between',
      'Only engineers could turn an idea into software',
    ],
    whyItMattered: [
      'AI raised the stakes: an agent with bad context does not fail politely, it ships the wrong thing faster',
      'A problem without a number can be deferred forever',
      'Design\'s influence stopped at the handoff; production was decided somewhere else',
    ],
    images: [
      {
        url: '/img/dna/parity.jpg',
        alt: 'Parity audit comparing the design library to the production codebase: 839 components in Figma, 22 mapped to code, 0 verified in sync',
        caption: 'The parity audit (April 2026 data): drift became a number instead of a suspicion',
      },
    ],
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Code as the Source of Truth',
        decision: 'The production library owns the tokens, the components and the truth. Design files became a mirror, and DNA measures how far any app sits from the system.',
        rationale: 'You cannot build reliable automation on top of a picture. Once truth has one home, drift stops being an argument and becomes a measurement. The design review report takes this to a live application: it checks every style rule against the design system, shows the evidence page by page, and lets a person accept each fix. Nothing changes on its own.',
        result: 'Drift is a number on a dashboard, and design debt is a backlog with a sign-off, not a feeling.',
      },
      {
        title: '2. A Workstation Anyone Can Use',
        decision: 'The Lab: pick a prototype, describe the change, and an agent builds it live in the real source code, right beside the running result.',
        rationale: 'The barrier was never ideas; it was the toolchain. The Lab wraps the whole harness (components, tokens, brand rules, team skills) behind one chat and one preview, so a product manager needs a terminal and a Claude login, not a frontend career. Prototypes built for a ticket are tied to it, and every prototype deploys to a shareable link, so feedback lands on the real thing.',
        result: 'Product managers and other less technical colleagues build their own prototypes and tools inside our guardrails. It lowers the bar for anyone to just do things.',
      },
      {
        title: '3. Evals Before Trust',
        decision: 'Check the output before asking anyone to trust it: code compliance and experience quality, on every prototype.',
        rationale: 'AI output is not trustworthy by default, and engineering knows it. Deterministic rules own the error tier and can block a push; AI judges only advise, so hard results never flip between runs. Any pull request can be evaluated with one comment.',
        result: 'Hard failures are reproducible, and every finding is visible to everyone who reviews the work.',
      },
      {
        title: '4. Same Door as Engineers',
        decision: 'No parallel pipeline. Everything leaves DNA as an ordinary pull request with the team\'s normal review gates.',
        rationale: 'A separate lane for design-made code would have made it second-class forever. New capability earns trust fastest when it flows through the interfaces people already rely on.',
        result: 'Designers and non-technical teammates merged real product work, and the org\'s trust followed the process, not the promise.',
      },
    ],
    images: [
      {
        url: '/img/dna/architecture.jpg',
        alt: 'Architecture diagram: anyone in the organisation sends ideas and tickets into DNA, which holds the Lab, design tokens and components, skills and brand rules, evals and design review, and Linear, and ships pull requests through the same gates into the component library, the product platform and live prototypes',
        caption: 'From an idea to production code: code owns the truth, and everything ships through the same review gates as engineering',
      },
      {
        url: '/img/dna/lab-workbench.jpg',
        alt: 'The Lab workbench: a chat panel on the left where the agent ran the prototype lint and reported a clean result, beside a live Scheduled Jobs prototype running in a browser frame',
        caption: 'The Lab: ask in plain words, and the agent works in the real code beside the running prototype',
      },
    ],
  },

  designDecisions: [
    {
      title: 'Limits You Can See',
      description: 'An agent that edits code needs visible limits. In the Lab, writes stay inside the selected prototype, any command beyond a safe read-only set stops for approval, every approval is logged, new machines start read-only, and each person runs on their own Claude login with their usage in view.',
    },
    {
      title: 'Linear as the Spine',
      description: 'Prototypes built for a ticket are organised under it and carry its Linear status, refreshed daily, so the agent always knows what it is building.',
    },
    {
      title: 'Tokens as a Hard Build Error',
      description: 'Every colour, spacing and type decision compiles from one source. Anything outside the allowlist fails the build, so neither an agent nor a human can invent a colour.',
    },
  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'Token pipeline: one source compiled to CSS, SCSS and typed TypeScript, owned by the production library',
      'Team knowledge as versioned skills: how we write requirements, critique design, generate prototypes and translate design to code',
      'Two-layer evals: deterministic code and content rules that gate every prototype push, plus AI design and content judges that advise',
      'The Lab: a browser workstation over the real repositories, with the agent, the live preview, Linear and the approval gate in one place',
      'Design review report: a live application scored rule by rule against the design system, with decision workbenches for every mapping',
    ],
    quickTechnical: [
      'Tokens, components and brand rules from one source of truth',
      'Automatic checks on every prototype; AI advises, rules decide',
      'The Lab: an agent, a live preview and Linear in one workstation',
    ],
    rollout: [
      {
        phase: 'February 2026: Proof of Concept',
        activities: [
          'Started as a one-person repository: the token pipeline, then the first components wired from design intent to production code',
          'Shared with the team on February 9 as a proof of concept',
        ],
      },
      {
        phase: 'April to July: Into Production',
        activities: [
          'Coded prototypes moved to a shared portal, one live link each',
          'Designers started merging production components, then real product work',
          'Evals landed on every prototype, with lint blocking the push',
        ],
      },
      {
        phase: 'August: The Lab',
        activities: [
          'Released DNA 2.0: the Lab, with one-command setup for the whole team',
          'Prototypes linked to Linear tickets, with statuses refreshed daily',
        ],
      },
      {
        phase: 'September: Anyone, Any Checkout',
        activities: [
          'Moved the Lab out of a branch that had drifted nearly 900 commits from the main product and into an installable add-on that works on any checkout',
          'Released the design review report, which measures a live application against the design system',
        ],
      },
    ],
    images: [
      {
        url: '/img/dna/lab-linear.jpg',
        alt: 'The Lab projects view: a folder tree of Linear tasks, prototype cards, and a details drawer showing the ticket\'s Linear status as In Progress with a link to open it in Linear',
        caption: 'A prototype built for a Linear ticket carries the ticket and its status',
      },
      {
        url: '/img/dna/design-review.jpg',
        alt: 'The design review report colour map: a list of design system tokens, the current colours mapped to them, and a three-step panel showing the change, the decision and the evidence before a mapping is accepted',
        caption: 'The design review report: the change, the decision and the evidence, before anything is accepted',
      },
    ],
  },

  validation: {
    title: 'Validation',
    outcomes: [
      {
        category: 'Who ships',
        results: [
          'Designers now ship real product features and fixes into the live platform, not just prototypes',
          'Contributions come from individual contributors and senior management alike',
          'In the component library, designer pull requests went from none to 14% of everything merged',
        ],
      },
      {
        category: 'How we prototype',
        results: [
          '55 coded prototypes in the shared portal, 51 of them with a live link',
          'Designers and non-technical teammates make more than 90% of prototype commits, so prototyping no longer waits in an engineer\'s queue',
          'Two product managers became regular users over the summer',
        ],
      },
      {
        category: 'Speed',
        results: [
          'A designer\'s component went from pull request to a published npm release in twelve minutes, released automatically on merge. An engineer\'s review and the docs followed the same day',
          'Simple components ship within a day; the big composites still take real review time, as they should',
        ],
      },
    ],
    quickOutcomes: [
      '31 merged product pull requests from designers and non-technical teammates, up from zero',
      '55 coded prototypes by 9 people',
      'More than 90% of prototype commits by designers and non-technical teammates',
      'Product managers prototype on their own in the Lab',
    ],
    technical: [
      'Every number on this page is counted from primary records (git history, GitHub and the audits\' own output), not estimated',
      'Evals keep hard failures deterministic: an AI opinion never fails a build',
      'The Lab ships as an add-on with its own test suite and a nightly build against the product',
    ],
    testimonials: [
      {
        quote: 'A lot of us have so much more context around the solutions that we can much easier deliver the whole thing end-to-end instead of having to involve someone, explain and then wait for the solution. It kind of kills productivity.',
        company: 'Senior management',
      },
      {
        quote: 'I don\'t want to block Product/Design from contributing or shipping simple things. Agree that would be a step backwards.',
        company: 'Engineering leadership',
      },
    ],
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'Trust came from visible limits, not demos. Engineering accepted design-made code because every change carried its eval findings and went through the same gates as theirs. The Lab earned its users the same way: people try things when they can see exactly what the agent may and may not do.',
      'Shipping through existing doors beat building new ones. Everything left DNA as an ordinary pull request. When the volume grew, the organisation widened the door instead of closing it.',
    ],
    challenges: [
      {
        challenge: 'The second-user problem. A harness that works on its author\'s machine is a prototype. Early on, every assumption in my head was a silent failure on a colleague\'s laptop',
        solution: 'I treated onboarding as the product: a doctor command that checks every dependency, one-command setup, and a Lab that installs on any checkout. The system hardened from a personal tool into a team workstation, and the second user is where that happened.',
      },
      {
        challenge: 'The politics of velocity. In June, design-made pull requests arrived faster than the review process was built for, and engineering felt the load. Designer and product pull requests still take longer to merge than engineers\' pull requests',
        solution: 'I did not route around the process; I stayed in the room. We agreed that small UI changes are welcome, bigger ones get flagged early, and engineering leadership offered design code ownership of the component library. Velocity that forces a process conversation, and survives it, is real adoption.',
      },
    ],
    insight: 'DNA changed what happens when anyone in the organisation has an idea. Before, it entered a queue: mockups, handoff, translation, waiting. Now the same person builds it from the team\'s own DNA into something running, on-brand and one review away from production.\n\nThe real product is a team where shipping is no longer gated by who can code. We are early, not unique: product teams everywhere are about to work this way. Ours already does.',
    quickInsight: 'Anyone with a terminal can now turn an idea into working, on-brand code. Product teams everywhere are about to work this way. Ours already does.',
  },
}
