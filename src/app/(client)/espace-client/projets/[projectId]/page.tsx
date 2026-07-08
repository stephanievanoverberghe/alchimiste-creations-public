import type { Metadata } from "next";

import { ClientProjectPage } from "@/features/client-portal/components/ClientProjectPage";
import { requireClientPortalSession } from "@/server/auth/client";
import { getClientPortalProject } from "@/server/client-portal/portal";

export const metadata: Metadata = {
    title: "Projet client — Alchimiste Créations",
    description: "Suivi privé d’un projet client Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type ClientProjectRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        validation?: string;
    }>;
};

export default async function ClientProjectRoute({
    params,
    searchParams,
}: ClientProjectRouteProps) {
    const session = await requireClientPortalSession();
    const [{ projectId }, query] = await Promise.all([params, searchParams]);
    const project = await getClientPortalProject({
        projectId,
        role: session.user.role,
        userId: session.user.id,
    });

    return (
        <ClientProjectPage
            project={project}
            validationStatus={query.validation}
        />
    );
}
