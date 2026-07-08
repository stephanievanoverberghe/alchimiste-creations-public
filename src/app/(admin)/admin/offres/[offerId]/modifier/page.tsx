import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminOfferCreatePage } from "@/features/offers/components/OfferCreateForms";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminMediaAssets } from "@/server/media/media";
import { getAdminOffer, getAdminOffers } from "@/server/offers/offers";

export const metadata: Metadata = {
    title: "Modifier une offre — Admin Alchimiste Créations",
    description: "Modification d'une offre du catalogue CRM.",
};

export const dynamic = "force-dynamic";

type AdminEditOfferRouteProps = {
    params: Promise<{
        offerId: string;
    }>;
};

export default async function AdminEditOfferRoute({
    params,
}: AdminEditOfferRouteProps) {
    await requireAdminSession();

    const { offerId } = await params;
    const [offer, data, mediaAssets] = await Promise.all([
        getAdminOffer(offerId),
        getAdminOffers(),
        getAdminMediaAssets({ status: "ACTIVE" }),
    ]);

    if (!offer) {
        notFound();
    }

    return (
        <AdminOfferCreatePage
            families={data.families}
            mediaAssets={mediaAssets}
            offer={offer}
        />
    );
}
