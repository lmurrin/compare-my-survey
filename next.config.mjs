import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    serverUrl: 'http://localhost:8000', // Update with your server URL
    apiKey: 'ValleyView8646*', // Update with your API key
  },
  webpack(config) {
    // Add alias configuration
    config.resolve.alias['@'] = path.resolve(__dirname); // Ensure the alias points to your project root
    return config;
  },
};

export default nextConfig;
