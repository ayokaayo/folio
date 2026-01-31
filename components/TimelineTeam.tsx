'use client'

interface TimelineTeamProps {
  timeline: string
  team: string
}

/**
 * TimelineTeam - Displays project timeline and team information
 * 
 * Features:
 * - Purple tag labels matching footer style
 * - Labels on their own line with values below
 * - Proper spacing from other elements
 * - Responsive layout
 */
export default function TimelineTeam({ timeline, team }: TimelineTeamProps) {
  return (
    <div className="mt-16 pt-12 pb-0 border-t border-text/10">
      <div className="bg-white border border-text/10 p-6 flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Timeline */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="inline-flex items-center gap-1.5 self-start text-text-secondary uppercase tracking-wide text-xs px-2 py-1 bg-[#F3E8FF] border border-[#D8B4FE] rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA]"></span>
            Timeline
          </span>
          <span className="text-sm text-text/80 leading-relaxed pl-1">
            {timeline}
          </span>
        </div>

        {/* Team */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="inline-flex items-center gap-1.5 self-start text-text-secondary uppercase tracking-wide text-xs px-2 py-1 bg-[#F3E8FF] border border-[#D8B4FE] rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA]"></span>
            Team
          </span>
          <span className="text-sm text-text/80 leading-relaxed pl-1">
            {team}
          </span>
        </div>
      </div>
    </div>
  )
}

