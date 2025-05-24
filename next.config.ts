import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  eslint:{
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  /* config options here */
};

export default nextConfig;
