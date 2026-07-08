"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";
import { performOpportunityConversion } from "@/server/crm/opportunity-actions";
import { generateProjectOsStructure } from "@/server/project-os/generation";

const generateProjectOsSchema = z.object({
    opportunityId: z.string().min(1),
    projectId: z.string().min(1),
});

const convertAndGenerateSchema = z.object({
    opportunityId: z.string().min(1),
    projectTypeId: z.string().min(1),
    selectedModuleKeys: z.array(z.string().trim().min(1)).max(40),
});

// Conversion wizard submit: confirm the project type, convert the
// opportunity (explicit admin action, session re-checked in the core),
// then generate the playbook instance with the chosen optional modules.
export async function convertAndGenerateProjectAction(formData: FormData) {
    const session = await requireAdminSession();

    const parsed = convertAndGenerateSchema.safeParse({
        opportunityId: formData.get("opportunityId"),
        projectTypeId: formData.get("projectTypeId"),
        selectedModuleKeys: formData
            .getAll("modules")
            .map((value) => String(value)),
    });

    if (!parsed.success) {
        redirect("/admin/demandes?conversion=invalid-wizard");
    }

    const { opportunityId, projectTypeId, selectedModuleKeys } = parsed.data;
    const wizardPath = `/admin/demandes/${opportunityId}/convertir`;
    const prisma = getPrismaClient();

    const opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId },
        select: {
            id: true,
            projectTypeId: true,
            convertedProject: {
                select: { id: true },
            },
        },
    });

    if (!opportunity) {
        redirect("/admin/demandes?conversion=missing");
    }

    let projectId = opportunity.convertedProject?.id ?? null;

    if (!projectId) {
        const projectType = await prisma.projectType.findUnique({
            where: { id: projectTypeId },
            select: { id: true },
        });

        if (!projectType) {
            redirect(`${wizardPath}?wizard=unknown-type`);
        }

        if (opportunity.projectTypeId !== projectTypeId) {
            await prisma.opportunity.update({
                where: { id: opportunityId },
                data: { projectTypeId },
            });
        }

        const conversion = await performOpportunityConversion(opportunityId);

        if (conversion.status === "missing") {
            redirect("/admin/demandes?conversion=missing");
        }

        if (conversion.status === "blocked") {
            redirect(`${wizardPath}?wizard=blocked`);
        }

        projectId = "projectId" in conversion ? conversion.projectId : null;
    }

    if (!projectId) {
        redirect(`${wizardPath}?wizard=conversion-failed`);
    }

    const generation = await generateProjectOsStructure(projectId, {
        appliedByUserId: session.user.id,
        selectedModuleKeys,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/demandes");
    revalidatePath(`/admin/demandes/${opportunityId}`);
    revalidatePath("/admin/projets");
    revalidatePath(`/admin/projets/${projectId}`);

    redirect(`/admin/projets/${projectId}?generation=${generation.status}`);
}

export async function generateProjectOsAction(formData: FormData) {
    const session = await requireAdminSession();

    const parsed = generateProjectOsSchema.parse({
        opportunityId: formData.get("opportunityId"),
        projectId: formData.get("projectId"),
    });

    const result = await generateProjectOsStructure(parsed.projectId, {
        appliedByUserId: session.user.id,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/demandes");
    revalidatePath(`/admin/demandes/${parsed.opportunityId}`);

    redirect(
        `/admin/demandes/${parsed.opportunityId}?projectOs=${result.status}${
            result.projectId ? `&projectId=${result.projectId}` : ""
        }`,
    );
}
