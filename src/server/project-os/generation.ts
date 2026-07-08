import lotsJson from "../../../data/project-os/lots.json";

import { type Prisma } from "@prisma/client";

import { getPrismaClient } from "@/server/db/client";

type ProjectOsGenerationStatus =
    | "generated"
    | "already-generated"
    | "missing-project"
    | "missing-template";

export type ProjectOsGenerationResult = {
    projectId?: string;
    status: ProjectOsGenerationStatus;
    summary?: ProjectOsGenerationSummary;
};

type ProjectOsGenerationSummary = {
    actions: number;
    deliverables: number;
    documents: number;
    gates: number;
    lots: number;
    phases: number;
    playbookKey: string;
    tasks: number;
    templateId: string;
    validations: number;
};

type LotTemplate = {
    id: string;
    name: string;
    objective?: string;
    order?: number;
};

type ProjectActionCreateManyInput = {
    description: string | null;
    isBlocking: boolean;
    isClientVisible: boolean;
    key: string;
    ownerRole: string | null;
    phaseId: string | null;
    projectId: string;
    sortOrder: number;
    sourceTemplateKey: string;
    title: string;
};

type ProjectGateCreateManyInput = {
    description: string | null;
    isClientVisible: boolean;
    key: string;
    objectType: string | null;
    phaseId: string | null;
    projectId: string;
    proofRequired: boolean;
    required: boolean;
    sortOrder: number;
    sourceTemplateKey: string;
    title: string;
    type: string | null;
};

type PlaybookInstanceCreateInput = {
    appliedByUserId: string | null;
    generationSummary: Prisma.InputJsonValue;
    playbookTemplateId: string;
    projectId: string;
    scopeSnapshot: Prisma.InputJsonValue;
    status: string;
};

type RoadmapTransactionClient = {
    playbookInstance: {
        count(args: { where: { projectId: string } }): Promise<number>;
        create(args: { data: PlaybookInstanceCreateInput }): Promise<unknown>;
    };
    projectAction: {
        count(args: { where: { projectId: string } }): Promise<number>;
        createMany(args: {
            data: ProjectActionCreateManyInput[];
            skipDuplicates?: boolean;
        }): Promise<unknown>;
    };
    projectGate: {
        count(args: { where: { projectId: string } }): Promise<number>;
        createMany(args: {
            data: ProjectGateCreateManyInput[];
            skipDuplicates?: boolean;
        }): Promise<unknown>;
    };
};

const lots = lotsJson as LotTemplate[];

