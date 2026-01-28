import type { SideProject } from './types'

export const kallax: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'kallax',
  hashtag: '#Mobile · Product',
  year: 'Q42025–Q12026',
  title: 'Kallax',
  subtitle: 'Vinyl companion for DJs who own their records and their data',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description: 'Mobile app for vinyl DJs. Sync your Discogs collection, track BPMs, build playlists, run live sets. Offline-first, local storage, no subscriptions: designed for dark booths and deep crates.',
  imageUrl: '/img/projects/kallax/hero.png',
  imageAlt: 'Kallax collection view showing vinyl albums in a dark interface with yellow accents',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: 'December 2025 – January 2026 (6 weeks)',
  role: 'Solo: design, development, brand, distribution',
  techStack: ['React Native', 'Expo', 'SQLite', 'Discogs API', 'GetSongBPM API'],

  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'Join Beta (Android)',
      url: 'https://play.google.com/store/apps/details?id=com.kallax.app',
      type: 'live',
    },
    {
      label: 'Visit Website',
      url: 'https://kallax.app',
      type: 'live',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/ayokaayo/kallax',
      type: 'code',
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // MISSION
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement: 'Vinyl DJs work offline, own physical objects, and dig through crates: software should respect that.',

    spark: 'I DJ with vinyl. Every time I prepared for a set, I juggled three disconnected tools: Discogs for my collection metadata, spreadsheets for tracking BPMs, and my own memory for which records I had actually brought to the gig. The question kept surfacing: why isn\'t there one tool that understands how vinyl DJs actually work? Not streaming DJs scrolling through infinite playlists. Not bedroom producers organizing project files. Vinyl collectors who perform live, often without internet, in poorly lit booths, surrounded by hundreds of physical records they need to locate quickly.',

    intent: [
      'Build a companion app that works the way vinyl DJs do: sync collection data from Discogs, fetch BPM information where it exists, and make manual entry effortless where it does not',
      'Organize playlists offline and provide a live reference mode that stays out of your way during a set',
      'No cloud dependency, no subscription model, no pretending perfect metadata exists for every obscure pressing',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'The tools available to vinyl DJs exist in isolated silos. Discogs serves as the ubiquitous repository for collection metadata, but offers no DJ functionality. Desktop software like Rekordbox assumes you are working with digital files, not physical objects. Streaming platforms become irrelevant the moment you are standing in front of a crate. And then there is the BPM problem: unlike digital DJs who have tempo metadata embedded in their files, vinyl DJs often have no idea what speed their records are. Some pay services to analyze tracks they do not even own digitally. Others manually tap out tempos on calculators. Most just guess and adjust by ear.',

    opportunity: 'Design a mobile app that brings these disconnected pieces together: sync with Discogs to import your collection, fetch BPM data where APIs can provide it, make manual entry feel natural rather than punitive, and offer a live mode that functions as passive reference during sets. No cloud lock-in, no monthly subscription, no illusion that perfect data exists for every record pressed in 1974. The constraint that shaped everything: build it fast, build it alone, make every design choice serve the person standing in a dark booth trying to remember which crate holds their copy of that specific pressing.',

    audience: 'Vinyl DJs and record collectors who catalog on Discogs, perform at venues (clubs, radio shows, private parties), value offline-first tools, and appreciate when software understands the craft rather than trying to replace it.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'Five principles emerged while designing Kallax, each one responding to how vinyl DJs actually work rather than how software typically imagines they should. Honor the ritual: digging through records is part of the craft, the muscle memory. Design for the booth: DJ booths are dark spaces, often with colored stage lighting. Respect ownership: no login required, no cloud storage, no subscription model. Accept reality: the GetSongBPM API returns tempo data for roughly 67% of tracks, so build excellent manual entry instead of chasing perfect automation. Stay out of the way: three tabs, three concepts, no nested menus to hunt through under pressure.',

    features: [
      {
        title: 'Collection Management (Shelf Tab)',
        description: 'Connect your Discogs account via OAuth, sync your complete collection: releases, tracks, artists, album art. Two browse modes let you switch between efficient grid scanning and cover-flow digging. Real-time search filters as you type. Toggle between your full collection ("SHELF") and favorited tracks ("HOT"). Tap any album to see the full tracklist with vinyl-specific positioning (A1, B2, etc.), track durations, and BPM badges.',
        image: {
          url: '/img/projects/kallax/collection-grid.png',
          alt: 'Kallax Shelf tab displaying a synced Discogs collection in two-column grid layout with yellow accent highlighting the active tab',
          caption: 'Collection grid view with bold-bordered square cards: geometric contrast against circular vinyl records, neutral frames that work with any cover design',
        },
      },
      {
        title: 'BPM Detection & Manual Entry',
        description: 'After syncing your collection, fetch BPM data from GetSongBPM API: a progress bar shows real-time status as it processes your library. For tracks without data (or tracks where the API got it wrong), tap the BPM badge to open a tap-tempo interface. Four taps gives you your tempo. Done. Settings displays your BPM coverage percentage with no gamification, no pressure to hit 100%, just honest reporting of what is verified versus what needs manual input.',
      },
      {
        title: 'Playlist Management (Bag Tab)',
        description: 'Create playlists (called "bags" in DJ terminology). Add tracks from your collection or hot tracks. Drag-and-drop to reorder in manual mode, or sort by BPM (ascending/descending) or alphabetically. If a playlist exceeds 60 tracks, you will see a "heavy bag" warning: practical reminder that carrying that many records to a gig is physically exhausting. Playlists are local, they export with your backup, you own them completely.',
        image: {
          url: '/img/projects/kallax/playlist-detail.png',
          alt: 'Kallax playlist detail view with numbered track positions and BPM badges',
          caption: 'Manual sort mode enables drag-and-drop reordering. Tracks without BPM data display double dash as honest indicator rather than broken state',
        },
      },
      {
        title: 'Live Mode (Spin Tab)',
        description: 'Select a playlist, start a live session. The Now Playing card dominates the screen: large album art, track title, artist, BPM clearly visible. Swipe left for next track, swipe right for previous. The queue scrolls below showing what is coming up. Skip to any track if you need to adjust on the fly. Edit BPMs mid-set if you discover the data was wrong. The screen stays awake automatically. Live Mode does not try to control your mixer or suggest what to play next: it assumes you know what you are doing and simply organizes the information you need to reference quickly.',
        image: {
          url: '/img/projects/kallax/live-mode.png',
          alt: 'Kallax Live Mode showing Now Playing track in a large hero card with BPM badge and queue below',
          caption: 'Yellow "NOW LIVE" indicator shows active session status. Designed for visibility in dark DJ booths without causing glare',
        },
      },
    ],

    images: [
      {
        url: '/img/projects/kallax/design-system.png',
        alt: 'Kallax design system showing color palette, typography, and border examples',
        caption: 'Neo-brutalist visual system: #FFD53D yellow for booth visibility, 3-4px borders, hard drop shadows, uppercase labels in Archivo typeface. Squares contrast with circular records',
      },
      {
        url: '/img/projects/kallax/browse-modes.png',
        alt: 'Side-by-side comparison of grid view and cover-flow digging mode',
        caption: 'Two browse modes honor different behaviors: grid view for efficient scanning, cover-flow "digging mode" for the ritual of flipping through crates one album at a time',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'Yellow (#FFD53D) over blue, green, or white: sits second in the visible spectrum for brightness but reads warmer than blue light, which causes more eye strain in dark spaces. Tested in actual DJ booth conditions with dim red house lighting and complete darkness.',
      'Squares and hard edges throughout: records are circular, turntables are circular, vinyl culture is defined by round geometry. Square cards with hard borders create neutral frames that present any album cover without the interface competing visually. Neo-brutalism signals directness: this tool does not pretend to be smoother than reality.',
      'Three tabs instead of deeper navigation: DJs do not have time to hunt through nested menus when they are thirty seconds from needing their next record. Shelf, Bag, Spin: three words, three concepts. This constraint forced clarity everywhere else.',
      'Accept 67% BPM coverage instead of chasing perfect automation: I could have integrated multiple APIs, built server-side audio analysis, used algorithmic estimates. The design decision: build excellent manual entry rather than chase unreliable automation. The tap-tempo interface is fast, tactile, gives DJs direct control.',
      'Skip authentication in the MVP: building OAuth flows and backend infrastructure would have delayed launch by weeks. But the choice became philosophical: DJs own physical records, they should own their data with the same certainty. Local-first architecture means the app works offline by default, never phones home.',
    ],

    exploration: 'Building Kallax alone (design, development, API integration, database schema, deployment, marketing site, app store presence) meant every choice was mine to make and mine to live with. This forced a particular kind of clarity: if I could not explain why a feature mattered in one sentence, it probably did not matter enough to build. Some features got cut: collaborative playlists (too complex for solo timeline), Spotify preview integration (nice-to-have, not essential), advanced filtering by genre or year (can add later if usage shows demand). What remained was the tightest possible loop: sync collection, build playlists, run live sets. Solo building also meant accepting imperfection strategically. "Good enough to be immediately useful" shipped in six weeks beats "theoretically perfect" that never launches.',

    image: {
      url: '/img/projects/kallax/booth-context.png',
      alt: 'Kallax app displayed on phone next to turntables in a dark DJ booth environment',
      caption: 'Designed for the environment where it is actually used: dark DJ booths with colored lighting, surrounded by physical records, often without internet. Yellow stands out without causing glare',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'Kallax is live in open beta on Google Play, with iOS launch pending Apple Developer account complications from my recent move between countries. Beta testers (all working DJs) are using it during live sets at clubs, radio shows, private events. The app has received zero support questions about navigation or core functionality: feature requests are refinements, not confusion about how things work. The measure of success for a tool like this is not download numbers or engagement metrics, it is trust. Do DJs trust Kallax when it matters? In the dark, without internet, in front of an audience? So far, yes.',

    notes: [
      'Building everything solo (concept through distribution) took six weeks of focused work during holiday time. Timeline possible because every decision optimized for shipping over perfection',
      'The privacy-first architecture that started as a velocity hack became the app\'s core identity. DJs appreciate that collection data never leaves their device, no monthly subscription, honest about what it can and cannot do',
      'Planned freemium model: free tier limited to 3 playlists and manual BPM only, one-time $9.99 unlock for full access via RevenueCat',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'Designing and building Kallax end-to-end taught me that constraints force honesty in product design. When you cannot hide behind "engineering will figure that out" or "we will improve that later," every feature has to justify its existence immediately. The biggest shift in thinking: designing for 67% coverage instead of 100% perfection. Most tools overpromise. Kallax does less, but what it does it does honestly. That turned out to be more respectful to users than pretending certainty where none exists.',

    openQuestions: [
      'Will DJs pay $9.99 for a tool that solves a real problem they have lived with for years, or has free software trained everyone to expect everything for nothing?',
      'Can a solo-built app compete long-term with venture-backed competitors who can afford to lose money gaining market share?',
      'Does the vinyl DJ community even want new software, or are they fundamentally satisfied with their current fragmented workflows?',
    ],

    nextSteps: [
      'Launch publicly on both platforms once Apple Developer account issues resolve',
      'Watch how DJs who are not friends or beta testers actually use it in the wild: strangers who found it in the store with no context',
      'Potential future directions: crowdsourced BPM database, AI-powered playlist suggestions for harmonic mixing, better crate organization for large collections, key detection',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/kallax/user-flows.png',
      alt: 'User flow diagrams showing first-time setup, creating playlists, starting live sets, and managing collection',
      caption: 'User journey deliberately kept shallow. Three tabs, clear hierarchy: Collection → Playlists → Live Mode. No hidden features, no complex navigation patterns',
    },
    {
      url: '/img/projects/kallax/digging-mode.png',
      alt: 'Cover-flow style digging mode showing albums flipping one at a time',
      caption: 'Digging mode mirrors the physical act of flipping through crates one album at a time. You do not rush vinyl. The interface should not either',
    },
  ],
}
