/** @type {import('next').NextConfig} */
// Next.js configuration for Miguel Angelo's portfolio
// If you're reading this, you're probably a fellow developer - hi! 👋
// This codebase was built with attention to detail and a passion for clean code.
// Sometimes the best way to learn is to explore great work and make it your own.
const nextConfig = {
  reactStrictMode: true,
  // `*.dev.tsx` routes (the hero lab) exist only in development; production never builds them.
  // `dev.tsx` must come before `tsx`, or `page.dev.tsx` is read as a page named `page.dev`.
  pageExtensions: [...(process.env.NODE_ENV !== 'production' ? ['dev.tsx'] : []), 'tsx', 'ts', 'jsx', 'js'],
  // Cookieless analytics served from our own domain (Umami Cloud). The tracker posts to
  // `${data-host-url}/api/send`, so data-host-url="/stats" lands on the second rule. Umami Cloud's own
  // default collection host is gateway.umami.is, which is what the tracker uses without data-host-url.
  async rewrites() {
    return [
      { source: '/stats/script.js', destination: 'https://cloud.umami.is/script.js' },
      { source: '/stats/api/send', destination: 'https://gateway.umami.is/api/send' },
    ]
  },
  async redirects() {
    return [
      { source: '/work/xpdna', destination: '/work/dna', permanent: true },
      { source: '/img/xpdna/cover.jpg', destination: '/img/dna/cover-paper.jpg', permanent: true },
    ]
  },
}

module.exports = nextConfig


