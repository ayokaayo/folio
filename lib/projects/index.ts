export type { SideProject } from './types'

import { designSystemEvolution } from './design-system-evolution'
import { aiContentGeneration } from './ai-content-generation'
import { enterpriseDashboard } from './enterprise-dashboard'
import { mobileAppRedesign } from './mobile-app-redesign'
import { onboardingOptimization } from './onboarding-optimization'
import { accessibilityAudit } from './accessibility-audit'
import { exoticaRadio } from './exotica-radio'
import { normaAiAssistant } from './norma-ai-assistant'
import { codexTarot } from './codex-tarot'
import type { SideProject } from './types'

// Export individual projects for potential direct imports
export {
  designSystemEvolution,
  aiContentGeneration,
  enterpriseDashboard,
  mobileAppRedesign,
  onboardingOptimization,
  accessibilityAudit,
  exoticaRadio,
  normaAiAssistant,
  codexTarot,
}

// Export aggregated array
export const projects: SideProject[] = [
  designSystemEvolution,
  aiContentGeneration,
  enterpriseDashboard,
  mobileAppRedesign,
  onboardingOptimization,
  accessibilityAudit,
  exoticaRadio,
  normaAiAssistant,
  codexTarot,
]

// Side projects shown on homepage (first 3)
export const sideProjects = projects.slice(0, 3)

