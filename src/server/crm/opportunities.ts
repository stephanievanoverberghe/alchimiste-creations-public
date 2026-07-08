import {
    OpportunityPriority,
    OpportunityStatus,
    type Prisma,
} from "@prisma/client";

import { getPrismaClient } from "@/server/db/client";
import {
    calculateOpportunityQualificationScore,
    closedOpportunityStatuses,
} from "@/server/crm/qualification";
import {
    getCommercialPlaybookReference,
    type CommercialPlaybookReferenceStep,
} from "@/server/playbooks/commercial-reference";

const opportunitySelect = {
    id: true,
    title: true,
    status: true,
    phase: true,
    prospectName: true,
    prospectEmail: true,
    organizationName: true,
    source: true,
    rawNeed: true,
    objective: true,
    notes: true,
    maturity: true,
    estimatedBudgetRange: true,
    estimatedValueCents: true,
    probability: true,
    priority: true,
    fit: true,
    qualificationScore: true,
    nextGate: true,
    nextAction: true,
    nextFollowUpAt: true,
    lastContactAt: true,
    commercialBlocker: true,
    readyToConvert: true,
    commercialScopeUrl: true,
    proposalUrl: true,
    proposalSentAt: true,
    quoteUrl: true,
    quoteSentAt: true,
    quoteAcceptedAt: true,
    depositRequestedAt: true,
    depositReceivedAt: true,
    conversionExceptionReason: true,
    offerId: true,
    projectTypeId: true,
    createdAt: true,
    updatedAt: true,
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
    projectRequest: {
        select: {
            requestId: true,
            projectTypeLabel: true,
        },
    },
    clientAccount: {
        select: {
            id: true,
            name: true,
            status: true,
            type: true,
        },
    },
    convertedProject: {
        select: {
            id: true,
            name: true,
        },
    },
    contact: {
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            status: true,
        },
    },
} satisfies Prisma.OpportunitySelect;

export type CrmOpportunity = Prisma.OpportunityGetPayload<{
    select: typeof opportunitySelect;
}>;

export type CrmPipelineView =
    | "all"
    | "new"
    | "qualification"
    | "followups"
    | "quotes"
    | "accepted";

export type GetCrmPipelineInput = {
    offerId?: string;
    priority?: string;
    projectTypeId?: string;
    status?: string;
    view?: string;
};

export type CrmPipelineFilters = GetCrmPipelineInput;

const opportunityDetailSelect = {
    id: true,
    title: true,
    status: true,
    phase: true,
    prospectName: true,
    prospectEmail: true,
    phone: true,
    organizationName: true,
    source: true,
    conversionChannel: true,
    rawNeed: true,
    objective: true,
    notes: true,
    maturity: true,
    estimatedBudgetRange: true,
    estimatedValueCents: true,
    probability: true,
    urgency: true,
    priority: true,
    fit: true,
    qualificationScore: true,
    decisionExpected: true,
    mainObjection: true,
    nextGate: true,
    nextAction: true,
    nextFollowUpAt: true,
    lastContactAt: true,
    commercialBlocker: true,
    lostReason: true,
    readyToConvert: true,
    commercialScopeUrl: true,
    proposalUrl: true,
    proposalSentAt: true,
    quoteUrl: true,
    quoteSentAt: true,
    quoteAcceptedAt: true,
    depositRequestedAt: true,
    depositReceivedAt: true,
    depositAmountCents: true,
    conversionExceptionReason: true,
    commercialDriveUrl: true,
    offerId: true,
    projectTypeId: true,
    projectRequestId: true,
    clientAccountId: true,
    contactId: true,
    createdAt: true,
    updatedAt: true,
    convertedProject: {
        select: {
            id: true,
            name: true,
            status: true,
            stage: true,
            nextAction: true,
            createdAt: true,
            _count: {
                select: {
                    deliverables: true,
                    lots: true,
                    phases: true,
                    tasks: true,
                    validations: true,
                },
            },
            projectOsGenerations: {
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    createdAt: true,
                    status: true,
                    summary: true,
                    templateId: true,
                },
                take: 1,
            },
        },
    },
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
    projectRequest: {
        select: {
            requestId: true,
            projectTypeLabel: true,
            projectTypeRaw: true,
            fullName: true,
            email: true,
            projectName: true,
            website: true,
            description: true,
            objective: true,
            maturity: true,
            budget: true,
            deadline: true,
            constraints: true,
            attachmentUrl: true,
            attachmentName: true,
            createdAt: true,
        },
    },
    clientAccount: {
        select: {
            id: true,
            brandName: true,
            name: true,
            status: true,
            type: true,
        },
    },
    contact: {
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            organizationName: true,
            phone: true,
            status: true,
            website: true,
        },
    },
} satisfies Prisma.OpportunitySelect;

