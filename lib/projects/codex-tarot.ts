import type { SideProject } from './types'

export const codexTarot: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'codex-tarot',
  hashtag: '#AI',
  year: '2024',
  title: 'Codex Tarot',
  subtitle: 'An AI tarot reader trained on symbology, built to feel alive',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description: 'A web app that generates Marseilles Tarot readings. Trained on hand-written card analyses. Built because every tarot app I found was either soulless copy-paste or ignored the classic deck entirely. Users ask real questions and get readings that feel human.',
  imageUrl: '/img/projects/codex-tarot/hero.png',
  imageAlt: 'Codex Tarot interface showing a five-card spread with atmospheric fog background',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: 'February 2024 (2 months to ship)',
  role: 'Creator, Researcher, Developer',
  techStack: ['Flask', 'Python', 'OpenAI', 'JavaScript', 'YAML', 'Heroku'],

  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'Try It',
      url: 'https://www.codextarot.com',
      type: 'live',
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // MISSION
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement: 'To build a tarot reader that thinks like a reader, not a database.',

    spark: 'I started studying tarot for the symbology. Archetypes, visual language, the way meaning layers across cards when you put them next to each other. Not divination, just exploration. Around the same time, I wanted to build something with LLMs that went beyond chat interfaces. My best friend mentioned he couldn\'t find a decent tarot app anywhere, something that felt alive and let you ask actual questions. Most apps just spit out canned text. They don\'t accept context. They don\'t articulate. I realised training an AI to read cards properly would force me to understand the cards deeply myself. The project became both the tool and the study.',

    intent: [
      'Build an AI that could weave card meanings together the way an experienced reader does intuitively',
      'Focus on the Marseilles deck, the classic version with more symbolic depth than Rider-Waite',
      'Create something that accepts real questions and responds in context, not prefabricated snippets',
      'Make it feel alive, warm, and worth returning to',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'Most tarot apps are stuck in the early 2000s. Generic text generators that repeat the same descriptions regardless of what you ask or what cards appear together. Worse, almost none focus on the Marseilles Tarot, the older tradition with richer visual symbolism. Everything caters to Rider-Waite, which is more mainstream but, to me, less interesting. The gap wasn\'t just quality. It was the complete absence of context-awareness. A reading should respond to your question, not just list card meanings.',

    opportunity: 'LLMs finally made it possible to build what I had in mind. Not a lookup table, but a system that could articulate relationships between cards, notice patterns, and respond to the specific situation a user describes. The challenge was training it properly. Generic prompts produce generic readings. I\'d need to write the training material myself.',

    audience: 'Originally built for my best friend and myself. Since then, beginners, curious people, and experienced readers have all used it. The feedback that keeps coming back is that it feels "alive". People say the readings connect with their actual situations in ways that surprise them.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'I wrote all the training documentation by hand. Every card in the 78-card Marseilles deck: meanings, keywords, graphic details, interpretations, relationships to other cards, and a monologue written from the card\'s perspective. This took longer than building the app. I went through several books, cross-referenced the Jodorowsky-Camoin restoration, and documented everything in structured YAML files. The AI needed dense, accurate source material to articulate readings properly. No shortcuts.',

    features: [
      {
        title: 'Contextual Readings',
        description: 'Users write their situation, question, or idea before drawing cards. The AI doesn\'t just interpret the cards in isolation. It weaves the user\'s context through the entire reading. Ask about a career decision and get a reading about career. Ask about a relationship and get something entirely different from the same cards.',
      },
      {
        title: 'Spread Options',
        description: 'Single card for quick insights. Three cards for past, present, future. Five cards in a plus shape for nuance and detail. Each spread type has its own logic and the AI adapts its synthesis accordingly.',
      },
      {
        title: 'Oracle Message',
        description: 'After the individual card interpretations and spread synthesis, the system generates a final "oracle" message. This is more poetic, weaving together the monologues I wrote for each card into a unified voice. It feels like the deck is speaking directly.',
      },
      {
        title: 'Study Mode',
        description: 'Browse all 78 cards with filtering and search. Each card has its full data visible: meanings, keywords, descriptions. Built as much for my own learning as for users who want to go deeper.',
      },
    ],

    images: [
      {
        url: '/img/projects/codex-tarot/reading.png',
        alt: 'A three-card spread reading with contextual interpretation',
        caption: 'Readings respond to the question asked, not generic meanings',
      },
      {
        url: '/img/projects/codex-tarot/study.png',
        alt: 'Study mode showing card browser with filtering options',
        caption: 'All 78 cards documented with searchable metadata',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'Chose Marseilles over Rider-Waite deliberately. It\'s the classic deck, older, with denser visual symbolism. Most apps ignore it entirely.',
      'Wrote card monologues in first person from each card\'s perspective. This gives the oracle message a distinct voice that feels like the deck itself is speaking.',
      'Set temperature to 0.3 for consistent, focused responses. Higher temperatures produced more creative but less accurate readings.',
      'Abandoned an initial vector/embedding approach. It hallucinated badly. Structured YAML with explicit card data fed directly into prompts worked far better.',
    ],

    exploration: 'The hardest part wasn\'t the code. It was the research. Writing accurate, nuanced documentation for 78 cards across multiple dimensions: upright meaning, reversed implications, numerology, suit relationships, visual symbolism. I had to become a competent reader myself to write training material that would produce competent readings. The books I went through disagreed with each other constantly. Synthesising a coherent system from contradictory sources was its own challenge.',

    image: {
      url: '/img/projects/codex-tarot/data.png',
      alt: 'YAML file structure showing card data organisation',
      caption: 'Hand-written documentation for every card in the deck',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'A few dozen users have found it despite zero marketing. The readings work. People describe them as "alive" and report connections to their actual situations that surprise them. Beginners, curious visitors, and experienced readers have all validated the approach.',

    notes: [
      'Users consistently say the app feels different from other tarot tools. The word "alive" comes up repeatedly.',
      'Advanced readers have confirmed the interpretations align with traditional Marseilles practice.',
      'The engine is solid. What\'s missing is the learning module I originally planned.',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'AI quality is downstream of training quality. The generic readings other apps produce aren\'t a model limitation. They\'re a data limitation. Hand-writing comprehensive source material took months, but it\'s the reason the readings feel human.',

    openQuestions: [
      'Could this become sustainable without losing the thing that makes it good?',
      'Is there a way to add the learning module without turning it into a course platform?',
    ],

    nextSteps: [
      'Build out the apprentice/learning mode that\'s been planned since the start',
      'Explore whether monetisation makes sense without compromising the experience',
      'Animated cards and sound design are still on the list, shelved but not forgotten',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/codex-tarot/cards.png',
      alt: 'Selection of Marseilles Tarot cards from the Jodorowsky-Camoin restoration',
      caption: 'The Jodorowsky-Camoin restored Marseilles deck',
    },
    {
      url: '/img/projects/codex-tarot/mobile.png',
      alt: 'Codex Tarot on mobile showing responsive card layout',
      caption: 'Responsive design for readings anywhere',
    },
  ],
}
