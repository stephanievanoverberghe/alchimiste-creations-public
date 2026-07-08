import type { Metadata } from "next";

import { AdminProjectsPage } from "@/features/projects/components/AdminProjectsPage";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminProjects } from "@/server/projects/projects";

export const metadata: Metadata = {
    title: "Projets — Admin Alchimiste Créations",
    description: "Pilotage des projets convertis Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsRoute() {
    await requireAdminSession();

    const data = await getAdminProjects();

    return <AdminProjectsPage data={data} />;
}
