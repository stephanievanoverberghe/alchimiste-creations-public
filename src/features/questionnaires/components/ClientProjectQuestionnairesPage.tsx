import { ArrowLeft, ClipboardList } from "lucide-react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, Textarea } from "@/components/ui";
import { submitClientQuestionnaireAction } from "@/server/questionnaires/actions";
import { getClientProjectQuestionnaires } from "@/server/questionnaires/questionnaires";

type ClientProjectQuestionnairesPageProps = {
    answerStatus?: string;
    data: Awaited<ReturnType<typeof getClientProjectQuestionnaires>>;
};

export function ClientProjectQuestionnairesPage({
    answerStatus,
    data,
}: ClientProjectQuestionnairesPageProps) {
    return (
        <Section spacing="lg" className="min-h-[calc(100vh-220px)]">
            <Container>
                <div className="flex flex-col gap-8">
                    <header className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-8">
                        <Button
                            href={`/espace-client/projets/${data.project.id}`}
                            variant="ghost"
                            size="sm"
                            iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                            className="w-fit"
                        >
                            Projet
                        </Button>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge tone="info">Questionnaires</Badge>
                            <Badge tone="neutral">{data.project.name}</Badge>
                        </div>
                        <h1 className="mt-3 text-h1 text-[color:var(--color-text-default)]">
                            Informations attendues
                        </h1>
                        <p className="mt-3 max-w-[760px] text-body text-[color:var(--color-text-muted)]">
                            Réponds aux questionnaires ouverts pour transmettre les
                            contenus, accès ou décisions nécessaires au projet.
                        </p>
                    </header>

                    {answerStatus ? (
                        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
                            Réponses enregistrées.
                        </div>
                    ) : null}

                    <div className="grid gap-5">
                        {data.questionnaires.length > 0 ? (
                            data.questionnaires.map((questionnaire) => (
                                <form
                                    key={questionnaire.id}
                                    action={submitClientQuestionnaireAction}
                                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                                >
                                    <input
                                        type="hidden"
                                        name="projectId"
                                        value={data.project.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="questionnaireId"
                                        value={questionnaire.id}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <Badge tone="info">{questionnaire.status}</Badge>
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

                                    <div className="mt-5 grid gap-4">
                                        {questionnaire.questions.map((question) => (
                                            <Textarea
                                                key={question.id}
                                                name={`answer-${question.id}`}
                                                label={question.label}
                                                helperText={
                                                    question.answers[0]
                                                        ? "Réponse déjà enregistrée, tu peux la modifier."
                                                        : question.required
                                                            ? "Réponse attendue."
                                                            : undefined
                                                }
                                                defaultValue={question.answers[0]?.value ?? ""}
                                                required={question.required}
                                                rows={4}
                                            />
                                        ))}
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        tone="info"
                                        className="mt-5"
                                    >
                                        Enregistrer les réponses
                                    </Button>
                                </form>
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

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <ClipboardList
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun questionnaire ouvert.
            </p>
        </div>
    );
}
