module.exports = {
  // ...existing code...
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false, // Ignore 'net' module
      fs: false,  // Ignore 'fs' module
      dns: false, // Ignore 'dns' module
    };
    return config;
  },
};