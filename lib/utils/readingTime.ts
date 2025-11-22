/**
 * Calculate reading time from text content
 * Enhanced with variable reading speeds and automatic image type detection
 */

// Variable reading speeds based on content type
// Slower speeds to achieve: Quick read ~3+ min, Deep dive ~7-9+ min
const READING_SPEEDS = {
  HEADER: 56, // Headers/titles scanned quickly
  BULLET: 31, // Bullet points read slightly faster
  PARAGRAPH: 24, // Paragraphs read at realistic technical content speed
  SHORT: 44, // Short strings (< 20 words) scanned quickly
} as const

// Image viewing times (in seconds) based on automatically detected type
const IMAGE_VIEWING_TIMES = {
  cover: 3, // Cover images - quick glance
  screenshot: 5, // Simple screenshots
  mockup: 8, // UI mockups/previews
  annotated: 15, // Annotated screenshots
  chart: 25, // Charts/graphs - data interpretation
  diagram: 50, // Diagrams (flowcharts, architecture, system diagrams)
  map: 50, // Maps (geographic, user flows, journey maps)
  default: 12, // Default/unknown - medium complexity
} as const

type ImageType = keyof typeof IMAGE_VIEWING_TIMES

/**
 * Count words in a string
 */
function countWords(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length
}

/**
 * Detect image type from URL and alt text
 * Automatically classifies images based on keywords
 */
function detectImageType(imageUrl?: string, imageAlt?: string): ImageType {
  if (!imageUrl && !imageAlt) return 'default'

  const searchText = `${imageUrl || ''} ${imageAlt || ''}`.toLowerCase()

  // Check for complex visual content first (diagrams, maps)
  if (
    searchText.includes('diagram') ||
    searchText.includes('architecture') ||
    searchText.includes('flowchart') ||
    searchText.includes('system diagram') ||
    searchText.includes('component diagram')
  ) {
    return 'diagram'
  }

  if (
    searchText.includes('map') ||
    searchText.includes('user flow') ||
    searchText.includes('journey map') ||
    searchText.includes('user journey')
  ) {
    return 'map'
  }

  // Check for charts and graphs
  if (
    searchText.includes('chart') ||
    searchText.includes('graph') ||
    searchText.includes('analytics')
  ) {
    return 'chart'
  }

  // Check for annotated content
  if (
    searchText.includes('annotated') ||
    searchText.includes('labeled') ||
    searchText.includes('marked up')
  ) {
    return 'annotated'
  }

  // Check for cover images (must be explicit - header in path is usually a cover)
  if (
    searchText.includes('cover') ||
    (imageUrl?.toLowerCase().includes('header') && !searchText.includes('diagram') && !searchText.includes('map'))
  ) {
    return 'cover'
  }

  // Check for mockups
  if (
    searchText.includes('mockup') ||
    searchText.includes('preview') ||
    searchText.includes('design')
  ) {
    return 'mockup'
  }

  // Default to screenshot for simple images
  if (searchText.includes('screenshot') || searchText.includes('interface')) {
    return 'screenshot'
  }

  return 'default'
}

/**
 * Get viewing time in seconds for an image based on its type
 */
function getImageViewingTime(imageType: ImageType): number {
  return IMAGE_VIEWING_TIMES[imageType]
}

/**
 * Calculate reading time in minutes from word count and content type
 * Returns raw decimal value (will be rounded at the end)
 */
function calculateReadingTimeMinutes(
  wordCount: number,
  contentType: 'header' | 'bullet' | 'paragraph' | 'short' = 'paragraph'
): number {
  const wpm = READING_SPEEDS[contentType.toUpperCase() as keyof typeof READING_SPEEDS] || READING_SPEEDS.PARAGRAPH
  return wordCount / wpm
}

/**
 * Determine content type based on text characteristics
 */
function detectContentType(text: string): 'header' | 'bullet' | 'paragraph' | 'short' {
  const wordCount = countWords(text)
  
  // Short strings are scanned quickly
  if (wordCount < 20) {
    return 'short'
  }
  
  // Headers are typically short and in title case or all caps
  if (wordCount < 10 && (text === text.toUpperCase() || /^[A-Z]/.test(text))) {
    return 'header'
  }
  
  // Bullet points are typically medium length
  if (wordCount < 50) {
    return 'bullet'
  }
  
  // Longer content is paragraph
  return 'paragraph'
}

/**
 * Format reading time as a human-readable string
 * Returns format like "90 sec" or "4 min"
 * Always rounds to whole numbers
 */
export function formatReadingTime(minutes: number): string {
  // Round to nearest minute (or second for short times)
  const roundedMinutes = Math.round(minutes)
  
  if (roundedMinutes < 1) {
    // For less than 1 minute, show in seconds
    const seconds = Math.round(minutes * 60)
    if (seconds < 1) {
      return '< 1 min'
    }
    return `${seconds} sec`
  } else if (roundedMinutes === 1) {
    return '1 min'
  } else {
    return `${roundedMinutes} min`
  }
}

