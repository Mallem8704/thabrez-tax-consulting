import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@thabrez/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  experimental: {
    // Enable when using Server Actions
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
