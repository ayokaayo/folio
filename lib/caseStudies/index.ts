export type { CaseStudy } from './types'

import { dropdownBuilder } from './dropdown-builder'
import { smsCharacters } from './sms-characters'
import { timeManagement } from './time-management'
import { fastTrackAI } from './fast-track-ai'
import { xpdna } from './xpdna'
import type { CaseStudy } from './types'

// Export individual case studies for potential direct imports
export { xpdna, dropdownBuilder, smsCharacters, timeManagement, fastTrackAI }

// Export aggregated array
export const caseStudies: CaseStudy[] = [
  xpdna,
  fastTrackAI,
  timeManagement,
  smsCharacters,
  dropdownBuilder,
]

