import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export const noIndexRobots = {
    index: false,
    follow: false,
} as const;

export function getSiteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url).replace(/\/$/, "");
}

export function toAbsoluteUrl(path: string) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${getSiteUrl()}${normalizedPath}`;
}

export function createSitemap(
    routes: readonly string[],
): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return routes.map((route) => ({
        url: toAbsoluteUrl(route),
        lastModified,
    }));
}

export function createRobots(
    disallow: readonly string[],
): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [...disallow],
        },
        sitemap: toAbsoluteUrl("/sitemap.xml"),
    };
}
