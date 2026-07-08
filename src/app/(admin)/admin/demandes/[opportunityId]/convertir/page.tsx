import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OpportunityConversionWizardPage } from "@/features/requests/components/OpportunityConversionWizardPage";
import { requireAdminSession } from "@/server/auth/admin";
import { getConversionWizardData } from "@/server/project-os/conversion-wizard";

export const metadata: Metadata = {
    title: "Conversion en projet — Alchimiste Créations",
    description:
        "Assistant de conversion : pré-conditions, type de projet, playbook et modules.",
};

export const dynamic = "force-dynamic";

type ConvertOpportunityRouteProps = {
    params: Promise<{
        opportunityId: string;
    }>;
    searchParams: Promise<{
        typeId?: string;
        wizard?: string;
    }>;
};

export default async function ConvertOpportunityRoute({
    params,
    searchParams,
}: ConvertOpportunityRouteProps) {
    await requireAdminSession();

    const { opportunityId } = await params;
    const wizardParams = await searchParams;
    const data = await getConversionWizardData(
        opportunityId,
        typeof wizardParams.typeId === "string"
            ? wizardParams.typeId
            : undefined,
    );

    if (!data) {
        notFound();
    }

    return (
        <OpportunityConversionWizardPage
            data={data}
            wizardStatus={wizardParams.wizard}
        />
    );
}
