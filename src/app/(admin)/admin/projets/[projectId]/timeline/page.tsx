import type { Metadata } from "next";

import { AdminProjectTimelinePage } from "@/features/timeline/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminProjectTimeline } from "@/server/timeline/timeline";

export const metadata: Metadata = {
    title: "Timeline projet — Alchimiste Créations",
    description: "Timeline, notifications et audit d'un projet Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type AdminProjectTimelineRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        event?: string;
    }>;
};

export default async function AdminProjectTimelineRoute({
    params,
    searchParams,
}: AdminProjectTimelineRouteProps) {
    const session = await requireAdminSession();
    const [{ projectId }, query] = await Promise.all([params, searchParams]);
    const data = await getAdminProjectTimeline(projectId, session.user.id);

    return <AdminProjectTimelinePage data={data} eventStatus={query.event} />;
}
