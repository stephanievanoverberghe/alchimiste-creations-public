"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { requireClientPortalSession } from "@/server/auth/client";
import { canReadProject } from "@/server/client-portal/portal";
import { getPrismaClient } from "@/server/db/client";
import {
    getAdminEmails,
    getProjectClientEmails,
    sendPortalEmail,
} from "@/server/emails/portal-notifications";
import { createProjectNotifications } from "@/server/notifications/notifications";
import { createTimelineEvent } from "@/server/timeline/timeline";

const createAdminMessageSchema = z.object({
    body: z.string().trim().min(1).max(4000),
    projectId: z.string().trim().min(1),
    visibility: z.enum(["CLIENT_VISIBLE", "INTERNAL"]),
});

const createClientMessageSchema = z.object({
    body: z.string().trim().min(1).max(4000),
    projectId: z.string().trim().min(1),
});

export async function createAdminProjectMessageAction(formData: FormData) {
    const session = await requireAdminSession();
    const parsed = createAdminMessageSchema.parse({
        body: formData.get("body"),
        projectId: formData.get("projectId"),
        visibility: formData.get("visibility"),
    });
    const prisma = getPrismaClient();
    const conversation = await getOrCreateProjectConversation({
        createdByUserId: session.user.id,
        projectId: parsed.projectId,
        visibility: parsed.visibility,
    });

    await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: { id: parsed.projectId },
            select: {
                opportunityId: true,
            },
        });

        await tx.message.create({
            data: {
                authorName: session.user.name ?? session.user.email ?? "Admin",
                authorRole: "ADMIN",
                authorUserId: session.user.id,
                body: parsed.body,
                conversationId: conversation.id,
                internalNote: parsed.visibility === "INTERNAL",
                isClientVisible: parsed.visibility === "CLIENT_VISIBLE",
            },
        });

        await tx.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
        });

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            description: parsed.body,
            kind: parsed.visibility === "INTERNAL" ? "INTERNAL_NOTE" : "MESSAGE",
            opportunityId: project?.opportunityId,
            projectId: parsed.projectId,
            title:
                parsed.visibility === "INTERNAL"
                    ? "Note interne ajoutée"
                    : "Message admin envoyé",
            visibility:
                parsed.visibility === "INTERNAL" ? "ADMIN_ONLY" : "CLIENT_VISIBLE",
        });

        if (parsed.visibility === "CLIENT_VISIBLE") {
            await createProjectNotifications(tx, {
                actionHref: `/espace-client/projets/${parsed.projectId}/messages`,
                audience: "CLIENT",
                body: parsed.body,
                opportunityId: project?.opportunityId,
                priority: "NORMAL",
                projectId: parsed.projectId,
                title: "Nouveau message projet",
            });
        }
    });

    if (parsed.visibility === "CLIENT_VISIBLE") {
        await sendPortalEmail({
            actionLabel: "Lire et répondre",
            actionPath: `/espace-client/projets/${parsed.projectId}/messages`,
            body: "Un nouveau message vous attend dans le suivi de votre projet.",
            subject: "Nouveau message sur votre projet",
            to: await getProjectClientEmails(parsed.projectId),
        });
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/projets/${parsed.projectId}/messages`);
    revalidatePath(`/espace-client/projets/${parsed.projectId}/messages`);
    redirect(`/admin/projets/${parsed.projectId}/messages?message=created`);
}

export async function createClientProjectMessageAction(formData: FormData) {
    const session = await requireClientPortalSession();
    const parsed = createClientMessageSchema.parse({
        body: formData.get("body"),
        projectId: formData.get("projectId"),
    });
    const allowed = await canReadProject({
        projectId: parsed.projectId,
        role: session.user.role,
        userId: session.user.id,
    });

    if (!allowed) {
        redirect("/espace-client?error=AccessDenied");
    }

    const prisma = getPrismaClient();
    const conversation = await getOrCreateProjectConversation({
        createdByUserId: session.user.id,
        projectId: parsed.projectId,
        visibility: "CLIENT_VISIBLE",
    });

    await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: { id: parsed.projectId },
            select: {
                opportunityId: true,
            },
        });

        await tx.message.create({
            data: {
                authorName: session.user.name ?? session.user.email ?? "Client",
                authorRole: "CLIENT",
                authorUserId: session.user.id,
                body: parsed.body,
                conversationId: conversation.id,
                internalNote: false,
                isClientVisible: true,
            },
        });

        await tx.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
        });

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            description: parsed.body,
            kind: "CLIENT_ACTION",
            opportunityId: project?.opportunityId,
            projectId: parsed.projectId,
            title: "Message client reçu",
            visibility: "CLIENT_VISIBLE",
        });

        await createProjectNotifications(tx, {
            actionHref: `/admin/projets/${parsed.projectId}/messages`,
            audience: "ADMIN",
            body: parsed.body,
            opportunityId: project?.opportunityId,
            priority: "HIGH",
            projectId: parsed.projectId,
            title: "Nouveau message client",
        });
    });

    await sendPortalEmail({
        actionLabel: "Répondre depuis l'admin",
        actionPath: `/admin/projets/${parsed.projectId}/messages`,
        body: parsed.body.slice(0, 300),
        subject: "Nouveau message client",
        to: await getAdminEmails(),
    });

    revalidatePath(`/admin/projets/${parsed.projectId}/messages`);
    revalidatePath(`/espace-client/projets/${parsed.projectId}/messages`);
    redirect(`/espace-client/projets/${parsed.projectId}/messages?message=created`);
}

async function getOrCreateProjectConversation({
    createdByUserId,
    projectId,
    visibility,
}: {
    createdByUserId: string;
    projectId: string;
    visibility: "CLIENT_VISIBLE" | "INTERNAL";
}) {
    const prisma = getPrismaClient();
    const existing = await prisma.conversation.findFirst({
        where: {
            projectId,
            scope: "PROJECT",
            visibility,
        },
        select: {
            id: true,
        },
    });

    if (existing) return existing;

    return prisma.conversation.create({
        data: {
            createdByUserId,
            projectId,
            scope: "PROJECT",
            title:
                visibility === "CLIENT_VISIBLE"
                    ? "Échanges projet"
                    : "Notes internes",
            visibility,
        },
        select: {
            id: true,
        },
    });
}
