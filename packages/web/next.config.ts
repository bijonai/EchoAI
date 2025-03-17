import type { NextConfig } from "next";
import dotenv from "dotenv";
import fs from "fs";

const env = dotenv.parse(fs.readFileSync('../../.env'))

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  env,
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${env.API_URL}/:path*`,
    },
  ],
};

export default nextConfig;
