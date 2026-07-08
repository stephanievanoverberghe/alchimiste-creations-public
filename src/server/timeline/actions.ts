"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";
import { createProjectNotifications } from "@/server/notifications/notifications";
import { createTimelineEvent } from "@/server/timeline/timeline";

const createTimelineEventSchema = z.object({
    description: z.string().trim().max(2000).optional(),
    kind: z.enum([
        "PROJECT",
        "MESSAGE",
        "QUESTIONNAIRE",
        "DOCUMENT",
        "VALIDATION",
        "DECISION",
        "STATUS_CHANGE",
        "CLIENT_ACTION",
        "INTERNAL_NOTE",
    ]),
    notifyClient: z.boolean(),
    projectId: z.string().trim().min(1),
    title: z.string().trim().min(1).max(180),
    visibility: z.enum(["ADMIN_ONLY", "CLIENT_VISIBLE"]),
});

export async function createProjectTimelineEventAction(formData: FormData) {
    const session = await requireAdminSession();
    const parsed = createTimelineEventSchema.parse({
        description: formData.get("description"),
        kind: formData.get("kind"),
        notifyClient: formData.get("notifyClient") === "on",
        projectId: formData.get("projectId"),
        title: formData.get("title"),
        visibility: formData.get("visibility"),
    });
    const prisma = getPrismaClient();

    await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: { id: parsed.projectId },
            select: {
                opportunityId: true,
            },
        });

        if (!project) return;

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            description: nullableString(parsed.description),
            kind: parsed.kind,
            opportunityId: project.opportunityId,
            projectId: parsed.projectId,
            title: parsed.title,
            visibility: parsed.visibility,
        });

        await tx.auditLog.create({
            data: {
                action: "project.timeline_event.created",
                actorUserId: session.user.id,
                entityId: parsed.projectId,
                entityType: "Project",
                metadata: {
                    kind: parsed.kind,
                    notifyClient: parsed.notifyClient,
                    visibility: parsed.visibility,
                },
            },
        });

        if (parsed.notifyClient && parsed.visibility === "CLIENT_VISIBLE") {
            await createProjectNotifications(tx, {
                actionHref: `/espace-client/projets/${parsed.projectId}/timeline`,
                audience: "CLIENT",
                body: nullableString(parsed.description) ?? undefined,
                opportunityId: project.opportunityId,
                priority: "NORMAL",
                projectId: parsed.projectId,
                title: parsed.title,
            });
        }
    });

    revalidatePath(`/admin/projets/${parsed.projectId}/timeline`);
    revalidatePath(`/espace-client/projets/${parsed.projectId}/timeline`);
    redirect(`/admin/projets/${parsed.projectId}/timeline?event=created`);
}

function nullableString(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}
