import type { Prisma } from "@prisma/client";

import { getCommercialPlaybookReference } from "@/server/playbooks/commercial-reference";
import { getPrismaClient } from "@/server/db/client";

export const playbookTemplateSummarySelect = {
    id: true,
    key: true,
    name: true,
    sourceProjectOsId: true,
    sourceTemplateId: true,
    sourceSnapshot: true,
    status: true,
    priority: true,
    description: true,
    sortOrder: true,
    updatedAt: true,
    _count: {
        select: {
            phases: true,
            gates: true,
            actions: true,
            deliverables: true,
            documents: true,
            modules: true,
            instances: true,
        },
    },
    phases: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        take: 4,
        select: {
            id: true,
            key: true,
            name: true,
            sourceLotKey: true,
            sourceSnapshot: true,
        },
    },
    gates: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        take: 4,
        select: {
            id: true,
            key: true,
            name: true,
            type: true,
            required: true,
            proofRequired: true,
        },
    },
} satisfies Prisma.PlaybookTemplateSelect;

export async function getAdminPlaybooks() {
    const prisma = getPrismaClient();

    const playbooks = await prisma.playbookTemplate.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: playbookTemplateSummarySelect,
    });

    return {
        playbooks,
        totals: playbooks.reduce(
            (accumulator, playbook) => ({
                playbooks: accumulator.playbooks + 1,
                phases: accumulator.phases + playbook._count.phases,
                gates: accumulator.gates + playbook._count.gates,
                actions: accumulator.actions + playbook._count.actions,
                deliverables:
                    accumulator.deliverables + playbook._count.deliverables,
                documents: accumulator.documents + playbook._count.documents,
                modules: accumulator.modules + playbook._count.modules,
                instances: accumulator.instances + playbook._count.instances,
            }),
            {
                playbooks: 0,
                phases: 0,
                gates: 0,
                actions: 0,
                deliverables: 0,
                documents: 0,
                modules: 0,
                instances: 0,
            },
        ),
    };
}

export async function getAdminPlaybook(templateId: string) {
    const prisma = getPrismaClient();

    const playbook = await prisma.playbookTemplate.findUnique({
        where: { id: templateId },
        select: {
            ...playbookTemplateSummarySelect,
            sourceSnapshot: true,
            phases: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    key: true,
                    name: true,
                    description: true,
                    sourceLotKey: true,
                    moduleKey: true,
                    sortOrder: true,
                    sourceSnapshot: true,
                },
            },
            gates: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    key: true,
                    name: true,
                    type: true,
                    objectType: true,
                    required: true,
                    proofRequired: true,
                    unblocks: true,
                    moduleKey: true,
                    sortOrder: true,
                },
            },
            actions: {
                orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
                select: {
                    id: true,
                    key: true,
                    title: true,
                    description: true,
                    sourcePhaseKey: true,
                    ownerRole: true,
                    isBlocking: true,
                    moduleKey: true,
                    sortOrder: true,
                },
            },
            deliverables: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    key: true,
                    name: true,
                    description: true,
                    category: true,
                    sourcePhaseKey: true,
                    documentTemplateKey: true,
                    isRequired: true,
                    isClientVisible: true,
                    moduleKey: true,
                    sortOrder: true,
                },
            },
            documents: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    key: true,
                    name: true,
                    category: true,
                    usage: true,
                    recommendedFormat: true,
                    recommendedDrivePath: true,
                    visibility: true,
                    status: true,
                    sourcePhaseKey: true,
                    producesDeliverableKey: true,
                    moduleKey: true,
                    sortOrder: true,
                },
            },
            modules: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    key: true,
                    name: true,
                    description: true,
                    isDefault: true,
                    sortOrder: true,
                    sourceSnapshot: true,
                },
            },
        },
    });

    if (!playbook) {
        return null;
    }

    return {
        ...playbook,
        commercialReference: isRequestOsPlaybook(playbook)
            ? getCommercialPlaybookReference()
            : null,
    };
}

function isRequestOsPlaybook(playbook: {
    sourceSnapshot: unknown;
    sourceTemplateId: string | null;
}) {
    return (
        playbook.sourceTemplateId?.startsWith("request-os") ||
        getSnapshotKind(playbook.sourceSnapshot) === "request-os-playbook"
    );
}

function getSnapshotKind(sourceSnapshot: unknown) {
    return isRecord(sourceSnapshot) && typeof sourceSnapshot.kind === "string"
        ? sourceSnapshot.kind
        : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
