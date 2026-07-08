import type { Metadata } from "next";

import { AdminHomePage } from "@/features/admin/components/AdminHomePage";
import { getAdminNowDashboard } from "@/server/admin/now-dashboard";
import { getAdminClientPortalProjects } from "@/server/client-portal/admin-actions";

export const metadata: Metadata = {
    title: "Admin — Alchimiste Créations",
    description: "Tableau de bord interne protégé Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type AdminPageProps = {
    searchParams: Promise<{
        clientAccess?: string;
    }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const [params, clientPortalProjects, nowDashboard] = await Promise.all([
        searchParams,
        getAdminClientPortalProjects(),
        getAdminNowDashboard(),
    ]);

    return (
        <AdminHomePage
            clientAccessStatus={params.clientAccess}
            clientPortalProjects={clientPortalProjects}
            nowDashboard={nowDashboard}
        />
    );
}
