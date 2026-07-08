import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPlaybookDetailPage } from "@/features/playbooks/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminPlaybook } from "@/server/playbooks/playbooks";

export const metadata: Metadata = {
    title: "Playbook — Admin Alchimiste Créations",
    description: "Détail d'un template Project OS en lecture seule.",
};

export const dynamic = "force-dynamic";

type AdminPlaybookDetailRouteProps = {
    params: Promise<{
        templateId: string;
    }>;
};

export default async function AdminPlaybookDetailRoute({
    params,
}: AdminPlaybookDetailRouteProps) {
    await requireAdminSession();

    const { templateId } = await params;
    const playbook = await getAdminPlaybook(templateId);

    if (!playbook) {
        notFound();
    }

    return <AdminPlaybookDetailPage playbook={playbook} />;
}
