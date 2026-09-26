/**
 * MillimetricPaper: Engineering paper grid with square cells
 *
 * One continuous 16px lattice across the whole content box, gutters included. The box is a
 * `.lattice` container, whose width snaps so every column and gutter is a whole number of cells:
 * column edges (ExposedGrid, GridRow children) therefore fall exactly on these lines.
 */

interface MillimetricPaperProps {
  /** Opacity of the grid lines (0-1) */
  opacity?: number
  /** Z-index for layering */
  zIndex?: number
}

/** Fixed baseline grid size - everything aligns to this */
export const BASELINE_GRID = 16

export default function MillimetricPaper({
  opacity = 0.5,
  zIndex = 0,
}: MillimetricPaperProps) {
  const lineColor = `rgba(229, 224, 216, ${opacity})`  // border-subtle

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex }}
      aria-hidden="true"
    >
      <div className="lattice h-full">
        <div className="relative h-full">
          {/* One pixel wider than the content box, so the closing line at the right edge is drawn. */}
          <div
            className="absolute top-0 bottom-0 left-0"
            style={{
              right: '-1px',
              backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
              backgroundSize: `${BASELINE_GRID}px ${BASELINE_GRID}px`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
