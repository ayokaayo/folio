import type { CaseStudy } from './types'

export const nexus: CaseStudy = {
  id: 'nexus',
  title: 'Nexus',
  subtitle: 'Design debt and drift management for a live product, and the focused remediation work inside DNA: a harness that measures a product\'s own style rules against the design system, lets AI pay the debt down at scale, and keeps a person on every judgement call.',
  hashtag: '#Design Systems',
  company: 'Fast Track AI',
  year: '2026',
  linkText: 'Read case study',
  cardSummary: 'Design system management tooling that measures silent drift and pays the debt down safely with AI, while people decide.',
  imageUrl: '/img/nexus/cover-emoji.jpg',
  imageAlt: 'Nexus cover: a glossy magenta and cyan magnifying glass emoji beside the Nexus wordmark and the tagline design debt and drift management, on a light paper field faintly sketched with before and after screens, a pixel grid and a type scale',
  timeline: 'September 2026 (proof of concept; typography change awaiting review)',
  team: 'Built solo; the product change is open as a draft pull request for engineering review',

  impact: {
    title: 'Impact',
    items: [
      'Design debt became a number: 22,050 of a live product\'s own style rules measured against the design system, and only 3% were on it',
      'Typography drift fell from 99.85% to 9.82% in one change now awaiting review, and the type scale gained the styles the product was missing: a 24px heading pair, a 20px regular and a code style',
      'Every judgement call is on record: 223 decisions, each with its file, rule and reason, and the design rules themselves set by a person',
      '47 page states checked pixel by pixel before and after, every capture taken twice and matched, with no new errors',
    ],
    quickItems: [
      'Three kinds of style rule measured: text, colour and spacing',
      'Only 3% of 22,050 rules used the design system',
      'Text rules off the design system: 99.85% down to 9.82%, awaiting review',
      '223 judgement calls on record, the rules set by a person',
    ],
    images: [
      {
        url: '/img/nexus/numbers.jpg',
        alt: 'Figures: 22,050 style rules measured; text rules outside the design system down from 99.85% on the clean baseline to 9.82% on the typography candidate; 223 judgement calls on record; 47 of 55 page states checked pixel by pixel',
        caption: 'The debt, measured: typography is the first category paid down',
      },
    ],
  },

  problem: {
    title: 'The Problem',
    context: 'Every product that grows fast collects design debt, as values get typed by hand, close to the design system but not in it, and nobody can see the gap one rule at a time. In this product the scan was blunt: 22,050 style rules in the app\'s own files, and only 3% of them used a design system token.\n\nThe obvious fix is a bulk cleanup, which is exactly what nobody wants to ship blind, because a change touching hundreds of files is impossible to review line by line and one wrong guess ripples across every page. So the debt kept growing, quietly.',
    quickContext: 'A live product had drifted away from its own design system one hand-typed value at a time, and nobody could see the gap or wanted to fix it blind.',
    issues: [
      {
        category: 'Invisible debt',
        description: 'Hand-typed values sat close to the design system but not in it, so the drift was real while nobody could point to where.',
        impact: 'A problem without a location never makes it onto a roadmap.',
      },
      {
        category: 'Too big to review',
        description: 'Fixing it meant touching hundreds of files at once, far too many to review through the code changes alone.',
        impact: 'The safest option was always to do nothing.',
      },
      {
        category: 'Who decides?',
        description: 'Many values sit between two steps of the scale, so somebody has to choose, and a script should not.',
        impact: 'Without clear ownership, every automated fix is a guess.',
      },
    ],
    quickIssues: [
      'Hand-typed values drifted from the design system, and nobody could see where',
      'A fix meant hundreds of files, too many to review line by line',
      'Values that fell between two sizes on the scale needed a person to decide, not a script',
    ],
    whyItMattered: [
      'Drift is paid for on every screen: inconsistency users feel and designers keep re-explaining',
      'AI can now change a whole codebase in minutes, which makes an unreviewable change easier to produce than ever',
      'A design system only matters as far as the product actually uses it',
    ],
    images: [
      {
        url: '/img/nexus/overview.jpg',
        alt: 'The design review report overview: 22,050 original style rules checked, compliance up from 3% to 19.63%, 17,721 rules remaining, 47 before and after pairs, and progress cards for text, colour, spacing and visual checks',
        caption: 'The report\'s verdict: where the product stands against the design system, category by category',
      },
    ],
  },

  approach: {
    title: 'My Approach',
    decisions: [
      {
        title: '1. Measure the Real Thing',
        decision: 'Scan a clean copy of the live product, rule by rule, and sort every text, colour and spacing value: on the design system, off it, or unclear.',
        rationale: 'You cannot pay a debt you cannot see, and only the product\'s original rules count, so rules added along the way can never inflate progress. The report also says out loud that token use is not the same as visual quality, and keeps both measures apart.',
        result: 'The debt has a number and an address: every rule, in every file, with its category and status.',
      },
      {
        title: '2. People Decide, AI Does the Volume',
        decision: 'A person sets the design rules and makes every call the rules do not cover; an AI engine applies them across the whole product; and where a rule\'s answer looks wrong on the page, the case comes back to the person as a question.',
        rationale: 'The rules were short and human: keep the declared weight and move only the size, make titles 20px bold, and add the styles the product really needs. One call was a deliberate exception to the engine\'s own tie rule, taking 18px text down to 16px to protect the hierarchy, and it was made after seeing the ten affected rules next to their neighbours. Cases the rules do not cover arrive as a short list of options, shown side by side on real pages, with a recommendation. Accepting a mapping only records the decision, a separate engine run applies it on a branch, and a pull request is the only way into the product.',
        result: '223 judgement calls on record, none pending, and each one traceable to its file, rule and reason.',
      },
      {
        title: '3. Evidence Before Approval',
        decision: 'Replay real pages before and after the change and compare them pixel by pixel, capturing each side twice and requiring the two captures to match exactly, while the differences between before and after are what a person reviews.',
        rationale: 'A clean diff proves nothing about how a page looks, so the replay freezes the clock, fixes the fonts and uses recorded data, leaving the styling as the only thing that can change. The replays caught the engine moving icons it should not have touched, and an independent AI review of the engine found it had turned every non-regular weight bold, so those rules went back to the baseline before the rerun and the engine could never certify its own earlier choices, with AI reviews running as adversaries rather than approvals.',
        result: '47 page states compared, every capture taken twice and matched (retakes on record), and no new errors.',
      },
      {
        title: '4. An Ordinary Pull Request',
        decision: 'The change lands as an ordinary product pull request, with its records attached and a short path for the reviewer.',
        rationale: 'A standing rule sits above the whole system, stating that passing checks supply evidence but never authorise a change on their own, so an engineer still reviews and approves, and rollout goes to a low-risk environment first, with named owners and a way back.',
        result: 'The design review report shipped with DNA, and the typography change it produced is open as a draft pull request, awaiting engineering review, with colour and spacing measured and next in line.',
      },
    ],
    images: [
      {
        url: '/img/nexus/flow.jpg',
        alt: 'Five-step flow: measure (scanner), decide (person), apply (AI engine), prove (visual checks) and review (engineering), with the standing rule that passing checks supply evidence and never authorise a change on their own',
        caption: 'The AI does the volume while people make the calls',
      },
      {
        url: '/img/nexus/decision.jpg',
        alt: 'A decision card for regular text at 20px: crops of the page before and after, the four candidate sizes rendered at their exact size, and a highlighted box reading your call, 7 rules, with options A, B and C and a recommendation',
        caption: 'When a rule\'s answer looks wrong on the page, it comes back as a question: real pages, real options, one recommendation',
      },
    ],
  },

  designDecisions: [
    {
      title: 'Only Original Rules Count',
      description: 'Progress is measured on the rules the product already had, and new rules added during the fix never count, so the numbers cannot be gamed, even by accident.',
    },
    {
      title: 'Refuse to Guess',
      description: 'Where a change is ambiguous, such as icons or containers that mix several text styles, the engine leaves the rule alone and asks, because a wrong guess costs more than an open question, and it never decides a weight on its own either, so every weight change is a recorded decision.',
    },
    {
      title: 'One Title, One Edit',
      description: 'In the change under review, 137 title rules share one title style, so changing every title in the product becomes one edit to four token values instead of a hunt across the codebase.',
    },
  ],

  implementation: {
    title: 'Implementation',
    technical: [
      'Source scanner: classifies every original text, colour and spacing rule as on the design system, off it, or unresolved',
      'Design review report: one page with the verdict, rule-level findings, decision workbenches for colours and sizes, and page checks',
      'Typography decision engine: moves each rule to the nearest step on the scale, keeps the declared weight, records every non-mechanical choice, and guards its 129 hand edits with exact-match checks',
      'Visual replay: recorded data, a frozen clock and fixed fonts; every page state captured twice per side and compared pixel by pixel',
      'A standing decision rule on record: passing checks supply evidence and never authorise a change on their own',
    ],
    quickTechnical: [
      'A scanner that puts a number on design debt',
      'An AI engine that applies the rules and asks when they run out',
      'Pixel-by-pixel replays of real pages, before and after',
    ],
    rollout: [
      {
        phase: '8 September: Measure',
        activities: [
          'Scanned a copy of the live product and built the design review report',
          'Wrote down the standing rule: checks supply evidence, people authorise change',
        ],
      },
      {
        phase: '17 to 22 September: False Starts, Then a Clean Copy',
        activities: [
          'Restarted typography twice, the second time on a clean copy of the main product, after the earlier baselines proved unreliable',
          'Caught the engine\'s own errors, on screen and in review, and reversed the weight changes before going further',
        ],
      },
      {
        phase: '22 to 23 September: Decide and Hand Off',
        activities: [
          'Closed the open design rules, including one deliberate exception to the tie rule',
          'Opened the typography change as an ordinary product pull request, with its records and a rollout and rollback plan',
        ],
      },
    ],
    images: [
      {
        url: '/img/nexus/side-by-side.jpg',
        alt: 'Before and after screenshots of a localisation settings page, side by side, with 12.15% of the image changed',
        caption: 'Before and after on a real page: the same screen, now on the design system\'s type scale',
      },
      {
        url: '/img/nexus/changed-pixels.jpg',
        alt: 'The changed pixels view of the same page: every glyph and line that moved is outlined in magenta',
        caption: 'Every pixel that moved, outlined, so nothing changes that nobody can see',
      },
    ],
  },

  validation: {
    title: 'Validation',
    outcomes: [
      {
        category: 'The debt',
        results: [
          'Text rules with no verified design system token went from 99.85% on the clean baseline to 9.82% after the change, a measure of token use rather than visual defects',
          'Summed across the three separately measured categories, rules on the design system went from 3% to 19.63%',
          '17,721 rules still need work, almost all of them colour and spacing',
        ],
      },
      {
        category: 'The proof',
        results: [
          '47 of 55 recorded page states compared before and after; every capture was taken twice and matched, with retakes on record, and no new errors (the same eight backend errors appear on both sides and stay on record)',
          'The engine\'s mistakes were caught on screen: 135 rules across 89 files went back to the baseline and were re-mapped by explicit decision',
          'No page is approved yet, by design: approval is a person\'s job, not a check\'s',
        ],
      },
      {
        category: 'The status',
        results: [
          'This is a proof of concept, and the typography change is an open draft pull request, awaiting engineering review',
          'Colour and spacing are measured, with no mappings accepted yet',
        ],
      },
    ],
    quickOutcomes: [
      'Text rules off the design system: 99.85% to 9.82%',
      '223 judgement calls on record',
      '47 screens checked pixel by pixel, before and after',
      'Awaiting review; colour and spacing next',
    ],
    technical: [
      'The measurements come from the report of 23 September 2026 (source measured on a clean copy of the main product against the typography candidate, and recorded replays run on one machine); the decision, edit and file counts come from the pull request\'s own records',
      'The engine\'s focused test suite passes, and its records ship inside the pull request',
      'Most of the change\'s 21,000 added lines are records (the decisions, the title inventory and a ledger of the work that remains), not application code'
    ],
  },

  learned: {
    title: 'What I Learned',
    worked: [
      'Speed was never the hard part, since the engine can rewrite hundreds of files in minutes; what took the time was making every change explainable, reversible and checkable by someone who was not in the room.',
      'Asking beats guessing: where the rules ran out or gave a doubtful answer, the case came back as a question, because a short list of real decisions, shown side by side on real pages, is something a busy person can answer, while a diff of hundreds of files is not.',
    ],
    challenges: [
      {
        challenge: 'The engine got it wrong first: it turned every non-regular weight bold, and a fixed line height it set on body text moved the sidebar icons with it',
        solution: 'The pixel checks caught the icons and an independent AI review of the engine caught the weights, so I rebuilt the baseline from a clean copy, put 135 rules across 89 files back as they were and mapped them again by explicit decision, and reviewed the icon movement on screen before accepting it on record as a few pixels of intended line height. The first handoff was premature, and saying so early was cheaper than defending it later.',
      },
      {
        challenge: 'A big change is hard to trust, and the typography change touches 529 files, too many to review line by line',
        solution: 'Most of the added lines are records, not code, with six record files holding 13,000 of the 21,000, and the reviewer gets a short path through it: open the preview, spot-check pages and read the decisions. Rollout goes to a low-risk environment first, with owners and a rollback, and while it is still a draft awaiting review, that is the honest place for it to be.',
      },
    ],
    insight: 'Design debt is not a clean-up job but a trust problem, since nobody doubts that the values should match the design system, only that a change this big can be safe, and Nexus answers with evidence: a number for the debt, a person on every call, and a pixel check on every page it can capture.\n\nTypography is the first category through the door, while colour and spacing are measured and waiting for the same loop to carry them.',
    quickInsight: 'Design debt is a trust problem, not a clean-up job, so measure it, let people make the calls, and check every change on the page.',
  },
}
