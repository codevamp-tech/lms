import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  output: "standalone",
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
