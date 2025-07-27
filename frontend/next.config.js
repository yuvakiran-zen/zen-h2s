/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Handle SVG imports as React components
    config.module.rules.push({
      test: /\.svg$/i || /\.png$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
