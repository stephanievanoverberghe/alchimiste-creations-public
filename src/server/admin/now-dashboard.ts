import { getPrismaClient } from "@/server/db/client";

const qualificationStatuses = [
    "NOUVEAU",
    "A_QUALIFIER",
    "APPEL_A_PLANIFIER",
    "APPEL_PREVU",
] as const;

const activeOpportunityStatuses = [
    "NOUVEAU",
    "A_QUALIFIER",
    "APPEL_A_PLANIFIER",
    "APPEL_PREVU",
    "CADRAGE_A_PRODUIRE",
    "PROPOSITION_A_ENVOYER",
    "DEVIS_ENVOYE",
    "NEGOCIATION_AJUSTEMENT",
    "RELANCE_A_FAIRE",
] as const;

const quoteStatuses = [
    "DEVIS_ENVOYE",
    "NEGOCIATION_AJUSTEMENT",
] as const;

const collectableFinancialStatuses = [
    "SENT",
    "ACCEPTED",
    "TO_INVOICE",
    "ISSUED",
    "LATE",
] as const;

export async function getAdminNowDashboard() {
    const prisma = getPrismaClient();
    const todayEnd = getTodayEnd();

    const [
        opportunitiesToQualify,
        followUpsDue,
        quotesWithoutFollowUp,
        blockedProjects,
        pendingClientValidations,
        invoicesToCollect,
        recentNotifications,
        recentTimelineEvents,
        weeklyFocus,
        counts,
    ] = await Promise.all([
        prisma.opportunity.findMany({
            where: {
                status: {
                    in: [...qualificationStatuses],
                },
            },
            orderBy: [{ updatedAt: "desc" }],
            select: opportunityItemSelect,
            take: 6,
        }),
        prisma.opportunity.findMany({
            where: {
                nextFollowUpAt: {
                    lte: todayEnd,
                },
                status: {
                    in: [...activeOpportunityStatuses],
                },
            },
            orderBy: [{ nextFollowUpAt: "asc" }],
            select: opportunityItemSelect,
            take: 8,
        }),
        prisma.opportunity.findMany({
            where: {
                nextFollowUpAt: null,
                quoteUrl: {
                    not: null,
                },
                status: {
                    in: [...quoteStatuses],
                },
            },
            orderBy: [{ quoteSentAt: "asc" }, { updatedAt: "desc" }],
            select: {
                id: true,
                prospectName: true,
                quoteSentAt: true,
                status: true,
                title: true,
            },
            take: 6,
        }),
        prisma.project.findMany({
            where: {
                hasActiveBlocker: true,
            },
            orderBy: [{ updatedAt: "desc" }],
            select: {
                id: true,
                name: true,
                nextAction: true,
                stage: true,
                status: true,
                updatedAt: true,
            },
            take: 6,
        }),
        prisma.validation.findMany({
            where: {
                isClientVisible: true,
                status: "PENDING",
                type: "CLIENT",
            },
            orderBy: [{ createdAt: "desc" }],
            select: {
                id: true,
                createdAt: true,
                title: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            take: 8,
        }),
        prisma.financialDocument.findMany({
            where: {
                status: {
                    in: [...collectableFinancialStatuses],
                },
            },
            orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
            select: {
                id: true,
                amountCents: true,
                clientName: true,
                dueAt: true,
                reference: true,
                status: true,
                type: true,
                project: {
                    select: {
                        name: true,
                    },
                },
            },
            take: 8,
        }),
        prisma.notification.findMany({
            orderBy: [{ createdAt: "desc" }],
            select: {
                id: true,
                actionHref: true,
                body: true,
                createdAt: true,
                priority: true,
                status: true,
                title: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            take: 8,
        }),
        prisma.timelineEvent.findMany({
            orderBy: [{ happenedAt: "desc" }],
            select: {
                id: true,
                happenedAt: true,
                kind: true,
                title: true,
                visibility: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            take: 8,
        }),
        getWeeklyFocus(prisma),
        getDashboardCounts(prisma, todayEnd),
    ]);

    return {
        blockedProjects,
        counts,
        followUpsDue,
        invoicesToCollect,
        opportunitiesToQualify,
        pendingClientValidations,
        quotesWithoutFollowUp,
        recentNotifications,
        recentTimelineEvents,
        weeklyFocus,
    };
}

// The week's work: for each active project, the current phase and its
// open deliverables and blocking actions - the Scrum view of the cascade.
async function getWeeklyFocus(prisma: ReturnType<typeof getPrismaClient>) {
    const projects = await prisma.project.findMany({
        where: {
            status: {
                in: ["PREPARATION", "EN_COURS", "EN_VALIDATION"],
            },
        },
        orderBy: [{ updatedAt: "desc" }],
        select: {
            id: true,
            name: true,
            nextAction: true,
            hasActiveBlocker: true,
            phases: {
                where: {
                    status: {
                        in: ["TODO", "IN_PROGRESS"],
                    },
                },
                orderBy: [{ sortOrder: "asc" }],
                take: 1,
                select: {
                    id: true,
                    name: true,
                    deliverables: {
                        where: {
                            status: {
                                in: ["TODO", "IN_PROGRESS"],
                            },
                        },
                        select: { id: true },
                    },
                    actions: {
                        where: {
                            isBlocking: true,
                            status: {
                                in: ["TODO", "IN_PROGRESS"],
                            },
                        },
                        select: { id: true },
                    },
                },
            },
        },
        take: 6,
    });

    return projects.map((project) => {
        const currentPhase = project.phases[0] ?? null;

        return {
            currentPhaseName: currentPhase?.name ?? null,
            hasActiveBlocker: project.hasActiveBlocker,
            id: project.id,
            name: project.name,
            nextAction: project.nextAction,
            openBlockingActions: currentPhase?.actions.length ?? 0,
            openDeliverables: currentPhase?.deliverables.length ?? 0,
        };
    });
}

const opportunityItemSelect = {
    id: true,
    nextAction: true,
    nextFollowUpAt: true,
    priority: true,
    prospectName: true,
    status: true,
    title: true,
} as const;

async function getDashboardCounts(
    prisma: ReturnType<typeof getPrismaClient>,
    todayEnd: Date,
) {
    const [
        opportunitiesToQualify,
        followUpsDue,
        quotesWithoutFollowUp,
        blockedProjects,
        pendingClientValidations,
        invoicesToCollect,
        activeProjects,
        openQuestionnaires,
        unreadNotifications,
    ] = await Promise.all([
        prisma.opportunity.count({
            where: {
                status: {
                    in: [...qualificationStatuses],
                },
            },
        }),
        prisma.opportunity.count({
            where: {
                nextFollowUpAt: {
                    lte: todayEnd,
                },
                status: {
                    in: [...activeOpportunityStatuses],
                },
            },
        }),
        prisma.opportunity.count({
            where: {
                nextFollowUpAt: null,
                quoteUrl: {
                    not: null,
                },
                status: {
                    in: [...quoteStatuses],
                },
            },
        }),
        prisma.project.count({
            where: {
                hasActiveBlocker: true,
            },
        }),
        prisma.validation.count({
            where: {
                isClientVisible: true,
                status: "PENDING",
                type: "CLIENT",
            },
        }),
        prisma.financialDocument.count({
            where: {
                status: {
                    in: [...collectableFinancialStatuses],
                },
            },
        }),
        prisma.project.count({
            where: {
                status: {
                    in: ["PREPARATION", "EN_COURS", "EN_VALIDATION"],
                },
            },
        }),
        prisma.questionnaire.count({
            where: {
                isClientVisible: true,
                status: {
                    in: ["SENT", "IN_PROGRESS"],
                },
            },
        }),
        prisma.notification.count({
            where: {
                status: "UNREAD",
            },
        }),
    ]);

    return {
        activeProjects,
        blockedProjects,
        followUpsDue,
        invoicesToCollect,
        openQuestionnaires,
        opportunitiesToQualify,
        pendingClientValidations,
        quotesWithoutFollowUp,
        unreadNotifications,
    };
}

function getTodayEnd() {
    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
    );
}
