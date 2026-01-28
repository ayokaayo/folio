import type { SideProject } from './types'

export const kallax: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'kallax',
  hashtag: '#Mobile',
  year: '2026',
  title: 'Kallax',
  subtitle: 'A vinyl DJ companion built for crates, not clouds',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description: 'Mobile app for vinyl DJs. Sync your Discogs collection, track BPMs, build playlists, run live sets. Offline-first, local storage, no subscriptions. Designed for dark booths and the people who dig through crates to fill them.',
  imageUrl: '/img/projects/kallax/hero.png',
  imageAlt: 'Kallax app interface showing collection grid with bold yellow accents against a dark background',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: 'December 2025 – January 2026 (6 weeks)',
  role: 'Solo: design, development, brand, distribution',
  techStack: ['React Native', 'Figma', 'Expo', 'SQLite', 'Discogs API', 'GetSongBPM API'],

  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'App Store',
      url: 'https://apps.apple.com/app/kallax/id6737292390',
      type: 'live',
    },
    {
      label: 'Google Play',
      url: 'https://play.google.com/store/apps/details?id=com.kallax.app',
      type: 'live',
    },
    {
      label: 'Website',
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
    statement: 'Vinyl DJs work offline, own physical objects, and dig through crates. Software should respect that.',

    spark: 'I DJ with vinyl. Every time I prepared for a set, I juggled three disconnected tools. Discogs for my collection metadata. Spreadsheets for tracking BPMs. My own memory for which records I had actually brought to the gig. The question kept surfacing. Why is there not one tool that understands how vinyl DJs actually work? Not streaming DJs scrolling through infinite playlists. Not bedroom producers organizing project files. Vinyl collectors who perform live, often without internet, in poorly lit booths, surrounded by hundreds of physical records they need to locate quickly. The name came naturally. Kallax, after the IKEA shelving unit that has become the unofficial furniture of record collectors worldwide. Square, modular, unpretentious. Exactly what the app tries to be.',

    intent: [
      'Build a companion app that works the way vinyl DJs do. Sync collection data from Discogs, fetch BPM information where it exists, and make manual entry effortless where it does not.',
      'Organize playlists offline and provide a live reference mode that stays out of your way during a set.',
      'No cloud dependency, no subscription model, no pretending perfect metadata exists for every obscure pressing.',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'The tools available to vinyl DJs exist in isolated silos. Discogs serves as the ubiquitous repository for collection metadata, but offers no DJ functionality. Desktop software like Rekordbox assumes you are working with digital files, not physical objects. Streaming platforms become irrelevant the moment you are standing in front of a crate. And then there is the BPM problem. Unlike digital DJs who have tempo metadata embedded in their files, vinyl DJs often have no idea what speed their records are. Some pay services to analyze tracks they do not even own digitally. Others manually tap out tempos on calculators. Most just guess and adjust by ear.',

    opportunity: 'Design a mobile app that brings these disconnected pieces together. Sync with Discogs to import your collection. Fetch BPM data where APIs can provide it. Make manual entry feel natural rather than punitive. Offer a live mode that functions as passive reference during sets. No cloud lock-in, no monthly subscription, no illusion that perfect data exists for every record pressed in 1974. The constraint that shaped everything. Build it fast. Build it alone. Make every design choice serve the person standing in a dark booth trying to remember which crate holds their copy of that specific pressing.',

    audience: 'Vinyl DJs and record collectors who catalog on Discogs, perform at venues, clubs, radio shows, private parties, value offline-first tools, and appreciate when software understands the craft rather than trying to replace it.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'Five principles emerged while designing Kallax, each one responding to how vinyl DJs actually work rather than how software typically imagines they should. Honor the ritual. Digging through records is part of the craft, the muscle memory. Design for the booth. DJ booths are dark spaces, often with colored stage lighting. Respect ownership. No login required, no cloud storage, no subscription model. Accept reality. The GetSongBPM API returns tempo data for roughly 67% of tracks, so build excellent manual entry instead of chasing perfect automation. Stay out of the way. Three tabs, three concepts, no nested menus to hunt through under pressure.',

    features: [
      {
        title: 'Collection Management (Shelf Tab)',
        description: 'Connect your Discogs account via OAuth, sync your complete collection. Releases, tracks, artists, album art. Two browse modes let you switch between efficient grid scanning and cover-flow digging. Real-time search filters as you type. Toggle between your full collection (SHELF) and favorited tracks (HOT). Tap any album to see the full tracklist with vinyl-specific positioning (A1, B2, etc.), track durations, and BPM badges.',
        image: {
          url: '/img/projects/kallax/collection-grid.png',
          alt: 'Kallax onboarding welcome screen, collection grid view, and album detail with tracklist',
          caption: 'Onboarding to album detail: welcome modal prompts Discogs connection, grid view shows synced collection, tapping an album reveals full tracklist with vinyl positioning and BPM badges.',
        },
      },
      {
        title: 'BPM Detection & Manual Entry',
        description: 'After syncing your collection, fetch BPM data from GetSongBPM API. A progress bar shows real-time status as it processes your library. For tracks without data, or tracks where the API got it wrong, tap the BPM badge to open a tap-tempo interface. Four taps gives you your tempo. Done. Settings displays your BPM coverage percentage with no gamification, no pressure to hit 100%, just honest reporting of what is verified versus what needs manual input.',
        image: {
          url: '/img/projects/kallax/settings-config.png',
          alt: 'Settings screen showing Discogs connection, BPM fetch progress, and sync preferences',
          caption: 'Settings hub: Discogs account connection, real-time BPM fetch progress with coverage percentage, and sync preferences for auto-updates.',
        },
      },
      {
        title: 'Playlist Management (Bag Tab)',
        description: 'Create playlists, called bags in DJ terminology. Add tracks from your collection or hot tracks. Drag-and-drop to reorder in manual mode, or sort by BPM (ascending or descending) or alphabetically. If a playlist exceeds 60 tracks, you will see a heavy bag warning. Practical reminder that carrying that many records to a gig is physically exhausting. Playlists are local, they export with your backup, you own them completely.',
        image: {
          url: '/img/projects/kallax/playlist-detail.png',
          alt: 'Kallax playlist detail view with numbered track positions and BPM badges',
          caption: 'Manual sort mode enables drag-and-drop reordering. Tracks without BPM data display double dash as honest indicator rather than broken state.',
        },
      },
      {
        title: 'Live Mode (Spin Tab)',
        description: 'Select a playlist, start a live session. The Now Playing card dominates the screen. Large album art, track title, artist, BPM clearly visible. Swipe left for next track, swipe right for previous. The queue scrolls below showing what is coming up. Skip to any track if you need to adjust on the fly. Edit BPMs mid-set if you discover the data was wrong. The screen stays awake automatically. Live Mode does not try to control your mixer or suggest what to play next. It assumes you know what you are doing and simply organizes the information you need to reference quickly.',
        image: {
          url: '/img/projects/kallax/live-mode.png',
          alt: 'Kallax Live Mode showing Now Playing track, tap-tempo BPM interface, and queue view',
          caption: 'Live Mode with tap-tempo fallback: Now Playing card shows current track with BPM, tap interface for manual entry when needed, queue shows what is coming up next.',
        },
      },
      {
        title: 'Marketing Website',
        description: 'Built kallax.app to match the app aesthetic. Single page, no trackers, no analytics, direct download links to both stores. The site had to communicate what the app does in under 10 seconds for visitors who found it through search.',
        image: {
          url: '/img/projects/kallax/website.png',
          alt: 'Kallax marketing website showing app screenshots and store download badges',
          caption: 'Marketing site extends the neo-brutalist system. Yellow accents, square cards, immediate download buttons. No fluff.',
        },
      },
    ],

    images: [
      {
        url: '/img/projects/kallax/design-system.png',
        alt: 'Kallax design system showing color palette, typography, and border examples',
        caption: 'Neo-brutalist visual system. #FFD53D yellow for booth visibility, 3-4px borders, hard drop shadows, uppercase labels in Archivo typeface. Squares contrast with circular records.',
      },
      {
        url: '/img/projects/kallax/browse-modes.png',
        alt: 'Side-by-side comparison of grid view and cover-flow digging mode',
        caption: 'Two browse modes honor different behaviors. Grid view for efficient scanning, cover-flow digging mode for the ritual of flipping through crates one album at a time.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'Yellow (#FFD53D) over blue, green, or white. It sits second in the visible spectrum for brightness but reads warmer than blue light, which causes more eye strain in dark spaces. Tested in actual DJ booth conditions with dim red house lighting and complete darkness.',
      'Squares and hard edges throughout. Records are circular, turntables are circular, vinyl culture is defined by round geometry. Square cards with hard borders create neutral frames that present any album cover without the interface competing visually. Neo-brutalism signals directness. This tool does not pretend to be smoother than reality.',
      'Three tabs instead of deeper navigation. DJs do not have time to hunt through nested menus when they are thirty seconds from needing their next record. Shelf, Bag, Spin. Three words, three concepts. This constraint forced clarity everywhere else.',
      'Accept 67% BPM coverage instead of chasing perfect automation. I could have integrated multiple APIs, built server-side audio analysis, used algorithmic estimates. The design decision. Build excellent manual entry rather than chase unreliable automation. The tap-tempo interface is fast, tactile, gives DJs direct control.',
      'Skip authentication in the MVP. Building OAuth flows and backend infrastructure would have delayed launch by weeks. But the choice became philosophical. DJs own physical records, they should own their data with the same certainty. Local-first architecture means the app works offline by default, never phones home.',
    ],

    exploration: 'Sketched ideas around December 12, 2025. First commit December 24, 2025. Six weeks from that commit to live on both app stores. Building Kallax alone meant every choice was mine to make and mine to live with. Design, development, API integration, database schema, deployment, marketing site, app store presence. This forced a particular kind of clarity. If I could not explain why a feature mattered in one sentence, it probably did not matter enough to build. Some features got cut. Collaborative playlists, too complex for the timeline. Spotify preview integration, nice-to-have but not essential. Advanced filtering by genre or year, can add later if usage shows demand. What remained was the tightest possible loop. Sync collection, build playlists, run live sets. Solo building also meant accepting imperfection strategically. Good enough to be immediately useful shipped in six weeks beats theoretically perfect that never launches.',

    image: {
      url: '/img/projects/kallax/booth-context.png',
      alt: 'Kallax app displayed on phone next to turntables in a dark DJ booth environment',
      caption: 'Designed for the environment where it is actually used. Dark DJ booths with colored lighting, surrounded by physical records, often without internet. Yellow stands out without causing glare.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'Kallax is now live on both the App Store and Google Play. In the weeks since launch, it has found its way onto 150+ devices. The measure of success for a tool like this is not download numbers or engagement metrics. It is trust. Do DJs trust Kallax when it matters? In the dark, without internet, in front of an audience? The professional DJs I know, friends who play clubs, radio shows, private events, are using it during live sets. No support questions about navigation or core functionality. Feature requests are refinements, not confusion about how things work. So far, yes.',

    notes: [
      'Building everything solo from concept through distribution took focused work across the holiday period. Timeline possible because every decision optimized for shipping over perfection.',
      'The privacy-first architecture that started as a velocity hack became the app\'s core identity. DJs appreciate that collection data never leaves their device, no monthly subscription, honest about what it can and cannot do.',
      'The IKEA Kallax shelving reference lands immediately with vinyl collectors. It signals this was made by someone who understands the culture without needing to explain.',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'Designing and building Kallax end-to-end taught me that constraints force honesty in product design. When you cannot hide behind engineering will figure that out or we will improve that later, every feature has to justify its existence immediately. The biggest shift in thinking. Designing for 67% coverage instead of 100% perfection. Most tools overpromise. Kallax does less, but what it does it does honestly. That turned out to be more respectful to users than pretending certainty where none exists.',

    openQuestions: [
      'Will DJs pay for a tool that solves a real problem they have lived with for years, or has free software trained everyone to expect everything for nothing?',
      'Can a solo-built app compete long-term with venture-backed competitors who can afford to lose money gaining market share?',
      'Does the vinyl DJ community even want new software, or are they fundamentally satisfied with their current fragmented workflows?',
    ],

    nextSteps: [
      'Watch how DJs who are not friends or beta testers actually use it in the wild. Strangers who found it in the store with no context.',
      'Potential future directions. Crowdsourced BPM database, AI-powered playlist suggestions for harmonic mixing, better crate organization for large collections, key detection.',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/kallax/flows.png',
      alt: 'User flow diagrams showing first-time setup, creating playlists, starting live sets, and managing collection',
      caption: 'User journey deliberately kept shallow. Three tabs, clear hierarchy. Collection to Playlists to Live Mode. No hidden features, no complex navigation patterns.',
    },
    {
      url: '/img/projects/kallax/bangers-favourites.png',
      alt: 'HOT tracks list showing favorited tracks with BPM sorting',
      caption: 'HOT tab: your working crate of favorited tracks, sortable by BPM or alphabetically. The tracks you reach for most often, always at your fingertips.',
    },
    {
      url: '/img/projects/kallax/storefront.png',
      alt: 'Google Play Store listing showing Kallax app page with screenshots',
      caption: 'Live on both platforms. Six weeks from first commit to app store approval.',
    },
  ],
}
