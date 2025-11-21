'use client'

import { motion } from 'framer-motion'
import { ANIMATION, VIEWPORT } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface ArticleCardProps {
  article: {
    publication: string
    date: string
    title: string
    tags: string[]
    readTime: string
    views: string
  }
  index?: number
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: VIEWPORT.ONCE, margin: VIEWPORT.MARGIN }}
      transition={prefersReducedMotion ? {} : { duration: ANIMATION.DURATION.NORMAL, delay: index * ANIMATION.DELAY.STAGGER }}
      className="border-b border-text/10 pb-6 last:border-b-0"
    >
      <div className="flex items-start gap-4 mb-2">
        <span className="text-xs text-text/60 whitespace-nowrap">
          Published in {article.publication} · {article.date}
        </span>
      </div>
      <h3 className="text-lg md:text-xl font-serif font-bold text-text mb-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-text/60">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-text/60">
          {article.readTime} | {article.views}
        </span>
      </div>
    </motion.div>
  )
}

