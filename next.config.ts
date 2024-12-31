/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.jfeed.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.jfeed.com",
        pathname: "/assets/images/**",
      },
    ],
  },
};

export default nextConfig;
