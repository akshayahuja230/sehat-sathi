import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  runtimeCaching: [
    {
      urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
      },
    },
  ],
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
      "@valibot/to-json-schema": false,
    };
    return config;
  },
};

export default withPWA(nextConfig);