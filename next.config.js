/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure images so Plesk server processes Unsplash portraits correctly with absolute VPS stability
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'woodworker.org.uk',
      },
    ],
  },
};

export default nextConfig;
