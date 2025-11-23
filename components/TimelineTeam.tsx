'use client'

interface TimelineTeamProps {
  timeline: string
  team: string
}

/**
 * TimelineTeam - Displays project timeline and team information
 * 
 * Features:
 * - Discrete but stylish design with icons
 * - Uses brand colors for visual interest
 * - Proper spacing from other elements
 * - Responsive layout
 */
export default function TimelineTeam({ timeline, team }: TimelineTeamProps) {
  return (
    <div className="mt-16 pt-12 pb-0 border-t border-text/10 flex flex-col sm:flex-row gap-6 sm:gap-8">
      {/* Timeline */}
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-card flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
            Timeline
          </div>
          <div className="text-sm text-text/80 leading-relaxed">
            {timeline}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-card flex items-center justify-center">
          <svg
            className="w-5 h-5 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
            Team
          </div>
          <div className="text-sm text-text/80 leading-relaxed">
            {team}
          </div>
        </div>
      </div>
    </div>
  )
}

