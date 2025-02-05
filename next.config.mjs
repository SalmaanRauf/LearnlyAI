/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverMinification: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
  webpack: (config) => config,
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
