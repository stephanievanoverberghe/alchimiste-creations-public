import { ArrowLeft, ClipboardList } from "lucide-react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, Select, Textarea, TextField } from "@/components/ui";
import { createProjectQuestionnaireAction } from "@/server/questionnaires/actions";
import { getAdminProjectQuestionnaires } from "@/server/questionnaires/questionnaires";

type AdminProjectQuestionnairesPageProps = {
    data: Awaited<ReturnType<typeof getAdminProjectQuestionnaires>>;
    questionnaireStatus?: string;
};

export function AdminProjectQuestionnairesPage({
    data,
    questionnaireStatus,
}: AdminProjectQuestionnairesPageProps) {
    return (
        <Section
            spacing="none"
            className="min-h-[calc(100vh-56px)] py-4 md:py-5 lg:py-6"
        >
            <Container>
                <div className="flex flex-col gap-8">
                    <header className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-8">
                        <Button
                            href={`/admin/projets/${data.project.id}/roadmap`}
                            variant="ghost"
                            size="sm"
                            iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                            className="w-fit"
                        >
                            Roadmap projet
                        </Button>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge tone="info">Questionnaires</Badge>
                            <Badge tone="neutral">{data.project.opportunity.prospectName}</Badge>
                        </div>
                        <h1 className="mt-3 text-h1 text-[color:var(--color-text-default)]">
                            Questionnaires projet
                        </h1>
                        <p className="mt-3 max-w-[760px] text-body text-[color:var(--color-text-muted)]">
                            Crée des questionnaires visibles client pour récupérer les
                            contenus, accès, décisions ou retours nécessaires au projet.
                        </p>
                    </header>

                    {questionnaireStatus ? (
                        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
                            Questionnaire créé.
                        </div>
                    ) : null}

                    <form
                        action={createProjectQuestionnaireAction}
                        className="grid gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:grid-cols-2"
                    >
                        <input type="hidden" name="projectId" value={data.project.id} />
                        <TextField name="title" label="Titre" required />
                        <TextField name="dueAt" type="date" label="Échéance" />
                        <Select
                            name="status"
                            label="Statut"
                            defaultValue="SENT"
                            options={[
                                { value: "SENT", label: "Envoyé" },
                                { value: "DRAFT", label: "Brouillon" },
                            ]}
                        />
                        <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3 text-body-small text-[color:var(--color-text-muted)]">
                            <input
                                type="checkbox"
                                name="isClientVisible"
                                defaultChecked
                                className="size-4 accent-[var(--color-action-default)]"
                            />
                            Visible dans l’espace client
                        </label>
                        <Textarea
                            name="description"
                            label="Contexte"
                            rows={3}
                            className="md:col-span-2"
                        />
                        <TextField
                            name="question1"
                            label="Question obligatoire"
                            required
                            className="md:col-span-2"
                        />
                        <TextField
                            name="question2"
                            label="Question optionnelle"
                            className="md:col-span-2"
                        />
                        <TextField
                            name="question3"
                            label="Question optionnelle"
                            className="md:col-span-2"
                        />
                        <div className="md:col-span-2">
                            <Button type="submit" variant="solid" tone="info">
                                Créer le questionnaire
                            </Button>
                        </div>
                    </form>

                    <div className="grid gap-5">
                        {data.questionnaires.length > 0 ? (
                            data.questionnaires.map((questionnaire) => (
                                <QuestionnaireCard
                                    key={questionnaire.id}
                                    questionnaire={questionnaire}
                                />
                            ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function QuestionnaireCard({
    questionnaire,
}: {
    questionnaire: AdminProjectQuestionnairesPageProps["data"]["questionnaires"][number];
}) {
    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-wrap gap-2">
                <Badge tone={getQuestionnaireTone(questionnaire.status)}>
                    {questionnaire.status}
                </Badge>
                {questionnaire.isClientVisible ? (
                    <Badge tone="success">Client</Badge>
                ) : (
                    <Badge tone="warning">Interne</Badge>
                )}
                <Badge tone="neutral">
                    {questionnaire.questions.length} question(s)
                </Badge>
            </div>
            <h2 className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                {questionnaire.title}
            </h2>
            {questionnaire.description ? (
                <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                    {questionnaire.description}
                </p>
            ) : null}

            <div className="mt-5 grid gap-3">
                {questionnaire.questions.map((question) => (
                    <div
                        key={question.id}
                        className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                    >
                        <p className="text-label text-[color:var(--color-text-default)]">
                            {question.label}
                        </p>
                        <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                            {question.answers.length} réponse(s)
                        </p>
                        {question.answers.slice(0, 2).map((answer) => (
                            <p
                                key={answer.id}
                                className="mt-3 whitespace-pre-wrap text-body-small text-[color:var(--color-text-muted)]"
                            >
                                {answer.value}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </article>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <ClipboardList
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun questionnaire.
            </p>
        </div>
    );
}

function getQuestionnaireTone(status: string) {
    if (status === "COMPLETED") return "success";
    if (status === "SENT" || status === "IN_PROGRESS") return "info";
    if (status === "DRAFT") return "draft";

    return "neutral" as const;
}
