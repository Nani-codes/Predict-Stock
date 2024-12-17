/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tremor/react'],
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
}

export default nextConfig;
