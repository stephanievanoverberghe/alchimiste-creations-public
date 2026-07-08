"use server";

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

const validateGateSchema = z.object({
    gateId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
});

type PhaseCloseProjectInfo = {
    hasActiveBlocker: boolean;
    name: string;
    status: string;
    opportunity: {
        depositAmountCents: number | null;
        estimatedValueCents: number | null;
        prospectName: string;
    } | null;
};

// Shared advance logic: opens the next phase, or - when the closed
// phase was the last one - marks the project delivered and references
// the balance invoice to issue in the external tool.
async function advanceProjectAfterPhaseClose(
    tx: Parameters<Parameters<ReturnType<typeof getPrismaClient>["$transaction"]>[0]>[0],
    {
        closedPhaseSortOrder,
        project,
        projectId,
    }: {
        closedPhaseSortOrder: number;
        project: PhaseCloseProjectInfo;
        projectId: string;
    },
) {
    const nextPhase = await tx.projectPhase.findFirst({
        where: {
            projectId,
            sortOrder: { gt: closedPhaseSortOrder },
            status: "TODO",
        },
        orderBy: [{ sortOrder: "asc" }],
        select: { id: true, name: true },
    });

    if (nextPhase) {
        await tx.projectPhase.update({
            where: { id: nextPhase.id },
            data: { status: "IN_PROGRESS" },
        });
        await tx.project.update({
            where: { id: projectId },
            data: {
                nextAction: `Démarrer la phase : ${nextPhase.name}`,
                ...(project.status === "PREPARATION"
                    ? { status: "EN_COURS" as const }
                    : {}),
            },
        });

        return nextPhase.name;
    }

    const remainingOpenPhases = await tx.projectPhase.count({
        where: {
            projectId,
            status: { in: ["TODO", "IN_PROGRESS"] },
        },
    });

    if (remainingOpenPhases === 0) {
        await tx.project.update({
            where: { id: projectId },
            data: {
                nextAction: "Facturer le solde, archiver et faire le RETEX.",
                status: "LIVRE",
            },
        });

        const existingBalance = await tx.financialDocument.findFirst({
            where: {
                projectId,
                type: "BALANCE_INVOICE",
            },
            select: { id: true },
        });

        if (!existingBalance) {
            const amountCents =
                project.opportunity?.estimatedValueCents &&
                project.opportunity?.depositAmountCents
                    ? project.opportunity.estimatedValueCents -
                      project.opportunity.depositAmountCents
                    : (project.opportunity?.estimatedValueCents ?? null);

            await tx.financialDocument.create({
                data: {
                    amountCents,
                    clientName:
                        project.opportunity?.prospectName ?? project.name,
                    notes: "Solde à émettre dans l'outil de facturation, puis remplacer cette fiche par la référence réelle.",
                    projectId,
                    reference: buildBalanceReference(projectId),
                    status: "TO_INVOICE",
                    type: "BALANCE_INVOICE",
                },
            });

            await createProjectNotifications(tx, {
                actionHref: "/admin/finance",
                audience: "ADMIN",
                body: `${project.name} est livré : émettre la facture de solde dans l'outil de facturation.`,
                priority: "HIGH",
                projectId,
                title: "Solde à facturer",
            });
        }
    }

    return null;
}

const closePhaseSchema = z.object({
    phaseId: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
});

