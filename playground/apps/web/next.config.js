/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname + '/app',
      '@/lib': __dirname + '/lib',
      '@/hooks': __dirname + '/hooks',
    };
    return config;
  },
};

module.exports = nextConfig;
