import { notFound } from "next/navigation";
import type { Prisma, UserRole } from "@prisma/client";

import { getPrismaClient } from "@/server/db/client";

type ClientProjectAccessRow = {
    projectId: string;
};

type ClientPortalIdentity = {
    clientAccountIds: string[];
    contactIds: string[];
    email: string | null;
};

type ClientRoadmapItemRow = {
    id: string;
    phaseId: string | null;
    status: string;
    title: string;
    type: string | null;
};

type ClientRoadmapPhase = {
    id: string;
    name: string;
    status: string;
};

export async function getClientPortalHome(input: {
    role: UserRole;
    userId: string;
}) {
    const prisma = getPrismaClient();
    const identity = await getClientPortalIdentity(input.userId);
    const projectIds = await getAccessibleProjectIds(input, identity);

    if (
        projectIds.length === 0 &&
        identity.clientAccountIds.length === 0 &&
        identity.contactIds.length === 0 &&
        !identity.email
    ) {
        const notifications = await getClientPortalNotifications(input.userId);

        return {
            notifications,
            openQuestionnaires: [],
            pendingValidations: [],
            projects: [],
            projectRequests: [],
        };
    }

    const [
        projects,
        projectRequests,
        notifications,
        openQuestionnaires,
        pendingValidations,
    ] = await Promise.all([
        prisma.project.findMany({
            where: {
                id: {
                    in: projectIds,
                },
            },
            orderBy: [{ updatedAt: "desc" }],
            select: {
                id: true,
                name: true,
                status: true,
                stage: true,
                nextAction: true,
                targetDate: true,
                updatedAt: true,
                _count: {
                    select: {
                        deliverables: {
                            where: {
                                isClientVisible: true,
                            },
                        },
                        realDocuments: {
                            where: {
                                isClientVisible: true,
                            },
                        },
                        validations: {
                            where: {
                                isClientVisible: true,
                                type: "CLIENT",
                            },
                        },
                    },
                },
                opportunity: {
                    select: {
                        prospectName: true,
                    },
                },
            },
        }),
        prisma.projectRequest.findMany({
            where: buildProjectRequestAccessWhere({
                identity,
                projectIds,
            }),
            orderBy: [{ createdAt: "desc" }],
            select: {
                id: true,
                budget: true,
                createdAt: true,
                deadline: true,
                emailStatus: true,
                projectName: true,
                projectTypeLabel: true,
                projectTypeRaw: true,
                requestId: true,
                opportunity: {
                    select: {
                        id: true,
                        nextAction: true,
                        nextFollowUpAt: true,
                        status: true,
                        title: true,
                        convertedProject: {
                            select: {
                                id: true,
                                name: true,
                                stage: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        }),
        getClientPortalNotifications(input.userId),
        prisma.questionnaire.findMany({
            where: {
                isClientVisible: true,
                projectId: {
                    in: projectIds,
                },
                status: {
                    in: ["SENT", "IN_PROGRESS"],
                },
            },
            orderBy: [{ updatedAt: "desc" }],
            select: {
                id: true,
                dueAt: true,
                status: true,
                title: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        questions: true,
                    },
                },
            },
            take: 6,
        }),
        prisma.validation.findMany({
            where: {
                isClientVisible: true,
                projectId: {
                    in: projectIds,
                },
                status: "PENDING",
                type: "CLIENT",
            },
            orderBy: [{ requestedAt: "desc" }, { createdAt: "desc" }],
            select: {
                id: true,
                realDocumentId: true,
                title: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            take: 6,
        }),
    ]);

    return {
        notifications,
        openQuestionnaires,
        pendingValidations,
        projectRequests,
        projects,
    };
}

export async function getClientPortalProject(input: {
    projectId: string;
    role: UserRole;
    userId: string;
}) {
    const prisma = getPrismaClient();
    const hasAccess = await canReadProject(input);

    if (!hasAccess) {
        notFound();
    }

    const project = await prisma.project.findUnique({
        where: { id: input.projectId },
        select: {
            id: true,
            name: true,
            status: true,
            stage: true,
            nextAction: true,
            targetDate: true,
            startedAt: true,
            updatedAt: true,
            deliverables: {
                where: {
                    isClientVisible: true,
                },
                orderBy: [{ sortOrder: "asc" }],
                select: {
                    id: true,
                    description: true,
                    documentUrl: true,
                    name: true,
                    status: true,
                },
            },
            phases: {
                orderBy: [{ sortOrder: "asc" }],
                select: {
                    id: true,
                    name: true,
                    status: true,
                },
            },
            realDocuments: {
                where: {
                    isClientVisible: true,
                },
                orderBy: [{ createdAt: "desc" }],
                select: {
                    id: true,
                    documentUrl: true,
                    documentModelKey: true,
                    currentVersion: true,
                    reference: true,
                    status: true,
                    title: true,
                    type: true,
                },
            },
            validations: {
                where: {
                    isClientVisible: true,
                    type: "CLIENT",
                },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
                select: {
                    id: true,
                    description: true,
                    realDocumentId: true,
                    responseComment: true,
                    respondedAt: true,
                    status: true,
                    title: true,
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    const [actions, gates] = await Promise.all([
        prisma.$queryRaw<ClientRoadmapItemRow[]>`
            SELECT "id", "phaseId", "status", "title", "ownerRole" AS "type"
            FROM "ProjectAction"
            WHERE "projectId" = ${project.id}
              AND "isClientVisible" = true
            ORDER BY "sortOrder" ASC
        `,
        prisma.$queryRaw<ClientRoadmapItemRow[]>`
            SELECT "id", "phaseId", "status", "title", "type"
            FROM "ProjectGate"
            WHERE "projectId" = ${project.id}
              AND "isClientVisible" = true
            ORDER BY "sortOrder" ASC
        `,
    ]);

    const phases = project.phases.map((phase) => ({
        ...phase,
        actions: actions.filter((action) => action.phaseId === phase.id),
        gates: gates.filter((gate) => gate.phaseId === phase.id),
    }));
    const visibleActions = actions.length;
    const visibleGates = gates.length;
    const expectedActions = buildExpectedActions({
        actions,
        gates,
        phases: project.phases,
    });

    return {
        ...project,
        dashboard: {
            expectedActions: expectedActions.length,
            phases: project.phases.length,
            visibleActions,
            visibleDocuments: project.realDocuments.length,
            visibleGates,
            visibleDeliverables: project.deliverables.length,
            visibleValidations: project.validations.length,
        },
        expectedActions,
        phases,
    };
}

export async function canReadProject(input: {
    projectId: string;
    role: UserRole;
    userId: string;
}) {
    const identity = await getClientPortalIdentity(input.userId);
    const projectIds = await getAccessibleProjectIds(input, identity);

    return projectIds.includes(input.projectId);
}

async function getAccessibleProjectIds(input: {
    role: UserRole;
    userId: string;
}, identity?: ClientPortalIdentity) {
    const prisma = getPrismaClient();
    const currentIdentity = identity ?? await getClientPortalIdentity(input.userId);
    const ownedProjectWhere = buildOwnedProjectAccessWhere(currentIdentity);
    const [rows, ownedProjects] = await Promise.all([
        prisma.$queryRaw<ClientProjectAccessRow[]>`
        SELECT "projectId"
        FROM "ClientPortalAccess"
        WHERE "userId" = ${input.userId}
          AND "status" = 'ACTIVE'::"ClientPortalAccessStatus"
    `,
        ownedProjectWhere
            ? prisma.project.findMany({
                where: ownedProjectWhere,
                select: {
                    id: true,
                },
            })
            : Promise.resolve([]),
    ]);

    return [
        ...new Set([
            ...rows.map((row) => row.projectId),
            ...ownedProjects.map((project) => project.id),
        ]),
    ];
}

async function getClientPortalIdentity(userId: string): Promise<ClientPortalIdentity> {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            email: true,
            accountMemberships: {
                select: {
                    clientAccountId: true,
                },
            },
            contacts: {
                select: {
                    clientAccountId: true,
                    id: true,
                },
            },
        },
    });

    if (!user) {
        return {
            clientAccountIds: [],
            contactIds: [],
            email: null,
        };
    }

    return {
        clientAccountIds: [
            ...new Set([
                ...user.accountMemberships.map(
                    (membership) => membership.clientAccountId,
                ),
                ...user.contacts.map((contact) => contact.clientAccountId),
            ]),
        ],
        contactIds: user.contacts.map((contact) => contact.id),
        email: user.email,
    };
}

function getClientPortalNotifications(userId: string) {
    const prisma = getPrismaClient();

    return prisma.notification.findMany({
        where: {
            recipientUserId: userId,
        },
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
        take: 6,
    });
}

function buildProjectRequestAccessWhere({
    identity,
    projectIds,
}: {
    identity: ClientPortalIdentity;
    projectIds: string[];
}): Prisma.ProjectRequestWhereInput {
    const filters: Prisma.ProjectRequestWhereInput[] = [];

    if (identity.clientAccountIds.length > 0) {
        filters.push({
            clientAccountId: {
                in: identity.clientAccountIds,
            },
        });
    }

    if (identity.contactIds.length > 0) {
        filters.push({
            contactId: {
                in: identity.contactIds,
            },
        });
    }

    if (identity.email) {
        filters.push({
            email: identity.email,
        });
    }

    if (projectIds.length > 0) {
        filters.push({
            opportunity: {
                convertedProject: {
                    id: {
                        in: projectIds,
                    },
                },
            },
        });
    }

    return filters.length > 0 ? { OR: filters } : { id: "__no-access__" };
}

function buildOwnedProjectAccessWhere(
    identity: ClientPortalIdentity,
): Prisma.ProjectWhereInput | null {
    const opportunityFilters: Prisma.OpportunityWhereInput[] = [];

    if (identity.clientAccountIds.length > 0) {
        opportunityFilters.push({
            clientAccountId: {
                in: identity.clientAccountIds,
            },
        });
    }

    if (identity.contactIds.length > 0) {
        opportunityFilters.push({
            contactId: {
                in: identity.contactIds,
            },
        });
    }

    if (identity.email) {
        opportunityFilters.push(
            {
                prospectEmail: identity.email,
            },
            {
                projectRequest: {
                    email: identity.email,
                },
            },
        );
    }

    if (opportunityFilters.length === 0) return null;

    return {
        opportunity: {
            OR: opportunityFilters,
        },
    };
}

function buildExpectedActions({
    actions,
    gates,
    phases,
}: {
    actions: ClientRoadmapItemRow[];
    gates: ClientRoadmapItemRow[];
    phases: ClientRoadmapPhase[];
}) {
    const phaseNamesById = new Map(phases.map((phase) => [phase.id, phase.name]));
    const pendingStatuses = new Set([
        "TODO",
        "PENDING",
        "IN_PROGRESS",
        "CHANGES_REQUESTED",
    ]);

    return [
        ...gates.map((gate) => ({
            ...gate,
            kind: "Gate",
            phaseName: gate.phaseId
                ? phaseNamesById.get(gate.phaseId) ?? null
                : null,
        })),
        ...actions.map((action) => ({
            ...action,
            kind: "Action",
            phaseName: action.phaseId
                ? phaseNamesById.get(action.phaseId) ?? null
                : null,
        })),
    ].filter((item) => pendingStatuses.has(item.status));
}

// Client-side reading of a shared composed document: only shared
// versions are visible, and the render uses the immutable snapshot the
// client was actually sent - never the working draft.
export async function getClientComposedDocument(input: {
    documentId: string;
    projectId: string;
    role: UserRole;
    userId: string;
}) {
    const hasAccess = await canReadProject({
        projectId: input.projectId,
        role: input.role,
        userId: input.userId,
    });

    if (!hasAccess) {
        notFound();
    }

    const prisma = getPrismaClient();

    const document = await prisma.realDocument.findFirst({
        where: {
            id: input.documentId,
            projectId: input.projectId,
            isClientVisible: true,
            documentModelKey: { not: null },
            status: { in: ["SHARED", "SENT", "APPROVED"] },
        },
        select: {
            id: true,
            reference: true,
            title: true,
            status: true,
            clientName: true,
            documentModelKey: true,
            currentVersion: true,
            projectId: true,
            versions: {
                orderBy: [{ version: "desc" }],
                take: 1,
                select: {
                    contentSnapshot: true,
                    sharedAt: true,
                    version: true,
                },
            },
            validations: {
                where: {
                    isClientVisible: true,
                    type: "CLIENT",
                },
                orderBy: [{ createdAt: "desc" }],
                take: 1,
                select: {
                    id: true,
                    respondedAt: true,
                    responseComment: true,
                    status: true,
                    title: true,
                },
            },
        },
    });

    const latestVersion = document?.versions[0];

    if (!document || !latestVersion || !document.documentModelKey) {
        notFound();
    }

    const model = await prisma.documentModel.findUnique({
        where: { key: document.documentModelKey },
        select: {
            name: true,
            sections: true,
        },
    });

    if (!model) {
        notFound();
    }

    const { parseComposedContent, parseModelSections } = await import(
        "@/server/documents/composer"
    );

    return {
        clientName: document.clientName,
        content: parseComposedContent(latestVersion.contentSnapshot),
        id: document.id,
        model: {
            name: model.name,
            sections: parseModelSections(model.sections),
        },
        projectId: document.projectId,
        reference: document.reference,
        sharedAt: latestVersion.sharedAt,
        status: document.status,
        title: document.title,
        validation: document.validations[0] ?? null,
        version: latestVersion.version,
    };
}

// Distinct portal sections: a request is not a project (it may never
// convert). Each list has its own route and vocabulary.
export async function getClientRequests(input: {
    role: UserRole;
    userId: string;
}) {
    const prisma = getPrismaClient();
    const identity = await getClientPortalIdentity(input.userId);
    const projectIds = await getAccessibleProjectIds(input, identity);

    return prisma.projectRequest.findMany({
        where: buildProjectRequestAccessWhere({
            identity,
            projectIds,
        }),
        orderBy: [{ createdAt: "desc" }],
        select: {
            id: true,
            createdAt: true,
            projectName: true,
            projectTypeLabel: true,
            projectTypeRaw: true,
            requestId: true,
            opportunity: {
                select: {
                    status: true,
                    convertedProject: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
}

export async function getClientProjects(input: {
    role: UserRole;
    userId: string;
}) {
    const prisma = getPrismaClient();
    const projectIds = await getAccessibleProjectIds(input);

    return prisma.project.findMany({
        where: {
            id: {
                in: projectIds,
            },
        },
        orderBy: [{ updatedAt: "desc" }],
        select: {
            id: true,
            name: true,
            status: true,
            targetDate: true,
            updatedAt: true,
            phases: {
                where: {
                    status: {
                        in: ["TODO", "IN_PROGRESS"],
                    },
                },
                orderBy: [{ sortOrder: "asc" }],
                take: 1,
                select: {
                    name: true,
                },
            },
            _count: {
                select: {
                    validations: {
                        where: {
                            isClientVisible: true,
                            status: "PENDING",
                            type: "CLIENT",
                        },
                    },
                },
            },
        },
    });
}
