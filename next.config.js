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
  
  eslint: {
    ignoreDuringBuilds: true, // ✅ Tắt eslint khi chạy `next build`
  },
}

module.exports = nextConfig 