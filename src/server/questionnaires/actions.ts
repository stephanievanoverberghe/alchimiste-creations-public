"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/admin";
import { requireClientPortalSession } from "@/server/auth/client";
import { canReadProject } from "@/server/client-portal/portal";
import { getPrismaClient } from "@/server/db/client";
import { createProjectNotifications } from "@/server/notifications/notifications";
import { createTimelineEvent } from "@/server/timeline/timeline";

const createQuestionnaireSchema = z.object({
    description: z.string().trim().max(2000).optional(),
    dueAt: z.string().trim().optional(),
    isClientVisible: z.boolean(),
    projectId: z.string().trim().min(1),
    question1: z.string().trim().min(1).max(300),
    question2: z.string().trim().max(300).optional(),
    question3: z.string().trim().max(300).optional(),
    status: z.enum(["DRAFT", "SENT"]),
    title: z.string().trim().min(1).max(180),
});

const submitQuestionnaireSchema = z.object({
    projectId: z.string().trim().min(1),
    questionnaireId: z.string().trim().min(1),
});

export async function createProjectQuestionnaireAction(formData: FormData) {
    await requireAdminSession();

    const parsed = createQuestionnaireSchema.parse({
        description: formData.get("description"),
        dueAt: formData.get("dueAt"),
        isClientVisible: formData.get("isClientVisible") === "on",
        projectId: formData.get("projectId"),
        question1: formData.get("question1"),
        question2: formData.get("question2"),
        question3: formData.get("question3"),
        status: formData.get("status"),
        title: formData.get("title"),
    });
    const questions = [parsed.question1, parsed.question2, parsed.question3]
        .map((question) => question?.trim())
        .filter((question): question is string => Boolean(question));
    const prisma = getPrismaClient();

    await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: { id: parsed.projectId },
            select: {
                opportunityId: true,
            },
        });

        await tx.questionnaire.create({
            data: {
                description: nullableString(parsed.description),
                dueAt: parseOptionalDate(parsed.dueAt),
                isClientVisible: parsed.isClientVisible,
                projectId: parsed.projectId,
                status: parsed.status,
                title: parsed.title,
                questions: {
                    create: questions.map((question, index) => ({
                        key: `question-${index + 1}`,
                        label: question,
                        required: index === 0,
                        sortOrder: index + 1,
                        type: "LONG_TEXT",
                    })),
                },
            },
        });

        await createTimelineEvent(tx, {
            description: nullableString(parsed.description),
            kind: "QUESTIONNAIRE",
            opportunityId: project?.opportunityId,
            projectId: parsed.projectId,
            title: `Questionnaire créé : ${parsed.title}`,
            visibility: parsed.isClientVisible ? "CLIENT_VISIBLE" : "ADMIN_ONLY",
        });

        if (parsed.isClientVisible && parsed.status === "SENT") {
            await createProjectNotifications(tx, {
                actionHref: `/espace-client/projets/${parsed.projectId}/questionnaires`,
                audience: "CLIENT",
                body: nullableString(parsed.description) ?? undefined,
                opportunityId: project?.opportunityId,
                priority: "HIGH",
                projectId: parsed.projectId,
                title: `Questionnaire à compléter : ${parsed.title}`,
            });
        }
    });

    revalidatePath(`/admin/projets/${parsed.projectId}/questionnaires`);
    revalidatePath(`/espace-client/projets/${parsed.projectId}/questionnaires`);
    redirect(`/admin/projets/${parsed.projectId}/questionnaires?questionnaire=created`);
}

export async function submitClientQuestionnaireAction(formData: FormData) {
    const session = await requireClientPortalSession();
    const parsed = submitQuestionnaireSchema.parse({
        projectId: formData.get("projectId"),
        questionnaireId: formData.get("questionnaireId"),
    });
    const allowed = await canReadProject({
        projectId: parsed.projectId,
        role: session.user.role,
        userId: session.user.id,
    });

    if (!allowed) {
        redirect("/espace-client?error=AccessDenied");
    }

    const prisma = getPrismaClient();
    const questionnaire = await prisma.questionnaire.findFirst({
        where: {
            id: parsed.questionnaireId,
            isClientVisible: true,
            projectId: parsed.projectId,
        },
        select: {
            id: true,
            questions: {
                select: {
                    id: true,
                    required: true,
                },
            },
        },
    });

    if (!questionnaire) {
        redirect(`/espace-client/projets/${parsed.projectId}/questionnaires?answer=not-found`);
    }

    const answers = questionnaire.questions
        .map((question) => ({
            questionId: question.id,
            value: String(formData.get(`answer-${question.id}`) ?? "").trim(),
        }))
        .filter((answer) => answer.value.length > 0);

    await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: { id: parsed.projectId },
            select: {
                opportunityId: true,
            },
        });

        await tx.questionnaireAnswer.deleteMany({
            where: {
                authorUserId: session.user.id,
                questionId: {
                    in: questionnaire.questions.map((question) => question.id),
                },
            },
        });

        await Promise.all(
            answers.map((answer) =>
                tx.questionnaireAnswer.create({
                    data: {
                        authorUserId: session.user.id,
                        questionId: answer.questionId,
                        status: "SUBMITTED",
                        value: answer.value,
                    },
                }),
            ),
        );

        await tx.questionnaire.update({
            where: { id: parsed.questionnaireId },
            data: {
                status: "IN_PROGRESS",
            },
        });

        await createTimelineEvent(tx, {
            actorUserId: session.user.id,
            description: `${answers.length} réponse(s) enregistrée(s).`,
            kind: "CLIENT_ACTION",
            opportunityId: project?.opportunityId,
            projectId: parsed.projectId,
            title: "Questionnaire client mis à jour",
            visibility: "CLIENT_VISIBLE",
        });

        await createProjectNotifications(tx, {
            actionHref: `/admin/projets/${parsed.projectId}/questionnaires`,
            audience: "ADMIN",
            body: `${answers.length} réponse(s) enregistrée(s).`,
            opportunityId: project?.opportunityId,
            priority: "HIGH",
            projectId: parsed.projectId,
            title: "Réponses questionnaire reçues",
        });
    });

    revalidatePath(`/admin/projets/${parsed.projectId}/questionnaires`);
    revalidatePath(`/espace-client/projets/${parsed.projectId}/questionnaires`);
    redirect(`/espace-client/projets/${parsed.projectId}/questionnaires?answer=saved`);
}

function nullableString(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? trimmed : null;
}

function parseOptionalDate(value: string | undefined) {
    const trimmed = value?.trim() ?? "";

    return trimmed ? new Date(trimmed) : null;
}
