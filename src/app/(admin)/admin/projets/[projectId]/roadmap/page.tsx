import type { Metadata } from "next";

import { AdminProjectRoadmapPage } from "@/features/roadmap/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminProjectRoadmap } from "@/server/roadmap/roadmap";

export const metadata: Metadata = {
    title: "Roadmap projet — Alchimiste Créations",
    description: "Roadmap Project OS interne d'un projet Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type AdminProjectRoadmapRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
};

export default async function AdminProjectRoadmapRoute({
    params,
}: AdminProjectRoadmapRouteProps) {
    await requireAdminSession();

    const { projectId } = await params;
    const project = await getAdminProjectRoadmap(projectId);

    return <AdminProjectRoadmapPage project={project} />;
}
