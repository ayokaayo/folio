'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CaseStudy } from '@/lib/caseStudies'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import TimelineTeam from './TimelineTeam'
import ImageGallery from './ImageGallery'
import dynamic from 'next/dynamic'
import type { ImageWithCaption } from '@/lib/caseStudies/types'
import DensityToggle from './DensityToggle'
import ImageModal from './ImageModal'
import LazyImage from './LazyImage'
import { parseMarkdownLinks } from '@/lib/utils/parseMarkdownLinks'
import TestimonialCarousel from './TestimonialCarousel'

const BeforeAfterImage = dynamic(() => import('./BeforeAfterImage'), {
  ssr: false
})

interface CaseStudyDetailProps {
  caseStudy: CaseStudy
  densityMode: 'quick' | 'deep'
  onModeChange?: (mode: 'quick' | 'deep') => void
}

/**
 * Helper component to render section images with consistent styling
 * Handles optional images arrays and returns null if empty
 * Automatically detects before/after pairs and renders BeforeAfterImage component
 * Supports mixed arrays with both regular images and before/after pairs
 */
function SectionImageGallery({ images }: { images?: ImageWithCaption[] }) {
  if (!images || !Array.isArray(images) || images.length === 0) return null
  
  // Helper to check if an image is a "before" image
  const isBeforeImage = (img: ImageWithCaption) => 
    img.caption?.toLowerCase().includes('before') || 
    img.url?.toLowerCase().includes('before') ||
    img.alt?.toLowerCase().includes('before')
  
  // Helper to check if an image is an "after" image
  const isAfterImage = (img: ImageWithCaption) => 
    img.caption?.toLowerCase().includes('after') || 
    img.url?.toLowerCase().includes('after') ||
    img.alt?.toLowerCase().includes('after')
  
  // Find all before/after pairs
  const pairs: Array<{ before: ImageWithCaption; after: ImageWithCaption; defaultView?: 'before' | 'after' }> = []
  const usedIndices = new Set<number>()
  const regularImages: ImageWithCaption[] = []
  
  // First pass: find all before/after pairs
  for (let i = 0; i < images.length; i++) {
    if (usedIndices.has(i)) continue
    
    const img = images[i]
    if (isBeforeImage(img)) {
      // Find matching "after" image
      for (let j = i + 1; j < images.length; j++) {
        if (usedIndices.has(j)) continue
        
        const afterImg = images[j]
        if (isAfterImage(afterImg)) {
          // Found a pair
          const defaultView = img.url?.toLowerCase().includes('dashboard') || 
                             afterImg.url?.toLowerCase().includes('dashboard') 
                             ? 'after' : undefined
          pairs.push({ before: img, after: afterImg, defaultView })
          usedIndices.add(i)
          usedIndices.add(j)
          break
        }
      }
    } else if (isAfterImage(img)) {
      // Find matching "before" image
      for (let j = i + 1; j < images.length; j++) {
        if (usedIndices.has(j)) continue
        
        const beforeImg = images[j]
        if (isBeforeImage(beforeImg)) {
          // Found a pair
          const defaultView = img.url?.toLowerCase().includes('dashboard') || 
                             beforeImg.url?.toLowerCase().includes('dashboard') 
                             ? 'after' : undefined
          pairs.push({ before: beforeImg, after: img, defaultView })
          usedIndices.add(i)
          usedIndices.add(j)
          break
        }
      }
    }
  }
  
  // Collect remaining regular images
  for (let i = 0; i < images.length; i++) {
    if (!usedIndices.has(i)) {
      regularImages.push(images[i])
    }
  }
  
  // Render regular images first, then pairs (to maintain array order)
  return (
    <div className="mt-8 space-y-8">
      {regularImages.length > 0 && (
        <ImageGallery images={regularImages} />
      )}
      {pairs.map((pair, index) => (
        <BeforeAfterImage 
          key={`before-after-${index}`}
          before={pair.before} 
          after={pair.after}
          {...(pair.defaultView && { defaultView: pair.defaultView })}
        />
      ))}
    </div>
  )
}

