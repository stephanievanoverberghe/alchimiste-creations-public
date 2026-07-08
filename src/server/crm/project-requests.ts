import type { Prisma, UserRole } from "@prisma/client";

import type { ProjectRequestEmailResult } from "@/lib/project-requests/email";
import type { ProjectRequestData } from "@/lib/project-requests/schema";
import { isAdminRole } from "@/server/auth/roles";
import { getPrismaClient } from "@/server/db/client";

type CreateProjectRequestOpportunityInput = {
    payload: unknown;
    request: ProjectRequestData;
    requestId: string;
};

type MarkProjectRequestEmailInput = {
    emailResult: ProjectRequestEmailResult;
    requestId: string;
};

export async function createProjectRequestOpportunity({
    payload,
    request,
    requestId,
}: CreateProjectRequestOpportunityInput) {
    const prisma = getPrismaClient();

    return prisma.$transaction(async (tx) => {
        const projectType = await tx.projectType.findUnique({
            where: { slug: request.projectType },
            select: { id: true },
        });
        const clientContext = await upsertProjectRequestClientContext(tx, request);

        const projectRequest = await tx.projectRequest.create({
            data: {
                clientAccountId: clientContext.clientAccountId,
                contactId: clientContext.contactId,
                requestId,
                projectTypeRaw: request.projectType,
                projectTypeLabel: nullableString(request.labels.projectType),
                fullName: request.fullName,
                email: request.email,
                projectName: nullableString(request.projectName),
                website: nullableString(request.website),
                description: request.description,
                objective: request.objective,
                maturity: request.maturity,
                budget: nullableString(request.budget),
                deadline: nullableString(request.deadline),
                constraints: nullableString(request.constraints),
                attachmentUrl: nullableString(request.attachmentUrl),
                attachmentName: nullableString(request.attachmentName),
                consent: request.consent,
                payloadSnapshot: buildPayloadSnapshot(payload, request),
            },
            select: { id: true },
        });

        const opportunity = await tx.opportunity.create({
            data: {
                title: buildOpportunityTitle(request),
                prospectName: request.fullName,
                prospectEmail: request.email,
                source: "PROJECT_FORM",
                rawNeed: request.description,
                objective: request.objective,
                maturity: request.maturity,
                estimatedBudgetRange: nullableString(request.budget),
                nextGate: "gate_demande_exploitable",
                nextAction: "Qualifier la demande projet",
                nextFollowUpAt: addHours(new Date(), 24),
                clientAccountId: clientContext.clientAccountId,
                contactId: clientContext.contactId,
                projectRequestId: projectRequest.id,
                projectTypeId: projectType?.id,
            },
            select: { id: true },
        });

        await tx.auditLog.create({
            data: {
                action: "project_request.received",
                entityId: projectRequest.id,
                entityType: "ProjectRequest",
                metadata: {
                    clientAccountId: clientContext.clientAccountId,
                    contactId: clientContext.contactId,
                    opportunityId: opportunity.id,
                    requestId,
                    source: "PROJECT_FORM",
                },
            },
        });

        return {
            clientAccountId: clientContext.clientAccountId,
            contactId: clientContext.contactId,
            opportunityId: opportunity.id,
            projectRequestId: projectRequest.id,
        };
    });
}

async function upsertProjectRequestClientContext(
    tx: Prisma.TransactionClient,
    request: ProjectRequestData,
) {
    const existingContact = await tx.contact.findFirst({
        where: { email: request.email },
        orderBy: { updatedAt: "desc" },
        select: {
            clientAccountId: true,
            id: true,
            userId: true,
        },
    });
    const user = await tx.user.findUnique({
        where: { email: request.email },
        select: {
            id: true,
            role: true,
        },
    });
    const nameParts = splitFullName(request.fullName);

    if (existingContact) {
        const contactUpdateData: Prisma.ContactUncheckedUpdateInput = {
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            source: "PROJECT_FORM",
            status: "ACTIVE",
            userId: existingContact.userId ?? user?.id ?? null,
        };

        if (nullableString(request.projectName)) {
            contactUpdateData.organizationName = nullableString(request.projectName);
        }

        if (nullableString(request.website)) {
            contactUpdateData.website = nullableString(request.website);
        }

        await tx.contact.update({
            where: { id: existingContact.id },
            data: contactUpdateData,
        });
        await upsertAccountMembershipForUser({
            clientAccountId: existingContact.clientAccountId,
            tx,
            user,
        });

        return {
            clientAccountId: existingContact.clientAccountId,
            contactId: existingContact.id,
        };
    }

    const clientAccount = await tx.clientAccount.create({
        data: {
            brandName: nullableString(request.projectName),
            name: buildClientAccountName(request),
            source: "PROJECT_FORM",
            status: "LEAD",
            type: inferClientAccountType(request),
        },
        select: { id: true },
    });
    const contact = await tx.contact.create({
        data: {
            clientAccountId: clientAccount.id,
            email: request.email,
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            organizationName: nullableString(request.projectName),
            source: "PROJECT_FORM",
            status: "NEW",
            userId: user?.id ?? null,
            website: nullableString(request.website),
        },
        select: { id: true },
    });

    await upsertAccountMembershipForUser({
        clientAccountId: clientAccount.id,
        tx,
        user,
    });

    return {
        clientAccountId: clientAccount.id,
        contactId: contact.id,
    };
}

async function upsertAccountMembershipForUser({
    clientAccountId,
    tx,
    user,
}: {
    clientAccountId: string;
    tx: Prisma.TransactionClient;
    user: { id: string; role: UserRole } | null;
}) {
    if (!user || isAdminRole(user.role)) return;

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
        },
    });
}

export async function markProjectRequestEmailResult({
    emailResult,
    requestId,
}: MarkProjectRequestEmailInput) {
    const prisma = getPrismaClient();

    await prisma.projectRequest.update({
        where: { requestId },
        data: emailResult.ok
            ? {
                  emailProviderId: emailResult.providerId ?? null,
                  emailStatus: "SENT",
              }
            : {
                  emailStatus:
                      emailResult.reason === "not-configured"
                          ? "SKIPPED"
                          : "FAILED",
              },
    });
}

function buildPayloadSnapshot(
    payload: unknown,
    request: ProjectRequestData,
): Prisma.InputJsonValue {
    return {
        raw: toJsonValue(payload),
        normalized: request,
    };
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
}

function buildOpportunityTitle(request: ProjectRequestData) {
    return (
        nullableString(request.projectName) ??
        nullableString(request.labels.projectType) ??
        `Demande de ${request.fullName}`
    );
}

function buildClientAccountName(request: ProjectRequestData) {
    return nullableString(request.projectName) ?? request.fullName;
}

function inferClientAccountType(request: ProjectRequestData) {
    if (nullableString(request.projectName) || nullableString(request.website)) {
        return "BRAND";
    }

    return "PERSON";
}

function splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts.shift() ?? fullName.trim();
    const lastName = nullableString(parts.join(" "));

    return {
        firstName,
        lastName,
    };
}

function nullableString(value: string) {
    const trimmed = value.trim();

    return trimmed ? trimmed : null;
}

function addHours(date: Date, hours: number) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
