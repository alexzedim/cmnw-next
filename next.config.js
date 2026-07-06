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
  // No rewrites() — the old /api/:path* rewrite caused a self-loop in
  // production (Next.js proxying /api to itself). API calls now go directly:
  //   - Server-side: serverFetch() in lib/api/origins.ts targets the backend
  //     (cmnw-api:8080 → 128.0.0.255:8080 fallback).
  //   - Client-side: clientFetch() uses same-origin relative URLs; nginx
  //     proxies /api/ to the backend for all domains.
};

module.exports = nextConfig;
