/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    // domains: ["utfs.io"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