/**
 * Calculate reading time from a single text string
 */
export function calculateReadingTime(text: string): string {
  const wordCount = countWords(text)
  const contentType = detectContentType(text)
  const minutes = calculateReadingTimeMinutes(wordCount, contentType)
  return formatReadingTime(minutes)
}

/**
 * Calculate reading time from multiple text strings (e.g., array of items)
 * Uses appropriate reading speed for each item
 */
export function calculateReadingTimeFromArray(texts: string[]): string {
  let totalMinutes = 0

  texts.forEach((text) => {
    const wordCount = countWords(text)
    const contentType = detectContentType(text)
    totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
  })

  return formatReadingTime(totalMinutes)
}

/**
 * Calculate total image viewing time for a case study
 */
function calculateImageTime(
  caseStudy: {
    imageUrl?: string
    imageAlt?: string
    coverImageUrl?: string
    coverImageAlt?: string
  },
  mode: 'quick' | 'deep'
): number {
  let totalSeconds = 0

  // In quick mode, only count cover image (or main image if no cover)
  if (mode === 'quick') {
    if (caseStudy.coverImageUrl) {
      const imageType = detectImageType(caseStudy.coverImageUrl, caseStudy.coverImageAlt)
      totalSeconds += getImageViewingTime(imageType)
    } else if (caseStudy.imageUrl) {
      const imageType = detectImageType(caseStudy.imageUrl, caseStudy.imageAlt)
      totalSeconds += getImageViewingTime(imageType)
    }
  } else {
    // In deep mode, count all images
    if (caseStudy.coverImageUrl) {
      const imageType = detectImageType(caseStudy.coverImageUrl, caseStudy.coverImageAlt)
      totalSeconds += getImageViewingTime(imageType)
    }
    if (caseStudy.imageUrl) {
      const imageType = detectImageType(caseStudy.imageUrl, caseStudy.imageAlt)
      totalSeconds += getImageViewingTime(imageType)
    }
  }

  return totalSeconds
}

/**
 * Calculate reading time from a case study based on visible content
 * Enhanced with variable reading speeds and automatic image detection
 */
