import { getPrismaClient } from "@/server/db/client";

export async function getAdminFinance() {
    const prisma = getPrismaClient();

    const [documents, opportunities, projects, offers] = await Promise.all([
        prisma.financialDocument.findMany({
            orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
            select: {
                id: true,
                amountCents: true,
                clientName: true,
                depositPercent: true,
                documentUrl: true,
                dueAt: true,
                issuedAt: true,
                notes: true,
                paidAt: true,
                reference: true,
                status: true,
                type: true,
                opportunity: {
                    select: {
                        title: true,
                    },
                },
                project: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
        prisma.opportunity.findMany({
            orderBy: [{ updatedAt: "desc" }],
            select: {
                depositAmountCents: true,
                depositReceivedAt: true,
                depositRequestedAt: true,
                id: true,
                prospectName: true,
                quoteAcceptedAt: true,
                quoteSentAt: true,
                title: true,
            },
            take: 80,
        }),
        prisma.project.findMany({
            orderBy: [{ createdAt: "desc" }],
            select: {
                id: true,
                name: true,
            },
            take: 80,
        }),
        prisma.offer.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: {
                id: true,
                name: true,
            },
        }),
    ]);

    return {
        documents,
        offers,
        opportunities,
        projects,
        summary: buildFinanceSummary(documents, opportunities),
    };
}

function buildFinanceSummary(
    documents: Array<{
        amountCents: number | null;
        status: string;
        type: string;
    }>,
    opportunities: Array<{
        depositReceivedAt: Date | null;
        quoteAcceptedAt: Date | null;
    }>,
) {
    const openAmountCents = documents
        .filter((document) => document.status !== "PAID")
        .reduce((total, document) => total + (document.amountCents ?? 0), 0);
    const quoteCount = documents.filter((document) => document.type === "QUOTE").length;
    const acceptedQuoteCount = documents.filter(
        (document) => document.type === "QUOTE" && document.status === "ACCEPTED",
    ).length;
    const pendingDepositCount = opportunities.filter(
        (opportunity) =>
            Boolean(opportunity.quoteAcceptedAt) &&
            !opportunity.depositReceivedAt,
    ).length;
    const paidDepositAmountCents = documents
        .filter(
            (document) =>
                document.type === "DEPOSIT_INVOICE" && document.status === "PAID",
        )
        .reduce((total, document) => total + (document.amountCents ?? 0), 0);
    const lateCount = documents.filter((document) => document.status === "LATE").length;

    return {
        acceptedQuoteCount,
        lateCount,
        openAmountCents,
        paidDepositAmountCents,
        pendingDepositCount,
        quoteCount,
    };
}
