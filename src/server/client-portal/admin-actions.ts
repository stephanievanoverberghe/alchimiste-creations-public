"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";
import { sendPortalEmail } from "@/server/emails/portal-notifications";

const grantClientAccessSchema = z.object({
    email: z.string().trim().email(),
    projectId: z.string().min(1),
});

export async function grantClientPortalAccessAction(formData: FormData) {
    await requireAdminSession();

    const parsed = grantClientAccessSchema.parse({
        email: formData.get("email"),
        projectId: formData.get("projectId"),
    });
    const email = parsed.email.toLowerCase();
    const prisma = getPrismaClient();

    const project = await prisma.project.findUnique({
        where: { id: parsed.projectId },
        select: { id: true },
    });

    if (!project) {
        redirect("/admin?clientAccess=missing-project");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            role: true,
        },
    });
    const user =
        existingUser ??
        (await prisma.user.create({
            data: {
                email,
                role: "CLIENT_OWNER",
            },
            select: {
                id: true,
                role: true,
            },
        }));

    await prisma.$executeRaw`
        INSERT INTO "ClientPortalAccess" (
            "id",
            "userId",
            "projectId",
            "status",
            "createdAt",
            "updatedAt"
        )
        VALUES (
            ${randomUUID()},
            ${user.id},
            ${parsed.projectId},
            'ACTIVE'::"ClientPortalAccessStatus",
            NOW(),
            NOW()
        )
        ON CONFLICT ("userId", "projectId")
        DO UPDATE SET
            "status" = 'ACTIVE'::"ClientPortalAccessStatus",
            "updatedAt" = NOW()
    `;

    // Invitation e-mail: the login page sends a magic link to this
    // address (it is now a known user), no password needed upfront.
    await sendPortalEmail({
        actionLabel: "Accéder à mon espace",
        actionPath: "/connexion",
        body: "Votre espace de suivi de projet est ouvert. Connectez-vous avec cette adresse e-mail : un lien de connexion sécurisé vous sera envoyé, et vous pourrez suivre l'avancement, lire les documents et donner vos validations.",
        subject: "Votre espace projet Alchimiste Créations est prêt",
        to: [email],
    });

    revalidatePath("/admin");
    revalidatePath("/espace-client");
    redirect("/admin?clientAccess=granted");
}

export async function getAdminClientPortalProjects() {
    const prisma = getPrismaClient();

    return prisma.project.findMany({
        orderBy: [{ updatedAt: "desc" }],
        select: {
            id: true,
            name: true,
            opportunity: {
                select: {
                    prospectEmail: true,
                    prospectName: true,
                },
            },
        },
    });
}
