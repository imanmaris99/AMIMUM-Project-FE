/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["hni.net", "d3bbrrd0qs69m4.cloudfront.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qopjphumrfywzveemvko.supabase.co",
      },
      {
        protocol: "https",
        hostname: "jamuiboe.com",
      },
      {
        protocol: "https",
        hostname: "lestarijayabangsa.com",
      },
      {
        protocol: "https",
        hostname: "www.hpaihalalnetwork.com",
      },
      {
        protocol: "https",
        hostname: "milagros.co.id",
      },
    ],
  },
};

export default nextConfig;
