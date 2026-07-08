import { realisationsProjectPages } from "@/content/realisations";

import { offerPublicRoutes } from "./offers";
import { legalRoutes, privateRoutes, publicRoutes } from "./navigation";

export const realisationPublicRoutes: readonly string[] = realisationsProjectPages.map(
    (project) => `${publicRoutes.realisations}/${project.slug}`,
);

export const legalPublicRoutes: readonly string[] = Object.values(legalRoutes);

export const publicIndexableRoutes: readonly string[] = [
    publicRoutes.home,
    publicRoutes.method,
    publicRoutes.offers,
    ...offerPublicRoutes,
    publicRoutes.realisations,
    ...realisationPublicRoutes,
    publicRoutes.about,
    publicRoutes.contact,
    publicRoutes.projectRequest,
];

export const robotsDisallowedRoutes: readonly string[] = Object.values(privateRoutes);

export const noIndexRoutes: readonly string[] = [...legalPublicRoutes];
