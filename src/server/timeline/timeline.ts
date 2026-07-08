import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/server/db/client";

type AuditLogRow = {
    action: string;
    actorEmail: string | null;
    actorName: string | null;
    createdAt: Date;
    entityId: string | null;
    entityType: string;
    id: string;
    metadata: unknown;
};

export async function getAdminProjectTimeline(projectId: string, userId: string) {
    const prisma = getPrismaClient();
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            name: true,
            opportunity: {
                select: {
                    id: true,
                    prospectName: true,
                    title: true,
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    const [events, auditLogs, notifications] = await Promise.all([
        prisma.timelineEvent.findMany({
            where: { projectId },
            orderBy: [{ happenedAt: "desc" }],
            select: {
                id: true,
                actor: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
                description: true,
                happenedAt: true,
                kind: true,
                title: true,
                visibility: true,
            },
        }),
        getProjectAuditLogs(prisma, projectId),
        prisma.notification.findMany({
            where: {
                recipientUserId: userId,
                projectId,
            },
            orderBy: [{ createdAt: "desc" }],
            take: 12,
            select: {
                id: true,
                actionHref: true,
                body: true,
                createdAt: true,
                priority: true,
                status: true,
                title: true,
            },
        }),
    ]);

    return {
        auditLogs,
        events,
        notifications,
        project,
    };
}

export async function getClientProjectTimeline(projectId: string, userId: string) {
    const prisma = getPrismaClient();
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            name: true,
            nextAction: true,
        },
    });

    if (!project) {
        notFound();
    }

    const [events, notifications] = await Promise.all([
        prisma.timelineEvent.findMany({
            where: {
                projectId,
                visibility: "CLIENT_VISIBLE",
            },
            orderBy: [{ happenedAt: "desc" }],
            select: {
                id: true,
                actor: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
                description: true,
                happenedAt: true,
                kind: true,
                title: true,
            },
        }),
        prisma.notification.findMany({
            where: {
                recipientUserId: userId,
                projectId,
            },
            orderBy: [{ createdAt: "desc" }],
            take: 12,
            select: {
                id: true,
                actionHref: true,
                body: true,
                createdAt: true,
                priority: true,
                status: true,
                title: true,
            },
        }),
    ]);

    return {
        events,
        notifications,
        project,
    };
}

export async function createTimelineEvent(
    tx: Prisma.TransactionClient,
    input: {
        actorUserId?: string | null;
        description?: string | null;
        kind:
            | "PROJECT"
            | "MESSAGE"
            | "QUESTIONNAIRE"
            | "DOCUMENT"
            | "VALIDATION"
            | "DECISION"
            | "STATUS_CHANGE"
            | "CLIENT_ACTION"
            | "INTERNAL_NOTE";
        metadata?: Prisma.InputJsonValue;
        opportunityId?: string | null;
        projectId: string;
        title: string;
        visibility?: "ADMIN_ONLY" | "CLIENT_VISIBLE";
    },
) {
    await tx.timelineEvent.create({
        data: {
            actorUserId: input.actorUserId ?? null,
            description: input.description,
            kind: input.kind,
            metadata: input.metadata,
            opportunityId: input.opportunityId ?? null,
            projectId: input.projectId,
            title: input.title,
            visibility: input.visibility ?? "ADMIN_ONLY",
        },
    });
}

function getProjectAuditLogs(
    prisma: ReturnType<typeof getPrismaClient>,
    projectId: string,
) {
    return prisma.$queryRaw<AuditLogRow[]>`
        SELECT
            al."id",
            al."action",
            al."entityType",
            al."entityId",
            al."metadata",
            al."createdAt",
            u."name" AS "actorName",
            u."email" AS "actorEmail"
        FROM "AuditLog" al
        LEFT JOIN "User" u ON u."id" = al."actorUserId"
        WHERE
            (al."entityType" = 'Project' AND al."entityId" = ${projectId})
            OR (al."metadata" ->> 'projectId' = ${projectId})
        ORDER BY al."createdAt" DESC
        LIMIT 40
    `;
}
