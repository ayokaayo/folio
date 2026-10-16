import type { SideProject } from './types'

export const exoticaRadio: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'exotica-radio',
  hashtag: '#Music',
  year: '2017 to present',
  title: 'Exotica Radio',
  subtitle:
    'The radio that never stops travelling, now in its third life as Storybook Earth: a hand-drawn planet the player flies, sails and drives across, from one record\'s home to the next',
  status: 'live',

  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // ─────────────────────────────────────────────────────────────
  description:
    'An independent internet radio station that travels the world in time with its own broadcast. Version 3.0 repaints the journey on Storybook Earth, a hand-drawn globe of drawn forests, hatched savanna, winding rivers and contour-lined seas, where a plane, a sailboat, a train and a car carry each track to its artist\'s home. 1,854 tracks from 523 cities in 90 countries, streaming 24/7.',
  cardSummary:
    'Independent radio since 2017, now in its third version: a hand-drawn globe the player travels in sync with the broadcast, from each record\'s home to the next. 1,854 tracks, 90 countries.',
  imageUrl: '/img/projects/exotica-radio/cover-3.jpg',
  imageAlt: 'Exotica Radio cover: the round EXR badge and the address www.exotica.radio over a hand-drawn map of South East Asia, with forests of tiny trees, winding rivers, contour lines rippling round every coast, a small white sailboat on an orange route out of Manila, and a dusk sky on the horizon',

  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // ─────────────────────────────────────────────────────────────
  timeline: '2017 to present · 3.0, Storybook Earth, in 2026',
  role: 'Creator, curator, developer',
  techStack: [
    'three.js',
    'JavaScript',
    'Python',
    'PMTiles',
    'SQLite',
    'AzuraCast',
    'Icecast',
    'Docker',
  ],
  tags: ['internet radio', 'illustrated globe', 'crate digging'],

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
      'To share my music collection with the world, and to make listening feel like travelling.',

    spark:
      'Exotica Radio started in 2017 because streaming was built for major labels, not collectors: half my records weren\'t on Spotify, and the platform buried what it did have. So I built my own station, a single page with one play button, and it quietly won, reaching #1 on Google, becoming the house station in bars and playing on every continent. The second version, earlier in 2026, put every record on a satellite map and sent the player travelling between them, and it worked, but a satellite photo can only tell you where a place is. Version 3.0 is my answer to what a place feels like: the whole planet redrawn by hand, so the journey reads like the record sleeves it comes from.',

    intent: [
      'Turn the stream into a shared journey: every listener travels the same route at the same moment',
      'Honour the geography of the collection, from Lagos to São Paulo to Istanbul, with a map as warm as the music',
      'Keep it fast and kind on every device, from a desktop to a phone on a slow connection',
      'Own the entire chain: domain, DNS, server, station, map tiles and player',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONTEXT
  // ─────────────────────────────────────────────────────────────
  context: {
    background:
      'The collection spans funk, disco, boogie, Afrobeat, bossa nova, space-age pop, Turkish psych, and music from corners of the world streaming services don\'t index. It grew through years of digging on every trip, and it has outgrown its player twice: first a play button over rotating travel photos that said nothing about where the music was from, then a satellite map that placed every record correctly but felt like any other map on the web.',

    quickContext:
      'Version 2.0 put the collection on a satellite map; 3.0 redraws the whole planet by hand and rebuilds the journey on top of it.',

    opportunity:
      'Open land-cover and terrain data now cover the whole planet in enough detail to paint it, tile formats like PMTiles let a single file serve a world map from cheap storage, and agent-assisted development lets one person build the baking pipeline, the globe renderer and the travel engine together. A hand-drawn world that would once have needed a studio of illustrators became something one curator could make.',

    audience:
      'The same people it always served: anyone who wants music that isn\'t fed to them by an algorithm, and anyone who ever read a record sleeve and wondered where the band was from.',
  },

  // ─────────────────────────────────────────────────────────────
  // CREATION
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach:
      'Three builds joined at the metadata. A Python pipeline identifies and geo-locates every track in the library; a second pipeline bakes the whole planet into a hand-drawn tile set; and the player, rebuilt on three.js for 3.0, turns both into a perpetual journey that flies, sails and drives between the homes of whatever the station broadcasts. The live stream is still the clock: the map moves because the music does.',

    features: [
      {
        title: 'Storybook Earth',
        description:
          'The satellite photography is gone, and in its place is a pen and wash illustration of the entire planet, baked from ESA\'s WorldCover land-cover survey and open terrain data. Forests are drawn as clusters of tiny trees, grassland and savanna are hatched, towns are soft patches of colour, rivers and lakes wind in turquoise, and the sea is engraved with contour lines that ripple round every coastline, while mountains rise as gentle clay relief, so the Andes stand up out of the map as the plane comes in to Lima.',
        image: {
          url: '/img/projects/exotica-radio/journey-andes.jpg',
          alt: 'The 3.0 player following a plane into Lima: the Andes rise in raised relief out of a hand-drawn map of forest and dry slopes, under a split-flap header reading AKR to LIM, the track Disco Hi-Life by Orlando Julius, and the departure and destination local times',
          caption: 'Coming in to Lima: the Andes in clay relief, the forest drawn tree by tree',
        },
      },
      {
        title: 'Detail Where You Look',
        description:
          'The planet streams as a tile pyramid from its own map subdomain, loading finer detail only where the camera is looking and where the vehicle is heading, so arrivals are sharp the moment you land. Every vertex takes its height from one global elevation grid, which means the plane, the boat, the route and the city markers sit exactly on the ground at any level of detail, and the globe paints coarse tiles first and refines them as the view asks, with a smaller tile budget on phones.',
        image: {
          url: '/img/projects/exotica-radio/map-detail.jpg',
          alt: 'A close view of the hand-drawn map leaving Amsterdam: hatched farmland, small clusters of drawn trees, salmon-pink towns, and a sea of fine engraved contour lines following the coast, with a sailboat on the orange route',
          caption: 'Leaving Amsterdam by sea: hatched fields, drawn woods and engraved water',
        },
      },
      {
        title: 'Four Ways to Travel',
        description:
          'Every leg is travelled by the right vehicle, each a small 3D model: a cartoon plane with its own propeller for the long hauls, a sailboat that sails port to port, and a train or a car overland. Roads and railways come from real routing services, sea legs follow shipping routes between the nearest real ports, and the camera follows like a crane behind the vehicle or pulls back to show the whole route, easing between the two without a jump.',
        image: {
          url: '/img/projects/exotica-radio/journey-sea-3.jpg',
          alt: 'A white sailboat following the orange route close to a steep, hand-drawn coastline, with contour lines rippling out from the shore and the rest of the route into Lima drawn ahead across the sea',
          caption: 'Sea legs run port to port, along real shipping routes',
        },
      },
      {
        title: 'A New Arrivals Board',
        description:
          'The boarding pass of 2.0 became one calm header over the globe: split-flap airport codes for the departure and the destination, the track set large with the artist and year beneath, the local time at both ends with the time difference, the length of the leg, the distance still to go and when you will land. A small now spinning card carries the cover art, a link to own the record on Discogs, the number of people listening and the kilometres travelled so far.',
        image: {
          url: '/img/projects/exotica-radio/voyage-header.jpg',
          alt: 'The 3.0 header: Ekiti by air to Lima, split-flap codes AKR and LIM, the title Disco Hi-Life by Orlando Julius, 2024, and the departure time, the leg of 9,359 km and the arrival time with a six-hour difference',
          caption: 'Where you are, where you are going and when you will land',
        },
      },
      {
        title: 'Live for Everyone',
        description:
          'The player still follows the real broadcast rather than a shuffle per listener, so someone in Tokyo and someone in Buenos Aires watch the same sailboat cross the same sea at the same moment, and every leg lands as its song ends.',
      },
      {
        title: 'The Geo Pipeline',
        description:
          'A Python pipeline fingerprints every file, identifies it through AcoustID and MusicBrainz, cross-checks Discogs, geocodes the origin, and sends what the databases miss to Claude for batch research, with a human review queue for the rest. It also snaps each track to its nearest real seaport, so sea legs start and end where a boat could. 1,854 tracks are placed in 523 cities across 90 countries.',
      },
      {
        title: 'Exotica Island',
        description:
          'Eighteen tracks resisted every pass, six with no tags and no fingerprint match and twelve with a name but no origin anyone could trace. They live on an invented island in the remote South Pacific, and on Storybook Earth the sailboat sails there from any port, with its own code on the board: EXR.',
        image: {
          url: '/img/projects/exotica-radio/exotica-island.jpg',
          alt: 'A sailboat arriving at the Exotica Island marker in the open Pacific, with contour rings around tiny islands in the sea, under the header Lima by sea to Exotica Island, LIM to EXR',
          caption: 'Lima to EXR: the island where the mysteries live',
        },
      },
      {
        title: 'The Station',
        description:
          'Self-hosted AzuraCast runs the broadcast 24/7 with three mounts: MP3 320 for everyone, AAC 256 for good gear and lossless FLAC for the faithful. The original one-button site lives on as the Classic player, one tap from the splash, for anyone who only wants the music; for eight years the whole radio was that button, and now the button is a world.',
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
      'Drew the world instead of photographing it. A satellite map is accurate but anonymous, while an illustration can be just as true to the land cover and the terrain and still carry the warmth of the music, so the art is generated from real data and never invented.',
      'Baked the planet once rather than drawing it live. The illustration is rendered offline into a tile pyramid and served as archive files, so the browser only streams small images and the globe stays fast on a phone.',
      'Separated the shape of the world from its picture. Heights come from one elevation grid shared by the terrain, the routes, the vehicles and the camera, so nothing floats or sinks however much detail has loaded.',
      'Respected every device and every listener: a smaller tile budget and larger tap targets on phones, less motion for those who ask their system for it, anonymous statistics only with consent, and no account and no ads.',
      'Previewed the new globe on its own subdomain while the 2.0 player stayed live, the same parallel cutover that moved the station off its managed host without the stream ever going down.',
      'Kept a lossless FLAC mount although almost nobody streams FLAC, because the source library is lossless and a station built on conviction should offer the real thing.',
    ],

    exploration:
      'The map is still only as good as the catalogue, so the editorial work carried over: 129 tracks with no usable tags were fingerprinted and 100 identified, 89 origins were corrected by hand research, and diaspora artists are placed case by case. 3.0 added a new kind of judgement, cartographic rather than musical: how much to exaggerate the relief, how fine the pen work can be before it turns to hairlines on a sharp screen, and how much detail to load before arriving over a city stops reading as detail being erased.',

    image: {
      url: '/img/projects/exotica-radio/journey-coast.jpg',
      alt: 'The plane following its route along the West African coast on the hand-drawn globe: an engraved sea on the left, a coastline of drawn forest, hatched savanna, salmon-pink towns and a long turquoise lake, under the 3.0 header',
      caption: 'The West African coast, drawn from land-cover data: forest, savanna, towns and lakes',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // OUTCOME
  // ─────────────────────────────────────────────────────────────
  outcome: {
    summary:
      'Exotica Radio 3.0 is live at exotica.radio, streaming around the clock with Storybook Earth in front. Everything the station earned carried over, from the #1 Google result for "exotica radio" to the aggregators that found it on their own and the bars that treat it as their house station, and now the journey looks the way the music sounds.',

    quickItems: [
      'A hand-drawn globe of the whole planet, baked from real land-cover and terrain data',
      'Plane, sailboat, train and car, routed over real roads, railways and sea lanes',
      'A new arrivals board with local times at both ends',
      '1,854 tracks from 523 cities in 90 countries, live 24/7',
    ],

    notes: [
      '1,854 tracks placed in 523 cities across 90 countries, one of them Exotica Island, home to the 18 that will not be found',
      'The whole planet baked to a hand-drawn tile pyramid, land down to zoom level 8, served from the radio\'s own map subdomain',
      'Three stream mounts up to lossless FLAC, loudness-normalised track to track',
      'No account, no ads, and anonymous listening statistics only for those who allow them',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight:
      'The 2017 lesson held: build something real and keep it running, and the audience finds you. 2.0 taught me that data quality is curation, and 3.0 adds that a map is curation too, because choosing how the world is drawn says as much about a station as choosing what it plays, and the right drawing can make a stranger feel at home somewhere they have never been.',

    quickInsight:
      'A map is curation too: drawing the world by hand made the journey feel like the music.',

    openQuestions: [
      'Channels per crate: disco, groove and feel-good as separate journeys?',
      'A way to support the original artists directly through the stream',
    ],

    nextSteps: [
      'Keep digging, keep travelling, keep adding cities to the map',
      'The radio runs as long as there is music to share',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────────────────────────
  gallery: [
    {
      url: '/img/projects/exotica-radio/splash-3.jpg',
      alt: 'The splash screen over a photo from an aeroplane window: the EXR badge, Exotica Radio, come where the pleasure is, and a yellow Travel and Listen button above a link to the Classic player',
      caption: 'The invitation: come where the pleasure is',
    },
    {
      url: '/img/projects/exotica-radio/mobile-3.jpg',
      alt: 'The 3.0 player on a phone: the split-flap header from Ekiti to Lima, the plane over the engraved sea, the now spinning card and the control bar',
      caption: 'The journey fits in a pocket',
    },
    {
      url: '/img/projects/exotica-radio/classic-3.jpg',
      alt: 'The Classic player: a pause button and the now playing track, La Rumba del Chinito by Compay Quinto, over a photo from an aeroplane window',
      caption: 'The Classic player: the 2017 radio preserved inside the new one',
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
