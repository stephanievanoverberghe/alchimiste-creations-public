import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientProjectQuestionnairesPage } from "@/features/questionnaires/components";
import { requireClientPortalSession } from "@/server/auth/client";
import { canReadProject } from "@/server/client-portal/portal";
import { getClientProjectQuestionnaires } from "@/server/questionnaires/questionnaires";

export const metadata: Metadata = {
    title: "Questionnaires projet — Alchimiste Créations",
    description: "Questionnaires et réponses liés à un projet Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type ClientProjectQuestionnairesRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        answer?: string;
    }>;
};

export default async function ClientProjectQuestionnairesRoute({
    params,
    searchParams,
}: ClientProjectQuestionnairesRouteProps) {
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

    const data = await getClientProjectQuestionnaires({
        projectId,
        userId: session.user.id,
    });

    return (
        <ClientProjectQuestionnairesPage
            answerStatus={query.answer}
            data={data}
        />
    );
}
