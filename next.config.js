/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "render.worldofwarcraft.com",
        pathname: "/**",
      },
    ],
  },
  // Dev-only rewrite: proxy browser /api/* requests to the local backend so
  // client-side clientFetch() calls work without nginx. Only active when
  // API_URL is set (local dev). In production, hasSource/destination check
  // prevents the self-loop that removing this originally fixed.
  async rewrites() {
    const apiUrl = (process.env.API_URL ?? "").replace(/\/+$/, "");

    if (apiUrl) {
      return [
        {
          destination: `${apiUrl}/api/:path*`,
          source: "/api/:path*",
        },
      ];
    }

    return [];
  },
};

module.exports = nextConfig;
