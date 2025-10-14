import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ❌ Ignore TypeScript errors during production build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❌ Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
