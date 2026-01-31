import type { SideProject } from './types'

export const wordWarOne: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'word-war-one',
  hashtag: '#Game Design',
  year: '2023',
  title: 'Word War One',
  subtitle: 'A party game where vocabulary meets combat strategy, and the best word is not always the longest one',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description: 'A physical card game for 2-5 players. Combine letter cards to form words and use them as attacks, defenses, or special moves. Health points, resupply mechanics, and boss words create strategic depth beneath the party-game surface. Self-designed, self-published, funded on Indiegogo.',
  cardSummary: 'Physical card game where words become weapons. 2-5 players, health points, special cards, boss words. Self-published via Indiegogo.',
  readingTime: '5–8 min read',
  videoUrl: 'https://www.youtube.com/embed/1PhT3UENxoI',
  imageUrl: '/img/projects/word-war-one/square.webp',
  imageAlt: 'Word War One game artwork showing multiple hands reaching toward letter tiles spelling out the game title',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: '2023 (8 months from concept to fulfillment)',
  role: 'Designer, Illustrator, Publisher',
  techStack: ['Illustrator', 'InDesign', 'Print Production'],
  tags: ['game theory', 'indie board game'],

  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'BoardGameGeek',
      url: 'https://boardgamegeek.com/boardgame/405678/word-war-one',
      type: 'other',
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // MISSION
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement: 'To build a word game where vocabulary is the weapon but strategy wins the war.',

    spark: 'Party games and strategy games rarely occupy the same table. Word games tend toward the casual, Scrabble and Bananagrams reward the person with the biggest vocabulary and that is the whole game. Strategy games demand planning and risk assessment and reading opponents but often require hours and a rulebook the size of a novella. I wanted something that could bridge that gap, a game where your grandmother and your board-game-group friend could both find something to enjoy, where forming a good word was necessary but not sufficient, where timing and bluffing and knowing when to hold your best letters mattered as much as knowing what to spell with them.',

    intent: [
      'Create a game that works at parties but rewards strategic thinking, fast to learn but with depth that emerges over multiple plays',
      'Design a health-point system with catch-up mechanics so losing players stay engaged until the final round',
      'Build special cards that introduce chaos without breaking the game, ensuring no two battles play out the same way',
      'Handle everything from illustration to print production to crowdfunding, proving the full stack of physical product creation',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'Word games are everywhere but most are pure vocabulary tests. The person who reads the most wins. Strategy games are everywhere but most require significant investment to learn and play. The overlap between accessible and deep is surprisingly thin. I had been playing with the idea of letter cards as combat for years, scrabble tiles as ammunition, words as attacks that could be blocked or countered, but the system always collapsed under its own complexity or failed to produce meaningful decisions. The breakthrough was realizing that the word itself should not determine the damage, the context should. A short word played at the right moment against the right opponent could be devastating. A long word played into a prepared defense could be neutralized entirely.',
    quickContext: 'Word games reward vocabulary. Strategy games require hours. The gap was a game that bridged both without dominating either.',

    opportunity: 'The gap was a game that respected vocabulary without being dominated by it, that introduced strategy without requiring a tutorial, that created dramatic moments without relying on luck. Health points meant comebacks were always possible. Special cards meant the board state could shift unpredictably. Boss words, pre-selected target words that ended the game immediately if played, created tension around holding powerful letters and watching opponents hands for the telltale signs of a finishing move.',

    audience: 'Game nights where not everyone wants to read a rulebook. Families where the kids have better vocabularies than the parents. Friend groups where one person always wins at Scrabble and everyone else is tired of it.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'I started with the combat system and worked backwards. How do words become attacks? How do attacks become damage? How does damage create tension rather than just elimination? The health-point system emerged from that last question, 25 points each, damage calculated by comparing word values, but with a catch-up mechanic where players who fall behind draw better cards from the resupply pile. The special cards came next, five types that break rules in specific ways. Wildcard becomes any letter. Propaganda doubles damage. Rubber Stamp validates any move. Censorship invalidates any word. Grammar Nazi punishes misspellings harshly. Each one creates a moment of decision, do I use this now or save it for a bigger play?',

    features: [
      {
        title: 'Wordcrafting Combat',
        description: 'Players form words from letter cards in hand. The word is played as an attack against a chosen opponent. Defenders can block by forming a stronger word, creating a back-and-forth where the best vocabulary does not always win because timing and card management matter as much as raw letter power.',
        image: {
          url: '/img/projects/word-war-one/2.webp',
          alt: 'Black and white photograph of Word War One being played on a table with snacks and drinks',
          caption: 'The game in action. Letter cards spread across a table, hands reaching, words forming in real time.',
        },
      },
      {
        title: 'Health Points & Catch-Up',
        description: 'Each player starts with 25 health points. When you lose a battle, you take damage based on the difference in word values. But the resupply system gives players with lower health better card draw options, creating natural rubber-banding that keeps everyone in the game until the final rounds. No early elimination, no sitting out.',
        image: {
          url: '/img/projects/word-war-one/Rules_Basics.png',
          alt: 'Rules infographic showing basic mechanics, wordcrafting, victory conditions, and special cards',
          caption: 'Complete rules on a single vertical sheet. Setup, combat, victory conditions, and the five special card types.',
          isZoomable: true,
        },
      },
      {
        title: 'The Special Cards',
        description: 'Five cards that break the rules in specific, game-changing ways. Wildcard becomes any letter you need. Propaganda doubles your damage output. Rubber Stamp validates any word regardless of spelling. Censorship invalidates an opponent\'s word entirely. Grammar Nazi punishes misspelled words with extra damage. They are rare enough to feel special when drawn, common enough to keep every game unpredictable.',
        image: {
          url: '/img/projects/word-war-one/2w.png',
          alt: 'Special card artwork showing +2 damage multiplier card with bold typography',
          caption: 'Propaganda card: double damage. The special cards create moments where the table state can shift dramatically.',
        },
      },
      {
        title: 'Boss Word Victory',
        description: 'Before the game begins, players collectively choose a Boss Word, a target word that ends the game immediately if played. This creates a secondary win condition and a layer of bluffing, is that player holding letters for a big attack, or are they one card away from playing the Boss Word and winning outright? It also creates moments of sacrifice, using a letter you need to block someone else from completing the Boss Word.',
        image: {
          url: '/img/projects/word-war-one/QG.png',
          alt: 'High-value letter cards Q and G with distinctive typographic treatment',
          caption: 'High-value letters like Q and G become strategic assets. Hold them for big attacks, or use them to block Boss Words.',
        },
      },
      {
        title: 'Physical Production',
        description: 'Designed the entire card set in Illustrator, from letter typography to special card iconography to the box art. The aesthetic is bold and graphic, high contrast black and cream with red accents, readable across a table in dim lighting. Managed print production, proofing, and fulfillment through a local manufacturer. The cards have a satisfying weight and the box fits in a jacket pocket.',
        image: {
          url: '/img/projects/word-war-one/x-.png',
          alt: 'Letter X card and wildcard card showing the vintage textured card design',
          caption: 'Card design with vintage texture and bold typography. The X and wildcard are among the most sought-after cards.',
        },
      },
    ],

    images: [
      {
        url: '/img/projects/word-war-one/1920X1080.png',
        alt: 'Word War One hero artwork showing hands reaching toward letter tiles arranged in a cross pattern',
        caption: 'The central metaphor: words as weapons, collaboration as combat. Letter tiles become ammunition in a battle of wits.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'Chose high-contrast black and cream with red accents for the card design. Readable in dim lighting, distinctive on a cluttered table, and printable without full-color costs that would have made the game unaffordable to produce.',
      'Made the special cards visually distinct from letter cards at a glance. Players need to know immediately when someone is holding a potential game-changer. The border treatment and iconography create that recognition without reading.',
      'Set player count at 2-5 after extensive testing. At 2 players the game becomes a tense duel. At 5 it becomes chaotic in the best way, with alliances forming and breaking in real time. Above 5 the downtime between turns becomes punishing.',
      'Designed the box to fit in a jacket pocket. Board games often live on shelves. I wanted this to travel, to be the game you bring to the bar or the park or the friend\'s house without planning ahead.',
    ],

    exploration: 'The biggest challenge was the damage calculation. Early versions used Scrabble-style letter values, but that made the game too predictable, the person with the most high-value letters always won. The solution was to decouple word value from damage, with damage calculated by comparing the two words in the battle rather than absolute scores. A 12-point word against a 10-point word does 2 damage, regardless of how those points were achieved. This meant a carefully timed 8-point word could be devastating if the opponent played a 6. It shifted the focus from hoarding high-value letters to reading the table and knowing when to strike. The special cards went through dozens of iterations. Early versions had too many, the game became about the cards rather than the words. Too few and they felt irrelevant. Five felt right, each one distinct, each one memorable, each one creating a story when played.',

    // Craft section image removed - using card images in features instead
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'Successfully funded on Indiegogo and fulfilled to backers. Listed on BoardGameGeek with positive early feedback. The game has found its way into game nights and family gatherings, with the most common feedback being that it plays differently every time and that the special cards create moments people talk about afterwards.',
    quickItems: [
      'Successfully funded on Indiegogo and fulfilled to backers',
      'Listed on BoardGameGeek with positive early feedback',
      'Catch-up mechanic keeps games competitive until final rounds',
    ],

    notes: [
      'The catch-up mechanic works as designed. Games rarely end with a blowout, most come down to the final few health points.',
      'Boss Words create the intended tension. Players watch each other\'s hands, trying to deduce who is holding what letters.',
      'The pocket-sized box has been mentioned repeatedly by players. It travels well, which was the intention.',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'Physical product design taught me constraints I do not encounter in digital work. Every color adds cost. Every card size affects shipping. Every design decision is frozen once the print run starts. That rigor was valuable. It also taught me that the tactile matters. The weight of the cards, the texture of the box, the sound of shuffling, these are part of the experience in a way that pixels cannot replicate.',
    quickInsight: 'Physical products taught me constraints digital work does not have. Every decision is frozen at print. The tactile matters in ways pixels cannot replicate.',

    openQuestions: [
      'Would an expansion add value or dilute what works? More special cards, new victory conditions, or leave it as a complete experience?',
      'Is there a digital version that makes sense, or does the physicality define the game?',
    ],

    nextSteps: [
      'Monitor ongoing feedback for patterns that suggest balance issues or expansion opportunities',
      'Consider a small print run for retail if demand justifies it',
      'Document the design process for a potential write-up on game design principles',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/word-war-one/image(2).png',
      alt: 'Square crop of the Word War One hero artwork showing hands and letter tiles',
      caption: 'The game\'s visual identity: hands reaching, letters colliding, conflict through collaboration.',
    },
    {
      url: '/img/projects/word-war-one/3.jpg',
      alt: 'Additional gameplay image',
      caption: 'Game in progress.',
    },
  ],
}
