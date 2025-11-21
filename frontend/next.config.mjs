/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["react", "react-dom"]
  }
};

export default nextConfig;
