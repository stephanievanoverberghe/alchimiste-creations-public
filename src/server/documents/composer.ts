import { notFound } from "next/navigation";

import { formatDate, formatMoneyFromCents } from "@/lib/formatters";
import { getPrismaClient } from "@/server/db/client";

export type DocumentModelSection = {
    helpText?: string;
    key: string;
    prefill?: string;
    title: string;
};

export type ComposedContent = {
    sections: Record<string, string>;
};

export async function getProjectDocumentsOverview(projectId: string) {
    const prisma = getPrismaClient();

    const [project, documentModels, documents] = await Promise.all([
        prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                name: true,
                opportunity: {
                    select: { prospectName: true },
                },
            },
        }),
        prisma.documentModel.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }],
            select: {
                id: true,
                key: true,
                name: true,
                description: true,
                category: true,
            },
        }),
        prisma.realDocument.findMany({
            where: { projectId },
            orderBy: [{ updatedAt: "desc" }],
            select: {
                id: true,
                reference: true,
                title: true,
                status: true,
                type: true,
                isClientVisible: true,
                documentUrl: true,
                documentModelKey: true,
                currentVersion: true,
                updatedAt: true,
            },
        }),
    ]);

    if (!project) {
        notFound();
    }

    return {
        composedDocuments: documents.filter(
            (document) => document.documentModelKey,
        ),
        documentModels,
        linkedDocuments: documents.filter(
            (document) => !document.documentModelKey,
        ),
        project,
    };
}

export async function getComposedDocumentById(documentId: string) {
    return getComposedDocument(null, documentId);
}

export async function getComposedDocument(
    projectId: string | null,
    documentId: string,
) {
    const prisma = getPrismaClient();

    const document = await prisma.realDocument.findFirst({
        where: projectId
            ? { id: documentId, projectId }
            : { id: documentId },
        select: {
            id: true,
            reference: true,
            title: true,
            status: true,
            type: true,
            clientName: true,
            isClientVisible: true,
            contentJson: true,
            documentModelKey: true,
            currentVersion: true,
            createdAt: true,
            updatedAt: true,
            project: {
                select: {
                    id: true,
                    name: true,
                    opportunity: {
                        select: { prospectName: true, prospectEmail: true },
                    },
                },
            },
        },
    });

    if (!document || !document.documentModelKey) {
        notFound();
    }

    const model = await prisma.documentModel.findUnique({
        where: { key: document.documentModelKey },
        select: {
            key: true,
            name: true,
            description: true,
            sections: true,
        },
    });

    if (!model) {
        notFound();
    }

    return {
        ...document,
        content: parseComposedContent(document.contentJson),
        model: {
            ...model,
            sections: parseModelSections(model.sections),
        },
    };
}

export function parseModelSections(value: unknown): DocumentModelSection[] {
    if (!Array.isArray(value)) return [];

    return value.filter(
        (section): section is DocumentModelSection =>
            Boolean(section) &&
            typeof section === "object" &&
            typeof (section as DocumentModelSection).key === "string" &&
            typeof (section as DocumentModelSection).title === "string",
    );
}

export function parseComposedContent(value: unknown): ComposedContent {
    if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        typeof (value as ComposedContent).sections === "object"
    ) {
        return { sections: { ...(value as ComposedContent).sections } };
    }

    return { sections: {} };
}

