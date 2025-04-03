/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Set to static export
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip trying to initialize Firebase during build
  webpack: (config) => {
    // This tells webpack to ignore firebase imports during build
    if (typeof window === 'undefined') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'firebase/app': false,
        'firebase/auth': false,
        'firebase/firestore': false,
      };
    }
    return config;
  },
};

export default nextConfig;
