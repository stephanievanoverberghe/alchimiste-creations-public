import type { Metadata } from "next";

import { AdminOfferCreatePage } from "@/features/offers/components/OfferCreateForms";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminMediaAssets } from "@/server/media/media";
import { getAdminOffers } from "@/server/offers/offers";

export const metadata: Metadata = {
    title: "Créer une offre — Admin Alchimiste Créations",
    description: "Création d'une offre dans le catalogue CRM.",
};

export const dynamic = "force-dynamic";

export default async function AdminNewOfferRoute() {
    await requireAdminSession();

    const [data, mediaAssets] = await Promise.all([
        getAdminOffers(),
        getAdminMediaAssets({ status: "ACTIVE" }),
    ]);

    return <AdminOfferCreatePage families={data.families} mediaAssets={mediaAssets} />;
}
