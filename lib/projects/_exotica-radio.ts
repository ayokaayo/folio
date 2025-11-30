import type { SideProject } from './types'

/**
 * Exotica Radio - An online radio station
 * 
 * A curated ambient, world music, and eclectic sounds streaming platform.
 * Built from the ground up - UI, streaming setup, and playlist curation.
 */

export const exoticaRadio: SideProject = {
  // ─────────────────────────────────────────────────────────────
  // CORE METADATA
  // ─────────────────────────────────────────────────────────────
  id: 'exotica-radio',
  hashtag: '#Radio',
  year: '2024',
  title: 'Exotica Radio',
  subtitle: 'A curated online radio station for ambient and world music',
  status: 'live',
  
  // ─────────────────────────────────────────────────────────────
  // CARD DISPLAY
  // This appears on the /projects listing page
  // ─────────────────────────────────────────────────────────────
  description: 'An online radio station playing curated ambient, world music, and eclectic sounds. Designed and built the platform end-to-end, from UI to streaming setup and playlist curation.',
  imageUrl: '/img/projects/exotica-radio/hero.png',
  imageAlt: 'Exotica Radio interface showing the player and current track',
  
  // ─────────────────────────────────────────────────────────────
  // HERO SECTION
  // Quick context for the detail page header
  // ─────────────────────────────────────────────────────────────
  timeline: '2024 (Ongoing)',
  role: 'Design, Development & Curation',
  techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Icecast', 'Liquidsoap'],
  
  // ─────────────────────────────────────────────────────────────
  // EXTERNAL LINKS
  // Side projects live outside portfolios - these get prominence
  // ─────────────────────────────────────────────────────────────
  links: [
    {
      label: 'Live Radio',
      url: 'https://www.exotica.radio',
      type: 'live',
    },
  ],
  
  // ─────────────────────────────────────────────────────────────
  // MISSION SECTION
  // Why does this exist? What's the creative intent?
  // ─────────────────────────────────────────────────────────────
  mission: {
    statement: 'To create a space for discovery through carefully curated soundscapes that blend ambient textures with world music traditions.',
    
    spark: 'I found myself constantly searching for music that matched a specific mood - something that could be background but also engaging. Most streaming services push you toward popular tracks, but I wanted something more intentional, more curated.',
    
    intent: [
      'Build a platform that prioritizes curation over algorithms',
      'Create a listening experience that encourages discovery',
      'Explore the intersection of ambient and world music traditions',
    ],
  },
  
  // ─────────────────────────────────────────────────────────────
  // CONTEXT SECTION
  // The space this project lives in.
  // ─────────────────────────────────────────────────────────────
  context: {
    background: 'Streaming services are great for finding specific songs, but they\'re not great for creating atmosphere. I wanted something that felt more like tuning into a radio station - where you trust the curation and let it take you somewhere.',
    
    opportunity: 'What if there was a radio station that played music you didn\'t know you wanted to hear? Something that blended ambient soundscapes with world music in a way that felt natural, not forced.',
    
    audience: 'People who want music for focus, relaxation, or just want to discover something new without the pressure of choosing.',
  },
  
  // ─────────────────────────────────────────────────────────────
  // CREATION SECTION
  // What you built and how you approached it.
  // ─────────────────────────────────────────────────────────────
  creation: {
    approach: 'Started with the streaming infrastructure - setting up Icecast server and Liquidsoap for playlist management. Then built a minimal web interface that puts the music first. The design is intentionally sparse, letting the music be the focus.',
    
    features: [
      {
        title: 'Live Player Interface',
        description: 'A minimal player that shows the current track and artist. No playlists, no skip buttons - just what\'s playing now. The interface updates in real-time as tracks change.',
      },
      {
        title: 'Curated Playlists',
        description: 'Hand-picked tracks that blend ambient textures with world music. Each playlist is crafted to create a specific mood or atmosphere, not just a collection of similar songs.',
      },
      {
        title: 'Streaming Infrastructure',
        description: 'Built on Icecast for reliable streaming and Liquidsoap for playlist management. The system runs 24/7, automatically transitioning between tracks and playlists.',
      },
    ],
  },
  
  // ─────────────────────────────────────────────────────────────
  // REFLECTION
  // What you took away personally.
  // ─────────────────────────────────────────────────────────────
  reflection: {
    insight: 'Sometimes the best projects are the ones that solve your own problem. Building something I actually wanted to use made all the technical challenges worth it.',
    
    openQuestions: [
      'How do you balance curation with discovery?',
      'What makes a good radio station in the age of on-demand streaming?',
    ],
  },
}
