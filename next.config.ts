import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger deploy ships .next/standalone + .next/static + public
  // (architecture.md §8.1).
  output: "standalone",
};

export default nextConfig;
