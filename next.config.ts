import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MODEL_URL: process.env.NEXT_PUBLIC_MODEL_URL,
  },
  images: {
    domains: ["www.vecteezy.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.globalObject = "self";
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      });
    }
    return config;
  },
  experimental: {
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
};

export default nextConfig;
