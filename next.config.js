/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig