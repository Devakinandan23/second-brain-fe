import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "app.notion.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "**.medium.com" },
      { protocol: "https", hostname: "**.substack.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "21st.dev" },
      { protocol: "https", hostname: "**" },
    ],
  },
  allowedDevOrigins: ["192.168.1.6"],
};

export default nextConfig;
