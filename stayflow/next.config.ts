import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/protected",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
