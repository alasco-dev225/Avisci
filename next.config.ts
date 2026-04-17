import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uccsajfixiqsctdgxnoq.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
    ],
  },
  async redirects() {
    const domain = process.env.NEXT_PUBLIC_CANONICAL_DOMAIN
    if (!domain) return []
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${domain}` }],
        destination: `https://${domain}/:path*`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig