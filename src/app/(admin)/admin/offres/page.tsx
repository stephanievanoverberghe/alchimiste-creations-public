import type { Metadata } from "next";

import { AdminOffersPage } from "@/features/offers/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminOffers } from "@/server/offers/offers";

export const metadata: Metadata = {
    title: "Offres — Admin Alchimiste Créations",
    description: "Catalogue des offres, familles et états de publication.",
};

export const dynamic = "force-dynamic";

type AdminOffersRouteProps = {
    searchParams: Promise<{
        status?: string;
    }>;
};

export default async function AdminOffersRoute({
    searchParams,
}: AdminOffersRouteProps) {
    await requireAdminSession();

    const params = await searchParams;
    const data = await getAdminOffers();

    return <AdminOffersPage data={data} status={params.status} />;
}
