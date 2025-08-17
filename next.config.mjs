/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',  // Include the protocol
        hostname: 'images.unsplash.com',  // Include the correct hostname
        pathname: '/**',  // Match all paths
      },
      {
        protocol: 'https',  // Include the protocol
        hostname: 'd3f3pssrmrg5d4.cloudfront.net',  // Include the correct hostname
        pathname: '/**',  // Match all paths
      },
      {
        protocol: 'https',  // Include the protocol
        hostname: 'd29rw3zaldax51.cloudfront.net',  // Include the correct hostname
        pathname: '/**',  // Match all paths
      },
      {
        protocol: 'https',  // Include the protocol
        hostname: 'uploadthing.com',  // Include the correct hostname
        pathname: '/**',  // Match all paths
      },
      {
        protocol: 'https',  // Include the protocol
        hostname: 'utfs.io',  // Include the correct hostname
        pathname: '/**',  // Match all paths
      },
      {
        protocol: 'https',  // Include the protocol
        hostname: 'player.cloudinary.com',  // Include the correct hostname
        pathname: '/**',  // Match all paths
      },
    ],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
