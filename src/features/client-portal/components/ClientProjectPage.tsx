import {
    ArrowLeft,
    CheckCircle2,
    ClipboardList,
    Clock3,
    ExternalLink,
    FileText,
    FolderOpen,
    History,
    ListChecks,
    MessageSquareText,
    Route,
} from "lucide-react";
import type { ReactNode } from "react";

import { Container, Section } from "@/components/layout";
import {
    Badge,
    Button,
    Select,
    Textarea,
    type BadgeTone,
} from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import { respondClientValidationAction } from "@/server/client-portal/actions";
import { getClientPortalProject } from "@/server/client-portal/portal";

type ClientProjectPageProps = {
    project: Awaited<ReturnType<typeof getClientPortalProject>>;
    validationStatus?: string;
};

export function ClientProjectPage({
    project,
    validationStatus,
}: ClientProjectPageProps) {
    const pendingValidations = project.validations.filter(
        (validation) => validation.status === "PENDING",
    );

    return (
        <Section spacing="lg" className="min-h-[calc(100vh-220px)]">
            <Container>
                <div className="flex flex-col gap-8">
                    <ProjectHeader project={project} />

                    {validationStatus ? (
                        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
                            Validation mise à jour.
                        </div>
                    ) : null}

                    <div className="grid gap-3 md:grid-cols-4">
                        <DashboardCard
                            icon={<Clock3 className="size-4" aria-hidden="true" />}
                            label="Actions attendues"
                            tone={
                                project.dashboard.expectedActions > 0
                                    ? "warning"
                                    : "success"
                            }
                            value={String(project.dashboard.expectedActions)}
                        />
                        <DashboardCard
                            icon={<Route className="size-4" aria-hidden="true" />}
                            label="Étapes visibles"
                            value={String(project.dashboard.phases)}
                        />
                        <DashboardCard
                            icon={<FileText className="size-4" aria-hidden="true" />}
                            label="Documents"
                            value={String(project.dashboard.visibleDocuments)}
                        />
                        <DashboardCard
                            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            label="Validations"
                            tone={pendingValidations.length > 0 ? "warning" : "neutral"}
                            value={String(project.dashboard.visibleValidations)}
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
                        <div className="flex flex-col gap-6">
                            <Panel
                                eyebrow="Aujourd’hui"
                                title="Actions attendues"
                            >
                                <ExpectedActions project={project} />
                            </Panel>

                            <Panel eyebrow="Roadmap" title="Avancement du projet">
                                <ProjectRoadmap project={project} />
                            </Panel>

                            <Panel eyebrow="Livrables" title="Livrables partagés">
                                <DeliverablesList project={project} />
                            </Panel>
                        </div>

                        <aside className="flex flex-col gap-6">
                            <Panel eyebrow="Drive" title="Documents">
                                <DocumentsList project={project} />
                            </Panel>

                            <Panel eyebrow="Décisions" title="Validations">
                                <ValidationsList project={project} />
                            </Panel>
                        </aside>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function ProjectHeader({
    project,
}: {
    project: Awaited<ReturnType<typeof getClientPortalProject>>;
}) {
    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-8">
            <Button
                href="/espace-client"
                variant="ghost"
                size="sm"
                iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                className="w-fit"
            >
                Espace client
            </Button>
            <div className="flex flex-wrap gap-2">
                <Badge tone="info">{project.status}</Badge>
                <Badge tone="neutral">{project.stage}</Badge>
                {project.targetDate ? (
                    <Badge tone="brand">
                        Échéance {formatDate(project.targetDate, "long")}
                    </Badge>
                ) : null}
            </div>
            <div>
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Projet client
                </p>
                <h1 className="mt-2 text-h1 text-[color:var(--color-text-default)]">
                    {project.name}
                </h1>
                <p className="mt-3 max-w-[820px] text-body text-[color:var(--color-text-muted)]">
                    Prochaine étape : {project.nextAction ?? "à venir"}
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button
                    href={`/espace-client/projets/${project.id}/messages`}
                    variant="secondary"
                    size="sm"
                    iconLeft={
                        <MessageSquareText className="size-4" aria-hidden="true" />
                    }
                >
                    Messages
                </Button>
                <Button
                    href={`/espace-client/projets/${project.id}/questionnaires`}
                    variant="secondary"
                    size="sm"
                    iconLeft={<ClipboardList className="size-4" aria-hidden="true" />}
                >
                    Questionnaires
                </Button>
                <Button
                    href={`/espace-client/projets/${project.id}/timeline`}
                    variant="secondary"
                    size="sm"
                    iconLeft={<History className="size-4" aria-hidden="true" />}
                >
                    Timeline
                </Button>
            </div>
        </div>
    );
}

function ExpectedActions({
    project,
}: {
    project: Awaited<ReturnType<typeof getClientPortalProject>>;
}) {
    if (project.expectedActions.length === 0) {
        return (
            <EmptyInline
                icon={<CheckCircle2 className="size-5" aria-hidden="true" />}
                text="Aucune action client attendue pour le moment."
            />
        );
    }

    return (
        <div className="grid gap-3">
            {project.expectedActions.map((item) => (
                <div
                    key={`${item.kind}-${item.id}`}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="warning" size="sm">
                            {item.kind}
                        </Badge>
                        <Badge tone="neutral" size="sm">
                            {item.status}
                        </Badge>
                    </div>
                    <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {item.title}
                    </p>
                    {item.phaseName ? (
                        <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                            Étape : {item.phaseName}
                        </p>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

function ProjectRoadmap({
    project,
}: {
    project: Awaited<ReturnType<typeof getClientPortalProject>>;
}) {
    if (project.phases.length === 0) {
        return (
            <EmptyInline
                icon={<Route className="size-5" aria-hidden="true" />}
                text="La roadmap n’est pas encore partagée."
            />
        );
    }

    return (
        <div className="grid gap-3">
            {project.phases.map((phase) => (
                <article
                    key={phase.id}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                            <Badge tone={getProgressTone(phase.status)} size="sm">
                                {phase.status}
                            </Badge>
                            <h2 className="mt-3 text-label text-[color:var(--color-text-default)]">
                                {phase.name}
                            </h2>
                        </div>
                        <p className="text-caption text-[color:var(--color-text-subtle)]">
                            {phase.gates.length} gate(s) · {phase.actions.length} action(s)
                        </p>
                    </div>

                    {phase.gates.length > 0 || phase.actions.length > 0 ? (
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {phase.gates.map((gate) => (
                                <RoadmapItem
                                    key={gate.id}
                                    label={gate.title}
                                    status={gate.status}
                                    type="Gate"
                                />
                            ))}
                            {phase.actions.map((action) => (
                                <RoadmapItem
                                    key={action.id}
                                    label={action.title}
                                    status={action.status}
                                    type="Action"
                                />
                            ))}
                        </div>
                    ) : null}
                </article>
            ))}
        </div>
    );
}

function DeliverablesList({
    project,
}: {
    project: Awaited<ReturnType<typeof getClientPortalProject>>;
}) {
    if (project.deliverables.length === 0) {
        return (
            <EmptyInline
                icon={<FolderOpen className="size-5" aria-hidden="true" />}
                text="Aucun livrable partagé pour le moment."
            />
        );
    }

    return (
        <div className="grid gap-3">
            {project.deliverables.map((deliverable) => (
                <div
                    key={deliverable.id}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                            <Badge tone={getProgressTone(deliverable.status)} size="sm">
                                {deliverable.status}
                            </Badge>
                            <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                                {deliverable.name}
                            </p>
                            {deliverable.description ? (
                                <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                                    {deliverable.description}
                                </p>
                            ) : null}
                        </div>
                        {deliverable.documentUrl ? (
                            <Button
                                href={deliverable.documentUrl}
                                variant="secondary"
                                size="sm"
                                iconRight={
                                    <ExternalLink
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                Ouvrir
                            </Button>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}

function DocumentsList({
    project,
}: {
    project: Awaited<ReturnType<typeof getClientPortalProject>>;
}) {
    if (project.realDocuments.length === 0) {
        return (
            <EmptyInline
                icon={<FileText className="size-5" aria-hidden="true" />}
                text="Aucun document partagé pour le moment."
            />
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {project.realDocuments.map((document) => (
                <div
                    key={document.id}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <Badge tone="info" size="sm">
                        {document.status}
                    </Badge>
                    <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {document.title}
                    </p>
                    <p className="text-caption text-[color:var(--color-text-subtle)]">
                        {document.reference}
                    </p>
                    {document.documentModelKey ? (
                        <Button
                            href={`/espace-client/projets/${project.id}/documents/${document.id}`}
                            variant="primary"
                            size="sm"
                            className="mt-3"
                        >
                            Lire et valider
                        </Button>
                    ) : document.documentUrl ? (
                        <Button
                            href={document.documentUrl}
                            variant="secondary"
                            size="sm"
                            iconRight={
                                <ExternalLink
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            }
                            className="mt-3"
                        >
                            Consulter
                        </Button>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

function ValidationsList({
    project,
}: {
    project: Awaited<ReturnType<typeof getClientPortalProject>>;
}) {
    if (project.validations.length === 0) {
        return (
            <EmptyInline
                icon={<ListChecks className="size-5" aria-hidden="true" />}
                text="Aucune validation client en attente."
            />
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {project.validations.map((validation) => (
                <form
                    key={validation.id}
                    action={respondClientValidationAction}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <input type="hidden" name="projectId" value={project.id} />
                    <input
                        type="hidden"
                        name="validationId"
                        value={validation.id}
                    />
                    <Badge tone={getProgressTone(validation.status)} size="sm">
                        {validation.status}
                    </Badge>
                    <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {validation.title}
                    </p>
                    {validation.description ? (
                        <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                            {validation.description}
                        </p>
                    ) : null}
                    {validation.realDocumentId ? (
                        <Button
                            href={`/espace-client/projets/${project.id}/documents/${validation.realDocumentId}`}
                            variant="secondary"
                            size="sm"
                            className="mt-3"
                        >
                            Lire le document avant de répondre
                        </Button>
                    ) : null}
                    <Select
                        name="status"
                        label="Réponse"
                        defaultValue="APPROVED"
                        options={[
                            {
                                value: "APPROVED",
                                label: "Valider",
                            },
                            {
                                value: "CHANGES_REQUESTED",
                                label: "Demander des ajustements",
                            },
                        ]}
                        className="mt-4"
                    />
                    <Textarea
                        name="responseComment"
                        label="Commentaire"
                        defaultValue={validation.responseComment ?? ""}
                        rows={3}
                        className="mt-3"
                    />
                    <Button
                        type="submit"
                        variant="solid"
                        tone="success"
                        size="sm"
                        className="mt-3"
                    >
                        Envoyer
                    </Button>
                </form>
            ))}
        </div>
    );
}

function DashboardCard({
    icon,
    label,
    tone = "neutral",
    value,
}: {
    icon: ReactNode;
    label: string;
    tone?: BadgeTone;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    {label}
                </p>
                <Badge tone={tone} size="sm">
                    {icon}
                </Badge>
            </div>
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}

function Panel({
    children,
    eyebrow,
    title,
}: {
    children: ReactNode;
    eyebrow: string;
    title: string;
}) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {eyebrow}
            </p>
            <h2 className="mt-2 text-h3 text-[color:var(--color-text-default)]">
                {title}
            </h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function RoadmapItem({
    label,
    status,
    type,
}: {
    label: string;
    status: string;
    type: string;
}) {
    return (
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-3">
            <div className="flex flex-wrap gap-2">
                <Badge tone="info" size="sm">
                    {type}
                </Badge>
                <Badge tone={getProgressTone(status)} size="sm">
                    {status}
                </Badge>
            </div>
            <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                {label}
            </p>
        </div>
    );
}

function EmptyInline({ icon, text }: { icon: ReactNode; text: string }) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
            <div className="flex items-start gap-3 text-[color:var(--color-text-muted)]">
                <span className="mt-0.5 text-[color:var(--color-text-subtle)]">
                    {icon}
                </span>
                <p className="text-body-small">{text}</p>
            </div>
        </div>
    );
}

function getProgressTone(status: string): BadgeTone {
    if (["APPROVED", "DONE", "COMPLETED"].includes(status)) return "success";
    if (["PENDING", "TODO", "CHANGES_REQUESTED"].includes(status)) {
        return "warning";
    }
    if (status === "IN_PROGRESS") return "info";

    return "neutral";
}
