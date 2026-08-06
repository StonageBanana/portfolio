import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Rewrites barrel imports to deep paths so a single icon doesn't pull the set.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
