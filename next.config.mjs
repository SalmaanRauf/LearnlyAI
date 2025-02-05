
/** @type {import('next').NextConfig} */
const nextConfig = {
  webSocketTimeout: 30000,
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
  webpack: (config) => {
    return config;
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
};

export default nextConfig;
