'use client'

import { ReactNode } from 'react'

interface MobilePhoneMockupProps {
  children: ReactNode
  className?: string
}

/**
 * MobilePhoneMockup - iPhone-style mobile phone frame component
 * 
 * Features:
 * - iPhone-style design with notch and rounded corners
 * - Responsive sizing
 * - Scrollable content area
 * - Styled to match portfolio design system
 */
export default function MobilePhoneMockup({
  children,
  className = '',
}: MobilePhoneMockupProps) {
  return (
    <div className={`flex justify-center items-start ${className}`}>
      <div className="relative w-full max-w-sm mx-auto">
        {/* Phone Frame */}
        <div className="relative bg-text rounded-[3rem] p-2 shadow-2xl border-2 border-text/20">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-text rounded-b-2xl z-10" />
          
          {/* Screen Container */}
          <div className="bg-background rounded-[2.5rem] overflow-hidden border border-text/10">
            {/* Status Bar Area */}
            <div className="h-8 bg-background flex items-center justify-center">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-text/40"></div>
                <div className="w-1 h-1 rounded-full bg-text/40"></div>
                <div className="w-1 h-1 rounded-full bg-text/40"></div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="bg-background min-h-[600px] max-h-[800px] overflow-y-auto">
              <div className="p-6">
                {children}
              </div>
            </div>
            
            {/* Home Indicator */}
            <div className="flex justify-center pb-2">
              <div className="w-32 h-1 bg-text/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
