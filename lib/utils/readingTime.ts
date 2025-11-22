/**
 * Calculate reading time from text content
 * Standard reading speed: ~250 words per minute
 */

const WORDS_PER_MINUTE = 250

/**
 * Count words in a string
 */
function countWords(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length
}

/**
 * Calculate reading time in minutes from word count
 */
function calculateReadingTimeMinutes(wordCount: number): number {
  return Math.ceil(wordCount / WORDS_PER_MINUTE)
}

/**
 * Format reading time as a human-readable string
 * Returns format like "90 sec" or "4 min"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min'
  } else if (minutes === 1) {
    return '1 min'
  } else if (minutes < 2) {
    // For times between 1-2 minutes, show in seconds
    const seconds = minutes * 60
    return `${Math.round(seconds)} sec`
  } else {
    return `${minutes} min`
  }
}

/**
 * Calculate reading time from a single text string
 */
export function calculateReadingTime(text: string): string {
  const wordCount = countWords(text)
  const minutes = calculateReadingTimeMinutes(wordCount)
  return formatReadingTime(minutes)
}

/**
 * Calculate reading time from multiple text strings (e.g., array of items)
 */
export function calculateReadingTimeFromArray(texts: string[]): string {
  const totalWords = texts.reduce((sum, text) => sum + countWords(text), 0)
  const minutes = calculateReadingTimeMinutes(totalWords)
  return formatReadingTime(minutes)
}

/**
 * Calculate reading time from a case study based on visible content
 * This is a helper that extracts all text content from a case study object
 */
export function calculateCaseStudyReadingTime(
  caseStudy: {
    subtitle?: string
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

  // Always include subtitle
  if (caseStudy.subtitle) {
    texts.push(caseStudy.subtitle)
  }

  // Impact section
  if (caseStudy.impact) {
    if (mode === 'quick' && caseStudy.impact.quickItems) {
      texts.push(...caseStudy.impact.quickItems)
    } else if (mode === 'deep' && caseStudy.impact.deepItems) {
      texts.push(...caseStudy.impact.deepItems)
    } else {
      texts.push(...(caseStudy.impact.items || []))
    }
  }

  // Problem section
  if (caseStudy.problem) {
    if (mode === 'quick' && caseStudy.problem.quickContext) {
      texts.push(caseStudy.problem.quickContext)
    } else {
      texts.push(caseStudy.problem.context || '')
    }

    if (mode === 'quick' && caseStudy.problem.quickIssues) {
      texts.push(...caseStudy.problem.quickIssues)
    } else {
      texts.push(...(caseStudy.problem.issues || []))
    }
  }

  // Approach section
  if (caseStudy.approach?.decisions) {
    caseStudy.approach.decisions.forEach((decision) => {
      texts.push(decision.title || '')
      texts.push(decision.decision || '')
      if (mode === 'deep') {
        texts.push(decision.rationale || '')
      }
      texts.push(decision.result || '')
    })
  }

  // Design decisions (only in deep mode)
  if (mode === 'deep' && caseStudy.designDecisions) {
    caseStudy.designDecisions.forEach((decision) => {
      texts.push(decision.title || '')
      texts.push(decision.description || '')
    })
  }

  // Implementation section
  if (caseStudy.implementation) {
    if (mode === 'quick' && caseStudy.implementation.quickTechnical) {
      texts.push(...caseStudy.implementation.quickTechnical)
    } else {
      texts.push(...(caseStudy.implementation.technical || []))
    }
    if (mode === 'deep') {
      texts.push(...(caseStudy.implementation.rollout || []))
    }
  }

  // Validation section
  if (caseStudy.validation) {
    if (mode === 'quick' && caseStudy.validation.quickOutcomes) {
      texts.push(...caseStudy.validation.quickOutcomes)
    } else {
      texts.push(...(caseStudy.validation.outcomes || []))
    }
    if (mode === 'deep') {
      texts.push(...(caseStudy.validation.feedback || []))
      texts.push(...(caseStudy.validation.technical || []))
    }
  }

  // Learned section
  if (caseStudy.learned) {
    if (mode === 'quick' && caseStudy.learned.quickInsight) {
      texts.push(caseStudy.learned.quickInsight)
    } else {
      texts.push(...(caseStudy.learned.worked || []))
      texts.push(caseStudy.learned.insight || '')
      if (mode === 'deep' && caseStudy.learned.challenges) {
        caseStudy.learned.challenges.forEach((challenge) => {
          texts.push(challenge.challenge || '')
          texts.push(challenge.solution || '')
        })
      }
    }
  }

  // Process section (only in deep mode)
  if (mode === 'deep' && caseStudy.process?.content) {
    texts.push(...caseStudy.process.content)
  }

  return calculateReadingTimeFromArray(texts)
}

