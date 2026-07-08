import type {
    PortfolioProjectKind,
    PortfolioPublicationStatus,
} from "@prisma/client";

import { getPrismaClient } from "@/server/db/client";

export const portfolioProjectSelect = {
    id: true,
    slug: true,
    title: true,
    shortDescription: true,
    status: true,
    kind: true,
    typeLabel: true,
    publicationStatus: true,
    isFeatured: true,
    sortOrder: true,
    coverImageUrl: true,
    heroImageUrl: true,
    imageAlt: true,
    contextTitle: true,
    contextDescription: true,
    objectives: true,
    proofs: true,
    tags: true,
    highlights: true,
    websiteUrl: true,
    publicHref: true,
    relatedOfferId: true,
    relatedOffer: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
} as const;

export async function getAdminRealisations() {
    const prisma = getPrismaClient();
    const projects = await prisma.portfolioProject.findMany({
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        select: portfolioProjectSelect,
    });

    return {
        realisations: projects,
        totals: {
            realisations: projects.length,
            published: countByPublicationStatus(projects, "PUBLISHED"),
            draft: countByPublicationStatus(projects, "DRAFT"),
            standby: countByPublicationStatus(projects, "STANDBY"),
            archived: countByPublicationStatus(projects, "ARCHIVED"),
            clientProjects: countByKind(projects, "CLIENT"),
            demos: countByKind(projects, "DEMO"),
        },
    };
}

export async function getAdminPortfolioProject(projectId: string) {
    const prisma = getPrismaClient();

    return prisma.portfolioProject.findUnique({
        where: { id: projectId },
        select: portfolioProjectSelect,
    });
}

export async function getPortfolioOfferOptions() {
    const prisma = getPrismaClient();

    return prisma.offer.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
        },
    });
}

function countByPublicationStatus(
    projects: Array<{ publicationStatus: PortfolioPublicationStatus }>,
    status: PortfolioPublicationStatus,
) {
    return projects.filter((project) => project.publicationStatus === status).length;
}

function countByKind(
    projects: Array<{ kind: PortfolioProjectKind }>,
    kind: PortfolioProjectKind,
) {
    return projects.filter((project) => project.kind === kind).length;
}
