import { notFound } from "next/navigation";

import { getPrismaClient } from "@/server/db/client";

export async function getAdminProjectQuestionnaires(projectId: string) {
    const prisma = getPrismaClient();
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            name: true,
            opportunity: {
                select: {
                    id: true,
                    prospectName: true,
                    title: true,
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    const questionnaires = await prisma.questionnaire.findMany({
        where: { projectId },
        orderBy: [{ updatedAt: "desc" }],
        select: {
            id: true,
            description: true,
            dueAt: true,
            isClientVisible: true,
            status: true,
            title: true,
            questions: {
                orderBy: [{ sortOrder: "asc" }],
                select: {
                    id: true,
                    helpText: true,
                    label: true,
                    required: true,
                    type: true,
                    answers: {
                        orderBy: [{ createdAt: "desc" }],
                        select: {
                            id: true,
                            author: {
                                select: {
                                    email: true,
                                    name: true,
                                },
                            },
                            createdAt: true,
                            status: true,
                            value: true,
                        },
                    },
                },
            },
        },
    });

    return { project, questionnaires };
}

export async function getClientProjectQuestionnaires({
    projectId,
    userId,
}: {
    projectId: string;
    userId: string;
}) {
    const prisma = getPrismaClient();
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            name: true,
            nextAction: true,
        },
    });

    if (!project) {
        notFound();
    }

    const questionnaires = await prisma.questionnaire.findMany({
        where: {
            isClientVisible: true,
            projectId,
            status: {
                in: ["SENT", "IN_PROGRESS", "COMPLETED"],
            },
        },
        orderBy: [{ updatedAt: "desc" }],
        select: {
            id: true,
            description: true,
            dueAt: true,
            status: true,
            title: true,
            questions: {
                orderBy: [{ sortOrder: "asc" }],
                select: {
                    id: true,
                    helpText: true,
                    label: true,
                    required: true,
                    type: true,
                    answers: {
                        where: {
                            authorUserId: userId,
                        },
                        orderBy: [{ createdAt: "desc" }],
                        take: 1,
                        select: {
                            id: true,
                            createdAt: true,
                            value: true,
                        },
                    },
                },
            },
        },
    });

    return { project, questionnaires };
}
