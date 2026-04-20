/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    images: {
        // Only allow hostnames that are actually used in API responses
        // This improves security by limiting external image sources
        remotePatterns: [
            // Supabase storage (primary image source - trusted domain)
            {
                protocol: 'https',
                hostname: 'qopjphumrfywzveemvko.supabase.co',
            },
            // Note: Brand websites are NOT included here because:
            // 1. They use regular <img> tags (not Next.js Image) to prevent retry loops
            // 2. Some domains (www.hpaihalalnetwork.com, lestarijayabangsa.com) are unreliable
            // 3. This prevents Next.js Image optimizer from attempting to fetch these images
            // If you need to use Next.js Image for these domains in the future, add them back
            // but ensure they are reliable and accessible
        ],
        // Security settings for external images
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        // Image optimization settings
        formats: ['image/avif', 'image/webp'],
        // Minimum cache time for external images (in seconds)
        minimumCacheTTL: 60,
        // Disable image optimization for external images that might fail
        // This prevents retry loops and improves performance
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Disable image optimization for problematic domains to prevent retry loops
        // Note: This only affects Next.js Image component, not regular img tags
        unoptimized: false, // Keep false to allow optimization for trusted domains
    },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer(nextConfig);
