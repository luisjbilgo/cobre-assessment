import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include the database file in the serverless function bundle for Vercel
  outputFileTracingIncludes: {
    '/api/chat': ['./public/assessment.db'],
  },
};

export default nextConfig;
