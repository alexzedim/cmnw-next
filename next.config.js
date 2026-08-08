/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // The project uses the npm-alias `typescript → @typescript/typescript6` for
  // @typescript-eslint compatibility (peer dep <6.1.0). Next.js's default TS
  // detection cannot resolve this alias to its lib/typescript.js API path; the
  // CLI mode bypasses that check by spawning `tsc` directly.
  experimental: {
    useTypeScriptCli: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
  // No rewrites() — client-side /api/* calls are handled by passthrough route
  // handlers in app/api/** which forward to the backend via serverFetch().
  //   - Server-side: serverFetch() targets the backend directly (Docker DNS →
  //     host hairpin fallback, or API_URL in local dev).
  //   - Client-side: clientFetch() uses same-origin relative URLs that hit
  //     these route handlers, which re-issue via serverFetch().
};

module.exports = nextConfig;