export type CrmOpportunityDetail = Prisma.OpportunityGetPayload<{
    select: typeof opportunityDetailSelect;
}>;

export type CrmCommercialProgress = {
    clientAction: string;
    completionPercent: number;
    currentStep: CommercialProgressStep;
    documents: string[];
    expectedOutput: string;
    followUp: string;
    isFollowUpOverdue: boolean;
    nextAction: string;
    nextStep: CommercialProgressStep | null;
    steps: CommercialProgressStep[];
    validation: string;
};

type CommercialProgressOpportunity = {
    commercialScopeUrl: string | null;
    convertedProject: unknown | null;
    conversionExceptionReason: string | null;
    depositReceivedAt: Date | null;
    depositRequestedAt: Date | null;
    nextAction: string | null;
    nextFollowUpAt: Date | null;
    proposalSentAt: Date | null;
    proposalUrl: string | null;
    quoteAcceptedAt: Date | null;
    quoteSentAt: Date | null;
    quoteUrl: string | null;
    rawNeed: string | null;
    readyToConvert: boolean;
    status: OpportunityStatus;
};

export type CommercialProgressStep = {
    isCurrent: boolean;
    isDone: boolean;
    order: number;
    title: string;
};

export async function getCrmPipeline(input: GetCrmPipelineInput) {
    const prisma = getPrismaClient();
    const view = normalizeView(input.view);
    const now = new Date();
    const where = buildOpportunityWhere(input, view, now);

    const [
        opportunities,
        offers,
        projectTypes,
        statusGroups,
        missingNextActionCount,
        overdueFollowUpCount,
    ] = await Promise.all([
        prisma.opportunity.findMany({
            where,
            orderBy: [
                { nextFollowUpAt: "asc" },
                { updatedAt: "desc" },
            ],
            select: opportunitySelect,
        }),
        prisma.offer.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, name: true },
        }),
        prisma.projectType.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, name: true },
        }),
        prisma.opportunity.groupBy({
            by: ["status"],
            _count: { _all: true },
        }),
        prisma.opportunity.count({
            where: {
                status: { notIn: [...closedOpportunityStatuses] },
                OR: [{ nextAction: null }, { nextAction: "" }],
            },
        }),
        prisma.opportunity.count({
            where: {
                status: { notIn: [...closedOpportunityStatuses] },
                nextFollowUpAt: { lte: now },
            },
        }),
    ]);

    const opportunitiesWithProgress = opportunities.map((opportunity) => ({
        ...opportunity,
        commercialProgress: getCrmCommercialProgress(opportunity),
    }));

    return {
        filters: {
            offerId: input.offerId ?? "",
            priority: input.priority ?? "",
            projectTypeId: input.projectTypeId ?? "",
            status: input.status ?? "",
            view,
        },
        missingNextActionCount,
        offers,
        opportunities: opportunitiesWithProgress,
        overdueFollowUpCount,
        qualificationAttentionCount:
            countOpportunitiesRequiringQualificationAttention(opportunities),
        projectTypes,
        statusCounts: buildStatusCounts(statusGroups),
    };
}

function countOpportunitiesRequiringQualificationAttention(
    opportunities: CrmOpportunity[],
) {
    return opportunities.filter((opportunity) => {
        if (closedOpportunityStatuses.includes(opportunity.status)) return false;

        const score = calculateOpportunityQualificationScore({
            commercialBlocker: opportunity.commercialBlocker,
            estimatedBudgetRange: opportunity.estimatedBudgetRange,
            fit: opportunity.fit,
            nextAction: opportunity.nextAction,
            nextFollowUpAt: opportunity.nextFollowUpAt,
            offerId: opportunity.offerId,
            projectTypeId: opportunity.projectTypeId,
            rawNeed: opportunity.rawNeed,
        });

        return score < 55;
    }).length;
}

