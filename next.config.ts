import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
    // Turbopack native loader rule (Replaces old webpack rule block)
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
        },
    },

    // Note: Next.js 16's `cacheComponents` flag (the new home for Partial
    // Prerendering) is intentionally NOT enabled here. It makes every route
    // dynamic-by-default and requires migrating unstable_cache-based data
    // fetching (see src/lib/publications.ts) to the new "use cache" directive
    // app-wide — a bigger, separate migration. The Suspense split in the
    // publications category page already fixes the perceived navigation
    // delay without it.
};

export default withNextIntl(nextConfig);