import type { Metadata } from "next";

import { AdminPlaybooksPage } from "@/features/playbooks/components";
import { requireAdminSession } from "@/server/auth/admin";
import { getAdminPlaybooks } from "@/server/playbooks/playbooks";

export const metadata: Metadata = {
    title: "Playbooks — Alchimiste Créations",
    description:
        "Référentiel des playbooks Project OS dans l'admin Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

export default async function AdminPlaybooksRoute() {
    await requireAdminSession();

    const data = await getAdminPlaybooks();

    return <AdminPlaybooksPage data={data} />;
}