export async function getCrmOpportunityDetail(id: string) {
    const prisma = getPrismaClient();

    const [opportunity, offers, projectTypes] = await Promise.all([
        prisma.opportunity.findUnique({
            where: { id },
            select: opportunityDetailSelect,
        }),
        prisma.offer.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, name: true },
        }),
        prisma.projectType.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, name: true },
        }),
    ]);

    return {
        commercialProgress: opportunity
            ? getCrmCommercialProgress(opportunity)
            : null,
        offers,
        opportunity,
        projectTypes,
    };
}

function getCrmCommercialProgress(
    opportunity: CommercialProgressOpportunity,
): CrmCommercialProgress | null {
    const reference = getCommercialPlaybookReference();

    if (!reference?.steps.length) {
        return null;
    }

    const currentOrder = getCommercialCurrentStepOrder(opportunity);
    const currentReference =
        reference.steps.find((step) => step.order === currentOrder) ??
        reference.steps[0];
    const nextReference =
        reference.steps.find((step) => step.order === currentReference.order + 1) ??
        null;
    const steps = reference.steps.map((step) => ({
        isCurrent: step.order === currentReference.order,
        isDone: step.order < currentReference.order,
        order: step.order,
        title: step.title,
    }));
    const nextAction = buildCommercialNextAction(opportunity, currentReference);
    const completionPercent = Math.round(
        ((currentReference.order - 1) / Math.max(reference.steps.length - 1, 1)) *
            100,
    );

    return {
        clientAction: currentReference.clientSees,
        completionPercent,
        currentStep: {
            isCurrent: true,
            isDone: false,
            order: currentReference.order,
            title: currentReference.title,
        },
        documents: currentReference.documents,
        expectedOutput: currentReference.expectedOutput,
        followUp: currentReference.followUp,
        isFollowUpOverdue: Boolean(
            opportunity.nextFollowUpAt &&
                opportunity.nextFollowUpAt.getTime() < Date.now(),
        ),
        nextAction,
        nextStep: nextReference
            ? {
                  isCurrent: false,
                  isDone: false,
                  order: nextReference.order,
                  title: nextReference.title,
              }
            : null,
        steps,
        validation: currentReference.validation,
    };
}

function getCommercialCurrentStepOrder(opportunity: CommercialProgressOpportunity) {
    if (opportunity.convertedProject) return 13;
    if (
        opportunity.readyToConvert ||
        opportunity.depositReceivedAt ||
        opportunity.conversionExceptionReason?.trim()
    ) {
        return 11;
    }
    if (opportunity.depositRequestedAt) return 10;
    if (opportunity.quoteAcceptedAt) return 9;
    if (
        opportunity.status === "NEGOCIATION_AJUSTEMENT" ||
        opportunity.status === "RELANCE_A_FAIRE"
    ) {
        return 8;
    }
    if (opportunity.quoteSentAt || opportunity.quoteUrl?.trim()) return 7;
    if (opportunity.proposalSentAt || opportunity.proposalUrl?.trim()) return 6;
    if (opportunity.commercialScopeUrl?.trim()) return 5;

    const statusStepMap: Record<OpportunityStatus, number> = {
        ACCEPTE: 10,
        APPEL_A_PLANIFIER: 4,
        APPEL_PREVU: 4,
        ARCHIVE: 8,
        A_QUALIFIER: opportunity.rawNeed?.trim() ? 3 : 2,
        CADRAGE_A_PRODUIRE: 5,
        DEVIS_ENVOYE: 7,
        NEGOCIATION_AJUSTEMENT: 8,
        NOUVEAU: 1,
        PERDU_SANS_SUITE: 8,
        PROPOSITION_A_ENVOYER: 6,
        REFUSE: 8,
        RELANCE_A_FAIRE: 8,
    };

    return statusStepMap[opportunity.status] ?? 1;
}

function buildCommercialNextAction(
    opportunity: Pick<CommercialProgressOpportunity, "nextAction">,
    currentStep: CommercialPlaybookReferenceStep,
) {
    if (opportunity.nextAction?.trim()) {
        return opportunity.nextAction;
    }

    return currentStep.todos[0] ?? "Définir la prochaine action commerciale";
}

