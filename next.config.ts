import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    remotePatterns:[
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9199',
        pathname: '/**'
      }
    ]
  },
  eslint:{
    ignoreDuringBuilds: true
  },
  experimental: {
    serverMinification: false,
    serverActions: {
      bodySizeLimit: '50mb',
      
    },
  },
  /* config options here */
};

export default nextConfig;

