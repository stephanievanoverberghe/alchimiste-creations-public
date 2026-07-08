import type { Metadata } from "next";

import { ClientRequestsPage } from "@/features/client-portal/components/ClientRequestsPage";
import { requireClientPortalSession } from "@/server/auth/client";
import { getClientRequests } from "@/server/client-portal/portal";

export const metadata: Metadata = {
    robots: { follow: false, index: false },
    title: "Mes demandes — Espace client Alchimiste Créations",
};

export const dynamic = "force-dynamic";

export default async function ClientRequestsRoute() {
    const session = await requireClientPortalSession();

    const requests = await getClientRequests({
        role: session.user.role,
        userId: session.user.id,
    });

    return <ClientRequestsPage requests={requests} />;
}
