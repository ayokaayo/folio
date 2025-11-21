'use client'

import { motion } from 'framer-motion'
import { CaseStudy } from '@/lib/caseStudies'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface CaseStudyDetailProps {
  caseStudy: CaseStudy
}

export default function CaseStudyDetail({ caseStudy }: CaseStudyDetailProps) {
  const prefersReducedMotion = useReducedMotion()

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
          {caseStudy.impact.items.map((item, index) => (
            <li key={`impact-${index}-${item.substring(0, 20)}`} className="text-text/80 flex items-start">
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
          <p>{caseStudy.problem.context}</p>
          <div>
            <h3 className="font-semibold text-text mb-2">Core Issues:</h3>
            <ul className="list-none space-y-2">
              {caseStudy.problem.issues.map((issue, index) => (
                <li key={`issue-${index}-${issue.substring(0, 20)}`} className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
          {caseStudy.problem.whyItMattered.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Why It Mattered:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.problem.whyItMattered.map((item, index) => (
                  <li key={`why-${index}-${item.substring(0, 20)}`} className="flex items-start">
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
                {decision.rationale && (
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

      {/* Design Decisions */}
      {caseStudy.designDecisions.length > 0 && (
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
          {caseStudy.implementation.technical.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Technical Approach:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.implementation.technical.map((item, index) => (
                  <li key={`tech-${index}-${item.substring(0, 20)}`} className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {caseStudy.implementation.rollout.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Rollout Strategy:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.implementation.rollout.map((item, index) => (
                  <li key={`rollout-${index}-${item.substring(0, 20)}`} className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.section>

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
          {caseStudy.validation.outcomes.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Measured Outcomes:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.validation.outcomes.map((item, index) => (
                  <li key={`outcome-${index}-${item.substring(0, 20)}`} className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {caseStudy.validation.feedback.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Partner Feedback:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.validation.feedback.map((item, index) => (
                  <li key={`feedback-${index}-${item.substring(0, 20)}`} className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {caseStudy.validation.technical.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Technical Success:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.validation.technical.map((item, index) => (
                  <li key={`validation-tech-${index}-${item.substring(0, 20)}`} className="flex items-start">
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
          {caseStudy.learned.worked.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">What Worked:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.learned.worked.map((item, index) => (
                  <li key={`worked-${index}-${item.substring(0, 20)}`} className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {caseStudy.learned.challenges.length > 0 && (
            <div>
              <h3 className="font-semibold text-text mb-2">Challenges Solved:</h3>
              <ul className="list-none space-y-2">
                {caseStudy.learned.challenges.map((challenge, index) => (
                  <li key={`challenge-${index}-${challenge.challenge.substring(0, 20)}`} className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span><strong>{challenge.challenge}:</strong> {challenge.solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {caseStudy.learned.insight && (
            <div className="bg-text/5 p-6 rounded-lg border-l-4 border-primary">
              <p className="font-semibold text-text mb-2">Strategic Insight:</p>
              <p>{caseStudy.learned.insight}</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  )
}


