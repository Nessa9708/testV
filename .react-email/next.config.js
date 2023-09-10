/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/info', // Specify the initial page here
      },
    ];
  },
};

module.exports = nextConfig;
