import {
    ArrowRight,
    Bell,
    CheckCircle2,
    ClipboardList,
    FileText,
    FolderKanban,
    MessageSquareText,
    Route,
} from "lucide-react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, type BadgeTone } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import { getRequestStatusForClient } from "@/lib/status-labels";
import { getClientPortalHome } from "@/server/client-portal/portal";

type ClientPortalHomePageProps = {
    data: Awaited<ReturnType<typeof getClientPortalHome>>;
    session: Session;
};

export function ClientPortalHomePage({
    data,
    session,
}: ClientPortalHomePageProps) {
    const hasRequests = data.projectRequests.length > 0;
    const hasProjects = data.projects.length > 0;
    const unreadNotifications = data.notifications.filter(
        (notification) => notification.status === "UNREAD",
    ).length;
    const pendingValidations = data.projects.reduce(
        (total, project) => total + project._count.validations,
        0,
    );

    return (
        <Section spacing="lg" className="min-h-[calc(100vh-220px)]">
            <Container>
                <div className="flex flex-col gap-8">
                    <header className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-[820px]">
                                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                    Espace client
                                </p>
                                <h1 className="mt-2 text-h1 text-[color:var(--color-text-default)]">
                                    Ton suivi projet
                                </h1>
                                <p className="mt-3 text-body text-[color:var(--color-text-muted)]">
                                    Tu retrouves ici tes demandes, tes projets, les
                                    documents partagés, les questionnaires ouverts et les
                                    prochaines actions à traiter.
                                </p>
                                <p className="mt-3 text-caption text-[color:var(--color-text-subtle)]">
                                    Connecté avec {session.user.email}
                                </p>
                            </div>
                            <Button
                                href="/demande-de-projet"
                                variant="secondary"
                                iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                                className="w-fit"
                            >
                                Nouvelle demande
                            </Button>
                        </div>
                    </header>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <DashboardMetric
                            icon={<ClipboardList className="size-4" aria-hidden="true" />}
                            label="Demandes"
                            value={data.projectRequests.length}
                        />
                        <DashboardMetric
                            icon={<FolderKanban className="size-4" aria-hidden="true" />}
                            label="Projets"
                            value={data.projects.length}
                        />
                        <DashboardMetric
                            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            label="Validations"
                            tone={pendingValidations > 0 ? "warning" : "neutral"}
                            value={pendingValidations}
                        />
                        <DashboardMetric
                            icon={<Bell className="size-4" aria-hidden="true" />}
                            label="Notifications"
                            tone={unreadNotifications > 0 ? "warning" : "neutral"}
                            value={unreadNotifications}
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
                        <div className="flex flex-col gap-6">
                            <DashboardPanel
                                icon={<Bell className="size-4" aria-hidden="true" />}
                                title="À suivre maintenant"
                            >
                                <ClientActionList data={data} />
                            </DashboardPanel>

                            {hasRequests ? (
                                <DashboardPanel
                                    icon={<ClipboardList className="size-4" aria-hidden="true" />}
                                    title="Tes demandes"
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {data.projectRequests.map((request) => (
                                            <ProjectRequestCard
                                                key={request.id}
                                                request={request}
                                            />
                                        ))}
                                    </div>
                                </DashboardPanel>
                            ) : (
                                <EmptyRequestsState />
                            )}

                            {hasProjects ? (
                                <DashboardPanel
                                    icon={<FolderKanban className="size-4" aria-hidden="true" />}
                                    title="Tes projets"
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {data.projects.map((project) => (
                                            <ProjectCard key={project.id} project={project} />
                                        ))}
                                    </div>
                                </DashboardPanel>
                            ) : !hasRequests ? (
                                <EmptyState />
                            ) : null}
                        </div>

                        <aside className="flex flex-col gap-6">
                            <DashboardPanel
                                icon={<ClipboardList className="size-4" aria-hidden="true" />}
                                title="Questionnaires"
                            >
                                <QuestionnairesList data={data} />
                            </DashboardPanel>

                            <DashboardPanel
                                icon={<Bell className="size-4" aria-hidden="true" />}
                                title="Notifications"
                            >
                                <NotificationsList data={data} />
                            </DashboardPanel>
                        </aside>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function ClientActionList({
    data,
}: {
    data: Awaited<ReturnType<typeof getClientPortalHome>>;
}) {
    const actions = [
        // Requested validations first: they are what blocks the project.
        ...data.pendingValidations.map((validation) => ({
            href: validation.realDocumentId
                ? `/espace-client/projets/${validation.project.id}/documents/${validation.realDocumentId}`
                : `/espace-client/projets/${validation.project.id}`,
            label: validation.title,
            meta: `${validation.project.name} · ta décision est attendue`,
            tone: "warning" as BadgeTone,
            type: "Validation",
        })),
        ...data.openQuestionnaires.map((questionnaire) => ({
            href: questionnaire.project
                ? `/espace-client/projets/${questionnaire.project.id}/questionnaires`
                : "/espace-client",
            label: questionnaire.title,
            meta: `${questionnaire.project?.name ?? "Projet"} · ${questionnaire._count.questions} question(s)`,
            tone: "warning" as BadgeTone,
            type: "Questionnaire",
        })),
        ...data.notifications
            .filter((notification) => notification.status === "UNREAD")
            .map((notification) => ({
                href: notification.actionHref ?? "/espace-client",
                label: notification.title,
                meta: notification.project?.name ?? "Notification",
                tone: "info" as BadgeTone,
                type: "Notification",
            })),
    ].slice(0, 6);

    if (actions.length === 0) {
        return <EmptyInline text="Tu n’as aucune action urgente pour le moment." />;
    }

    return (
        <div className="grid gap-3">
            {actions.map((action) => (
                <a
                    key={`${action.type}-${action.href}-${action.label}`}
                    href={action.href}
                    className="focus-ring flex items-start justify-between gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4 no-underline transition-colors hover:border-[color:var(--color-action-default)]"
                >
                    <span className="min-w-0">
                        <Badge tone={action.tone} size="sm">
                            {action.type}
                        </Badge>
                        <span className="mt-3 block text-label text-[color:var(--color-text-default)]">
                            {action.label}
                        </span>
                        <span className="mt-1 block text-caption text-[color:var(--color-text-subtle)]">
                            {action.meta}
                        </span>
                    </span>
                    <ArrowRight
                        className="mt-1 size-4 shrink-0 text-[color:var(--color-action-default)]"
                        aria-hidden="true"
                    />
                </a>
            ))}
        </div>
    );
}

function ProjectRequestCard({
    request,
}: {
    request: Awaited<
        ReturnType<typeof getClientPortalHome>
    >["projectRequests"][number];
}) {
    const opportunity = request.opportunity;
    const convertedProject = opportunity?.convertedProject;

    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-5">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                    <Badge tone="brand">{request.requestId}</Badge>
                    <Badge tone={getRequestStatusForClient(opportunity?.status).tone}>
                        {getRequestStatusForClient(opportunity?.status).label}
                    </Badge>
                </div>
                <div>
                    <h3 className="text-h3 text-[color:var(--color-text-default)]">
                        {request.projectName?.trim() ||
                            opportunity?.title ||
                            "Demande de projet"}
                    </h3>
                    <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        Type demandé :{" "}
                        {request.projectTypeLabel ??
                            request.projectTypeRaw ??
                            "à confirmer"}
                    </p>
                </div>
                <dl className="grid gap-3 text-caption text-[color:var(--color-text-subtle)] sm:grid-cols-3">
                    <DetailItem
                        label="Envoyée"
                        value={formatDate(request.createdAt, "long")}
                    />
                    <DetailItem label="Budget" value={request.budget ?? "À préciser"} />
                    <DetailItem
                        label="Échéance"
                        value={request.deadline ?? "À préciser"}
                    />
                </dl>
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
                    <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                        Prochaine étape
                    </p>
                    <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        {opportunity?.nextAction?.trim() ||
                            getDefaultRequestNextStep(opportunity?.status)}
                    </p>
                    {opportunity?.nextFollowUpAt ? (
                        <p className="mt-2 text-caption text-[color:var(--color-text-subtle)]">
                            Relance prévue :{" "}
                            {formatDate(opportunity.nextFollowUpAt, "long")}
                        </p>
                    ) : null}
                </div>
                {convertedProject ? (
                    <Button
                        href={`/espace-client/projets/${convertedProject.id}`}
                        variant="secondary"
                        size="sm"
                        iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                        className="w-fit"
                    >
                        Ouvrir le projet
                    </Button>
                ) : null}
            </div>
        </article>
    );
}

function ProjectCard({
    project,
}: {
    project: Awaited<ReturnType<typeof getClientPortalHome>>["projects"][number];
}) {
    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-5">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                    <Badge tone="info">{project.status}</Badge>
                    <Badge tone="neutral">{project.stage}</Badge>
                </div>
                <div>
                    <h3 className="text-h3 text-[color:var(--color-text-default)]">
                        {project.name}
                    </h3>
                    <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        Prochaine étape : {project.nextAction ?? "à venir"}
                    </p>
                </div>
                <dl className="grid grid-cols-3 gap-3 text-caption text-[color:var(--color-text-subtle)]">
                    <DetailItem
                        label="Livrables"
                        value={String(project._count.deliverables)}
                    />
                    <DetailItem
                        label="Documents"
                        value={String(project._count.realDocuments)}
                    />
                    <DetailItem
                        label="Validations"
                        value={String(project._count.validations)}
                    />
                </dl>
                <div className="flex flex-wrap gap-2">
                    <Button
                        href={`/espace-client/projets/${project.id}`}
                        variant="secondary"
                        size="sm"
                        iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    >
                        Ouvrir
                    </Button>
                    <Button
                        href={`/espace-client/projets/${project.id}/messages`}
                        variant="ghost"
                        size="sm"
                        iconLeft={<MessageSquareText className="size-4" aria-hidden="true" />}
                    >
                        Messages
                    </Button>
                    <Button
                        href={`/espace-client/projets/${project.id}/timeline`}
                        variant="ghost"
                        size="sm"
                        iconLeft={<Route className="size-4" aria-hidden="true" />}
                    >
                        Timeline
                    </Button>
                </div>
            </div>
        </article>
    );
}