// Closes a phase that has no pending required gate (some phases are
// gate-less, e.g. optional modules): same definition of done as gates,
// same advance logic afterwards.
export async function closePhaseAction(formData: FormData) {
    const session = await requireAdminSession();

    const parsed = closePhaseSchema.safeParse({
        phaseId: formData.get("phaseId"),
        projectId: formData.get("projectId"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?phase=invalid");
    }

    const { phaseId, projectId } = parsed.data;
    const cockpitPath = `/admin/projets/${projectId}`;
    const prisma = getPrismaClient();

    const outcome = await prisma.$transaction(async (tx) => {
        const phase = await tx.projectPhase.findFirst({
            where: { id: phaseId, projectId },
            select: {
                id: true,
                name: true,
                sortOrder: true,
                status: true,
                project: {
                    select: {
                        hasActiveBlocker: true,
                        name: true,
                        status: true,
                        opportunity: {
                            select: {
                                depositAmountCents: true,
                                estimatedValueCents: true,
                                prospectName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!phase) return { status: "not-found" as const };
        if (phase.status === "DONE") {
            return { status: "already-closed" as const };
        }

        const [openDeliverables, openBlockingActions, pendingRequiredGates] =
            await Promise.all([
                tx.deliverable.count({
                    where: {
                        phaseId,
                        projectId,
                        status: { in: ["TODO", "IN_PROGRESS"] },
                    },
                }),
                tx.projectAction.count({
                    where: {
                        isBlocking: true,
                        phaseId,
                        projectId,
                        status: { in: ["TODO", "IN_PROGRESS"] },
                    },
                }),
                tx.projectGate.count({
                    where: {
                        phaseId,
                        projectId,
                        required: true,
                        status: "PENDING",
                    },
                }),
            ]);

        if (pendingRequiredGates > 0) {
            return { status: "gate-pending" as const };
        }

        if (
            openDeliverables > 0 ||
            openBlockingActions > 0 ||
            phase.project.hasActiveBlocker
        ) {
            return {
                blockerActive: phase.project.hasActiveBlocker,
                openBlockingActions,
                openDeliverables,
                status: "blocked" as const,
            };
        }

        await tx.projectPhase.update({
            where: { id: phase.id },
            data: { status: "DONE" },
        });

        const nextPhaseName = await advanceProjectAfterPhaseClose(tx, {
            closedPhaseSortOrder: phase.sortOrder,
            project: phase.project,
            projectId,
        });

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            kind: "STATUS_CHANGE",
            projectId,
            title: `Phase terminée : ${phase.name}${
                nextPhaseName ? ` — ouverture de « ${nextPhaseName} »` : ""
            }`,
            visibility: "CLIENT_VISIBLE",
        });

        return { status: "closed" as const };
    });

    revalidatePath(cockpitPath);
    revalidatePath("/admin/projets");
    revalidatePath("/admin");

    if (outcome.status === "blocked") {
        const details = new URLSearchParams({
            actions: String(outcome.openBlockingActions),
            blocker: outcome.blockerActive ? "1" : "0",
            deliverables: String(outcome.openDeliverables),
            gate: "blocked",
        });

        redirect(`${cockpitPath}?${details.toString()}`);
    }

    redirect(`${cockpitPath}?phase=${outcome.status}`);
}

const closeProjectSchema = z.object({
    projectId: z.string().trim().min(1),
});

// Project closure: requires the internal RETEX to exist (the playbook
// only improves if the retrospective is written), moves the opportunity
// to POST_PROJET and thanks the client - with the Google review ask,
// the cheapest acquisition channel (docs/crm/09_stack-business.md).
export async function closeProjectAction(formData: FormData) {
    const session = await requireAdminSession();

    const parsed = closeProjectSchema.safeParse({
        projectId: formData.get("projectId"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?close=invalid");
    }

    const { projectId } = parsed.data;
    const cockpitPath = `/admin/projets/${projectId}`;
    const prisma = getPrismaClient();

    const outcome = await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                name: true,
                status: true,
                opportunityId: true,
            },
        });

        if (!project) return { status: "not-found" as const };
        if (project.status === "CLOTURE") {
            return { status: "already-closed" as const };
        }
        if (project.status !== "LIVRE") {
            return { status: "not-delivered" as const };
        }

        const retexCount = await tx.realDocument.count({
            where: { documentModelKey: "retex", projectId },
        });

        if (retexCount === 0) {
            return { status: "missing-retex" as const };
        }

        await tx.project.update({
            where: { id: projectId },
            data: {
                nextAction:
                    "Projet clôturé — suite recommandée dans le RETEX (maintenance, SEO, évolutions).",
                status: "CLOTURE",
            },
        });

        await tx.opportunity.update({
            where: { id: project.opportunityId },
            data: { phase: "POST_PROJET" },
        });

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            kind: "PROJECT",
            projectId,
            title: "Projet clôturé 🎉 Merci pour cette collaboration.",
            visibility: "CLIENT_VISIBLE",
        });

        return { name: project.name, status: "closed" as const };
    });

    if (outcome.status === "closed") {
        const reviewUrl = process.env.GOOGLE_REVIEW_URL;

        await sendPortalEmail({
            actionLabel: reviewUrl
                ? "Laisser un avis Google"
                : "Revoir mon projet",
            actionPath: reviewUrl ?? `/espace-client/projets/${projectId}`,
            body: `Votre projet « ${outcome.name} » est officiellement clôturé — merci pour votre confiance ! Si la collaboration vous a plu, un avis de votre part aide énormément un studio indépendant. Et si votre site doit évoluer un jour, votre espace reste ouvert.`,
            subject: "Merci ! Votre projet est clôturé 🎉",
            to: await getProjectClientEmails(projectId),
        });
    }

    revalidatePath(cockpitPath);
    revalidatePath("/admin/projets");
    revalidatePath("/admin");
    redirect(`${cockpitPath}?close=${outcome.status}`);
}

// Placeholder reference until the real invoice is issued in the
// external tool (FAC- prefix per the naming convention).
function buildBalanceReference(projectId: string) {
    const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");

    return `FAC-SOLDE-${date}-${projectId.slice(-6)}`;
}

const updateProjectLinksSchema = z.object({
    driveFolderUrl: z.string().trim().url().max(500).or(z.literal("")),
    githubRepoUrl: z.string().trim().url().max(500).or(z.literal("")),
    projectId: z.string().trim().min(1),
});

// Kickoff checklist: reference the real Drive folder and GitHub repo on
// the project card (links only, no external API).
export async function updateProjectLinksAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateProjectLinksSchema.safeParse({
        driveFolderUrl: String(formData.get("driveFolderUrl") ?? "").trim(),
        githubRepoUrl: String(formData.get("githubRepoUrl") ?? "").trim(),
        projectId: formData.get("projectId"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?links=invalid");
    }

    const { driveFolderUrl, githubRepoUrl, projectId } = parsed.data;
    const prisma = getPrismaClient();

    const result = await prisma.project.updateMany({
        where: { id: projectId },
        data: {
            driveFolderUrl: driveFolderUrl || null,
            githubRepoUrl: githubRepoUrl || null,
        },
    });

    if (result.count === 0) {
        redirect("/admin/projets?links=not-found");
    }

    revalidatePath(`/admin/projets/${projectId}`);
    redirect(`/admin/projets/${projectId}?links=updated`);
}

const updateItemStatusSchema = z.object({
    itemId: z.string().trim().min(1),
    kind: z.enum(["deliverable", "action"]),
    projectId: z.string().trim().min(1),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

// Toggle a deliverable or blocking action status from the cockpit.
// Actions are mirrored to the ProjectTask with the same key so the two
// generated collections never diverge.
export async function updateProjectItemStatusAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateItemStatusSchema.safeParse({
        itemId: formData.get("itemId"),
        kind: formData.get("kind"),
        projectId: formData.get("projectId"),
        status: formData.get("status"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?item=invalid");
    }

    const { itemId, kind, projectId, status } = parsed.data;
    const prisma = getPrismaClient();

    if (kind === "deliverable") {
        const result = await prisma.deliverable.updateMany({
            where: { id: itemId, projectId },
            data: { status },
        });

        if (result.count === 0) {
            redirect(`/admin/projets/${projectId}?item=not-found`);
        }
    } else {
        const action = await prisma.projectAction.findFirst({
            where: { id: itemId, projectId },
            select: { key: true },
        });

        if (!action) {
            redirect(`/admin/projets/${projectId}?item=not-found`);
        }

        await prisma.$transaction([
            prisma.projectAction.updateMany({
                where: { id: itemId, projectId },
                data: { status },
            }),
            prisma.projectTask.updateMany({
                where: { key: action.key, projectId },
                data: { status },
            }),
        ]);
    }

    revalidatePath(`/admin/projets/${projectId}`);
    revalidatePath(`/admin/projets/${projectId}/roadmap`);
    redirect(`/admin/projets/${projectId}`);
}

// Validates a project gate after re-checking its definition of done:
// no open deliverable, no open blocking action in the gate's phase and
// no active project blocker. Closing the last required gate of a phase
// closes the phase and opens the next one.
export async function validateProjectGateAction(formData: FormData) {
    const session = await requireAdminSession();

    const parsed = validateGateSchema.safeParse({
        gateId: formData.get("gateId"),
        projectId: formData.get("projectId"),
    });

    if (!parsed.success) {
        redirect("/admin/projets?gate=invalid");
    }

    const { gateId, projectId } = parsed.data;
    const cockpitPath = `/admin/projets/${projectId}`;
    const prisma = getPrismaClient();

    const outcome = await prisma.$transaction(async (tx) => {
        const gate = await tx.projectGate.findFirst({
            where: { id: gateId, projectId },
            select: {
                id: true,
                title: true,
                status: true,
                required: true,
                isClientVisible: true,
                phaseId: true,
                project: {
                    select: {
                        hasActiveBlocker: true,
                        name: true,
                        status: true,
                        opportunity: {
                            select: {
                                estimatedValueCents: true,
                                depositAmountCents: true,
                                prospectName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!gate) return { status: "not-found" as const };
        if (gate.status === "VALIDATED") {
            return { status: "already-validated" as const };
        }

        const [openDeliverables, openBlockingActions] = await Promise.all([
            gate.phaseId
                ? tx.deliverable.count({
                      where: {
                          phaseId: gate.phaseId,
                          projectId,
                          status: { in: ["TODO", "IN_PROGRESS"] },
                      },
                  })
                : Promise.resolve(0),
            gate.phaseId
                ? tx.projectAction.count({
                      where: {
                          isBlocking: true,
                          phaseId: gate.phaseId,
                          projectId,
                          status: { in: ["TODO", "IN_PROGRESS"] },
                      },
                  })
                : Promise.resolve(0),
        ]);

        if (
            openDeliverables > 0 ||
            openBlockingActions > 0 ||
            gate.project.hasActiveBlocker
        ) {
            return {
                blockerActive: gate.project.hasActiveBlocker,
                openBlockingActions,
                openDeliverables,
                status: "blocked" as const,
            };
        }

        await tx.projectGate.update({
            where: { id: gate.id },
            data: { status: "VALIDATED" },
        });

        let phaseClosed = false;
        let nextPhaseName: string | null = null;

        if (gate.phaseId) {
            const remainingRequiredGates = await tx.projectGate.count({
                where: {
                    phaseId: gate.phaseId,
                    projectId,
                    required: true,
                    status: "PENDING",
                },
            });

            if (remainingRequiredGates === 0) {
                const phase = await tx.projectPhase.update({
                    where: { id: gate.phaseId },
                    data: { status: "DONE" },
                    select: { sortOrder: true },
                });

                phaseClosed = true;

                const nextPhase = await tx.projectPhase.findFirst({
                    where: {
                        projectId,
                        sortOrder: { gt: phase.sortOrder },
                        status: "TODO",
                    },
                    orderBy: [{ sortOrder: "asc" }],
                    select: { id: true, name: true },
                });

                nextPhaseName = await advanceProjectAfterPhaseClose(tx, {
                    closedPhaseSortOrder: phase.sortOrder,
                    project: gate.project,
                    projectId,
                });
            }
        }

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            kind: "VALIDATION",
            metadata: { gateId: gate.id, phaseClosed },
            projectId,
            title: phaseClosed
                ? `Gate validé : ${gate.title} — phase terminée${
                      nextPhaseName ? `, ouverture de « ${nextPhaseName} »` : ""
                  }`
                : `Gate validé : ${gate.title}`,
            visibility: gate.isClientVisible ? "CLIENT_VISIBLE" : "ADMIN_ONLY",
        });

        return { phaseClosed, status: "validated" as const };
    });

    revalidatePath(cockpitPath);
    revalidatePath(`${cockpitPath}/roadmap`);
    revalidatePath("/admin/projets");
    revalidatePath("/admin");

    if (outcome.status === "blocked") {
        const details = new URLSearchParams({
            actions: String(outcome.openBlockingActions),
            blocker: outcome.blockerActive ? "1" : "0",
            deliverables: String(outcome.openDeliverables),
            gate: "blocked",
        });

        redirect(`${cockpitPath}?${details.toString()}`);
    }

    redirect(`${cockpitPath}?gate=${outcome.status}`);
}
