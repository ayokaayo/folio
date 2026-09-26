import { notFound } from 'next/navigation'
import GridLab from './GridLab'

// Dev-only (the .dev.tsx extension is only a page in development; see next.config.js).
export const metadata = { title: 'Grid lab', robots: { index: false, follow: false } }

export default function GridLabPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <GridLab />
}