function QuestionnairesList({
    data,
}: {
    data: Awaited<ReturnType<typeof getClientPortalHome>>;
}) {
    if (data.openQuestionnaires.length === 0) {
        return <EmptyInline text="Aucun questionnaire ouvert pour le moment." />;
    }

    return (
        <div className="grid gap-3">
            {data.openQuestionnaires.map((questionnaire) => (
                <a
                    key={questionnaire.id}
                    href={
                        questionnaire.project
                            ? `/espace-client/projets/${questionnaire.project.id}/questionnaires`
                            : "/espace-client"
                    }
                    className="focus-ring rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4 no-underline transition-colors hover:border-[color:var(--color-action-default)]"
                >
                    <Badge tone="warning" size="sm">
                        {questionnaire.status}
                    </Badge>
                    <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {questionnaire.title}
                    </p>
                    <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                        {questionnaire.project?.name ?? "Projet"}
                    </p>
                </a>
            ))}
        </div>
    );
}

function NotificationsList({
    data,
}: {
    data: Awaited<ReturnType<typeof getClientPortalHome>>;
}) {
    if (data.notifications.length === 0) {
        return <EmptyInline text="Aucune notification pour le moment." />;
    }

    return (
        <div className="grid gap-3">
            {data.notifications.map((notification) => (
                <a
                    key={notification.id}
                    href={notification.actionHref ?? "/espace-client"}
                    className="focus-ring rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4 no-underline transition-colors hover:border-[color:var(--color-action-default)]"
                >
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            tone={notification.status === "UNREAD" ? "warning" : "neutral"}
                            size="sm"
                        >
                            {notification.status}
                        </Badge>
                        <Badge tone="info" size="sm">
                            {notification.priority}
                        </Badge>
                    </div>
                    <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {notification.title}
                    </p>
                    {notification.body ? (
                        <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                            {notification.body}
                        </p>
                    ) : null}
                </a>
            ))}
        </div>
    );
}

