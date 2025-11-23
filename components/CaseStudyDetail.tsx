'use client'

import { motion } from 'framer-motion'
import { CaseStudy } from '@/lib/caseStudies'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface CaseStudyDetailProps {
  caseStudy: CaseStudy
  densityMode: 'quick' | 'deep'
}

export default function CaseStudyDetail({
  caseStudy,
  densityMode,
}: CaseStudyDetailProps) {
  const prefersReducedMotion = useReducedMotion()

  // Helper to get impact items based on mode
  const getImpactItems = () => {
    if (densityMode === 'quick' && caseStudy.impact.quickItems) {
      return caseStudy.impact.quickItems
    }
    if (densityMode === 'deep' && caseStudy.impact.deepItems) {
      return caseStudy.impact.deepItems
    }
    // Fallback: in quick mode, show first 3-4 items; in deep mode, show all
    if (densityMode === 'quick') {
      return caseStudy.impact.items.slice(0, 4)
    }
    return caseStudy.impact.items
  }

  // Helper to get problem context based on mode
  const getProblemContext = () => {
    if (densityMode === 'quick' && caseStudy.problem.quickContext) {
      return caseStudy.problem.quickContext
    }
    return caseStudy.problem.context
  }

  // Helper to get problem issues based on mode
  const getProblemIssues = () => {
    if (densityMode === 'quick' && caseStudy.problem.quickIssues) {
      return caseStudy.problem.quickIssues
    }
    return caseStudy.problem.issues || []
  }

  // Helper to get text from item (string or object)
  const getItemText = (item: any): string => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null) {
      // For issue objects, return description
      if (item.description) return item.description
      // For feedback objects, return quote
      if (item.quote) return item.quote
      // Fallback to stringified version
      return JSON.stringify(item)
    }
    return String(item)
  }

  // Helper to get key from item (for React keys)
  const getItemKey = (item: any, index: number, prefix: string): string => {
    if (typeof item === 'string') {
      return `${prefix}-${index}-${item.substring(0, 20)}`
    }
    if (typeof item === 'object' && item !== null) {
      const text = getItemText(item)
      return `${prefix}-${index}-${text.substring(0, 20)}`
    }
    return `${prefix}-${index}`
  }

  // Helper to get implementation technical items based on mode
  const getImplementationTechnical = () => {
    if (densityMode === 'quick' && caseStudy.implementation?.quickTechnical) {
      return caseStudy.implementation.quickTechnical
    }
    return caseStudy.implementation?.technical || []
  }

  // Helper to get validation outcomes based on mode
  const getValidationOutcomes = () => {
    if (densityMode === 'quick' && caseStudy.validation?.quickOutcomes) {
      return caseStudy.validation.quickOutcomes
    }
    return caseStudy.validation?.outcomes || []
  }

  // Helper to get learned insight based on mode
  const getLearnedInsight = () => {
    if (densityMode === 'quick' && caseStudy.learned.quickInsight) {
      return caseStudy.learned.quickInsight
    }
    return caseStudy.learned.insight
  }

  return (
    <div className="prose prose-lg max-w-none">
      {/* Impact */}
      <motion.section
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: VIEWPORT.ONCE }}
        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL }}
        className="mb-16"
      >
        <h2 className="text-2xl font-serif font-bold text-text mb-6">
          {caseStudy.impact.title}
        </h2>
        <ul className="list-none space-y-3">
          {getImpactItems().map((item, index) => (
            <li
              key={`impact-${index}-${item.substring(0, 20)}`}
              className="text-text/80 flex items-start"
            >
              <span className="text-primary mr-3">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-sm text-text/60">
          <p><strong>Timeline:</strong> {caseStudy.timeline}</p>
          <p><strong>Team:</strong> {caseStudy.team}</p>
        </div>
      </motion.section>

      {/* Problem */}
      <motion.section
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: VIEWPORT.ONCE }}
        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.SMALL }}
        className="mb-16 border-t border-text/10 pt-16"
      >
        <h2 className="text-2xl font-serif font-bold text-text mb-6">
          {caseStudy.problem.title}
        </h2>
        <div className="space-y-4 text-text/80">
          <p>{getProblemContext()}</p>
          <div>
            <h3 className="font-semibold text-text mb-2">Core Issues:</h3>
            <ul className="list-none space-y-2">
              {getProblemIssues().map((issue: any, index: number) => {
                const issueText = getItemText(issue)
                return (
                  <li
                    key={getItemKey(issue, index, 'issue')}
                    className="flex items-start"
                  >
                    <span className="text-primary mr-3">•</span>
                    <div className="flex-1">
                      {typeof issue === 'object' && issue !== null ? (
                        <div className="space-y-1">
                          {issue.category && (
                            <div className="font-semibold text-text">{issue.category}</div>
                          )}
                          {issue.description && (
                            <div>{issue.description}</div>
                          )}
                          {issue.impact && (
                            <div className="text-text/70 text-sm italic">Impact: {issue.impact}</div>
                          )}
                        </div>
                      ) : (
                        <span>{issueText}</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          {densityMode === 'deep' &&
            caseStudy.problem.whyItMattered &&
            Array.isArray(caseStudy.problem.whyItMattered) &&
            caseStudy.problem.whyItMattered.length > 0 && (
              <div>
                <h3 className="font-semibold text-text mb-2">Why It Mattered:</h3>
                <ul className="list-none space-y-2">
                  {caseStudy.problem.whyItMattered.map((item, index) => (
                    <li
                      key={`why-${index}-${item.substring(0, 20)}`}
                      className="flex items-start"
                    >
                      <span className="text-primary mr-3">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </motion.section>

      {/* Approach */}
      <motion.section
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: VIEWPORT.ONCE }}
        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.MEDIUM }}
        className="mb-16 border-t border-text/10 pt-16"
      >
        <h2 className="text-2xl font-serif font-bold text-text mb-6">
          {caseStudy.approach.title}
        </h2>
        <div className="space-y-8">
          {caseStudy.approach.decisions.map((decision, index) => (
            <div key={`decision-${index}-${decision.title.substring(0, 20)}`}>
              <h3 className="font-semibold text-text mb-2">{decision.title}</h3>
              <div className="space-y-2 text-text/80">
                <p><strong>Decision:</strong> {decision.decision}</p>
                {densityMode === 'deep' && decision.rationale && (
                  <p><strong>Rationale:</strong> {decision.rationale}</p>
                )}
                {decision.result && (
                  <p><strong>Result:</strong> {decision.result}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Design Decisions - Only in Deep mode */}
      {densityMode === 'deep' && caseStudy.designDecisions && caseStudy.designDecisions.length > 0 && (
        <motion.section
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.LARGE }}
          className="mb-16 border-t border-text/10 pt-16"
        >
          <h2 className="text-2xl font-serif font-bold text-text mb-6">
            KEY DESIGN DECISIONS
          </h2>
          <div className="space-y-8">
            {caseStudy.designDecisions.map((decision, index) => (
              <div key={`design-${index}-${decision.title.substring(0, 20)}`}>
                <h3 className="font-semibold text-text mb-2">{decision.title}</h3>
                <p className="text-text/80">{decision.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Implementation */}
      <motion.section
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: VIEWPORT.ONCE }}
        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.MEDIUM * 2 }}
        className="mb-16 border-t border-text/10 pt-16"
      >
        <h2 className="text-2xl font-serif font-bold text-text mb-6">
          {caseStudy.implementation.title}
        </h2>
        <div className="space-y-4 text-text/80">
          {getImplementationTechnical().length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Technical Approach:</h3>
              <ul className="list-none space-y-2">
                {getImplementationTechnical().map((item, index) => (
                  <li
                    key={`tech-${index}-${item.substring(0, 20)}`}
                    className="flex items-start"
                  >
                    <span className="text-primary mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {densityMode === 'deep' &&
            caseStudy.implementation.rollout &&
            (Array.isArray(caseStudy.implementation.rollout) ? caseStudy.implementation.rollout.length > 0 : true) && (
              <div>
                <h3 className="font-semibold text-text mb-2">Rollout Strategy:</h3>
                <ul className="list-none space-y-4">
                  {(Array.isArray(caseStudy.implementation.rollout) ? caseStudy.implementation.rollout : []).map((item: any, index: number) => {
                    if (typeof item === 'string') {
                      return (
                        <li
                          key={getItemKey(item, index, 'rollout')}
                          className="flex items-start"
                        >
                          <span className="text-primary mr-3">•</span>
                          <span>{item}</span>
                        </li>
                      )
                    } else if (typeof item === 'object' && item !== null) {
                      return (
                        <li key={getItemKey(item, index, 'rollout')} className="space-y-2">
                          {item.phase && (
                            <div className="font-semibold text-text">{item.phase}</div>
                          )}
                          {Array.isArray(item.activities) && (
                            <ul className="list-none space-y-1 ml-4">
                              {item.activities.map((activity: string, actIndex: number) => (
                                <li key={`activity-${index}-${actIndex}`} className="flex items-start">
                                  <span className="text-primary mr-2">◦</span>
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      )
                    }
                    return null
                  })}
                </ul>
              </div>
            )}
        </div>
      </motion.section>

      {/* Process - Only in Deep mode */}
      {densityMode === 'deep' && caseStudy.process && (
        <motion.section
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={
            prefersReducedMotion
              ? {}
              : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.MEDIUM * 2.5 }
          }
          className="mb-16 border-t border-text/10 pt-16"
        >
          <h2 className="text-2xl font-serif font-bold text-text mb-6">
            {caseStudy.process.title}
          </h2>
          <div className="space-y-4 text-text/80">
            {caseStudy.process.content.map((item, index) => (
              <p key={`process-${index}-${item.substring(0, 20)}`}>{item}</p>
            ))}
          </div>
        </motion.section>
      )}

      {/* Validation */}
      <motion.section
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: VIEWPORT.ONCE }}
        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.LARGE * 2 }}
        className="mb-16 border-t border-text/10 pt-16"
      >
        <h2 className="text-2xl font-serif font-bold text-text mb-6">
          {caseStudy.validation.title}
        </h2>
        <div className="space-y-6 text-text/80">
          {getValidationOutcomes().length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Measured Outcomes:</h3>
              <ul className="list-none space-y-4">
                {getValidationOutcomes().map((item: any, index: number) => {
                  if (typeof item === 'string') {
                    return (
                      <li
                        key={getItemKey(item, index, 'outcome')}
                        className="flex items-start"
                      >
                        <span className="text-primary mr-3">•</span>
                        <span>{item}</span>
                      </li>
                    )
                  } else if (typeof item === 'object' && item !== null) {
                    return (
                      <li key={getItemKey(item, index, 'outcome')} className="space-y-2">
                        {item.category && (
                          <div className="font-semibold text-text">{item.category}</div>
                        )}
                        {Array.isArray(item.results) && (
                          <ul className="list-none space-y-1 ml-4">
                            {item.results.map((result: string, resIndex: number) => (
                              <li key={`result-${index}-${resIndex}`} className="flex items-start">
                                <span className="text-primary mr-2">◦</span>
                                <span>{result}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  }
                  return null
                })}
              </ul>
            </div>
          )}
          {densityMode === 'deep' &&
            caseStudy.validation.feedback &&
            (Array.isArray(caseStudy.validation.feedback) ? caseStudy.validation.feedback.length > 0 : true) && (
              <div>
                <h3 className="font-semibold text-text mb-2">Partner Feedback:</h3>
                <ul className="list-none space-y-3">
                  {(Array.isArray(caseStudy.validation.feedback) ? caseStudy.validation.feedback : []).map((item: any, index: number) => {
                    if (typeof item === 'string') {
                      return (
                        <li
                          key={getItemKey(item, index, 'feedback')}
                          className="flex items-start"
                        >
                          <span className="text-primary mr-3">•</span>
                          <span>{item}</span>
                        </li>
                      )
                    } else if (typeof item === 'object' && item !== null) {
                      return (
                        <li key={getItemKey(item, index, 'feedback')} className="space-y-1">
                          {item.quote && (
                            <div className="italic text-text/90">&ldquo;{item.quote}&rdquo;</div>
                          )}
                          {item.source && (
                            <div className="text-sm text-text/60">— {item.source}</div>
                          )}
                        </li>
                      )
                    }
                    return null
                  })}
                </ul>
              </div>
            )}
          {densityMode === 'deep' &&
            caseStudy.validation.technical &&
            Array.isArray(caseStudy.validation.technical) &&
            caseStudy.validation.technical.length > 0 && (
              <div>
                <h3 className="font-semibold text-text mb-2">Technical Success:</h3>
                <ul className="list-none space-y-2">
                  {caseStudy.validation.technical.map((item, index) => (
                    <li
                      key={`validation-tech-${index}-${item.substring(0, 20)}`}
                      className="flex items-start"
                    >
                      <span className="text-primary mr-3">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </motion.section>

      {/* What I Learned */}
      <motion.section
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: VIEWPORT.ONCE }}
        transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.LARGE * 3 }}
        className="mb-16 border-t border-text/10 pt-16"
      >
        <h2 className="text-2xl font-serif font-bold text-text mb-6">
          {caseStudy.learned.title}
        </h2>
        <div className="space-y-6 text-text/80">
          {densityMode === 'deep' && caseStudy.learned.worked && Array.isArray(caseStudy.learned.worked) && caseStudy.learned.worked.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">What Worked:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.learned.worked.map((item, index) => (
                  <li
                    key={`worked-${index}-${item.substring(0, 20)}`}
                    className="flex items-start"
                  >
                    <span className="text-primary mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {densityMode === 'deep' && caseStudy.learned.challenges && Array.isArray(caseStudy.learned.challenges) && caseStudy.learned.challenges.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Challenges Solved:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.learned.challenges.map((challenge, index) => (
                  <li
                    key={`challenge-${index}-${challenge.challenge.substring(0, 20)}`}
                    className="flex items-start"
                  >
                    <span className="text-primary mr-3">•</span>
                    <span>
                      <strong>{challenge.challenge}:</strong> {challenge.solution}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {getLearnedInsight() && (
            <div className="bg-text/5 p-6 rounded-lg border-l-4 border-primary">
              <p className="font-semibold text-text mb-2">Strategic Insight:</p>
              <p>{getLearnedInsight()}</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  )
}


