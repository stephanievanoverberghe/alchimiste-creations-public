import { getPrismaClient } from "@/server/db/client";

export async function getAdminProjects() {
    const prisma = getPrismaClient();

    const projects = await prisma.project.findMany({
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        select: {
            id: true,
            name: true,
            status: true,
            stage: true,
            nextAction: true,
            hasActiveBlocker: true,
            targetDate: true,
            createdAt: true,
            updatedAt: true,
            offer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            projectType: {
                select: {
                    id: true,
                    name: true,
                },
            },
            opportunity: {
                select: {
                    id: true,
                    prospectEmail: true,
                    prospectName: true,
                    title: true,
                },
            },
            _count: {
                select: {
                    deliverables: true,
                    lots: true,
                    phases: true,
                    tasks: true,
                    validations: true,
                },
            },
        },
    });

    return {
        projects,
        totals: {
            active: projects.filter((project) =>
                ["PREPARATION", "EN_COURS", "EN_VALIDATION"].includes(project.status),
            ).length,
            blocked: projects.filter((project) => project.hasActiveBlocker).length,
            delivered: projects.filter((project) =>
                ["LIVRE", "CLOTURE"].includes(project.status),
            ).length,
            projects: projects.length,
        },
    };
}
