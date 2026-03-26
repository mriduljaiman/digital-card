/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for Puppeteer in Next.js
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'puppeteer',
        '@ffprobe-installer/ffprobe',
        '@ffmpeg-installer/ffmpeg',
        'fluent-ffmpeg',
      ];
    }
    // Fix for Three.js & canvas
    config.externals = [
      ...(config.externals || []),
      { canvas: 'canvas' },
    ];
    return config;
  },
};

module.exports = nextConfig;
