import { notFound } from "next/navigation";

import { getPrismaClient } from "@/server/db/client";

const OPEN_ITEM_STATUSES = ["TODO", "IN_PROGRESS"] as const;

export async function getAdminProjectCockpit(projectId: string) {
    const prisma = getPrismaClient();

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            name: true,
            status: true,
            stage: true,
            nextAction: true,
            hasActiveBlocker: true,
            notes: true,
            targetDate: true,
            startedAt: true,
            driveFolderUrl: true,
            githubRepoUrl: true,
            createdAt: true,
            updatedAt: true,
            offer: {
                select: { id: true, name: true },
            },
            projectType: {
                select: { id: true, name: true },
            },
            opportunity: {
                select: {
                    id: true,
                    prospectEmail: true,
                    prospectName: true,
                    title: true,
                },
            },
            playbookInstance: {
                select: {
                    appliedAt: true,
                    scopeSnapshot: true,
                    playbookTemplate: {
                        select: { key: true, name: true },
                    },
                },
            },
            clientPortalAccesses: {
                where: { status: "ACTIVE" },
                select: { id: true },
            },
            realDocuments: {
                where: { documentModelKey: "retex" },
                select: { id: true },
                take: 1,
            },
            financialDocuments: {
                where: { type: "BALANCE_INVOICE" },
                orderBy: [{ createdAt: "desc" }],
                select: {
                    id: true,
                    reference: true,
                    status: true,
                },
                take: 1,
            },
            phases: {
                orderBy: [{ sortOrder: "asc" }],
                select: {
                    id: true,
                    key: true,
                    name: true,
                    status: true,
                    sortOrder: true,
                    deliverables: {
                        orderBy: [{ sortOrder: "asc" }],
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            isClientVisible: true,
                            documentUrl: true,
                        },
                    },
                    actions: {
                        orderBy: [{ sortOrder: "asc" }],
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            isBlocking: true,
                            ownerRole: true,
                        },
                    },
                    tasks: {
                        orderBy: [{ sortOrder: "asc" }],
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            ownerRole: true,
                        },
                    },
                    gates: {
                        orderBy: [{ sortOrder: "asc" }],
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            required: true,
                            type: true,
                            isClientVisible: true,
                        },
                    },
                },
            },
            validations: {
                orderBy: [{ sortOrder: "asc" }],
                select: {
                    id: true,
                    title: true,
                    status: true,
                    type: true,
                    isClientVisible: true,
                    respondedAt: true,
                    responseComment: true,
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    const phases = project.phases.map((phase) => {
        const openDeliverables = phase.deliverables.filter((deliverable) =>
            isOpenStatus(deliverable.status),
        );
        const openBlockingActions = phase.actions.filter(
            (action) => action.isBlocking && isOpenStatus(action.status),
        );
        const pendingRequiredGates = phase.gates.filter(
            (gate) => gate.required && gate.status === "PENDING",
        );

        return {
            ...phase,
            dod: {
                blockerActive: project.hasActiveBlocker,
                openBlockingActions,
                openDeliverables,
                pendingRequiredGates,
                readyToClose:
                    openDeliverables.length === 0 &&
                    openBlockingActions.length === 0 &&
                    !project.hasActiveBlocker,
            },
        };
    });

    const currentPhase =
        phases.find(
            (phase) => phase.status === "TODO" || phase.status === "IN_PROGRESS",
        ) ?? null;

    const nextGate = currentPhase
        ? currentPhase.dod.pendingRequiredGates[0] ?? null
        : (phases
              .flatMap((phase) =>
                  phase.dod.pendingRequiredGates.map((gate) => ({
                      ...gate,
                      phaseId: phase.id,
                  })),
              )[0] ?? null);

    // Only validations actually requested from the client (visible in
    // the portal) count as awaited; generated-but-unrequested ones stay
    // internal backlog.
    const pendingClientValidations = project.validations.filter(
        (validation) =>
            validation.type === "CLIENT" &&
            validation.status === "PENDING" &&
            validation.isClientVisible,
    );
    const changesRequested = project.validations.filter(
        (validation) => validation.status === "CHANGES_REQUESTED",
    );
    const openTasks = currentPhase
        ? currentPhase.tasks.filter((task) => isOpenStatus(task.status))
        : [];

    return {
        ...project,
        changesRequested,
        currentPhase,
        nextGate,
        openTasks,
        pendingClientValidations,
        phases,
    };
}

function isOpenStatus(status: string) {
    return (OPEN_ITEM_STATUSES as readonly string[]).includes(status);
}
