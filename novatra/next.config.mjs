/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
    ATOMA_API_KEY: process.env.ATOMA_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    APTOS_TEST_KEY: process.env.APTOS_TEST_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        port: '',
        pathname: '/static/img/coins/**',
      },
    ],
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

