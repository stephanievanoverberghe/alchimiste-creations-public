import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DemandOpportunityDetailPage } from "@/features/requests/components/DemandOpportunityDetailPage";
import { requireAdminSession } from "@/server/auth/admin";
import { getCrmOpportunityDetail } from "@/server/crm/opportunities";

export const metadata: Metadata = {
    title: "Fiche demande — Alchimiste Créations",
    description: "Qualification commerciale interne Alchimiste Créations.",
};

export const dynamic = "force-dynamic";

type DemandOpportunityDetailRouteProps = {
    params: Promise<{
        opportunityId: string;
    }>;
    searchParams: Promise<{
        conversion?: string;
        qualification?: string;
        projectOs?: string;
        projectId?: string;
    }>;
};

export default async function DemandOpportunityDetailRoute({
    params,
    searchParams,
}: DemandOpportunityDetailRouteProps) {
    await requireAdminSession();

    const { opportunityId } = await params;
    const conversionParams = await searchParams;
    const data = await getCrmOpportunityDetail(opportunityId);

    if (!data.opportunity) {
        notFound();
    }

    return (
        <DemandOpportunityDetailPage
            commercialProgress={data.commercialProgress}
            conversionStatus={conversionParams.conversion}
            offers={data.offers}
            opportunity={data.opportunity}
            projectOsStatus={conversionParams.projectOs}
            projectId={conversionParams.projectId}
            projectTypes={data.projectTypes}
            qualificationStatus={conversionParams.qualification}
        />
    );
}
