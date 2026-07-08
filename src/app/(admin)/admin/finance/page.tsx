import type { Metadata } from "next";

import { AdminFinancePage } from "@/features/finance/components/AdminFinancePage";
import { requireAdminSession } from "@/server/auth/admin";

export const metadata: Metadata = {
    title: "Finance — Alchimiste Créations",
    description: "Devis, factures et paiements dans le CRM interne Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type AdminFinanceRouteProps = {
    searchParams: Promise<{
        created?: string;
    }>;
};

export default async function AdminFinanceRoute({
    searchParams,
}: AdminFinanceRouteProps) {
    await requireAdminSession();

    const params = await searchParams;

    return <AdminFinancePage createdStatus={params.created} />;
}
