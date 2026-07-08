import type { Metadata } from "next";

import { ProjectDocumentsPage } from "@/features/documents/components/ProjectDocumentsPage";
import { requireAdminSession } from "@/server/auth/admin";
import { getProjectDocumentsOverview } from "@/server/documents/composer";

export const metadata: Metadata = {
    title: "Documents du projet — Alchimiste Créations",
    description: "Documents composés et fichiers référencés du projet.",
};

export const dynamic = "force-dynamic";

type ProjectDocumentsRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        document?: string;
    }>;
};

export default async function ProjectDocumentsRoute({
    params,
    searchParams,
}: ProjectDocumentsRouteProps) {
    await requireAdminSession();

    const { projectId } = await params;
    const status = await searchParams;
    const data = await getProjectDocumentsOverview(projectId);

    return <ProjectDocumentsPage data={data} documentStatus={status.document} />;
}
