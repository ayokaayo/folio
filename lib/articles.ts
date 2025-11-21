export interface Article {
  id: string
  publication: string
  date: string
  title: string
  tags: string[]
  readTime: string
  views: string
}

export const popularArticles: Article[] = [
  {
    id: 'designing-for-scale',
    publication: 'UXCollective',
    date: 'Feb, 2024',
    title: 'Designing for scale: Lessons from 15× revenue growth',
    tags: ['#Growth', '#B2B SaaS'],
    readTime: '8 mins read',
    views: '12k+ views',
  },
  {
    id: 'design-systems-debt',
    publication: 'UXCollective',
    date: 'Mar, 2024',
    title: 'Building design systems under technical debt',
    tags: ['#Design Systems', '#Enterprise'],
    readTime: '10 mins read',
    views: '8k+ views',
  },
  {
    id: 'ai-product-design',
    publication: 'UXCollective',
    date: 'Apr, 2024',
    title: 'AI product design: Balancing innovation with constraints',
    tags: ['#AI', '#Product Design'],
    readTime: '9 mins read',
    views: '15k+ views',
  },
]


