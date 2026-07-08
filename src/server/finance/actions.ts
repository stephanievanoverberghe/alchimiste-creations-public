"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { getPrismaClient } from "@/server/db/client";

const financialDocumentStatuses = [
    "DRAFT",
    "SENT",
    "ACCEPTED",
    "REFUSED",
    "TO_INVOICE",
    "ISSUED",
    "PAID",
    "LATE",
    "CANCELLED",
] as const;

const financialDocumentTypes = [
    "QUOTE",
    "DEPOSIT_INVOICE",
    "BALANCE_INVOICE",
    "MAINTENANCE_INVOICE",
    "CREDIT_NOTE",
] as const;

const createFinancialDocumentSchema = z
    .object({
        amountCents: z.number().int().min(0).optional(),
        clientName: z.string().trim().min(1).max(160),
        depositPercent: z.number().int().min(0).max(100).optional(),
        documentUrl: z.string().trim().min(1).max(1000),
        dueAt: z.string().trim().optional(),
        issuedAt: z.string().trim().optional(),
        notes: z.string().trim().max(2000).optional(),
        offerId: z.string().trim().optional(),
        opportunityId: z.string().trim().optional(),
        projectId: z.string().trim().optional(),
        reference: z.string().trim().min(1).max(120),
        status: z.enum(financialDocumentStatuses),
        type: z.enum(financialDocumentTypes),
    })
    .refine(
        (value) => Boolean(value.opportunityId?.trim() || value.projectId?.trim()),
        {
            message: "Un document financier doit être relié à une opportunité ou un projet.",
            path: ["projectId"],
        },
    );

export async function createFinancialDocumentAction(formData: FormData) {
    await requireAdminSession();

    const parsed = createFinancialDocumentSchema.parse({
        amountCents: parseMoneyCents(formData.get("amount")),
        clientName: formData.get("clientName"),
        depositPercent: parseInteger(formData.get("depositPercent")),
        documentUrl: formData.get("documentUrl"),
        dueAt: formData.get("dueAt"),
        issuedAt: formData.get("issuedAt"),
        notes: formData.get("notes"),
        offerId: formData.get("offerId"),
        opportunityId: formData.get("opportunityId"),
        projectId: formData.get("projectId"),
        reference: formData.get("reference"),
        status: formData.get("status"),
        type: formData.get("type"),
    });

    const prisma = getPrismaClient();
    const opportunityId = nullableString(parsed.opportunityId);
    const projectId = nullableString(parsed.projectId);
    const issuedAt = parseDateInput(parsed.issuedAt);
    const dueAt = parseDateInput(parsed.dueAt);

    await prisma.$transaction(async (tx) => {
        await tx.financialDocument.create({
            data: {
                amountCents: parsed.amountCents ?? null,
                clientName: parsed.clientName,
                depositPercent: parsed.depositPercent ?? null,
                documentUrl: parsed.documentUrl,
                dueAt,
                issuedAt,
                notes: nullableString(parsed.notes),
                offerId: nullableString(parsed.offerId),
                opportunityId,
                projectId,
                reference: parsed.reference,
                status: parsed.status,
                type: parsed.type,
            },
        });

        if (opportunityId) {
            const opportunityFinanceData = buildOpportunityFinanceData({
                amountCents: parsed.amountCents,
                documentUrl: parsed.documentUrl,
                issuedAt,
                paidAt: parsed.status === "PAID" ? new Date() : null,
                status: parsed.status,
                type: parsed.type,
            });

            if (Object.keys(opportunityFinanceData).length > 0) {
                await tx.opportunity.update({
                    where: { id: opportunityId },
                    data: opportunityFinanceData,
                });
            }
        }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/finance");
    if (opportunityId) revalidatePath(`/admin/demandes/${opportunityId}`);
    redirect("/admin/finance?created=1");
}

function buildOpportunityFinanceData({
    amountCents,
    documentUrl,
    issuedAt,
    paidAt,
    status,
    type,
}: {
    amountCents: number | undefined;
    documentUrl: string;
    issuedAt: Date | null;
    paidAt: Date | null;
    status: (typeof financialDocumentStatuses)[number];
    type: (typeof financialDocumentTypes)[number];
}): Prisma.OpportunityUpdateInput {
    const data: Prisma.OpportunityUpdateInput = {};
    const referenceDate = issuedAt ?? new Date();

    if (type === "QUOTE") {
        data.estimatedValueCents = amountCents ?? null;
        data.quoteUrl = documentUrl;

        if (status === "SENT" || status === "ACCEPTED") {
            data.quoteSentAt = referenceDate;
        }

        if (status === "ACCEPTED") {
            data.quoteAcceptedAt = referenceDate;
        }

        return data;
    }

    if (type === "DEPOSIT_INVOICE") {
        data.depositAmountCents = amountCents ?? null;

        if (
            status === "SENT" ||
            status === "ISSUED" ||
            status === "LATE" ||
            status === "PAID"
        ) {
            data.depositRequestedAt = referenceDate;
        }

        if (status === "PAID") {
            data.depositReceivedAt = paidAt ?? referenceDate;
        }
    }

    return data;
}

function nullableString(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}

function parseDateInput(value: string | undefined) {
    if (!value) return null;

    const date = new Date(`${value}T12:00:00`);

    return Number.isNaN(date.getTime()) ? null : date;
}

function parseInteger(value: FormDataEntryValue | null) {
    const normalized = String(value ?? "").trim();
    if (!normalized) return undefined;

    const parsed = Number.parseInt(normalized, 10);

    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMoneyCents(value: FormDataEntryValue | null) {
    const normalized = String(value ?? "").trim().replace(",", ".");
    if (!normalized) return undefined;

    const amount = Number(normalized);
    if (!Number.isFinite(amount)) return undefined;

    return Math.round(amount * 100);
}
