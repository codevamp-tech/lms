import type { NextConfig } from "next";

throw new Error('Site temporarily disabled')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
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
