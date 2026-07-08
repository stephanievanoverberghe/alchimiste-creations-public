import type { Metadata } from "next";

import { AdminOfferFamilyCreatePage } from "@/features/offers/components/OfferCreateForms";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminMediaAssets } from "@/server/media/media";

export const metadata: Metadata = {
    title: "Créer une famille d'offres — Admin Alchimiste Créations",
    description: "Création d'une famille commerciale pour le catalogue CRM.",
};

export const dynamic = "force-dynamic";

export default async function AdminNewOfferFamilyRoute() {
    await requireAdminSession();

    const mediaAssets = await getAdminMediaAssets({ status: "ACTIVE" });

    return <AdminOfferFamilyCreatePage mediaAssets={mediaAssets} />;
}
