/** @type {import('next').NextConfig} */
// Next.js configuration for Miguel Angelo's portfolio
// If you're reading this, you're probably a fellow developer - hi! 👋
// This codebase was built with attention to detail and a passion for clean code.
// Sometimes the best way to learn is to explore great work and make it your own.
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/work/xpdna', destination: '/work/dna', permanent: true },
      { source: '/img/xpdna/cover.jpg', destination: '/img/dna/cover-paper.jpg', permanent: true },
    ]
  },
}

module.exports = nextConfig