export async function generateProjectOsStructure(
    projectId: string,
    options: {
        appliedByUserId?: string;
        selectedModuleKeys?: string[];
    } = {},
): Promise<ProjectOsGenerationResult> {
    const prisma = getPrismaClient();

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            offer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            opportunity: {
                select: {
                    conversionExceptionReason: true,
                    depositAmountCents: true,
                    depositReceivedAt: true,
                    estimatedValueCents: true,
                    id: true,
                    quoteAcceptedAt: true,
                    quoteUrl: true,
                    title: true,
                },
            },
            projectType: {
                select: {
                    id: true,
                    name: true,
                    projectOsId: true,
                    slug: true,
                    templateId: true,
                },
            },
        },
    });

    if (!project) {
        return { status: "missing-project" };
    }

    const playbook = await loadPlaybookForProjectType(project.projectType);

    if (!playbook) {
        return {
            projectId: project.id,
            status: "missing-template",
        };
    }

    return prisma.$transaction(async (tx) => {
        const roadmapTx = tx as Prisma.TransactionClient &
            RoadmapTransactionClient;
        const existingItems = await countProjectOsItems(tx, project.id);

        if (existingItems > 0) {
            return {
                projectId: project.id,
                status: "already-generated" as const,
            };
        }

        const selectedModuleKeys = new Set(options.selectedModuleKeys ?? []);
        const plan = buildGenerationPlan(playbook, selectedModuleKeys);
        const summary = buildGenerationSummary(plan, playbook.key, playbook.sourceTemplateId);

        await tx.projectLot.createMany({
            data: plan.lots.map((lot) => ({
                description: lot.objective ?? null,
                key: lot.id,
                name: lot.name,
                projectId: project.id,
                sortOrder: lot.order ?? 0,
            })),
            skipDuplicates: true,
        });

        await roadmapTx.playbookInstance.create({
            data: {
                appliedByUserId: options.appliedByUserId ?? null,
                generationSummary: toJson(summary),
                playbookTemplateId: playbook.id,
                projectId: project.id,
                scopeSnapshot: toJson({
                    documentsExpected: plan.documents.map((document) => ({
                        category: document.category,
                        key: document.key,
                        name: document.name,
                        recommendedDrivePath: document.recommendedDrivePath,
                        visibility: document.visibility,
                    })),
                    modules: {
                        available: playbook.modules.map((moduleTemplate) => ({
                            isDefault: moduleTemplate.isDefault,
                            key: moduleTemplate.key,
                            name: moduleTemplate.name,
                        })),
                        selected: [...selectedModuleKeys],
                    },
                    offer: project.offer,
                    opportunity: project.opportunity,
                    projectType: project.projectType,
                }),
                status: "APPLIED",
            },
        });

        const createdLots = await tx.projectLot.findMany({
            where: { projectId: project.id },
            select: { id: true, key: true },
        });
        const lotIdsByKey = new Map(
            createdLots.map((lot) => [lot.key, lot.id]),
        );

        await tx.projectPhase.createMany({
            data: plan.phases.map((phase, index) => ({
                description: phase.description ?? null,
                key: phase.id,
                lotId: phase.lotId ? lotIdsByKey.get(phase.lotId) ?? null : null,
                name: phase.name,
                projectId: project.id,
                sortOrder: phase.order ?? index + 1,
            })),
            skipDuplicates: true,
        });

        const createdPhases = await tx.projectPhase.findMany({
            where: { projectId: project.id },
            select: { id: true, key: true },
        });
        const phaseIdsByKey = new Map(
            createdPhases.map((phase) => [phase.key, phase.id]),
        );

        await tx.deliverable.createMany({
            data: plan.deliverables.map((deliverable, index) => ({
                description: deliverable.description ?? null,
                isClientVisible: deliverable.isClientVisible,
                key: deliverable.id,
                name: deliverable.name,
                phaseId: deliverable.phaseId
                    ? phaseIdsByKey.get(deliverable.phaseId) ?? null
                    : null,
                projectId: project.id,
                sortOrder: index + 1,
            })),
            skipDuplicates: true,
        });

        await tx.projectTask.createMany({
            data: plan.actions.map((action, index) => ({
                description: action.description ?? null,
                isClientVisible: isClientOwnerRole(action.ownerRole),
                key: action.id,
                ownerRole: action.ownerRole?.toUpperCase() ?? null,
                phaseId: action.phaseId
                    ? phaseIdsByKey.get(action.phaseId) ?? null
                    : null,
                projectId: project.id,
                sortOrder: index + 1,
                title: action.title,
            })),
            skipDuplicates: true,
        });

        await roadmapTx.projectAction.createMany({
            data: plan.actions.map((action, index) => ({
                description: action.description ?? null,
                isBlocking: action.isBlocking,
                isClientVisible: isClientOwnerRole(action.ownerRole),
                key: action.id,
                ownerRole: action.ownerRole?.toUpperCase() ?? null,
                phaseId: action.phaseId
                    ? phaseIdsByKey.get(action.phaseId) ?? null
                    : null,
                projectId: project.id,
                sortOrder: index + 1,
                sourceTemplateKey: action.id,
                title: action.title,
            })),
            skipDuplicates: true,
        });

        await roadmapTx.projectGate.createMany({
            data: plan.gates.map((gate, index) => ({
                description: gate.objectType ?? null,
                isClientVisible: isClientOwnerRole(gate.type),
                key: gate.id,
                objectType: gate.objectType ?? null,
                phaseId: findGatePhaseId(gate.unblocks, phaseIdsByKey),
                projectId: project.id,
                proofRequired: gate.proofRequired,
                required: gate.required,
                sortOrder: index + 1,
                sourceTemplateKey: gate.id,
                title: gate.name,
                type: gate.type?.toUpperCase() ?? null,
            })),
            skipDuplicates: true,
        });

        await tx.validation.createMany({
            data: plan.gates.map((gate, index) => {
                const type = isClientOwnerRole(gate.type) ? "CLIENT" : "INTERNAL";

                return {
                    deliverableId: null,
                    description: gate.objectType ?? null,
                    // Never visible at generation time: a client validation
                    // only appears in the portal once explicitly requested
                    // (document share or manual request), otherwise the
                    // client faces a wall of pending noise on day one.
                    isClientVisible: false,
                    key: gate.id,
                    projectId: project.id,
                    sortOrder: index + 1,
                    title: gate.name,
                    type,
                };
            }),
            skipDuplicates: true,
        });

        await tx.projectOsGeneration.create({
            data: {
                projectId: project.id,
                status: "COMPLETED",
                summary,
                templateId: summary.templateId,
            },
        });

        return {
            projectId: project.id,
            status: "generated" as const,
            summary,
        };
    });
}

