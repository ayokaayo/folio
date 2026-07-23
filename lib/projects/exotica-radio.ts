import type { SideProject } from './types'

export const exoticaRadio: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'exotica-radio',
  hashtag: '#Music',
  year: '2017–Present',
  title: 'Exotica Radio',
  subtitle:
    'The radio that never stops traveling: a live station whose player journeys the world, track by track',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description:
    'An independent internet radio station rebuilt as a live world journey. Every track is placed on the globe by its artist\'s origin, and the player flies, sails, and drives between them in sync with the broadcast. 1,854 tracks from 91 countries, streaming 24/7.',
  cardSummary:
    'Independent radio since 2017, rebuilt in 2026 as a live world journey: the player travels the globe to each artist\'s origin, in sync for every listener. 1,854 tracks, 91 countries.',
  imageUrl: '/img/projects/exotica-radio/cover.jpg',
  imageAlt: 'Exotica Radio cover: the wordmark over the satellite globe',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: '2017 to present · rebuilt as the journey platform in 2026',
  role: 'Creator, curator, developer',
  techStack: [
    'MapLibre GL',
    'three.js',
    'JavaScript',
    'Python',
    'SQLite',
    'AzuraCast',
    'Icecast',
    'Docker',
  ],
  tags: ['internet radio', 'live map', 'crate digging'],

  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'Listen Live',
      url: 'https://www.exotica.radio',
      type: 'live',
    },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/exotica.radio/',
      type: 'other',
    },
    {
      label: 'YouTube',
      url: 'https://www.youtube.com/exoticaradio',
      type: 'other',
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // MISSION
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement:
      'To share my music collection with the world, and to make listening feel like traveling.',

    spark:
      'Exotica Radio started in 2017 because streaming was built for major labels, not collectors: half my records weren\'t on Spotify, and the platform buried what it did have. So I built my own station, a single page with one play button, and it quietly won. It reached #1 on Google, bars adopted it as their house station, and it played on every continent. But the site never showed what makes the collection special: every record comes from somewhere, dug up in some city, carrying its place with it. In 2026 I rebuilt the radio around that truth.',

    intent: [
      'Turn the stream into a shared journey: every listener travels the same route at the same moment',
      'Honor the geography of the collection, from Lagos to São Paulo to Istanbul',
      'Own the entire chain this time: domain, DNS, server, station, player',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background:
      'The collection spans funk, disco, boogie, Afrobeat, bossa nova, space-age pop, Turkish psych, and music from corners of the world streaming services don\'t index. It grew through years of digging on every trip, and by 2026 it had outgrown its player: a play button over rotating travel photos said nothing about where the music was from.',

    opportunity:
      'Three things lined up. Browser maps got good enough to render a satellite globe with 3D traffic on it. A small VPS became cheap enough to run an entire radio station. And AI-assisted development made it possible for one person to build a metadata pipeline, a world-map player, and a streaming backend in a matter of weeks. A rebuild that would once have needed a team became a summer project.',

    audience:
      'The same people it always served: anyone who wants music that isn\'t fed to them by an algorithm. Plus anyone who ever read a record sleeve and wondered where the band was from.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach:
      'Two builds joined at the metadata. A Python pipeline identifies and geo-locates every track in the library; a web player turns that data into a perpetual journey, flying, sailing, and driving between the origin countries of whatever the station broadcasts. The live stream is the clock: the map moves because the music does.',

    features: [
      {
        title: 'The Journey Player',
        description:
          'A satellite globe where every leg is travelled for real: planes for the long hauls, a sailboat between ports, a camper van and trains overland. Luggage-tag labels mark departure and arrival with airport codes, and each leg is timed to the track, wheels down as the song ends.',
        image: {
          url: '/img/projects/exotica-radio/journey-air.jpg',
          alt: 'The journey player mid-flight, a plane crossing the ocean with the route line behind it',
          caption: 'Mid-leg: the plane crosses to the next artist\'s origin while the track plays',
        },
      },
      {
        title: 'Live for Everyone',
        description:
          'The player follows the real broadcast, not a per-listener shuffle. Someone in Tokyo and someone in Buenos Aires watch the same plane cross the same ocean at the same moment. A boarding pass shows the artist, origin, year, and a Discogs link to own the record; tap the passenger for the artist\'s passport.',
        image: {
          url: '/img/projects/exotica-radio/boarding-pass.jpg',
          alt: 'The boarding-pass card showing the now-playing track with origin, year, and Discogs link',
          caption: 'Every track issues a boarding pass, flight number included',
        },
      },
      {
        title: 'The Geo Pipeline',
        description:
          'A Python pipeline fingerprints every file, identifies it through AcoustID and MusicBrainz, cross-checks Discogs, geocodes the origin, and sends what the databases miss to Claude for batch research. A human review queue settles the rest. 1,854 tracks placed across 91 countries.',
      },
      {
        title: 'Honest Routing',
        description:
          'The sailboat snaps to real ports and sails port to port. Overland routes follow roads and never cross water. Planes fly great circles. Nobody would notice a camper van driving across the Atlantic, but the whole point is that the journey is real.',
        image: {
          url: '/img/projects/exotica-radio/journey-sea.jpg',
          alt: 'A sailboat leg between two ports on the globe',
          caption: 'Sea legs run port to port on real shipping geography',
        },
      },
      {
        title: 'Exotica Island',
        description:
          'Eighteen tracks resisted every identification pass: no tags, no fingerprint match, no leads. They live on an invented island in the remote South Pacific, and the player flies its flag when one comes on. Every archive needs a place for its mysteries.',
      },
      {
        title: 'The Station',
        description:
          'Self-hosted AzuraCast running the broadcast 24/7 with three mounts: MP3 320 for everyone, AAC 256 for good gear, lossless FLAC for the faithful. The original one-button site lives on inside the player as the Classic view. For eight years the whole radio was that button; now the button is a world.',
        image: {
          url: '/img/projects/exotica-radio/before.jpg',
          alt: 'The original Exotica Radio site: a single play button over travel photography',
          caption: 'The entire site, 2017 to 2025: one play button and the world implied',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'Left the managed streaming host for a self-hosted station, migrated with a parallel cutover: the new stack was built and verified while the old one kept running, then DNS flipped. The stream never went down.',
      'Synced the visuals to the broadcast\'s elapsed time instead of shuffling per visitor. The prototype gave every listener a private random journey; going live turned the radio back into a shared place.',
      'Treated metadata as curation. Where is a diaspora artist from: the birthplace, or the city that shaped the sound? The pipeline flags them; I decide case by case.',
      'Kept a lossless FLAC mount although almost nobody streams FLAC. The source library is lossless, and a station built on conviction should offer the real thing.',
    ],

    exploration:
      'The map is only as good as the catalogue. 129 tracks carried no usable tags at all, so the pipeline audio-fingerprinted them and identified 100. Geo-integrity audits swept the whole atlas, and 89 origins were corrected through hand research. The hardest problems weren\'t technical: they were editorial calls about where music belongs on a map.',

    image: {
      url: '/img/projects/exotica-radio/departure-board.jpg',
      alt: 'Split-flap departure board showing landings, boarding, live listeners, and kilometres travelled',
      caption: 'The split-flap board tracks the journey: landings, boardings, live listeners, kilometres flown',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary:
      'The new platform is live at exotica.radio, streaming around the clock with the journey player in front. Everything the old radio earned carried over: still #1 on Google for "exotica radio", still listed by aggregators that found it on their own, still playing in bars that treat it as their house station. Only now the listeners can see where the music is taking them.',

    notes: [
      '1,854 tracks placed across 91 countries, with the United States, France, the UK, and Brazil leading the map',
      'Three stream mounts up to lossless FLAC, loudness-normalized track to track',
      'Rebuilt end to end in weeks of AI-assisted solo development, from metadata pipeline to globe to station',
      'The old station kept broadcasting through the entire migration; listeners never noticed the move',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight:
      'The 2017 lesson held: build something real and keep it running, and the audience finds you. The 2026 lesson is that data quality is curation too. Placing a record on the map takes the same judgment as placing it in a set, and no API will make that call for you.',

    openQuestions: [
      'Channels per crate: disco, groove, and feel-good as separate journeys?',
      'Cover art for the whole catalogue without losing the vinyl-first identity',
      'A way to support the original artists directly through the stream',
    ],

    nextSteps: [
      'Keep digging, keep traveling, keep adding countries to the map',
      'The radio runs as long as there is music to share',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/exotica-radio/splash.jpg',
      alt: 'The splash screen inviting the listener to travel and listen',
      caption: 'The invitation: come where the pleasure is',
    },
    {
      url: '/img/projects/exotica-radio/classic.jpg',
      alt: 'The Classic player view: a single play button over travel photography',
      caption: 'The Classic view: the 2017 radio preserved inside the new one',
    },
    {
      url: '/img/projects/exotica-radio/mobile.jpg',
      alt: 'The journey player running on a phone',
      caption: 'The journey fits in a pocket',
    },
    {
      url: '/img/projects/exotica-radio/dj-set.jpg',
      alt: 'Live DJ set with Exotica Radio branding',
      caption: 'The radio extends into live sets',
    },
    {
      url: '/img/projects/exotica-radio/digging.jpg',
      alt: 'Record crates in a shop during a digging session',
      caption: 'Digging in New York City. The collection grows with every trip.',
    },
  ],
}
