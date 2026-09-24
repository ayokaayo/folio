export type { CaseStudy } from './types'

import { dropdownBuilder } from './dropdown-builder'
import { smsCharacters } from './sms-characters'
import { timeManagement } from './time-management'
import { fastTrackAI } from './fast-track-ai'
import { dna } from './dna'
import { nexus } from './nexus'
import type { CaseStudy } from './types'

// Export individual case studies for potential direct imports
export { dna, nexus, dropdownBuilder, smsCharacters, timeManagement, fastTrackAI }

// Export aggregated array
export const caseStudies: CaseStudy[] = [
  dna,
  nexus,
  fastTrackAI,
  timeManagement,
  smsCharacters,
  dropdownBuilder,
]

