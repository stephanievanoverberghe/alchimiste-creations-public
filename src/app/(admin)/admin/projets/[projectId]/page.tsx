import type { Metadata } from "next";

import { AdminProjectCockpitPage } from "@/features/projects/cockpit/AdminProjectCockpitPage";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminProjectCockpit } from "@/server/projects/cockpit";

export const metadata: Metadata = {
    title: "Cockpit projet — Alchimiste Créations",
    description:
        "Fil rouge du projet : phase courante, prochaine action, gates et blocages.",
};

export const dynamic = "force-dynamic";

type ProjectCockpitRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        actions?: string;
        blocker?: string;
        deliverables?: string;
        gate?: string;
        generation?: string;
    }>;
};

export default async function ProjectCockpitRoute({
    params,
    searchParams,
}: ProjectCockpitRouteProps) {
    await requireAdminSession();

    const { projectId } = await params;
    const status = await searchParams;
    const project = await getAdminProjectCockpit(projectId);

    return (
        <AdminProjectCockpitPage
            gateStatus={status.gate}
            gateBlockedDetails={
                status.gate === "blocked"
                    ? {
                          blockerActive: status.blocker === "1",
                          openBlockingActions: Number(status.actions ?? 0),
                          openDeliverables: Number(status.deliverables ?? 0),
                      }
                    : null
            }
            generationStatus={status.generation}
            project={project}
        />
    );
}
