import type { Metadata } from "next";

import { PortfolioProjectCreatePage } from "@/features/portfolio/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminMediaAssets } from "@/server/media/media";
import { getPortfolioOfferOptions } from "@/server/portfolio/realisations";

export const metadata: Metadata = {
    title: "Créer une réalisation — Admin Alchimiste Créations",
    description: "Création d'une réalisation dans le portfolio admin.",
};

export const dynamic = "force-dynamic";

export default async function AdminNewRealisationRoute() {
    await requireAdminSession();

    const [mediaAssets, offers] = await Promise.all([
        getAdminMediaAssets({ status: "ACTIVE" }),
        getPortfolioOfferOptions(),
    ]);

    return <PortfolioProjectCreatePage mediaAssets={mediaAssets} offers={offers} />;
}
