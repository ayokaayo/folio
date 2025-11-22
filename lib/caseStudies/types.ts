export interface CaseStudy {
  id: string
  title: string
  subtitle: string
  hashtag: string
  company: string
  year: string
  linkText: string
  linkUrl?: string
  imageUrl?: string
  imageAlt?: string
  coverImageUrl?: string
  coverImageAlt?: string
  impact: {
    title: string
    items: string[]
    quickItems?: string[]
    deepItems?: string[]
  }
  problem: {
    title: string
    context: string
    issues: string[]
    whyItMattered: string[]
    quickContext?: string
    quickIssues?: string[]
  }
  approach: {
    title: string
    decisions: Array<{
      title: string
      decision: string
      rationale: string
      result: string
    }>
  }
  designDecisions: Array<{
    title: string
    description: string
  }>
  implementation: {
    title: string
    technical: string[]
    rollout: string[]
    quickTechnical?: string[]
  }
  validation: {
    title: string
    outcomes: string[]
    feedback: string[]
    technical: string[]
    quickOutcomes?: string[]
  }
  learned: {
    title: string
    worked: string[]
    challenges: Array<{
      challenge: string
      solution: string
    }>
    insight: string
    quickInsight?: string
  }
  process?: {
    title: string
    content: string[]
  }
  timeline: string
  team: string
}

