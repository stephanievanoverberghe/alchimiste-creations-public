import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminOfferFamilyCreatePage } from "@/features/offers/components/OfferCreateForms";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminMediaAssets } from "@/server/media/media";
import { getAdminOfferFamily } from "@/server/offers/offers";

export const metadata: Metadata = {
    title: "Modifier une famille d'offres — Admin Alchimiste Créations",
    description: "Modification d'une famille commerciale du catalogue CRM.",
};

export const dynamic = "force-dynamic";

type AdminEditOfferFamilyRouteProps = {
    params: Promise<{
        familyId: string;
    }>;
};

export default async function AdminEditOfferFamilyRoute({
    params,
}: AdminEditOfferFamilyRouteProps) {
    await requireAdminSession();

    const { familyId } = await params;
    const [family, mediaAssets] = await Promise.all([
        getAdminOfferFamily(familyId),
        getAdminMediaAssets({ status: "ACTIVE" }),
    ]);

    if (!family) {
        notFound();
    }

    return <AdminOfferFamilyCreatePage family={family} mediaAssets={mediaAssets} />;
}
