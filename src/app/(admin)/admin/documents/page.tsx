import type { Metadata } from "next";

import { AdminDocumentsPage } from "@/features/documents/components/AdminDocumentsPage";
import { requireAdminSession } from "@/server/auth/admin";

export const metadata: Metadata = {
    title: "Documents — Alchimiste Créations",
    description: "Documents référencés dans le CRM interne Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type AdminDocumentsRouteProps = {
    searchParams: Promise<{
        created?: string;
    }>;
};

export default async function AdminDocumentsRoute({
    searchParams,
}: AdminDocumentsRouteProps) {
    await requireAdminSession();

    const params = await searchParams;

    return <AdminDocumentsPage createdStatus={params.created} />;
}
