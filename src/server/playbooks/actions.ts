"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";

const updatePhaseSchema = z.object({
    description: z.string().trim().max(600).optional(),
    name: z.string().trim().min(1).max(160),
    phaseId: z.string().trim().min(1),
    playbookId: z.string().trim().min(1),
});

export async function updatePlaybookPhaseAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updatePhaseSchema.safeParse({
        description: formData.get("description") ?? undefined,
        name: formData.get("name"),
        phaseId: formData.get("phaseId"),
        playbookId: formData.get("playbookId"),
    });

    if (!parsed.success) {
        redirect("/admin/playbooks?status=invalid-phase");
    }

    const prisma = getPrismaClient();

    const result = await prisma.playbookPhaseTemplate.updateMany({
        where: {
            id: parsed.data.phaseId,
            playbookId: parsed.data.playbookId,
        },
        data: {
            description: parsed.data.description || null,
            name: parsed.data.name,
        },
    });

    if (result.count === 0) {
        redirect("/admin/playbooks?status=phase-not-found");
    }

    revalidatePath(`/admin/playbooks/${parsed.data.playbookId}`);
    redirect(`/admin/playbooks/${parsed.data.playbookId}?status=phase-updated`);
}

const updateDeliverableSchema = z.object({
    deliverableId: z.string().trim().min(1),
    description: z.string().trim().max(600).optional(),
    isClientVisible: z.boolean(),
    isRequired: z.boolean(),
    name: z.string().trim().min(1).max(160),
    playbookId: z.string().trim().min(1),
});

export async function updatePlaybookDeliverableAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateDeliverableSchema.safeParse({
        deliverableId: formData.get("deliverableId"),
        description: formData.get("description") ?? undefined,
        isClientVisible: formData.get("isClientVisible") === "on",
        isRequired: formData.get("isRequired") === "on",
        name: formData.get("name"),
        playbookId: formData.get("playbookId"),
    });

    if (!parsed.success) {
        redirect("/admin/playbooks?status=invalid-deliverable");
    }

    const prisma = getPrismaClient();

    const result = await prisma.playbookDeliverableTemplate.updateMany({
        where: {
            id: parsed.data.deliverableId,
            playbookId: parsed.data.playbookId,
        },
        data: {
            description: parsed.data.description || null,
            isClientVisible: parsed.data.isClientVisible,
            isRequired: parsed.data.isRequired,
            name: parsed.data.name,
        },
    });

    if (result.count === 0) {
        redirect("/admin/playbooks?status=deliverable-not-found");
    }

    revalidatePath(`/admin/playbooks/${parsed.data.playbookId}`);
    redirect(
        `/admin/playbooks/${parsed.data.playbookId}?status=deliverable-updated`,
    );
}

const updateDocumentSchema = z.object({
    documentId: z.string().trim().min(1),
    name: z.string().trim().min(1).max(160),
    playbookId: z.string().trim().min(1),
    recommendedFormat: z.string().trim().max(120).optional(),
    usage: z.string().trim().max(600).optional(),
});

export async function updatePlaybookDocumentAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateDocumentSchema.safeParse({
        documentId: formData.get("documentId"),
        name: formData.get("name"),
        playbookId: formData.get("playbookId"),
        recommendedFormat: formData.get("recommendedFormat") ?? undefined,
        usage: formData.get("usage") ?? undefined,
    });

    if (!parsed.success) {
        redirect("/admin/playbooks?status=invalid-document");
    }

    const prisma = getPrismaClient();

    const result = await prisma.playbookDocumentTemplate.updateMany({
        where: {
            id: parsed.data.documentId,
            playbookId: parsed.data.playbookId,
        },
        data: {
            name: parsed.data.name,
            recommendedFormat: parsed.data.recommendedFormat || null,
            usage: parsed.data.usage || null,
        },
    });

    if (result.count === 0) {
        redirect("/admin/playbooks?status=document-not-found");
    }

    revalidatePath(`/admin/playbooks/${parsed.data.playbookId}`);
    redirect(
        `/admin/playbooks/${parsed.data.playbookId}?status=document-updated`,
    );
}

const updateModuleSchema = z.object({
    description: z.string().trim().max(500).optional(),
    moduleId: z.string().trim().min(1),
    name: z.string().trim().min(1).max(160),
    playbookId: z.string().trim().min(1),
});

export async function updatePlaybookModuleAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateModuleSchema.safeParse({
        description: formData.get("description") ?? undefined,
        moduleId: formData.get("moduleId"),
        name: formData.get("name"),
        playbookId: formData.get("playbookId"),
    });

    if (!parsed.success) {
        redirect("/admin/playbooks?status=invalid-module");
    }

    const prisma = getPrismaClient();

    const result = await prisma.playbookModuleTemplate.updateMany({
        where: {
            id: parsed.data.moduleId,
            playbookId: parsed.data.playbookId,
        },
        data: {
            description: parsed.data.description || null,
            name: parsed.data.name,
        },
    });

    if (result.count === 0) {
        redirect("/admin/playbooks?status=module-not-found");
    }

    revalidatePath(`/admin/playbooks/${parsed.data.playbookId}`);
    redirect(`/admin/playbooks/${parsed.data.playbookId}?status=module-updated`);
}
