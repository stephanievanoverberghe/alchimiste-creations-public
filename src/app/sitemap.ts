import type { MetadataRoute } from "next";

import { publicIndexableRoutes } from "@/config/public-pages";
import { createSitemap } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    return createSitemap(publicIndexableRoutes);
}
