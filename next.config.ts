import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zhraddrgoahbhyhfqrmq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false, // Ignore 'net' module
      fs: false,  // Ignore 'fs' module
      dns: false, // Ignore 'dns' module
      child_process: false, // Ignore 'child_process' module
      tls: false, // Ignore 'tls' module
    };
    return config;
  }

  /* config options here */
};

export default withNextIntl(nextConfig);