export function calculateCaseStudyReadingTime(
  caseStudy: {
    subtitle?: string
    imageUrl?: string
    imageAlt?: string
    coverImageUrl?: string
    coverImageAlt?: string
    impact?: { items?: string[]; quickItems?: string[]; deepItems?: string[] }
    problem?: {
      context?: string
      quickContext?: string
      issues?: string[]
      quickIssues?: string[]
    }
    approach?: {
      decisions?: Array<{
        title?: string
        decision?: string
        rationale?: string
        result?: string
      }>
    }
    designDecisions?: Array<{ title?: string; description?: string }>
    implementation?: {
      technical?: string[]
      quickTechnical?: string[]
      rollout?: string[]
    }
    validation?: {
      outcomes?: string[]
      quickOutcomes?: string[]
      feedback?: string[]
      technical?: string[]
    }
    learned?: {
      worked?: string[]
      insight?: string
      quickInsight?: string
      challenges?: Array<{ challenge?: string; solution?: string }>
    }
    process?: { content?: string[] }
  },
  mode: 'quick' | 'deep'
): string {
  const texts: string[] = []
  let totalMinutes = 0

  // Always include subtitle (treated as short/header)
  if (caseStudy.subtitle) {
    const wordCount = countWords(caseStudy.subtitle)
    const contentType = detectContentType(caseStudy.subtitle)
    totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
  }

  // Impact section
  if (caseStudy.impact) {
    const impactItems =
      mode === 'quick' && caseStudy.impact.quickItems
        ? caseStudy.impact.quickItems
        : mode === 'deep' && caseStudy.impact.deepItems
        ? caseStudy.impact.deepItems
        : caseStudy.impact.items || []

    impactItems.forEach((item) => {
      const wordCount = countWords(item)
      const contentType = detectContentType(item)
      totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
    })
  }

  // Problem section
  if (caseStudy.problem) {
    const context =
      mode === 'quick' && caseStudy.problem.quickContext
        ? caseStudy.problem.quickContext
        : caseStudy.problem.context || ''

    if (context) {
      const wordCount = countWords(context)
      const contentType = detectContentType(context)
      totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
    }

    const issues =
      mode === 'quick' && caseStudy.problem.quickIssues
        ? caseStudy.problem.quickIssues
        : caseStudy.problem.issues || []

    issues.forEach((issue) => {
      const wordCount = countWords(issue)
      const contentType = detectContentType(issue)
      totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
    })
  }

  // Approach section
  if (caseStudy.approach?.decisions) {
    caseStudy.approach.decisions.forEach((decision) => {
      // Title (header)
      if (decision.title) {
        const wordCount = countWords(decision.title)
        totalMinutes += calculateReadingTimeMinutes(wordCount, 'header')
      }
      // Decision (short/bullet)
      if (decision.decision) {
        const wordCount = countWords(decision.decision)
        const contentType = detectContentType(decision.decision)
        totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
      }
      // Rationale (paragraph, only in deep mode)
      if (mode === 'deep' && decision.rationale) {
        const wordCount = countWords(decision.rationale)
        totalMinutes += calculateReadingTimeMinutes(wordCount, 'paragraph')
      }
      // Result (short/bullet)
      if (decision.result) {
        const wordCount = countWords(decision.result)
        const contentType = detectContentType(decision.result)
        totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
      }
    })
  }

  // Design decisions (only in deep mode)
  if (mode === 'deep' && caseStudy.designDecisions) {
    caseStudy.designDecisions.forEach((decision) => {
      // Title (header)
      if (decision.title) {
        const wordCount = countWords(decision.title)
        totalMinutes += calculateReadingTimeMinutes(wordCount, 'header')
      }
      // Description (paragraph)
      if (decision.description) {
        const wordCount = countWords(decision.description)
        totalMinutes += calculateReadingTimeMinutes(wordCount, 'paragraph')
      }
    })
  }

  // Implementation section
  if (caseStudy.implementation) {
    const technicalItems =
      mode === 'quick' && caseStudy.implementation.quickTechnical
        ? caseStudy.implementation.quickTechnical
        : caseStudy.implementation.technical || []

    technicalItems.forEach((item) => {
      const wordCount = countWords(item)
      const contentType = detectContentType(item)
      totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
    })

    if (mode === 'deep' && caseStudy.implementation.rollout) {
      caseStudy.implementation.rollout.forEach((item) => {
        const wordCount = countWords(item)
        const contentType = detectContentType(item)
        totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
      })
    }
  }

  // Validation section
  if (caseStudy.validation) {
    const outcomes =
      mode === 'quick' && caseStudy.validation.quickOutcomes
        ? caseStudy.validation.quickOutcomes
        : caseStudy.validation.outcomes || []

    outcomes.forEach((item) => {
      const wordCount = countWords(item)
      const contentType = detectContentType(item)
      totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
    })

    if (mode === 'deep') {
      if (caseStudy.validation.feedback) {
        caseStudy.validation.feedback.forEach((item) => {
          const wordCount = countWords(item)
          const contentType = detectContentType(item)
          totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
        })
      }
      if (caseStudy.validation.technical) {
        caseStudy.validation.technical.forEach((item) => {
          const wordCount = countWords(item)
          const contentType = detectContentType(item)
          totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
        })
      }
    }
  }

  // Learned section
  if (caseStudy.learned) {
    if (mode === 'quick' && caseStudy.learned.quickInsight) {
      const wordCount = countWords(caseStudy.learned.quickInsight)
      const contentType = detectContentType(caseStudy.learned.quickInsight)
      totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
    } else {
      if (caseStudy.learned.worked) {
        caseStudy.learned.worked.forEach((item) => {
          const wordCount = countWords(item)
          const contentType = detectContentType(item)
          totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
        })
      }
      if (caseStudy.learned.insight) {
        const wordCount = countWords(caseStudy.learned.insight)
        totalMinutes += calculateReadingTimeMinutes(wordCount, 'paragraph')
      }
      if (mode === 'deep' && caseStudy.learned.challenges) {
        caseStudy.learned.challenges.forEach((challenge) => {
          if (challenge.challenge) {
            const wordCount = countWords(challenge.challenge)
            const contentType = detectContentType(challenge.challenge)
            totalMinutes += calculateReadingTimeMinutes(wordCount, contentType)
          }
          if (challenge.solution) {
            const wordCount = countWords(challenge.solution)
            totalMinutes += calculateReadingTimeMinutes(wordCount, 'paragraph')
          }
        })
      }
    }
  }

  // Process section (only in deep mode)
  if (mode === 'deep' && caseStudy.process?.content) {
    caseStudy.process.content.forEach((item) => {
      const wordCount = countWords(item)
      totalMinutes += calculateReadingTimeMinutes(wordCount, 'paragraph')
    })
  }

  // Add image viewing time
  const imageSeconds = calculateImageTime(caseStudy, mode)
  const imageMinutes = imageSeconds / 60
  totalMinutes += imageMinutes

  // Round to nearest 0.1 minute for more reasonable display, then format
  const roundedMinutes = Math.round(totalMinutes * 10) / 10
  return formatReadingTime(roundedMinutes)
}