export default function CaseStudyDetail({
  caseStudy,
  densityMode,
  onModeChange,
}: CaseStudyDetailProps) {
  const prefersReducedMotion = useReducedMotion()
  const [selectedImage, setSelectedImage] = useState<ImageWithCaption | null>(null)

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

  // Helper to render text with paragraph breaks, markdown bold, and markdown links
  const renderFormattedText = (text: string) => {
    if (!text) return null
    const paragraphs = text.split('\n\n')
    return (
      <>
        {paragraphs.map((paragraph, index) => {
          // First parse markdown links, then bold
          const parsedLinks = parseMarkdownLinks(paragraph)
          const parts = (typeof parsedLinks === 'string' ? parsedLinks : [parsedLinks])
            .flatMap((part: any) => {
              if (typeof part === 'string') {
                return part.split(/(\*\*.*?\*\*)/g)
              }
              return [part]
            })
          return (
            <span key={index}>
              {parts.map((part: any, partIndex: number) => {
                if (typeof part === 'string') {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIndex} className="text-text font-semibold">{part.slice(2, -2)}</strong>
                  }
                  return part
                }
                return part
              })}
              {index < paragraphs.length - 1 && <br />}
            </span>
          )
        })}
      </>
    )
  }

  return (
    <div className="prose prose-lg max-w-none">
      {/* Density Toggle */}
      {onModeChange && (
        <div className="mb-6">
          <DensityToggle
            caseStudy={caseStudy}
            mode={densityMode}
            onModeChange={onModeChange}
          />
        </div>
      )}
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
        {(() => {
          const awardsImage = caseStudy.impact?.images?.find(img => 
            img.url?.includes('awards') || img.caption?.toLowerCase().includes('award')
          )
          const otherImages = caseStudy.impact?.images?.filter(img => 
            !(img.url?.includes('awards') || img.caption?.toLowerCase().includes('award'))
          )
          
          return (
            <>
              <ul className="list-none space-y-3">
                {getImpactItems().map((item, index) => {
                  const isAwardsItem = item.toLowerCase().includes('awards') || item.toLowerCase().includes('aibc') || item.toLowerCase().includes('sbc') || item.toLowerCase().includes('sigma')
                  
                  return (
                    <li key={`impact-${index}-${item.substring(0, 20)}`}>
                      <div className="text-text/80 flex items-start">
                        <span className="text-primary mr-3">•</span>
                        <span>{parseMarkdownLinks(item)}</span>
                      </div>
                      {isAwardsItem && awardsImage && (
                        <motion.figure
                          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                          viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
                          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: 0.2 }}
                          className="mt-6 mb-8 w-full cursor-pointer"
                          onClick={() => setSelectedImage(awardsImage)}
                        >
                          <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                            <LazyImage
                              src={awardsImage.url}
                              alt={awardsImage.alt}
                              loading="lazy"
                            />
                          </div>
                          {awardsImage.caption && (
                            <figcaption className="mt-3 text-sm text-text/60 text-center italic">
                              {awardsImage.caption}
                            </figcaption>
                          )}
                        </motion.figure>
                      )}
                    </li>
                  )
                })}
              </ul>
              <SectionImageGallery images={otherImages} />
            </>
          )
        })()}
        <TimelineTeam timeline={caseStudy.timeline} team={caseStudy.team} />
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
          <div className="leading-relaxed">{renderFormattedText(getProblemContext())}</div>
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
                            <div className="leading-relaxed">{renderFormattedText(issue.description)}</div>
                          )}
                          {issue.impact && (
                            <div className="text-text/70 text-sm italic leading-relaxed">Impact: {renderFormattedText(issue.impact)}</div>
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
        <SectionImageGallery images={caseStudy.problem?.images} />
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
                <p className="leading-relaxed"><strong>Decision:</strong> {renderFormattedText(decision.decision)}</p>
                {densityMode === 'deep' && decision.rationale && (
                  <p className="leading-relaxed"><strong>Rationale:</strong> {renderFormattedText(decision.rationale)}</p>
                )}
                {decision.result && (
                  <p className="leading-relaxed"><strong>Result:</strong> {renderFormattedText(decision.result)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <SectionImageGallery images={caseStudy.approach?.images} />
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
            Key Design Decisions
          </h2>
          <div className="space-y-8">
            {caseStudy.designDecisions.map((decision, index) => (
              <div key={`design-${index}-${decision.title.substring(0, 20)}`}>
                <h3 className="font-semibold text-text mb-2">{decision.title}</h3>
                <p className="text-text/80 leading-relaxed">{renderFormattedText(decision.description)}</p>
                {decision.image && (
                  <div className="mt-4 cursor-pointer" onClick={() => setSelectedImage(decision.image!)}>
                    <div className="relative w-full overflow-hidden border border-text/10 bg-text/5 p-1 transition-transform hover:scale-[1.01]">
                      <LazyImage
                        src={decision.image.url}
                        alt={decision.image.alt}
                        loading="lazy"
                      />
                    </div>
                    {decision.image.caption && (
                      <p className="text-sm text-text/60 mt-2 italic text-center">{decision.image.caption}</p>
                    )}
                  </div>
                )}
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
        <SectionImageGallery images={caseStudy.implementation?.images} />
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
            {caseStudy.process.content.map((item, index) => {
              // Split at the first colon to separate label from content
              const colonIndex = item.indexOf(':')
              if (colonIndex > 0) {
                const label = item.substring(0, colonIndex + 1)
                const content = item.substring(colonIndex + 1).trim()
                return (
                  <p key={`process-${index}-${item.substring(0, 20)}`}>
                    <span className="font-bold text-text">{label}</span> {parseMarkdownLinks(content)}
                  </p>
                )
              }
              // Fallback if no colon found
              return (
                <p key={`process-${index}-${item.substring(0, 20)}`}>{parseMarkdownLinks(item)}</p>
              )
            })}
          </div>
          <SectionImageGallery images={caseStudy.process?.images} />
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
        {/* Testimonials Carousel */}
        {caseStudy.validation?.testimonials && caseStudy.validation.testimonials.length > 0 && (
          <div className="mt-12">
            <TestimonialCarousel testimonials={caseStudy.validation.testimonials} />
          </div>
        )}
        
        <SectionImageGallery images={caseStudy.validation?.images} />
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
            <div className="relative mt-8 pt-4">
              <div 
                className="bg-[#FFF9C4] p-6 transform rotate-[-1.5deg] border border-[#FDD835]/30"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
                }}
              >
                <p className="font-semibold text-text mb-2">Strategic Insight:</p>
                <p className="text-text/90 leading-relaxed text-lg">{renderFormattedText(getLearnedInsight())}</p>
              </div>
            </div>
          )}
        </div>
        <SectionImageGallery images={caseStudy.learned?.images} />
      </motion.section>

      {/* Image Gallery */}
      {caseStudy.images && caseStudy.images.length > 0 && (
        <motion.section
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: VIEWPORT.ONCE }}
          transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: ANIMATION.DELAY.LARGE * 4 }}
          className="mb-16 border-t border-text/10 pt-16"
        >
          <ImageGallery images={caseStudy.images} />
        </motion.section>
      )}

      {/* Image Modal */}
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  )
}


