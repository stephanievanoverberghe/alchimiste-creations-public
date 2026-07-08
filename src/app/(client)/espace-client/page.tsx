import type { Metadata } from "next";

import { ClientPortalHomePage } from "@/features/client-portal/components/ClientPortalHomePage";
import { requireClientPortalSession } from "@/server/auth/client";
import { getClientPortalHome } from "@/server/client-portal/portal";

export const metadata: Metadata = {
    title: "Espace client — Alchimiste Créations",
    description: "Suivi privé des projets clients Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

export default async function ClientPortalRoute() {
    const session = await requireClientPortalSession();
    const data = await getClientPortalHome({
        role: session.user.role,
        userId: session.user.id,
    });

    return <ClientPortalHomePage data={data} session={session} />;
}
