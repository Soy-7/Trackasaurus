/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
  reactStrictMode: true,
  // Make sure output isn't set to 'export' unless you want a static site
  // output: 'export',
  eslint: {
    // This ignores ESLint errors during the build process
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
