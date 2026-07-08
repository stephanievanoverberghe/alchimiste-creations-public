import type { MetadataRoute } from "next";

import { robotsDisallowedRoutes } from "@/config/public-pages";
import { createRobots } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    return createRobots(robotsDisallowedRoutes);
}
