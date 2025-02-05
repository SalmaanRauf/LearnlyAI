
/** @type {import('next').NextConfig} */
const nextConfig = {
  webSocketTimeout: 30000,
  experimental: {
    serverMinification: false,
  },
  async headers() {
    return [];
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
