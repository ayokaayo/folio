import { notFound } from 'next/navigation'
import ContactLab from './ContactLab'
import './lab.css'

// Dev-only (the .dev.tsx extension is only a page in development; see next.config.js).
export const metadata = { title: 'Contact lab', robots: { index: false, follow: false } }

export default function ContactLabPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <ContactLab />
}