async function loadPlaybookForProjectType(
    projectType: {
        projectOsId: string | null;
        slug: string;
        templateId: string | null;
    } | null,
) {
    if (!projectType) return null;

    const prisma = getPrismaClient();
    const candidateIds = [
        projectType.slug,
        projectType.projectOsId,
        slugToProjectOsId(projectType.slug),
        projectType.templateId,
    ].filter((candidateId): candidateId is string => Boolean(candidateId));

    return prisma.playbookTemplate.findFirst({
        where: {
            OR: [
                { key: { in: candidateIds } },
                { sourceProjectOsId: { in: candidateIds } },
                { sourceTemplateId: { in: candidateIds } },
            ],
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
            actions: {
                orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
            },
            deliverables: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
            documents: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
            gates: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
            modules: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
            phases: {
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
        },
    });
}

// Preview data for the conversion wizard: which playbook would apply to a
// project type, and which optional modules it exposes.
export async function getConversionPlaybookPreview(projectTypeId: string) {
    const prisma = getPrismaClient();

    const projectType = await prisma.projectType.findUnique({
        where: { id: projectTypeId },
        select: {
            id: true,
            name: true,
            projectOsId: true,
            recommendedArchitecture: true,
            slug: true,
            templateId: true,
        },
    });

    if (!projectType) return null;

    const playbook = await loadPlaybookForProjectType(projectType);

    if (!playbook) {
        return { playbook: null, projectType };
    }

    const moduleContentCounts = new Map<string, number>();
    const countModuleItem = (moduleKey: string | null) => {
        if (!moduleKey) return;

        moduleContentCounts.set(
            moduleKey,
            (moduleContentCounts.get(moduleKey) ?? 0) + 1,
        );
    };

    playbook.phases.forEach((phase) => countModuleItem(phase.moduleKey));
    playbook.deliverables.forEach((deliverable) =>
        countModuleItem(deliverable.moduleKey),
    );
    playbook.actions.forEach((action) => countModuleItem(action.moduleKey));
    playbook.gates.forEach((gate) => countModuleItem(gate.moduleKey));
    playbook.documents.forEach((document) =>
        countModuleItem(document.moduleKey),
    );

    const corePlan = buildGenerationPlan(playbook, new Set<string>());

    return {
        playbook: {
            core: {
                actions: corePlan.actions.length,
                deliverables: corePlan.deliverables.length,
                documents: corePlan.documents.length,
                gates: corePlan.gates.length,
                phases: corePlan.phases.length,
            },
            id: playbook.id,
            key: playbook.key,
            modules: playbook.modules.map((moduleTemplate) => ({
                contentCount: moduleContentCounts.get(moduleTemplate.key) ?? 0,
                description: moduleTemplate.description,
                isDefault: moduleTemplate.isDefault,
                key: moduleTemplate.key,
                name: moduleTemplate.name,
            })),
            name: playbook.name,
            phases: corePlan.phases.map((phase) => ({
                key: phase.id,
                name: phase.name,
            })),
        },
        projectType,
    };
}

type PlaybookWithTemplates = NonNullable<
    Awaited<ReturnType<typeof loadPlaybookForProjectType>>
>;

function buildGenerationPlan(
    playbook: PlaybookWithTemplates,
    selectedModuleKeys: Set<string>,
) {
    // Optional-module content is only generated when its module was
    // explicitly selected in the conversion wizard. Core content
    // (moduleKey null) is always generated.
    const isInScope = (moduleKey: string | null) =>
        !moduleKey || selectedModuleKeys.has(moduleKey);

    const lotsById = new Map(lots.map((lot) => [lot.id, lot]));
    const scopedPhases = playbook.phases.filter((phase) =>
        isInScope(phase.moduleKey),
    );
    const lotIds = [
        ...new Set(
            scopedPhases
                .map((phase) => phase.sourceLotKey)
                .filter((lotId): lotId is string => Boolean(lotId)),
        ),
    ];

    return {
        actions: playbook.actions
            .filter((action) => isInScope(action.moduleKey))
            .map((action) => ({
                description: action.description,
                id: action.key,
                isBlocking: action.isBlocking,
                ownerRole: action.ownerRole,
                phaseId: action.sourcePhaseKey,
                title: action.title,
            })),
        deliverables: playbook.deliverables
            .filter((deliverable) => isInScope(deliverable.moduleKey))
            .map((deliverable) => ({
                description: deliverable.description,
                id: deliverable.key,
                isClientVisible: deliverable.isClientVisible,
                name: deliverable.name,
                phaseId: deliverable.sourcePhaseKey,
            })),
        documents: playbook.documents
            .filter((document) => isInScope(document.moduleKey))
            .map((document) => ({
                category: document.category,
                key: document.key,
                name: document.name,
                recommendedDrivePath: document.recommendedDrivePath,
                visibility: document.visibility,
            })),
        gates: playbook.gates
            .filter((gate) => isInScope(gate.moduleKey))
            .map((gate) => ({
                id: gate.key,
                name: gate.name,
                objectType: gate.objectType,
                proofRequired: gate.proofRequired,
                required: gate.required,
                type: gate.type,
                unblocks: Array.isArray(gate.unblocks)
                    ? gate.unblocks.filter(
                          (phaseId): phaseId is string =>
                              typeof phaseId === "string",
                      )
                    : [],
            })),
        lots: lotIds.map((lotId, index) => {
            const lot = lotsById.get(lotId);

            return {
                id: lotId,
                name: lot?.name ?? lotId,
                objective: lot?.objective ?? null,
                order: lot?.order ?? index + 1,
            };
        }),
        phases: scopedPhases.map((phase) => ({
            description: phase.description,
            id: phase.key,
            lotId: phase.sourceLotKey,
            name: phase.name,
            order: phase.sortOrder,
        })),
    };
}

async function countProjectOsItems(
    tx: Prisma.TransactionClient,
    projectId: string,
) {
    const roadmapTx = tx as Prisma.TransactionClient & RoadmapTransactionClient;
    const [
        lotsCount,
        phasesCount,
        deliverablesCount,
        tasksCount,
        validationsCount,
        actionsCount,
        gatesCount,
        instanceCount,
    ] = await Promise.all([
        tx.projectLot.count({ where: { projectId } }),
        tx.projectPhase.count({ where: { projectId } }),
        tx.deliverable.count({ where: { projectId } }),
        tx.projectTask.count({ where: { projectId } }),
        tx.validation.count({ where: { projectId } }),
        roadmapTx.projectAction.count({ where: { projectId } }),
        roadmapTx.projectGate.count({ where: { projectId } }),
        roadmapTx.playbookInstance.count({ where: { projectId } }),
    ]);

    return (
        lotsCount +
        phasesCount +
        deliverablesCount +
        tasksCount +
        validationsCount +
        actionsCount +
        gatesCount +
        instanceCount
    );
}

function buildGenerationSummary(
    plan: ReturnType<typeof buildGenerationPlan>,
    playbookKey: string,
    sourceTemplateId: string | null,
) {
    return {
        actions: plan.actions.length,
        deliverables: plan.deliverables.length,
        documents: plan.documents.length,
        gates: plan.gates.length,
        lots: plan.lots.length,
        phases: plan.phases.length,
        playbookKey,
        tasks: plan.actions.length,
        templateId: sourceTemplateId ?? playbookKey,
        validations: plan.gates.length,
    } satisfies ProjectOsGenerationSummary;
}

function findGatePhaseId(
    unblocks: string[],
    phaseIdsByKey: Map<string, string>,
) {
    const phaseKey = unblocks.find((key) => phaseIdsByKey.has(key));

    return phaseKey ? phaseIdsByKey.get(phaseKey) ?? null : null;
}

function slugToProjectOsId(slug: string) {
    return slug.replaceAll("-", "_");
}

function isClientOwnerRole(value: string | null | undefined) {
    return value?.toLowerCase() === "client";
}

function toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value));
}
