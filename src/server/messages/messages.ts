import { notFound } from "next/navigation";

import { getPrismaClient } from "@/server/db/client";

export async function getAdminProjectMessages(projectId: string) {
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

    const conversations = await prisma.conversation.findMany({
        where: {
            projectId,
            scope: "PROJECT",
        },
        orderBy: [{ visibility: "asc" }, { updatedAt: "desc" }],
        select: {
            id: true,
            title: true,
            visibility: true,
            updatedAt: true,
            messages: {
                orderBy: [{ createdAt: "asc" }],
                select: {
                    id: true,
                    authorName: true,
                    authorRole: true,
                    body: true,
                    createdAt: true,
                    internalNote: true,
                    isClientVisible: true,
                },
            },
        },
    });

    return { conversations, project };
}

export async function getClientProjectMessages(projectId: string) {
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

    const conversations = await prisma.conversation.findMany({
        where: {
            projectId,
            scope: "PROJECT",
            visibility: "CLIENT_VISIBLE",
        },
        orderBy: [{ updatedAt: "desc" }],
        select: {
            id: true,
            title: true,
            updatedAt: true,
            messages: {
                where: {
                    internalNote: false,
                    isClientVisible: true,
                },
                orderBy: [{ createdAt: "asc" }],
                select: {
                    id: true,
                    authorName: true,
                    authorRole: true,
                    body: true,
                    createdAt: true,
                },
            },
        },
    });

    return { conversations, project };
}
