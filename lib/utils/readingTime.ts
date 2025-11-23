/**
 * Calculate reading time from text content
 * Simple calculation: 200 WPM standard reading speed + fixed image time
 */

// Standard reading speed (words per minute)
const WORDS_PER_MINUTE = 200

// Fixed image viewing time (in minutes)
const IMAGE_TIME_QUICK = 2 // minutes for quick read mode
const IMAGE_TIME_DEEP = 3 // minutes for deep dive mode

/**
 * Count words in a string or extract text from object
 */
function countWords(text: string | any): number {
  if (!text) return 0
  
  // Handle string
  if (typeof text === 'string') {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length
}

  // Handle objects - extract text from common properties
  if (typeof text === 'object' && text !== null) {
    let combinedText = ''
    
    // Extract from common object structures
    if (text.description && typeof text.description === 'string') combinedText += ' ' + text.description
    if (text.impact && typeof text.impact === 'string') combinedText += ' ' + text.impact
    if (text.category && typeof text.category === 'string') combinedText += ' ' + text.category
    if (text.quote && typeof text.quote === 'string') combinedText += ' ' + text.quote
    if (text.source && typeof text.source === 'string') combinedText += ' ' + text.source
    if (text.phase && typeof text.phase === 'string') combinedText += ' ' + text.phase
    if (Array.isArray(text.results)) {
      combinedText += ' ' + text.results.filter((r: any) => typeof r === 'string').join(' ')
    }
    if (Array.isArray(text.activities)) {
      combinedText += ' ' + text.activities.filter((a: any) => typeof a === 'string').join(' ')
    }
    
    if (combinedText.trim()) {
      return combinedText.trim().split(/\s+/).filter((word) => word.length > 0).length
    }
  }
  
  return 0
}

/**
 * Format reading time as a human-readable string
 * Returns format like "90 sec" or "4 min"
 * Always rounds to whole numbers
 */
export function formatReadingTime(minutes: number): string {
  // Round to nearest minute
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
  const minutes = wordCount / WORDS_PER_MINUTE
  return formatReadingTime(minutes)
}

/**
 * Calculate reading time from multiple text strings (e.g., array of items)
 */
export function calculateReadingTimeFromArray(texts: string[]): string {
  let totalWords = 0

  texts.forEach((text) => {
    totalWords += countWords(text)
  })

  const minutes = totalWords / WORDS_PER_MINUTE
  return formatReadingTime(minutes)
}

/**
 * Calculate reading time from a case study based on visible content
 * Simple calculation: word count / 200 WPM + fixed image time
 */
