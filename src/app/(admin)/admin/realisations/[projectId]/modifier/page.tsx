import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioProjectCreatePage } from "@/features/portfolio/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminMediaAssets } from "@/server/media/media";
import {
    getAdminPortfolioProject,
    getPortfolioOfferOptions,
} from "@/server/portfolio/realisations";

export const metadata: Metadata = {
    title: "Modifier une réalisation — Admin Alchimiste Créations",
    description: "Modification d'une réalisation du portfolio admin.",
};

export const dynamic = "force-dynamic";

type AdminEditRealisationRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
};

export default async function AdminEditRealisationRoute({
    params,
}: AdminEditRealisationRouteProps) {
    await requireAdminSession();

    const { projectId } = await params;
    const [project, mediaAssets, offers] = await Promise.all([
        getAdminPortfolioProject(projectId),
        getAdminMediaAssets({ status: "ACTIVE" }),
        getPortfolioOfferOptions(),
    ]);

    if (!project) {
        notFound();
    }

    return (
        <PortfolioProjectCreatePage
            mediaAssets={mediaAssets}
            offers={offers}
            project={project}
        />
    );
}
