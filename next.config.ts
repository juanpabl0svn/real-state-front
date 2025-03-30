import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'es',
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false, // Ignore 'net' module
      fs: false,  // Ignore 'fs' module
      dns: false, // Ignore 'dns' module
    };
    return config;
  }

  /* config options here */
};

export default nextConfig;
