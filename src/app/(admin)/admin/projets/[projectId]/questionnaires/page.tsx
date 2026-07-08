import type { Metadata } from "next";

import { AdminProjectQuestionnairesPage } from "@/features/questionnaires/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminProjectQuestionnaires } from "@/server/questionnaires/questionnaires";

export const metadata: Metadata = {
    title: "Questionnaires projet — Alchimiste Créations",
    description: "Questionnaires et réponses client d'un projet Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type AdminProjectQuestionnairesRouteProps = {
    params: Promise<{
        projectId: string;
    }>;
    searchParams: Promise<{
        questionnaire?: string;
    }>;
};

export default async function AdminProjectQuestionnairesRoute({
    params,
    searchParams,
}: AdminProjectQuestionnairesRouteProps) {
    await requireAdminSession();

    const [{ projectId }, query] = await Promise.all([params, searchParams]);
    const data = await getAdminProjectQuestionnaires(projectId);

    return (
        <AdminProjectQuestionnairesPage
            data={data}
            questionnaireStatus={query.questionnaire}
        />
    );
}
