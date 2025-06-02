/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: [
      'hypebeast.com',
      'image-cdn.hypb.st',
      'media.gq.com',
      'www.fashionbeans.com',
    ],
  },
}

module.exports = nextConfig 