export function getOpportunityConversionGates(
    opportunity: Pick<
        CrmOpportunityDetail,
        | "commercialBlocker"
        | "commercialScopeUrl"
        | "conversionExceptionReason"
        | "depositReceivedAt"
        | "nextAction"
        | "objective"
        | "offerId"
        | "projectTypeId"
        | "quoteAcceptedAt"
        | "quoteSentAt"
        | "quoteUrl"
        | "rawNeed"
    >,
) {
    const gates = [
        {
            key: "need",
            label: "Besoin qualifié",
            passed: Boolean(opportunity.rawNeed?.trim() || opportunity.objective?.trim()),
        },
        {
            key: "project-type",
            label: "Type de projet confirmé",
            passed: Boolean(opportunity.projectTypeId),
        },
        {
            key: "offer",
            label: "Offre pressentie confirmée",
            passed: Boolean(opportunity.offerId),
        },
        {
            key: "commercial-scope",
            label: "Cadrage commercial minimum validé",
            passed: Boolean(opportunity.commercialScopeUrl?.trim()),
        },
        {
            key: "quote-sent",
            label: "Devis envoyé",
            passed: Boolean(opportunity.quoteUrl?.trim() && opportunity.quoteSentAt),
        },
        {
            key: "quote-accepted",
            label: "Devis accepté",
            passed: Boolean(opportunity.quoteAcceptedAt),
        },
        {
            key: "deposit",
            label: "Acompte reçu ou exception écrite",
            passed: Boolean(
                opportunity.depositReceivedAt ||
                    opportunity.conversionExceptionReason?.trim(),
            ),
        },
        {
            key: "blocker",
            label: "Aucun blocage commercial actif",
            passed: !opportunity.commercialBlocker?.trim(),
        },
        {
            key: "next-action",
            label: "Prochaine action projet définie",
            passed: Boolean(opportunity.nextAction?.trim()),
        },
    ];

    return {
        gates,
        readyToConvert: gates.every((gate) => gate.passed),
    };
}

function buildOpportunityWhere(
    input: GetCrmPipelineInput,
    view: CrmPipelineView,
    now: Date,
): Prisma.OpportunityWhereInput {
    const status = parseStatus(input.status);
    const priority = parsePriority(input.priority);
    const filters: Prisma.OpportunityWhereInput[] = [
        buildViewWhere(view, now),
    ];

    if (status) filters.push({ status });
    if (priority) filters.push({ priority });
    if (input.offerId) filters.push({ offerId: input.offerId });
    if (input.projectTypeId) {
        filters.push({ projectTypeId: input.projectTypeId });
    }

    return filters.length > 1 ? { AND: filters } : filters[0];
}

function buildViewWhere(
    view: CrmPipelineView,
    now: Date,
): Prisma.OpportunityWhereInput {
    if (view === "new") return { status: "NOUVEAU" };

    if (view === "qualification") {
        return {
            status: {
                in: [
                    "A_QUALIFIER",
                    "APPEL_A_PLANIFIER",
                    "APPEL_PREVU",
                    "CADRAGE_A_PRODUIRE",
                ],
            },
        };
    }

    if (view === "followups") {
        return {
            OR: [
                { status: "RELANCE_A_FAIRE" },
                {
                    status: { notIn: [...closedOpportunityStatuses] },
                    nextFollowUpAt: { lte: now },
                },
            ],
        };
    }

    if (view === "quotes") {
        return {
            status: {
                in: [
                    "PROPOSITION_A_ENVOYER",
                    "DEVIS_ENVOYE",
                    "NEGOCIATION_AJUSTEMENT",
                ],
            },
        };
    }

    if (view === "accepted") return { status: "ACCEPTE" };

    return {};
}

export function normalizeView(view: string | undefined): CrmPipelineView {
    const allowedViews: CrmPipelineView[] = [
        "all",
        "new",
        "qualification",
        "followups",
        "quotes",
        "accepted",
    ];

    return allowedViews.includes(view as CrmPipelineView)
        ? (view as CrmPipelineView)
        : "all";
}

function parseStatus(value: string | undefined) {
    if (!value) return null;

    return Object.values(OpportunityStatus).includes(value as OpportunityStatus)
        ? (value as OpportunityStatus)
        : null;
}

function parsePriority(value: string | undefined) {
    if (!value) return null;

    return Object.values(OpportunityPriority).includes(
        value as OpportunityPriority,
    )
        ? (value as OpportunityPriority)
        : null;
}

function buildStatusCounts(
    groups: Array<{
        status: OpportunityStatus;
        _count: { _all: number };
    }>,
) {
    return Object.fromEntries(
        groups.map((group) => [group.status, group._count._all]),
    ) as Partial<Record<OpportunityStatus, number>>;
}