function DashboardPanel({
    children,
    icon,
    title,
}: {
    children: ReactNode;
    icon: ReactNode;
    title: string;
}) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-center gap-2">
                <Badge tone="neutral" size="sm">
                    {icon}
                </Badge>
                <h2 className="text-h3 text-[color:var(--color-text-default)]">
                    {title}
                </h2>
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function DashboardMetric({
    icon,
    label,
    tone = "neutral",
    value,
}: {
    icon: ReactNode;
    label: string;
    tone?: BadgeTone;
    value: number;
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

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="uppercase">{label}</dt>
            <dd className="mt-1 text-label text-[color:var(--color-text-default)]">
                {value}
            </dd>
        </div>
    );
}

function EmptyInline({ text }: { text: string }) {
    return (
        <p className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4 text-body-small text-[color:var(--color-text-muted)]">
            {text}
        </p>
    );
}

function EmptyRequestsState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-start gap-3">
                <ClipboardList
                    className="mt-1 size-5 shrink-0 text-[color:var(--color-text-subtle)]"
                    aria-hidden="true"
                />
                <div>
                    <p className="text-label text-[color:var(--color-text-default)]">
                        Aucune demande rattachée pour le moment.
                    </p>
                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                        Tes demandes apparaîtront ici dès qu’elles seront reliées à ton
                        compte ou à ton adresse email.
                    </p>
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <FolderKanban
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun projet autorisé pour le moment.
            </p>
            <div className="mt-4 flex justify-center gap-2 text-[color:var(--color-text-subtle)]">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                <FileText className="size-4" aria-hidden="true" />
            </div>
        </div>
    );
}

function getDefaultRequestNextStep(status: string | undefined) {
    if (!status || status === "NOUVEAU") {
        return "Ta demande a été transmise. Elle doit être qualifiée côté Alchimiste Créations.";
    }
    if (status === "DEVIS_ENVOYE") {
        return "Le devis est en cours de suivi.";
    }
    if (status === "ACCEPTE") {
        return "La demande est acceptée et peut être convertie en projet.";
    }
    if (["REFUSE", "PERDU_SANS_SUITE", "ARCHIVE"].includes(status)) {
        return "Cette demande n’est plus active.";
    }

    return "La demande avance dans le tunnel de qualification.";
}
