/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['geist'],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'render.worldofwarcraft.com',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
