import type {
    OpportunityFit,
    OpportunityStatus,
    Prisma,
} from "@prisma/client";

export const closedOpportunityStatuses: readonly OpportunityStatus[] = [
    "ACCEPTE",
    "REFUSE",
    "PERDU_SANS_SUITE",
    "ARCHIVE",
];

export function isClosedOpportunityStatus(status: OpportunityStatus) {
    return closedOpportunityStatuses.includes(status);
}

export function requiresNextAction(status: OpportunityStatus) {
    return !isClosedOpportunityStatus(status);
}

export type OpportunityQualificationInput = {
    commercialBlocker: string | null;
    estimatedBudgetRange: string | null;
    fit: OpportunityFit;
    nextAction: string | null;
    nextFollowUpAt: Date | null;
    offerId: string | null;
    projectTypeId: string | null;
    rawNeed: string | null;
};

export function calculateOpportunityQualificationScore(
    opportunity: OpportunityQualificationInput,
) {
    const score =
        getNeedScore(opportunity.rawNeed) +
        (opportunity.projectTypeId ? 15 : 0) +
        (opportunity.offerId ? 15 : 0) +
        (opportunity.estimatedBudgetRange?.trim() ? 15 : 0) +
        getFitScore(opportunity.fit) +
        (opportunity.nextAction?.trim() ? 5 : 0) +
        (opportunity.nextFollowUpAt ? 5 : 0) -
        (opportunity.commercialBlocker?.trim() ? 15 : 0);

    return Math.max(0, Math.min(score, 100));
}

export function getOpportunityQualificationChecklist(
    opportunity: OpportunityQualificationInput,
) {
    return [
        {
            key: "need",
            label: "Besoin qualifié",
            passed: Boolean(opportunity.rawNeed?.trim()),
        },
        {
            key: "project-type",
            label: "Type confirmé",
            passed: Boolean(opportunity.projectTypeId),
        },
        {
            key: "offer",
            label: "Offre pressentie",
            passed: Boolean(opportunity.offerId),
        },
        {
            key: "budget",
            label: "Budget ou enveloppe",
            passed: Boolean(opportunity.estimatedBudgetRange?.trim()),
        },
        {
            key: "next-action",
            label: "Prochaine action",
            passed: Boolean(opportunity.nextAction?.trim()),
        },
        {
            key: "follow-up",
            label: "Relance datée",
            passed: Boolean(opportunity.nextFollowUpAt),
        },
        {
            key: "blocker",
            label: "Blocage identifié ou absent",
            passed: !opportunity.commercialBlocker?.trim(),
        },
    ];
}

export function getPhaseForStatus(
    status: OpportunityStatus,
): Prisma.OpportunityUpdateInput["phase"] {
    if (
        status === "NOUVEAU" ||
        status === "A_QUALIFIER" ||
        status === "APPEL_A_PLANIFIER" ||
        status === "APPEL_PREVU"
    ) {
        return "LEAD";
    }

    if (
        status === "PROPOSITION_A_ENVOYER" ||
        status === "DEVIS_ENVOYE" ||
        status === "NEGOCIATION_AJUSTEMENT"
    ) {
        return "DEVIS";
    }

    if (status === "ACCEPTE") return "CLIENT";

    if (isClosedOpportunityStatus(status)) return "ARCHIVE";

    return "OPPORTUNITE";
}

function getFitScore(fit: OpportunityFit) {
    if (fit === "EXCELLENT") return 25;
    if (fit === "HIGH") return 20;
    if (fit === "MEDIUM") return 12;
    if (fit === "LOW") return 4;

    return 0;
}

function getNeedScore(rawNeed: string | null) {
    const need = rawNeed?.trim() ?? "";

    if (need.length >= 120) return 20;
    if (need.length >= 40) return 14;
    if (need.length > 0) return 8;

    return 0;
}
