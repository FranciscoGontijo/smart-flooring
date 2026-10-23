import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The indicator sits over the bottom action bar of the mobile forms.
  devIndicators: false,
  async headers() {
    return [
      {
        // The browser must always check for a new service worker.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
