import { getPrismaClient } from "@/server/db/client";

type RealDocumentRow = {
    clientName: string;
    createdAt: Date;
    deliverableName: string | null;
    documentUrl: string;
    id: string;
    isClientVisible: boolean;
    notes: string | null;
    opportunityTitle: string | null;
    projectId: string;
    projectName: string;
    reference: string;
    status: string;
    title: string;
    type: string;
};

export async function getAdminDocuments() {
    const prisma = getPrismaClient();

    const [documents, projects, deliverables] = await Promise.all([
        getRealDocuments(prisma),
        prisma.project.findMany({
            orderBy: [{ createdAt: "desc" }],
            select: {
                id: true,
                name: true,
                opportunity: {
                    select: {
                        prospectName: true,
                    },
                },
            },
        }),
        prisma.deliverable.findMany({
            orderBy: [{ projectId: "asc" }, { sortOrder: "asc" }],
            select: {
                id: true,
                name: true,
                projectId: true,
                project: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
    ]);

    return {
        deliverables,
        documents: documents.map((document) => ({
            id: document.id,
            clientName: document.clientName,
            createdAt: document.createdAt,
            documentUrl: document.documentUrl,
            isClientVisible: document.isClientVisible,
            notes: document.notes,
            reference: document.reference,
            status: document.status,
            title: document.title,
            type: document.type,
            deliverable: document.deliverableName
                ? {
                    name: document.deliverableName,
                }
                : null,
            opportunity: document.opportunityTitle
                ? {
                    title: document.opportunityTitle,
                }
                : null,
            project: {
                id: document.projectId,
                name: document.projectName,
            },
        })),
        projects,
    };
}

function getRealDocuments(prisma: ReturnType<typeof getPrismaClient>) {
    return prisma.$queryRaw<RealDocumentRow[]>`
        SELECT
            rd."id",
            rd."clientName",
            rd."createdAt",
            rd."documentUrl",
            rd."isClientVisible",
            rd."notes",
            rd."reference",
            rd."status"::text AS "status",
            rd."title",
            rd."type"::text AS "type",
            d."name" AS "deliverableName",
            o."title" AS "opportunityTitle",
            p."id" AS "projectId",
            p."name" AS "projectName"
        FROM "RealDocument" rd
        INNER JOIN "Project" p ON p."id" = rd."projectId"
        LEFT JOIN "Deliverable" d ON d."id" = rd."deliverableId"
        LEFT JOIN "Opportunity" o ON o."id" = rd."opportunityId"
        ORDER BY rd."createdAt" DESC
    `;
}
