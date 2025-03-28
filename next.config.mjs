import path from "path";
import { fileURLToPath } from "url";

// 👇 Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  },
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "app");
    return config;
  },
};

export default nextConfig;
