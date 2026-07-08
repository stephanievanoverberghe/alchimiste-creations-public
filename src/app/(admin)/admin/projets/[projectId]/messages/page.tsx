import type { Metadata } from "next";

import { AdminProjectMessagesPage } from "@/features/messages/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminProjectMessages } from "@/server/messages/messages";

export const metadata: Metadata = {
    title: "Messages projet — Alchimiste Créations",
    description: "Échanges et notes internes d'un projet Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type AdminProjectMessagesRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        message?: string;
    }>;
};

export default async function AdminProjectMessagesRoute({
    params,
    searchParams,
}: AdminProjectMessagesRouteProps) {
    await requireAdminSession();

    const [{ projectId }, query] = await Promise.all([params, searchParams]);
    const data = await getAdminProjectMessages(projectId);

    return (
        <AdminProjectMessagesPage
            data={data}
            messageStatus={query.message}
        />
    );
}
