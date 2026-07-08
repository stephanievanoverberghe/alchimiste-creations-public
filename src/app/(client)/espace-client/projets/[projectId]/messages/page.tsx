import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientProjectMessagesPage } from "@/features/messages/components";
import { requireClientPortalSession } from "@/server/auth/client";
import { canReadProject } from "@/server/client-portal/portal";
import { getClientProjectMessages } from "@/server/messages/messages";

export const metadata: Metadata = {
    title: "Messages projet — Alchimiste Créations",
    description: "Échanges privés liés à un projet Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type ClientProjectMessagesRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        message?: string;
    }>;
};

export default async function ClientProjectMessagesRoute({
    params,
    searchParams,
}: ClientProjectMessagesRouteProps) {
    const session = await requireClientPortalSession();
    const [{ projectId }, query] = await Promise.all([params, searchParams]);
    const allowed = await canReadProject({
        projectId,
        role: session.user.role,
        userId: session.user.id,
    });

    if (!allowed) {
        notFound();
    }

    const data = await getClientProjectMessages(projectId);

    return <ClientProjectMessagesPage data={data} messageStatus={query.message} />;
}
