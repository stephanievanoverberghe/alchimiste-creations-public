import type { Metadata } from "next";

import { AdminRequestsPage } from "@/features/requests/components/AdminRequestsPage";
import { requireAdminSession } from "@/server/auth/admin";

export const metadata: Metadata = {
    title: "Demandes — Admin Alchimiste Créations",
    description: "Demandes, opportunités et tunnel commercial interne.",
};

export const dynamic = "force-dynamic";

type AdminRequestsRouteProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminRequestsRoute({
    searchParams,
}: AdminRequestsRouteProps) {
    await requireAdminSession();

    return <AdminRequestsPage searchParams={await searchParams} />;
}
