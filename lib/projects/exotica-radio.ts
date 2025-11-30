import type { SideProject } from './types'

export const exoticaRadio: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'exotica-radio',
  hashtag: '#Music',
  year: '2017–Present',
  title: 'Exotica Radio',
  subtitle: 'A global music stream built on conviction, given freely to the world',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description: 'An independent internet radio station streaming my personal music collection 24/7. Built to share music on my own terms, now played worldwide. Ranks #1 on Google despite breaking every SEO convention.',
  imageUrl: '/img/projects/exotica-radio/hero.png',
  imageAlt: 'Exotica Radio interface showing play button with rotating travel photography background',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: '2017–Present (8 years running)',
  role: 'Creator, Curator, Developer',
  techStack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Shoutcast'],

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
    statement: 'To share my music collection with the world, freely and without compromise.',

    spark: 'In 2017, promoters were asking for Spotify playlists but I couldn\'t find half the music I owned on vinyl. Worse, when I searched for what Spotify did have, my playlists barely surfaced despite having traffic. I started digging into why. What I found was a system built for major labels, not independent curators. Even dead artists were being monetised by corporations that had nothing to do with the music. I realised if I wanted to share music properly, I\'d have to build the platform myself.',

    intent: [
      'Create a space where the music I love could exist outside the streaming economy',
      'Share a lifetime of digging and collecting with anyone who wanted to listen',
      'Prove that independent radio could compete without playing by platform rules',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'I travel constantly for work, for pleasure, and increasingly to dig for records. Every city has crates worth exploring. Over the years this turned into a collection that spans funk, disco, boogie, Afrobeat, bossa nova, space-age pop, and music from corners of the world most streaming services don\'t know exist. The collection outgrew any single playlist format.',

    opportunity: 'Internet radio felt like the honest format. No algorithm deciding what gets heard. No royalty shell game. Just a stream, running 24/7, playing what I think sounds good together. The idea that someone in Tokyo and someone in Buenos Aires could be hearing the same obscure track at the same moment felt worth building.',

    audience: 'Anyone who wants music that isn\'t fed to them by an algorithm. Coffee shops and bars that need a background vibe without ads. People who remember what radio used to feel like.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'I wanted the site to be as simple as the idea: press play, hear music. No sign-ups, no trackers, no content marketing. Just a big play button over rotating images from Unsplash that evoke travel and distant places. Everything hand-coded: HTML, CSS, JavaScript hooked to a Shoutcast server. The backoffice is PHP, also hand-built, so I have complete control over the stream. All the branding, from the logo to the visual identity, is designed by me.',

    features: [
      {
        title: 'Single-Page Interface',
        description: 'One page. One button. Background images rotate through curated photography from Unsplash, evoking the feeling of travel and discovery. No about page, no contact form, no text to scroll through. The music is the content.',
      },
      {
        title: 'Weighted Playlist System',
        description: 'The stream isn\'t random. I built a system that picks from genre-weighted crates and distributes tracks throughout the day. Office hours get medium energy and steady drive. Nights shift toward deeper cuts and higher intensity. It sounds human because the rules are based on how I\'d actually DJ.',
      },
      {
        title: 'Custom Backoffice',
        description: 'A PHP dashboard I built to monitor everything: current listeners, geographic spread, most-played tracks, peak times. The Shoutcast ASCI configuration feeds it all. Total control, no third-party analytics.',
      },
    ],

    images: [
      {
        url: '/img/projects/exotica-radio/interface.png',
        alt: 'Exotica Radio main interface with play button and travel photography',
        caption: 'The entire site: a play button and the world',
      },
      {
        url: '/img/projects/exotica-radio/backoffice.png',
        alt: 'Custom PHP backoffice showing listener stats and track history',
        caption: 'Hand-built backoffice for complete stream control',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRAFT
  // ─────────────────────────────────────────────────────────────
  craft: {
    decisions: [
      'No text content, no blog, no SEO optimisation. Just the stream. I figured if the music was good and the site stayed up, the right people would find it.',
      'Hand-coded everything instead of using a CMS or framework. More work upfront, but zero dependencies and complete control over every detail.',
      'Weighted playlists over pure random. True shuffle sounds chaotic. The energy curve throughout the day makes it feel curated even when I\'m not touching it.',
      'Self-hosted Shoutcast instead of using a streaming platform. More infrastructure to manage, but no middleman, no fees, no terms of service that could change.',
    ],

    exploration: 'The hardest part was making 2,000+ tracks from wildly different genres sound cohesive. Funk into Afrobeat into space-age pop into Turkish psych. It can feel jarring if sequenced wrong. I spent months tweaking the weighting system, adjusting energy curves, and learning what transitions work. The solution wasn\'t technical; it was curatorial. I had to think like a DJ programming a radio station, not an engineer building a shuffle algorithm.',

    image: {
      url: '/img/projects/exotica-radio/listeners.png',
      alt: 'World map showing listener distribution across continents',
      caption: 'A genuinely global audience. The music reaches every continent.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary: 'Exotica Radio ranks #1 on Google for "exotica radio", beating myTuner, Live365, AccuRadio, and every other aggregator. A single-page site with no text content, competing against platforms with thousands of pages and dedicated SEO teams. I still don\'t fully understand how, but eight years of consistency and a .radio domain probably helped.',

    notes: [
      'Bars and coffee shops have written to say they\'ve been playing it nonstop for years and consider it their official station',
      'Listeners from every continent. The metrics dashboard shows a genuinely global spread',
      'Gig invitations came through the radio that never would have happened through Spotify playlists',
      'Listed on myTuner, liveonlineradio.net, and other aggregators. They found me, I didn\'t pitch them',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'The best SEO strategy turned out to be having no SEO strategy. Build something real, keep it running, and let the aggregators do the backlink work. Eight years of consistency beats any optimisation hack.',

    openQuestions: [
      'What would it take to make this sustainable without it becoming a business?',
      'Is there a way to support the original artists more directly through the stream?',
    ],

    nextSteps: [
      'Keep digging, keep travelling, keep adding to the collection',
      'The radio will run as long as I have music to share',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/exotica-radio/dj-set.png',
      alt: 'Live DJ set with Exotica Radio branding',
      caption: 'The radio extends into live sets',
    },
    {
      url: '/img/projects/exotica-radio/digging.png',
      alt: 'Record crates in a shop during a digging session',
      caption: 'Digging in New York City. The collection grows with every trip.',
    },
  ],
}
