import type { Metadata } from "next";

import { AdminDesignPage } from "@/features/admin/design/AdminDesignPage";
import { requireAdminSession } from "@/server/auth/admin";

export const metadata: Metadata = {
    title: "Design system — Alchimiste Créations",
    description:
        "Référence visuelle vivante des fondations et composants transverses.",
};

export default async function AdminDesignRoute() {
    await requireAdminSession();

    return <AdminDesignPage />;
}
