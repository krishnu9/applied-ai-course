import type { NextConfig } from "next";

const PROTECTED_HEADERS = [
  { key: "Cache-Control", value: "private, no-store, max-age=0" },
  { key: "Vary", value: "Cookie" },
];

const PROTECTED_SOURCES = [
  "/lessons",
  "/lessons/:path*",
  "/roadmap",
  "/roadmap.txt",
  "/about",
  "/about.txt",
];

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return PROTECTED_SOURCES.map((source) => ({
      source,
      headers: PROTECTED_HEADERS,
    }));
  },
};

export default nextConfig;
