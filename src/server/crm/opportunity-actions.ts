"use server";

import {
    OpportunityFit,
    OpportunityPriority,
    OpportunityStatus,
    type Prisma,
    type UserRole,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { isAdminRole } from "@/server/auth/roles";
import { getPrismaClient } from "@/server/db/client";
import { getOpportunityConversionGates } from "@/server/crm/opportunities";
import {
    calculateOpportunityQualificationScore,
    getPhaseForStatus,
    requiresNextAction,
} from "@/server/crm/qualification";

const updateOpportunitySchema = z.object({
    id: z.string().min(1),
    nextAction: z.string().trim().max(240).optional(),
    nextFollowUpAt: z.string().trim().optional(),
    notes: z.string().trim().max(4000).optional(),
    priority: z.enum(OpportunityPriority),
    status: z.enum(OpportunityStatus),
});

const convertOpportunitySchema = z.object({
    id: z.string().min(1),
});

export async function updateOpportunityPipelineAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateOpportunitySchema.parse({
        id: formData.get("id"),
        nextAction: formData.get("nextAction"),
        nextFollowUpAt: formData.get("nextFollowUpAt"),
        notes: formData.get("notes"),
        priority: formData.get("priority"),
        status: formData.get("status"),
    });

    const prisma = getPrismaClient();
    const nextAction = nullableString(parsed.nextAction);

    if (requiresNextAction(parsed.status) && !nextAction) {
        redirect("/admin/demandes?update=missing-next-action");
    }

    await prisma.opportunity.update({
        where: { id: parsed.id },
        data: {
            nextAction,
            nextFollowUpAt: parseDateInput(parsed.nextFollowUpAt),
            notes: nullableString(parsed.notes),
            phase: getPhaseForStatus(parsed.status),
            priority: parsed.priority,
            status: parsed.status,
        },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/demandes");
}

export async function convertOpportunityToProjectAction(formData: FormData) {
    const parsed = convertOpportunitySchema.parse({
        id: formData.get("id"),
    });

    const result = await performOpportunityConversion(parsed.id);

    revalidatePath("/admin");
    revalidatePath("/admin/demandes");
    revalidatePath(`/admin/demandes/${parsed.id}`);

    if (result.status === "missing") {
        redirect("/admin/demandes?conversion=missing");
    }

    redirect(
        `/admin/demandes/${parsed.id}?conversion=${result.status}${
            "projectId" in result && result.projectId
                ? `&projectId=${result.projectId}`
                : ""
        }`,
    );
}

// Conversion core, reused by the direct action above and by the
// conversion wizard (src/server/project-os/actions.ts). Self-protected:
// the admin session is re-checked here even when called from another action.
export async function performOpportunityConversion(opportunityId: string) {
    const session = await requireAdminSession();
    const prisma = getPrismaClient();

    return prisma.$transaction(async (tx) => {
        const opportunity = await tx.opportunity.findUnique({
            where: { id: opportunityId },
            select: {
                id: true,
                title: true,
                prospectName: true,
                prospectEmail: true,
                rawNeed: true,
                objective: true,
                commercialScopeUrl: true,
                quoteUrl: true,
                quoteSentAt: true,
                quoteAcceptedAt: true,
                depositReceivedAt: true,
                depositAmountCents: true,
                conversionExceptionReason: true,
                commercialBlocker: true,
                nextAction: true,
                organizationName: true,
                clientAccountId: true,
                contactId: true,
                offerId: true,
                projectTypeId: true,
                convertedProject: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!opportunity) {
            return { status: "missing" as const };
        }

        if (opportunity.convertedProject) {
            return {
                projectId: opportunity.convertedProject.id,
                status: "already-converted" as const,
            };
        }

        const readiness = getOpportunityConversionGates(opportunity);

        if (!readiness.readyToConvert) {
            return { status: "blocked" as const };
        }

        const clientContext = await ensureConversionClientContext(tx, opportunity);

        const project = await tx.project.create({
            data: {
                name: buildProjectName(opportunity),
                nextAction: buildProjectGateZeroAction(),
                notes: buildProjectNotes(opportunity),
                offerId: opportunity.offerId,
                opportunityId: opportunity.id,
                projectTypeId: opportunity.projectTypeId,
                stage: "CADRAGE",
                status: "PREPARATION",
            },
            select: {
                id: true,
            },
        });

        await tx.clientPortalAccess.upsert({
            where: {
                userId_projectId: {
                    projectId: project.id,
                    userId: clientContext.userId,
                },
            },
            create: {
                projectId: project.id,
                status: "ACTIVE",
                userId: clientContext.userId,
            },
            update: {
                status: "ACTIVE",
            },
        });

        await tx.financialDocument.updateMany({
            where: {
                opportunityId: opportunity.id,
                projectId: null,
            },
            data: {
                projectId: project.id,
            },
        });

        // Financial milestone: keep a trace of the received deposit on the
        // project if no deposit invoice was referenced during the tunnel.
        if (opportunity.depositReceivedAt && opportunity.depositAmountCents) {
            const existingDeposit = await tx.financialDocument.findFirst({
                where: {
                    opportunityId: opportunity.id,
                    type: "DEPOSIT_INVOICE",
                },
                select: { id: true },
            });

            if (!existingDeposit) {
                await tx.financialDocument.create({
                    data: {
                        amountCents: opportunity.depositAmountCents,
                        clientName: opportunity.prospectName,
                        notes: "Acompte reçu avant conversion — remplacer par la référence réelle de l'outil de facturation.",
                        opportunityId: opportunity.id,
                        paidAt: opportunity.depositReceivedAt,
                        projectId: project.id,
                        reference: `FAC-ACOMPTE-${new Date()
                            .toISOString()
                            .slice(0, 10)
                            .replaceAll("-", "")}-${project.id.slice(-6)}`,
                        status: "PAID",
                        type: "DEPOSIT_INVOICE",
                    },
                });
            }
        }

        await tx.opportunity.update({
            where: { id: opportunity.id },
            data: {
                clientAccountId: clientContext.clientAccountId,
                contactId: clientContext.contactId,
                nextGate: "gate_0_cadrage_projet",
                phase: "CLIENT",
                readyToConvert: true,
                status: "ACCEPTE",
            },
        });

        await tx.auditLog.create({
            data: {
                action: "opportunity.converted_to_project",
                actorUserId: session.user.id,
                entityId: opportunity.id,
                entityType: "Opportunity",
                metadata: {
                    clientAccountId: clientContext.clientAccountId,
                    contactId: clientContext.contactId,
                    projectId: project.id,
                    projectOsGenerated: false,
                    userId: clientContext.userId,
                },
            },
        });

        return {
            projectId: project.id,
            status: "converted" as const,
        };
    });
}

const updateOpportunityDetailSchema = z.object({
    commercialBlocker: z.string().trim().max(1000).optional(),
    commercialDriveUrl: z.string().trim().max(500).optional(),
    commercialScopeUrl: z.string().trim().max(500).optional(),
    conversionChannel: z.string().trim().max(160).optional(),
    conversionExceptionReason: z.string().trim().max(2000).optional(),
    decisionExpected: z.string().trim().optional(),
    depositAmountCents: z.coerce.number().int().min(0).optional(),
    depositReceivedAt: z.string().trim().optional(),
    depositRequestedAt: z.string().trim().optional(),
    estimatedBudgetRange: z.string().trim().max(120).optional(),
    estimatedValueCents: z.coerce.number().int().min(0).optional(),
    fit: z.enum(OpportunityFit),
    id: z.string().min(1),
    mainObjection: z.string().trim().max(1000).optional(),
    nextAction: z.string().trim().max(240).optional(),
    nextFollowUpAt: z.string().trim().optional(),
    nextGate: z.string().trim().max(160).optional(),
    notes: z.string().trim().max(4000).optional(),
    offerId: z.string().trim().optional(),
    organizationName: z.string().trim().max(160).optional(),
    phone: z.string().trim().max(80).optional(),
    priority: z.enum(OpportunityPriority),
    probability: z.coerce.number().int().min(0).max(100).optional(),
    projectTypeId: z.string().trim().optional(),
    proposalSentAt: z.string().trim().optional(),
    proposalUrl: z.string().trim().max(500).optional(),
    qualificationScore: z.coerce.number().int().min(0).max(100).optional(),
    quoteAcceptedAt: z.string().trim().optional(),
    quoteSentAt: z.string().trim().optional(),
    quoteUrl: z.string().trim().max(500).optional(),
    rawNeed: z.string().trim().max(4000).optional(),
    status: z.enum(OpportunityStatus),
    title: z.string().trim().min(1).max(160),
    urgency: z.string().trim().max(120).optional(),
});

export async function updateOpportunityDetailAction(formData: FormData) {
    await requireAdminSession();

    const parsed = updateOpportunityDetailSchema.parse({
        commercialBlocker: formData.get("commercialBlocker"),
        commercialDriveUrl: formData.get("commercialDriveUrl"),
        commercialScopeUrl: formData.get("commercialScopeUrl"),
        conversionChannel: formData.get("conversionChannel"),
        conversionExceptionReason: formData.get("conversionExceptionReason"),
        decisionExpected: formData.get("decisionExpected"),
        depositAmountCents: parseMoneyCents(formData.get("depositAmount")),
        depositReceivedAt: formData.get("depositReceivedAt"),
        depositRequestedAt: formData.get("depositRequestedAt"),
        estimatedBudgetRange: formData.get("estimatedBudgetRange"),
        estimatedValueCents: parseMoneyCents(formData.get("estimatedValue")),
        fit: formData.get("fit"),
        id: formData.get("id"),
        mainObjection: formData.get("mainObjection"),
        nextAction: formData.get("nextAction"),
        nextFollowUpAt: formData.get("nextFollowUpAt"),
        nextGate: formData.get("nextGate"),
        notes: formData.get("notes"),
        offerId: formData.get("offerId"),
        organizationName: formData.get("organizationName"),
        phone: formData.get("phone"),
        priority: formData.get("priority"),
        probability: emptyToUndefined(formData.get("probability")),
        projectTypeId: formData.get("projectTypeId"),
        proposalSentAt: formData.get("proposalSentAt"),
        proposalUrl: formData.get("proposalUrl"),
        qualificationScore: emptyToUndefined(formData.get("qualificationScore")),
        quoteAcceptedAt: formData.get("quoteAcceptedAt"),
        quoteSentAt: formData.get("quoteSentAt"),
        quoteUrl: formData.get("quoteUrl"),
        rawNeed: formData.get("rawNeed"),
        status: formData.get("status"),
        title: formData.get("title"),
        urgency: formData.get("urgency"),
    });

    const readinessInput = {
        commercialBlocker: nullableString(parsed.commercialBlocker),
        commercialScopeUrl: nullableString(parsed.commercialScopeUrl),
        conversionExceptionReason: nullableString(
            parsed.conversionExceptionReason,
        ),
        depositReceivedAt: parseDateInput(parsed.depositReceivedAt),
        nextAction: nullableString(parsed.nextAction),
        objective: null,
        offerId: nullableString(parsed.offerId),
        projectTypeId: nullableString(parsed.projectTypeId),
        quoteAcceptedAt: parseDateInput(parsed.quoteAcceptedAt),
        quoteSentAt: parseDateInput(parsed.quoteSentAt),
        quoteUrl: nullableString(parsed.quoteUrl),
        rawNeed: nullableString(parsed.rawNeed),
    };
    const nextFollowUpAt = parseDateInput(parsed.nextFollowUpAt);
    const qualificationScore =
        parsed.qualificationScore ??
        calculateOpportunityQualificationScore({
            commercialBlocker: readinessInput.commercialBlocker,
            estimatedBudgetRange: nullableString(parsed.estimatedBudgetRange),
            fit: parsed.fit,
            nextAction: readinessInput.nextAction,
            nextFollowUpAt,
            offerId: readinessInput.offerId,
            projectTypeId: readinessInput.projectTypeId,
            rawNeed: readinessInput.rawNeed,
        });
    const { readyToConvert } = getOpportunityConversionGates(readinessInput);

    if (requiresNextAction(parsed.status) && !readinessInput.nextAction) {
        redirect(`/admin/demandes/${parsed.id}?qualification=missing-next-action`);
    }

    const prisma = getPrismaClient();

    await prisma.opportunity.update({
        where: { id: parsed.id },
        data: {
            commercialBlocker: nullableString(parsed.commercialBlocker),
            commercialDriveUrl: nullableString(parsed.commercialDriveUrl),
            commercialScopeUrl: nullableString(parsed.commercialScopeUrl),
            conversionChannel: nullableString(parsed.conversionChannel),
            conversionExceptionReason: readinessInput.conversionExceptionReason,
            decisionExpected: parseDateInput(parsed.decisionExpected),
            depositAmountCents: parsed.depositAmountCents ?? null,
            depositReceivedAt: readinessInput.depositReceivedAt,
            depositRequestedAt: parseDateInput(parsed.depositRequestedAt),
            estimatedBudgetRange: nullableString(parsed.estimatedBudgetRange),
            estimatedValueCents: parsed.estimatedValueCents ?? null,
            fit: parsed.fit,
            mainObjection: nullableString(parsed.mainObjection),
            nextAction: readinessInput.nextAction,
            nextFollowUpAt,
            nextGate: nullableString(parsed.nextGate),
            notes: nullableString(parsed.notes),
            offerId: readinessInput.offerId,
            organizationName: nullableString(parsed.organizationName),
            phone: nullableString(parsed.phone),
            phase: getPhaseForStatus(parsed.status),
            priority: parsed.priority,
            probability: parsed.probability ?? null,
            projectTypeId: readinessInput.projectTypeId,
            proposalSentAt: parseDateInput(parsed.proposalSentAt),
            proposalUrl: nullableString(parsed.proposalUrl),
            qualificationScore,
            quoteAcceptedAt: readinessInput.quoteAcceptedAt,
            quoteSentAt: readinessInput.quoteSentAt,
            quoteUrl: readinessInput.quoteUrl,
            rawNeed: readinessInput.rawNeed,
            readyToConvert,
            status: parsed.status,
            title: parsed.title,
            urgency: nullableString(parsed.urgency),
        },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/demandes");
    revalidatePath(`/admin/demandes/${parsed.id}`);
    redirect(`/admin/demandes/${parsed.id}`);
}

async function ensureConversionClientContext(
    tx: Prisma.TransactionClient,
    opportunity: {
        clientAccountId: string | null;
        contactId: string | null;
        organizationName: string | null;
        prospectEmail: string;
        prospectName: string;
        title: string;
    },
) {
    const email = opportunity.prospectEmail.toLowerCase();
    const user = await upsertClientUser(tx, email);
    const clientAccountId = await ensureActiveClientAccount(tx, opportunity);
    const contactId = await ensureActiveClientContact(tx, {
        clientAccountId,
        contactId: opportunity.contactId,
        email,
        organizationName: opportunity.organizationName,
        prospectName: opportunity.prospectName,
        userId: user.id,
    });

    if (!isAdminRole(user.role)) {
        await tx.accountMembership.upsert({
            where: {
                clientAccountId_userId: {
                    clientAccountId,
                    userId: user.id,
                },
            },
            create: {
                clientAccountId,
                isPrimary: true,
                role: "OWNER",
                userId: user.id,
            },
            update: {
                isPrimary: true,
                role: "OWNER",
            },
        });
    }

    return {
        clientAccountId,
        contactId,
        userId: user.id,
    };
}

async function upsertClientUser(tx: Prisma.TransactionClient, email: string) {
    const existingUser = await tx.user.findUnique({
        where: { email },
        select: {
            id: true,
            role: true,
        },
    });

    if (!existingUser) {
        return tx.user.create({
            data: {
                email,
                role: "CLIENT_OWNER",
            },
            select: {
                id: true,
                role: true,
            },
        });
    }

    if (shouldPromoteToClientOwner(existingUser.role)) {
        return tx.user.update({
            where: { id: existingUser.id },
            data: { role: "CLIENT_OWNER" },
            select: {
                id: true,
                role: true,
            },
        });
    }

    return existingUser;
}

async function ensureActiveClientAccount(
    tx: Prisma.TransactionClient,
    opportunity: {
        clientAccountId: string | null;
        organizationName: string | null;
        prospectName: string;
        title: string;
    },
) {
    if (opportunity.clientAccountId) {
        const account = await tx.clientAccount.update({
            where: { id: opportunity.clientAccountId },
            data: {
                status: "ACTIVE_CLIENT",
            },
            select: { id: true },
        });

        return account.id;
    }

    const account = await tx.clientAccount.create({
        data: {
            name: buildClientAccountName(opportunity),
            source: "CRM_CONVERSION",
            status: "ACTIVE_CLIENT",
            type: opportunity.organizationName ? "BRAND" : "PERSON",
        },
        select: { id: true },
    });

    return account.id;
}

async function ensureActiveClientContact(
    tx: Prisma.TransactionClient,
    input: {
        clientAccountId: string;
        contactId: string | null;
        email: string;
        organizationName: string | null;
        prospectName: string;
        userId: string;
    },
) {
    const nameParts = splitProspectName(input.prospectName);

    if (input.contactId) {
        const contact = await tx.contact.update({
            where: { id: input.contactId },
            data: {
                clientAccountId: input.clientAccountId,
                firstName: nameParts.firstName,
                lastName: nameParts.lastName,
                organizationName: input.organizationName,
                status: "ACTIVE",
                userId: input.userId,
            },
            select: { id: true },
        });

        return contact.id;
    }

    const contact = await tx.contact.upsert({
        where: {
            clientAccountId_email: {
                clientAccountId: input.clientAccountId,
                email: input.email,
            },
        },
        create: {
            clientAccountId: input.clientAccountId,
            email: input.email,
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            organizationName: input.organizationName,
            source: "CRM_CONVERSION",
            status: "ACTIVE",
            userId: input.userId,
        },
        update: {
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            organizationName: input.organizationName,
            status: "ACTIVE",
            userId: input.userId,
        },
        select: { id: true },
    });

    return contact.id;
}

function shouldPromoteToClientOwner(role: UserRole) {
    return !isAdminRole(role) && role !== "CLIENT_OWNER" && role !== "CLIENT_MEMBER";
}

function splitProspectName(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts.shift() ?? fullName.trim();

    return {
        firstName,
        lastName: nullableString(parts.join(" ")),
    };
}

function buildClientAccountName(opportunity: {
    organizationName: string | null;
    prospectName: string;
    title: string;
}) {
    return (
        nullableString(opportunity.organizationName) ??
        nullableString(opportunity.title) ??
        opportunity.prospectName
    );
}

function nullableString(value: string | null | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}

function parseDateInput(value: string | undefined) {
    if (!value) return null;

    const date = new Date(`${value}T12:00:00`);

    return Number.isNaN(date.getTime()) ? null : date;
}

function emptyToUndefined(value: FormDataEntryValue | null) {
    const normalized = String(value ?? "").trim();

    return normalized ? normalized : undefined;
}

function parseMoneyCents(value: FormDataEntryValue | null) {
    const normalized = String(value ?? "").trim().replace(",", ".");
    if (!normalized) return undefined;

    const amount = Number(normalized);
    if (!Number.isFinite(amount)) return undefined;

    return Math.round(amount * 100);
}

function buildProjectName(opportunity: {
    prospectName: string;
    title: string;
}) {
    return opportunity.title.trim() || `Projet ${opportunity.prospectName}`;
}

function buildProjectGateZeroAction() {
    return "Gate 0 : vérifier le périmètre, confirmer les accès, préparer le dossier projet et planifier le lancement.";
}

function buildProjectNotes(opportunity: {
    conversionExceptionReason: string | null;
    prospectEmail: string;
    rawNeed: string | null;
}) {
    const notes = [
        "Fiche projet centrale créée depuis le CRM.",
        `Contact source : ${opportunity.prospectEmail}`,
        opportunity.rawNeed ? `Besoin initial : ${opportunity.rawNeed}` : null,
        opportunity.conversionExceptionReason
            ? `Exception de conversion : ${opportunity.conversionExceptionReason}`
            : null,
        `Gate 0 préparée : ${buildProjectGateZeroAction()}`,
        "Project OS non généré. La structure de production devra être générée explicitement au sprint dédié.",
    ].filter(Boolean);

    return notes.join("\n\n");
}
