// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/ar/admin/", "/en/admin/", "/fr/admin/", "/ms/admin/", "/api/"],
            },
        ],
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    };
}