// Prefill directives: turn live project data into first-draft section
// content. Every value stays editable by the admin afterwards.
export async function buildPrefillValues(projectId: string) {
    const prisma = getPrismaClient();

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            name: true,
            targetDate: true,
            offer: { select: { name: true } },
            projectType: {
                select: { name: true, recommendedArchitecture: true },
            },
            opportunity: {
                select: {
                    estimatedValueCents: true,
                    depositAmountCents: true,
                    objective: true,
                    prospectEmail: true,
                    prospectName: true,
                    rawNeed: true,
                    title: true,
                },
            },
            phases: {
                orderBy: [{ sortOrder: "asc" }],
                select: { name: true },
            },
            playbookInstance: {
                select: { scopeSnapshot: true },
            },
            validations: {
                where: { respondedAt: { not: null } },
                orderBy: [{ respondedAt: "asc" }],
                select: {
                    respondedAt: true,
                    responseComment: true,
                    status: true,
                    title: true,
                },
            },
        },
    });

    if (!project) return {};

    const opportunity = project.opportunity;
    const scope = readScopeSnapshot(project.playbookInstance?.scopeSnapshot);

    const values: Record<string, string> = {
        architectureSummary: project.projectType?.recommendedArchitecture
            ? `Architecture recommandée : ${project.projectType.recommendedArchitecture}.`
            : "",
        budgetSummary: [
            opportunity.estimatedValueCents
                ? `Montant du projet : ${formatMoneyFromCents(opportunity.estimatedValueCents)}.`
                : null,
            opportunity.depositAmountCents
                ? `Acompte : ${formatMoneyFromCents(opportunity.depositAmountCents)}.`
                : null,
            project.targetDate
                ? `Date cible : ${formatDate(project.targetDate, "long", "—")}.`
                : null,
        ]
            .filter(Boolean)
            .join("\n"),
        clientContext: `${opportunity.prospectName} (${opportunity.prospectEmail}) — ${formatDate(new Date(), "long", "—")}`,
        modulesList: scope.modules
            .map(
                (moduleItem) =>
                    `- ${moduleItem.name} : ${moduleItem.selected ? "retenu" : "non retenu"}`,
            )
            .join("\n"),
        needSummary: opportunity.rawNeed ?? "",
        objectiveSummary: opportunity.objective ?? "",
        phasesList: project.phases
            .map((phase, index) => `${index + 1}. ${phase.name}`)
            .join("\n"),
        projectSummary: [
            `Projet : ${project.name}.`,
            project.offer ? `Offre : ${project.offer.name}.` : null,
            project.projectType
                ? `Type : ${project.projectType.name}.`
                : null,
            opportunity.rawNeed ? `Besoin initial : ${opportunity.rawNeed}` : null,
        ]
            .filter(Boolean)
            .join("\n"),
        scopeSummary: [
            project.offer ? `Offre : ${project.offer.name}.` : null,
            project.projectType
                ? `Type de projet : ${project.projectType.name}.`
                : null,
            scope.modules.length
                ? `Options : ${
                      scope.modules
                          .filter((moduleItem) => moduleItem.selected)
                          .map((moduleItem) => moduleItem.name)
                          .join(", ") || "aucune option retenue"
                  }.`
                : null,
        ]
            .filter(Boolean)
            .join("\n"),
        validationsHistory: project.validations
            .map(
                (validation) =>
                    `- ${validation.title} : ${
                        validation.status === "APPROVED"
                            ? "validé"
                            : validation.status === "CHANGES_REQUESTED"
                              ? "retouche demandée"
                              : validation.status
                    } le ${formatDate(validation.respondedAt, "long", "—")}${
                        validation.responseComment
                            ? ` — « ${validation.responseComment} »`
                            : ""
                    }`,
            )
            .join("\n"),
    };

    return values;
}

function readScopeSnapshot(snapshot: unknown) {
    const modules: { name: string; selected: boolean }[] = [];

    if (snapshot && typeof snapshot === "object" && !Array.isArray(snapshot)) {
        const rawModules = (snapshot as Record<string, unknown>).modules;

        if (
            rawModules &&
            typeof rawModules === "object" &&
            !Array.isArray(rawModules)
        ) {
            const available = (rawModules as Record<string, unknown>).available;
            const selected = (rawModules as Record<string, unknown>).selected;
            const selectedKeys = new Set(
                Array.isArray(selected)
                    ? selected.filter(
                          (key): key is string => typeof key === "string",
                      )
                    : [],
            );

            if (Array.isArray(available)) {
                for (const item of available) {
                    if (
                        item &&
                        typeof item === "object" &&
                        typeof (item as { key?: unknown }).key === "string" &&
                        typeof (item as { name?: unknown }).name === "string"
                    ) {
                        modules.push({
                            name: (item as { name: string }).name,
                            selected: selectedKeys.has(
                                (item as { key: string }).key,
                            ),
                        });
                    }
                }
            }
        }
    }

    return { modules };
}
