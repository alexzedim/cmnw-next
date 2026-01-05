const { API_ORIGIN } = require('./config/api-origin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    domains: ['render.worldofwarcraft.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'render.worldofwarcraft.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${API_ORIGIN}/api/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
