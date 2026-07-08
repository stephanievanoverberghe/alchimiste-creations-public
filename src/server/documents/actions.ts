"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";
import {
    getProjectClientEmails,
    sendPortalEmail,
} from "@/server/emails/portal-notifications";
import { createProjectNotifications } from "@/server/notifications/notifications";
import { createTimelineEvent } from "@/server/timeline/timeline";

const realDocumentStatuses = [
    "DRAFT",
    "REFERENCED",
    "SHARED",
    "SENT",
    "APPROVED",
    "ARCHIVED",
] as const;

const realDocumentTypes = [
    "PROPOSAL",
    "CONTRACT",
    "BRIEF",
    "DELIVERABLE",
    "ASSET",
    "REPORT",
    "HANDOVER",
    "OTHER",
] as const;

const createRealDocumentSchema = z.object({
    clientName: z.string().trim().min(1).max(160),
    deliverableId: z.string().trim().optional(),
    documentUrl: z.string().trim().min(1).max(1000),
    isClientVisible: z.boolean(),
    notes: z.string().trim().max(2000).optional(),
    projectId: z.string().trim().min(1),
    reference: z.string().trim().min(1).max(120),
    status: z.enum(realDocumentStatuses),
    title: z.string().trim().min(1).max(180),
    type: z.enum(realDocumentTypes),
});

export async function createRealDocumentAction(formData: FormData) {
    await requireAdminSession();

    const parsed = createRealDocumentSchema.parse({
        clientName: formData.get("clientName"),
        deliverableId: formData.get("deliverableId"),
        documentUrl: formData.get("documentUrl"),
        isClientVisible: formData.get("isClientVisible") === "on",
        notes: formData.get("notes"),
        projectId: formData.get("projectId"),
        reference: formData.get("reference"),
        status: formData.get("status"),
        title: formData.get("title"),
        type: formData.get("type"),
    });

    const prisma = getPrismaClient();
    const project = await prisma.project.findUnique({
        where: { id: parsed.projectId },
        select: {
            opportunityId: true,
        },
    });

    if (!project) {
        redirect("/admin/documents?created=missing-project");
    }

    await prisma.$executeRaw`
        INSERT INTO "RealDocument" (
            "id",
            "clientName",
            "deliverableId",
            "documentUrl",
            "isClientVisible",
            "notes",
            "opportunityId",
            "projectId",
            "reference",
            "status",
            "title",
            "type",
            "createdAt",
            "updatedAt"
        )
        VALUES (
            ${randomUUID()},
            ${parsed.clientName},
            ${nullableString(parsed.deliverableId)},
            ${parsed.documentUrl},
            ${parsed.isClientVisible},
            ${nullableString(parsed.notes)},
            ${project.opportunityId},
            ${parsed.projectId},
            ${parsed.reference},
            ${parsed.status}::"RealDocumentStatus",
            ${parsed.title},
            ${parsed.type}::"RealDocumentType",
            NOW(),
            NOW()
        )
    `;

    revalidatePath("/admin");
    revalidatePath("/admin/documents");
    redirect("/admin/documents?created=1");
}

const createComposedDocumentSchema = z.object({
    modelKey: z.string().trim().min(1).max(80),
    projectId: z.string().trim().min(1),
});

// Create a composed document from an app model, prefilled from live
// project data (docs/project-os/15_systeme-documents.md §3).
export async function createComposedDocumentAction(formData: FormData) {
    await requireAdminSession();

    const parsed = createComposedDocumentSchema.safeParse({
        modelKey: formData.get("modelKey"),
        projectId: formData.get("projectId"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?document=invalid");
    }

    const { modelKey, projectId } = parsed.data;
    const prisma = getPrismaClient();

    const [project, model] = await Promise.all([
        prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                name: true,
                opportunityId: true,
                opportunity: {
                    select: { prospectName: true },
                },
            },
        }),
        prisma.documentModel.findUnique({
            where: { key: modelKey },
            select: {
                key: true,
                name: true,
                realDocumentType: true,
                sections: true,
            },
        }),
    ]);

    if (!project || !model) {
        redirect(`/admin/projets/${projectId}/documents?document=missing-model`);
    }

    const { buildPrefillValues, parseModelSections } = await import(
        "@/server/documents/composer"
    );
    const prefillValues = await buildPrefillValues(projectId);
    const sections: Record<string, string> = {};

    for (const section of parseModelSections(model.sections)) {
        sections[section.key] = section.prefill
            ? (prefillValues[section.prefill] ?? "")
            : "";
    }

    const reference = buildDocumentReference({
        clientName: project.opportunity.prospectName,
        modelKey: model.key,
    });

    const document = await prisma.realDocument.create({
        data: {
            clientName: project.opportunity.prospectName,
            contentJson: { sections },
            documentModelKey: model.key,
            isClientVisible: false,
            opportunityId: project.opportunityId,
            projectId: project.id,
            reference,
            status: "DRAFT",
            title: `${model.name} — ${project.name}`,
            type: model.realDocumentType,
        },
        select: { id: true },
    });

    revalidatePath(`/admin/projets/${projectId}/documents`);
    redirect(`/admin/projets/${projectId}/documents/${document.id}`);
}

const updateComposedDocumentSchema = z.object({
    documentId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
    title: z.string().trim().min(1).max(180),
});

