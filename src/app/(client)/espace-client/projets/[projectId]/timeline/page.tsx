import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientProjectTimelinePage } from "@/features/timeline/components";
import { requireClientPortalSession } from "@/server/auth/client";
import { canReadProject } from "@/server/client-portal/portal";
import { getClientProjectTimeline } from "@/server/timeline/timeline";

export const metadata: Metadata = {
    title: "Timeline projet — Alchimiste Créations",
    description: "Historique visible d'un projet Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type ClientProjectTimelineRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
};

export default async function ClientProjectTimelineRoute({
    params,
}: ClientProjectTimelineRouteProps) {
    const session = await requireClientPortalSession();
    const { projectId } = await params;
    const allowed = await canReadProject({
        projectId,
        role: session.user.role,
        userId: session.user.id,
    });

    if (!allowed) {
        notFound();
    }

    const data = await getClientProjectTimeline(projectId, session.user.id);

    return <ClientProjectTimelinePage data={data} />;
}
