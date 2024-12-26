/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.jfeed.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
