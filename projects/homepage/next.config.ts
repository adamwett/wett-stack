import type { NextConfig } from 'next';

const config: NextConfig = {
  distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
