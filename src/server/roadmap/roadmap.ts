import { notFound } from "next/navigation";

import { getPrismaClient } from "@/server/db/client";

type RoadmapActionRow = {
    id: string;
    isBlocking: boolean;
    isClientVisible: boolean;
    ownerRole: string | null;
    phaseId: string | null;
    status: string;
    title: string;
};

type RoadmapGateRow = {
    id: string;
    isClientVisible: boolean;
    phaseId: string | null;
    required: boolean;
    status: string;
    title: string;
    type: string | null;
};

type PlaybookInstanceRow = {
    appliedAt: Date;
    generationSummary: unknown;
    playbookKey: string;
    playbookName: string;
    playbookPriority: string;
    status: string;
};

export async function getAdminProjectRoadmap(projectId: string) {
    const prisma = getPrismaClient();

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            name: true,
            nextAction: true,
            stage: true,
            status: true,
            targetDate: true,
            opportunity: {
                select: {
                    id: true,
                    prospectName: true,
                    title: true,
                },
            },
            phases: {
                orderBy: [{ sortOrder: "asc" }],
                select: {
                    id: true,
                    description: true,
                    key: true,
                    name: true,
                    status: true,
                    sortOrder: true,
                    deliverables: {
                        orderBy: [{ sortOrder: "asc" }],
                        select: {
                            id: true,
                            isClientVisible: true,
                            name: true,
                            status: true,
                        },
                    },
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    const [actions, gates, playbookInstances] = await Promise.all([
        prisma.$queryRaw<RoadmapActionRow[]>`
            SELECT "id", "phaseId", "isBlocking", "isClientVisible", "ownerRole", "status", "title"
            FROM "ProjectAction"
            WHERE "projectId" = ${project.id}
            ORDER BY "sortOrder" ASC
        `,
        prisma.$queryRaw<RoadmapGateRow[]>`
            SELECT "id", "phaseId", "isClientVisible", "required", "status", "title", "type"
            FROM "ProjectGate"
            WHERE "projectId" = ${project.id}
            ORDER BY "sortOrder" ASC
        `,
        prisma.$queryRaw<PlaybookInstanceRow[]>`
            SELECT
                pi."appliedAt",
                pi."generationSummary",
                pi."status",
                pt."key" AS "playbookKey",
                pt."name" AS "playbookName",
                pt."priority" AS "playbookPriority"
            FROM "PlaybookInstance" pi
            INNER JOIN "PlaybookTemplate" pt ON pt."id" = pi."playbookTemplateId"
            WHERE pi."projectId" = ${project.id}
            LIMIT 1
        `,
    ]);

    return {
        ...project,
        actions: actions.filter((action) => action.phaseId === null),
        gates: gates.filter((gate) => gate.phaseId === null),
        phases: project.phases.map((phase) => ({
            ...phase,
            actions: actions.filter((action) => action.phaseId === phase.id),
            gates: gates.filter((gate) => gate.phaseId === phase.id),
        })),
        playbookInstance: playbookInstances[0]
            ? {
                  appliedAt: playbookInstances[0].appliedAt,
                  generationSummary: playbookInstances[0].generationSummary,
                  status: playbookInstances[0].status,
                  playbookTemplate: {
                      key: playbookInstances[0].playbookKey,
                      name: playbookInstances[0].playbookName,
                      priority: playbookInstances[0].playbookPriority,
                  },
              }
            : null,
    };
}
