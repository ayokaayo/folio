'use client'

import Link from 'next/link'
import ExposedGrid, { GRID_GAP } from '@/components/ExposedGrid'
import type { VariantProps } from '../../types'

export default function Current({ copy, values }: VariantProps) {
  return (
    <section className="relative cursor-crosshair">
      <ExposedGrid showColumns showLabels showGaps opacity={Number(values.opacity)} interactive zIndex={5} />
      <div className="relative z-10 pt-12 pb-12 md:pt-16 md:pb-16 pointer-events-none">
        <div className="max-w-content mx-auto" style={{ paddingLeft: `${GRID_GAP}px`, paddingRight: `${GRID_GAP}px` }}>
          <div className="w-full lg:w-[calc((100%-11*16px)/12*8+7*16px)]">
            <h1 className="font-mono font-medium text-text-primary text-headline">
              {copy.headline[0]}
              <br />
              {copy.headline[1]}
            </h1>
            <p className="font-mono text-subhead text-text-secondary mt-6">
              {copy.subhead[0]}
              <br />
              {copy.subhead[1]}
            </p>
            <div className="mt-12">
              <Link
                href={copy.cta.href}
                className="btn-primary group inline-flex justify-between cta-2col pointer-events-auto"
              >
                <span className="font-mono text-label uppercase tracking-wide">{copy.cta.label}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
