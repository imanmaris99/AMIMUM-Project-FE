/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qopjphumrfywzveemvko.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'jamuiboe.com',
            },
            {
                protocol: 'https',
                hostname: 'lestarijayabangsa.com',
            },
            {
                protocol: 'https',
                hostname: 'www.hpaihalalnetwork.com',
            },
            {
                protocol: 'https',
                hostname: 'milagros.co.id',
            },
            {
                protocol: 'https',
                hostname: 'www.sunhope.co.id',
            },
            {
                protocol: 'https',
                hostname: 'hni.net',
            },
            {
                protocol: 'https',
                hostname: 'd3bbrrd0qs69m4.cloudfront.net',
            },
        ],
    },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer(nextConfig);