export async function updateComposedDocumentAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateComposedDocumentSchema.safeParse({
        documentId: formData.get("documentId"),
        projectId: formData.get("projectId"),
        title: formData.get("title"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?document=invalid");
    }

    const { documentId, projectId, title } = parsed.data;
    const sections: Record<string, string> = {};

    for (const [name, value] of formData.entries()) {
        if (name.startsWith("section:") && typeof value === "string") {
            sections[name.slice("section:".length)] = value.slice(0, 20000);
        }
    }

    const prisma = getPrismaClient();
    const result = await prisma.realDocument.updateMany({
        where: {
            id: documentId,
            projectId,
            documentModelKey: { not: null },
        },
        data: {
            contentJson: { sections },
            title,
        },
    });

    if (result.count === 0) {
        redirect(`/admin/projets/${projectId}/documents?document=not-found`);
    }

    revalidatePath(`/admin/projets/${projectId}/documents/${documentId}`);
    redirect(
        `/admin/projets/${projectId}/documents/${documentId}?document=saved`,
    );
}

const shareComposedDocumentSchema = z.object({
    documentId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
});

// Share a composed document with the client: freeze the current content
// as an immutable version (v01, v02...), open/reset the linked client
// validation, trace the timeline and notify the client. No silent share.
export async function shareComposedDocumentAction(formData: FormData) {
    const session = await requireAdminSession();

    const parsed = shareComposedDocumentSchema.safeParse({
        documentId: formData.get("documentId"),
        projectId: formData.get("projectId"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?document=invalid");
    }

    const { documentId, projectId } = parsed.data;
    const prisma = getPrismaClient();

    const shared = await prisma.$transaction(async (tx) => {
        const document = await tx.realDocument.findFirst({
            where: {
                id: documentId,
                projectId,
                documentModelKey: { not: null },
            },
            select: {
                id: true,
                title: true,
                contentJson: true,
                currentVersion: true,
            },
        });

        if (!document) return null;

        const nextVersion = document.currentVersion + 1;

        await tx.realDocumentVersion.create({
            data: {
                contentSnapshot: document.contentJson ?? { sections: {} },
                realDocumentId: document.id,
                sharedByUserId: session.user.id,
                version: nextVersion,
            },
        });

        await tx.realDocument.update({
            where: { id: document.id },
            data: {
                currentVersion: nextVersion,
                isClientVisible: true,
                status: "SHARED",
            },
        });

        const validationTitle = `Valider : ${document.title}`;
        const existingValidation = await tx.validation.findFirst({
            where: { realDocumentId: document.id, projectId },
            select: { id: true },
        });

        if (existingValidation) {
            await tx.validation.update({
                where: { id: existingValidation.id },
                data: {
                    requestedAt: new Date(),
                    respondedAt: null,
                    responseComment: null,
                    status: "PENDING",
                    title: validationTitle,
                },
            });
        } else {
            await tx.validation.create({
                data: {
                    isClientVisible: true,
                    key: `doc_${document.id}`,
                    projectId,
                    realDocumentId: document.id,
                    requestedAt: new Date(),
                    status: "PENDING",
                    title: validationTitle,
                    type: "CLIENT",
                },
            });
        }

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            kind: "DOCUMENT",
            metadata: { documentId: document.id, version: nextVersion },
            projectId,
            title: `Document partagé : ${document.title} (v${String(
                nextVersion,
            ).padStart(2, "0")})`,
            visibility: "CLIENT_VISIBLE",
        });

        await createProjectNotifications(tx, {
            actionHref: `/espace-client/projets/${projectId}/documents/${document.id}`,
            audience: "CLIENT",
            body: "Un document est à lire et à valider dans ton espace.",
            priority: "HIGH",
            projectId,
            title: `Nouveau document : ${document.title}`,
        });

        return { title: document.title, version: nextVersion };
    });

    if (!shared) {
        redirect(`/admin/projets/${projectId}/documents?document=not-found`);
    }

    // Fire-and-forget: works today only towards verified recipients
    // (Resend test mode until the domain is verified).
    await sendPortalEmail({
        actionLabel: "Lire et valider le document",
        actionPath: `/espace-client/projets/${projectId}/documents/${documentId}`,
        body: `Un document t'attend : « ${shared.title} » (version v${String(
            shared.version,
        ).padStart(2, "0")}). Ouvre-le dans ton espace, puis valide-le ou demande un ajustement.`,
        subject: `Document à valider : ${shared.title}`,
        to: await getProjectClientEmails(projectId),
    });

    revalidatePath(`/admin/projets/${projectId}/documents/${documentId}`);
    revalidatePath(`/admin/projets/${projectId}`);
    revalidatePath("/espace-client");
    redirect(
        `/admin/projets/${projectId}/documents/${documentId}?document=shared`,
    );
}

// Convention: YYYY-MM-DD_TYPE_client (versions live in
// RealDocumentVersion, never in the name).
function buildDocumentReference({
    clientName,
    modelKey,
}: {
    clientName: string;
    modelKey: string;
}) {
    const date = new Date().toISOString().slice(0, 10);
    const clientSlug = slugify(clientName);
    const suffix = randomUUID().slice(0, 4);

    return `${date}_${modelKey}_${clientSlug}_${suffix}`;
}

function slugify(value: string) {
    return value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 40);
}

function nullableString(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}
