import { getOpportunityConversionGates } from "@/server/crm/opportunities";
import { getPrismaClient } from "@/server/db/client";
import { getConversionPlaybookPreview } from "@/server/project-os/generation";

export async function getConversionWizardData(
    opportunityId: string,
    typeIdOverride?: string,
) {
    const prisma = getPrismaClient();

    const opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId },
        select: {
            id: true,
            title: true,
            prospectName: true,
            prospectEmail: true,
            organizationName: true,
            commercialBlocker: true,
            commercialScopeUrl: true,
            conversionExceptionReason: true,
            depositAmountCents: true,
            depositReceivedAt: true,
            estimatedValueCents: true,
            nextAction: true,
            objective: true,
            offerId: true,
            projectTypeId: true,
            quoteAcceptedAt: true,
            quoteSentAt: true,
            quoteUrl: true,
            rawNeed: true,
            offer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            projectType: {
                select: {
                    id: true,
                    name: true,
                },
            },
            convertedProject: {
                select: { id: true },
            },
        },
    });

    if (!opportunity) return null;

    const readiness = getOpportunityConversionGates(opportunity);
    const projectTypes = await prisma.projectType.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
            id: true,
            name: true,
        },
    });

    const selectedTypeId =
        typeIdOverride &&
        projectTypes.some((projectType) => projectType.id === typeIdOverride)
            ? typeIdOverride
            : opportunity.projectTypeId;

    const preview = selectedTypeId
        ? await getConversionPlaybookPreview(selectedTypeId)
        : null;

    return {
        opportunity,
        preview,
        projectTypes,
        readiness,
        selectedTypeId,
    };
}
