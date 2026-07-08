import type { Metadata } from "next";

import { AdminRealisationsPage } from "@/features/portfolio/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminRealisations } from "@/server/portfolio/realisations";

export const metadata: Metadata = {
    title: "Réalisations — Admin Alchimiste Créations",
    description: "Pilotage des cas portfolio et réalisations publiques.",
};

export const dynamic = "force-dynamic";

type AdminRealisationsRouteProps = {
    searchParams: Promise<{
        status?: string;
    }>;
};

export default async function AdminRealisationsRoute({
    searchParams,
}: AdminRealisationsRouteProps) {
    await requireAdminSession();

    const params = await searchParams;
    const data = await getAdminRealisations();

    return <AdminRealisationsPage data={data} status={params.status} />;
}
