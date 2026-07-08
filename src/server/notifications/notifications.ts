import type { Prisma, UserRole } from "@prisma/client";

import { isAdminRole } from "@/server/auth/roles";

type NotificationAudience = "ADMIN" | "CLIENT";

type CreateProjectNotificationsInput = {
    actionHref?: string;
    audience: NotificationAudience;
    body?: string;
    opportunityId?: string | null;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    projectId: string;
    title: string;
};

export async function createProjectNotifications(
    tx: Prisma.TransactionClient,
    input: CreateProjectNotificationsInput,
) {
    const recipientIds = await getProjectNotificationRecipientIds(tx, {
        audience: input.audience,
        projectId: input.projectId,
    });

    if (recipientIds.length === 0) return;

    await tx.notification.createMany({
        data: recipientIds.map((recipientUserId) => ({
            actionHref: input.actionHref,
            body: input.body,
            opportunityId: input.opportunityId,
            priority: input.priority ?? "NORMAL",
            projectId: input.projectId,
            recipientUserId,
            title: input.title,
        })),
    });
}

async function getProjectNotificationRecipientIds(
    tx: Prisma.TransactionClient,
    input: {
        audience: NotificationAudience;
        projectId: string;
    },
) {
    if (input.audience === "ADMIN") {
        const users = await tx.user.findMany({
            where: {
                role: {
                    in: ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"],
                },
            },
            select: {
                id: true,
            },
        });

        return users.map((user) => user.id);
    }

    const accesses = await tx.clientPortalAccess.findMany({
        where: {
            projectId: input.projectId,
            status: "ACTIVE",
        },
        select: {
            user: {
                select: {
                    id: true,
                    role: true,
                },
            },
        },
    });

    return [
        ...new Set(
            accesses
                .filter((access) => !isAdminRole(access.user.role as UserRole))
                .map((access) => access.user.id),
        ),
    ];
}
