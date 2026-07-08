import type { Metadata } from "next";

import { ClientProjectsListPage } from "@/features/client-portal/components/ClientProjectsListPage";
import { requireClientPortalSession } from "@/server/auth/client";
import { getClientProjects } from "@/server/client-portal/portal";

export const metadata: Metadata = {
    robots: { follow: false, index: false },
    title: "Mes projets — Espace client Alchimiste Créations",
};

export const dynamic = "force-dynamic";

export default async function ClientProjectsRoute() {
    const session = await requireClientPortalSession();

    const projects = await getClientProjects({
        role: session.user.role,
        userId: session.user.id,
    });

    return <ClientProjectsListPage projects={projects} />;
}
