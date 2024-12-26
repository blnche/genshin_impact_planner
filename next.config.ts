import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  images: {
    // domains: ['static.wikia.nocookie.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
        search: '',
      },
    ],
  },
  
};

export default nextConfig;
