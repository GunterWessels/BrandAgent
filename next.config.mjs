/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['ai']
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
