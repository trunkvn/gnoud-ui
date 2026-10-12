import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/docs", destination: "/docs/getting-started", permanent: false },
      { source: "/docs/components", destination: "/docs/components/button", permanent: false },
      // components used to live at /components/*
      { source: "/components/:name", destination: "/docs/components/:name", permanent: true },
    ];
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
