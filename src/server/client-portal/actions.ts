"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireClientPortalSession } from "@/server/auth/client";
import { getPrismaClient } from "@/server/db/client";
import { canReadProject } from "@/server/client-portal/portal";
import {
    getAdminEmails,
    sendPortalEmail,
} from "@/server/emails/portal-notifications";
import { createProjectNotifications } from "@/server/notifications/notifications";
import { createTimelineEvent } from "@/server/timeline/timeline";

const respondValidationSchema = z.object({
    projectId: z.string().min(1),
    responseComment: z.string().trim().max(2000).optional(),
    status: z.enum(["APPROVED", "CHANGES_REQUESTED"]),
    validationId: z.string().min(1),
});

export async function respondClientValidationAction(formData: FormData) {
    const session = await requireClientPortalSession();
    const parsed = respondValidationSchema.parse({
        projectId: formData.get("projectId"),
        responseComment: formData.get("responseComment"),
        status: formData.get("status"),
        validationId: formData.get("validationId"),
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
    const responseComment = nullableString(parsed.responseComment);
    const isApproved = parsed.status === "APPROVED";

    const responded = await prisma.$transaction(async (tx) => {
        const result = await tx.validation.updateMany({
            where: {
                id: parsed.validationId,
                isClientVisible: true,
                projectId: parsed.projectId,
                type: "CLIENT",
            },
            data: {
                respondedAt: new Date(),
                responseComment,
                status: parsed.status,
            },
        });

        if (result.count === 0) return false;

        const validation = await tx.validation.findUnique({
            where: { id: parsed.validationId },
            select: { title: true },
        });

        const validationTitle = validation?.title ?? "Validation";
        // Le titre de l'item de validation commence par « Valider : » ; on
        // retire ce préfixe pour ne pas le doubler dans « Retouche demandée :
        // Valider : … » (friction UX #21) — notifications, sujets et corps.
        const documentName =
            validationTitle.replace(/^\s*valider\s*:\s*/i, "").trim() ||
            validationTitle;
        const decisionLabel = isApproved
            ? "validée par le client"
            : "retour client : retouche demandée";

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            description: responseComment,
            kind: "VALIDATION",
            metadata: {
                status: parsed.status,
                validationId: parsed.validationId,
            },
            projectId: parsed.projectId,
            title: `${documentName} — ${decisionLabel}`,
            visibility: "CLIENT_VISIBLE",
        });

        await createProjectNotifications(tx, {
            actionHref: `/admin/projets/${parsed.projectId}`,
            audience: "ADMIN",
            body: responseComment ?? undefined,
            priority: isApproved ? "NORMAL" : "HIGH",
            projectId: parsed.projectId,
            title: isApproved
                ? `Validation approuvée : ${documentName}`
                : `Retouche demandée : ${documentName}`,
        });

        return { documentName };
    });

    if (!responded) {
        redirect(`/espace-client/projets/${parsed.projectId}?validation=not-found`);
    }

    // Fire-and-forget admin e-mail (works in Resend test mode since the
    // admin address is the account owner).
    await sendPortalEmail({
        actionLabel: "Ouvrir le cockpit du projet",
        actionPath: `/admin/projets/${parsed.projectId}`,
        body: isApproved
            ? `Le client a validé : « ${responded.documentName} ».`
            : `Le client demande un ajustement sur « ${responded.documentName} »${
                  responseComment ? ` : « ${responseComment} »` : ""
              }.`,
        subject: isApproved
            ? `Validation client : ${responded.documentName}`
            : `Retouche demandée : ${responded.documentName}`,
        to: await getAdminEmails(),
    });

    revalidatePath("/espace-client");
    revalidatePath(`/espace-client/projets/${parsed.projectId}`);
    redirect(`/espace-client/projets/${parsed.projectId}?validation=${parsed.status}`);
}

function nullableString(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}