export function calculateCaseStudyReadingTime(
  caseStudy: {
    subtitle?: string
    impact?: { items?: string[]; quickItems?: string[]; deepItems?: string[] }
    problem?: {
      context?: string
      quickContext?: string
      issues?: Array<string | { category?: string; description: string; impact?: string }>
      quickIssues?: string[]
      whyItMattered?: string[]
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
      rollout?: Array<string | { phase: string; activities: string[] }>
    }
    validation?: {
      outcomes?: Array<string | { category: string; results: string[] }>
      quickOutcomes?: string[]
      feedback?: Array<string | { quote: string; source?: string }>
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
  let totalWords = 0

  // Always include subtitle
  if (caseStudy.subtitle) {
    totalWords += countWords(caseStudy.subtitle)
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
      totalWords += countWords(item)
    })
  }

  // Problem section
  if (caseStudy.problem) {
    const context =
      mode === 'quick' && caseStudy.problem.quickContext
        ? caseStudy.problem.quickContext
        : caseStudy.problem.context || ''

    if (context) {
      totalWords += countWords(context)
    }

    const issues =
      mode === 'quick' && caseStudy.problem.quickIssues
        ? caseStudy.problem.quickIssues
        : caseStudy.problem.issues || []

    issues.forEach((issue: any) => {
      // Handle both string and object formats
      if (typeof issue === 'string') {
        totalWords += countWords(issue)
      } else if (typeof issue === 'object' && issue !== null) {
        // Extract text from object properties
        if (issue.description && typeof issue.description === 'string') {
          totalWords += countWords(issue.description)
        }
        if (issue.impact && typeof issue.impact === 'string') {
          totalWords += countWords(issue.impact)
        }
        if (issue.category && typeof issue.category === 'string') {
          totalWords += countWords(issue.category)
        }
      }
    })

    // Why it mattered (only in deep mode)
    if (mode === 'deep' && caseStudy.problem.whyItMattered) {
      caseStudy.problem.whyItMattered.forEach((item) => {
        totalWords += countWords(item)
      })
    }
  }

  // Approach section
  if (caseStudy.approach?.decisions) {
    caseStudy.approach.decisions.forEach((decision) => {
      if (decision.title) {
        totalWords += countWords(decision.title)
      }
      if (decision.decision) {
        totalWords += countWords(decision.decision)
      }
      // Rationale (only in deep mode)
      if (mode === 'deep' && decision.rationale) {
        totalWords += countWords(decision.rationale)
      }
      if (decision.result) {
        totalWords += countWords(decision.result)
      }
    })
  }

  // Design decisions (only in deep mode)
  if (mode === 'deep' && caseStudy.designDecisions) {
    caseStudy.designDecisions.forEach((decision) => {
      if (decision.title) {
        totalWords += countWords(decision.title)
      }
      if (decision.description) {
        totalWords += countWords(decision.description)
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
      totalWords += countWords(item)
    })

    // Rollout (only in deep mode)
    if (mode === 'deep' && caseStudy.implementation.rollout) {
      caseStudy.implementation.rollout.forEach((item: any) => {
        if (typeof item === 'string') {
          totalWords += countWords(item)
        } else if (typeof item === 'object' && item !== null) {
          // Extract from rollout object
          if (item.phase && typeof item.phase === 'string') {
            totalWords += countWords(item.phase)
          }
          if (Array.isArray(item.activities)) {
            item.activities.forEach((activity: any) => {
              if (typeof activity === 'string') {
                totalWords += countWords(activity)
              }
            })
          }
        }
      })
    }
  }

  // Validation section
  if (caseStudy.validation) {
    const outcomes =
      mode === 'quick' && caseStudy.validation.quickOutcomes
        ? caseStudy.validation.quickOutcomes
        : caseStudy.validation.outcomes || []

    outcomes.forEach((item: any) => {
      if (typeof item === 'string') {
        totalWords += countWords(item)
      } else if (typeof item === 'object' && item !== null) {
        // Extract from outcome object
        if (item.category && typeof item.category === 'string') {
          totalWords += countWords(item.category)
        }
        if (Array.isArray(item.results)) {
          item.results.forEach((result: any) => {
            if (typeof result === 'string') {
              totalWords += countWords(result)
            }
          })
    }
      }
    })

    // Feedback and technical (only in deep mode)
    if (mode === 'deep') {
      if (caseStudy.validation.feedback) {
        caseStudy.validation.feedback.forEach((item: any) => {
          if (typeof item === 'string') {
            totalWords += countWords(item)
          } else if (typeof item === 'object' && item !== null) {
            // Extract from feedback object
            if (item.quote && typeof item.quote === 'string') {
              totalWords += countWords(item.quote)
            }
            // source is metadata, not counted
          }
        })
      }
      if (caseStudy.validation.technical) {
        caseStudy.validation.technical.forEach((item) => {
          totalWords += countWords(item)
        })
      }
    }
  }

  // Learned section
  if (caseStudy.learned) {
    if (mode === 'quick' && caseStudy.learned.quickInsight) {
      totalWords += countWords(caseStudy.learned.quickInsight)
    } else {
      if (caseStudy.learned.worked) {
        caseStudy.learned.worked.forEach((item) => {
          totalWords += countWords(item)
        })
      }
      if (caseStudy.learned.insight) {
        totalWords += countWords(caseStudy.learned.insight)
      }
      // Challenges (only in deep mode)
      if (mode === 'deep' && caseStudy.learned.challenges) {
        caseStudy.learned.challenges.forEach((challenge) => {
          if (challenge.challenge) {
            totalWords += countWords(challenge.challenge)
          }
          if (challenge.solution) {
            totalWords += countWords(challenge.solution)
          }
        })
      }
    }
  }

  // Process section (only in deep mode)
  if (mode === 'deep' && caseStudy.process?.content) {
    caseStudy.process.content.forEach((item) => {
      totalWords += countWords(item)
    })
  }

  // Calculate reading time: words / 200 WPM + fixed image time
  const readingMinutes = totalWords / WORDS_PER_MINUTE
  const imageMinutes = mode === 'quick' ? IMAGE_TIME_QUICK : IMAGE_TIME_DEEP
  const totalMinutes = readingMinutes + imageMinutes

  return formatReadingTime(totalMinutes)
}
