import { ArrowLeft, Bell, History, ListChecks } from "lucide-react";
import type { ReactNode } from "react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, Select, Textarea, TextField } from "@/components/ui";
import { formatDateTime } from "@/lib/formatters";
import { createProjectTimelineEventAction } from "@/server/timeline/actions";
import { getAdminProjectTimeline } from "@/server/timeline/timeline";

type AdminProjectTimelinePageProps = {
    data: Awaited<ReturnType<typeof getAdminProjectTimeline>>;
    eventStatus?: string;
};

const eventKindOptions = [
    { value: "PROJECT", label: "Projet" },
    { value: "DECISION", label: "Décision" },
    { value: "STATUS_CHANGE", label: "Changement de statut" },
    { value: "DOCUMENT", label: "Document" },
    { value: "VALIDATION", label: "Validation" },
    { value: "MESSAGE", label: "Message" },
    { value: "QUESTIONNAIRE", label: "Questionnaire" },
    { value: "INTERNAL_NOTE", label: "Note interne" },
];

export function AdminProjectTimelinePage({
    data,
    eventStatus,
}: AdminProjectTimelinePageProps) {
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
                            <Badge tone="info">Timeline</Badge>
                            <Badge tone="neutral">{data.project.opportunity.prospectName}</Badge>
                        </div>
                        <h1 className="mt-3 text-h1 text-[color:var(--color-text-default)]">
                            Timeline, notifications et audit
                        </h1>
                        <p className="mt-3 max-w-[760px] text-body text-[color:var(--color-text-muted)]">
                            Suis les événements importants du projet, les notifications
                            utiles et le journal d’audit serveur.
                        </p>
                    </header>

                    {eventStatus ? (
                        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
                            Événement ajouté à la timeline.
                        </div>
                    ) : null}

                    <form
                        action={createProjectTimelineEventAction}
                        className="grid gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:grid-cols-2"
                    >
                        <input type="hidden" name="projectId" value={data.project.id} />
                        <TextField name="title" label="Titre de l’événement" required />
                        <Select
                            name="kind"
                            label="Type"
                            defaultValue="DECISION"
                            options={eventKindOptions}
                        />
                        <Select
                            name="visibility"
                            label="Visibilité"
                            defaultValue="ADMIN_ONLY"
                            options={[
                                { value: "ADMIN_ONLY", label: "Admin uniquement" },
                                { value: "CLIENT_VISIBLE", label: "Visible client" },
                            ]}
                        />
                        <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3 text-body-small text-[color:var(--color-text-muted)]">
                            <input
                                type="checkbox"
                                name="notifyClient"
                                className="size-4 accent-[var(--color-action-default)]"
                            />
                            Notifier le client si visible
                        </label>
                        <Textarea
                            name="description"
                            label="Description"
                            rows={3}
                            className="md:col-span-2"
                        />
                        <div className="md:col-span-2">
                            <Button type="submit" variant="solid" tone="info">
                                Ajouter à la timeline
                            </Button>
                        </div>
                    </form>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="flex flex-col gap-6">
                            <Panel icon={<History className="size-4" />} title="Timeline">
                                <TimelineList events={data.events} />
                            </Panel>

                            <Panel icon={<ListChecks className="size-4" />} title="Audit serveur">
                                <AuditList auditLogs={data.auditLogs} />
                            </Panel>
                        </div>

                        <Panel icon={<Bell className="size-4" />} title="Notifications">
                            <NotificationList notifications={data.notifications} />
                        </Panel>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function Panel({
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

function TimelineList({
    events,
}: {
    events: AdminProjectTimelinePageProps["data"]["events"];
}) {
    if (events.length === 0) {
        return <EmptyText>Aucun événement projet pour le moment.</EmptyText>;
    }

    return (
        <div className="flex flex-col gap-3">
            {events.map((event) => (
                <article
                    key={event.id}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="info" size="sm">
                            {event.kind}
                        </Badge>
                        <Badge
                            tone={
                                event.visibility === "CLIENT_VISIBLE"
                                    ? "success"
                                    : "warning"
                            }
                            size="sm"
                        >
                            {event.visibility === "CLIENT_VISIBLE"
                                ? "Client"
                                : "Admin"}
                        </Badge>
                    </div>
                    <h3 className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {event.title}
                    </h3>
                    {event.description ? (
                        <p className="mt-2 whitespace-pre-wrap text-body-small text-[color:var(--color-text-muted)]">
                            {event.description}
                        </p>
                    ) : null}
                    <p className="mt-3 text-caption text-[color:var(--color-text-subtle)]">
                        {formatDateTime(event.happenedAt)}
                    </p>
                </article>
            ))}
        </div>
    );
}

function AuditList({
    auditLogs,
}: {
    auditLogs: AdminProjectTimelinePageProps["data"]["auditLogs"];
}) {
    if (auditLogs.length === 0) {
        return <EmptyText>Aucun audit lié à ce projet.</EmptyText>;
    }

    return (
        <div className="flex flex-col gap-3">
            {auditLogs.map((log) => (
                <div
                    key={log.id}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <Badge tone="neutral" size="sm">
                        {log.entityType}
                    </Badge>
                    <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {log.action}
                    </p>
                    <p className="mt-2 text-caption text-[color:var(--color-text-subtle)]">
                        {formatDateTime(log.createdAt)}
                        {log.actorEmail ? ` · ${log.actorEmail}` : ""}
                    </p>
                </div>
            ))}
        </div>
    );
}

function NotificationList({
    notifications,
}: {
    notifications: AdminProjectTimelinePageProps["data"]["notifications"];
}) {
    if (notifications.length === 0) {
        return <EmptyText>Aucune notification liée à ce projet.</EmptyText>;
    }

    return (
        <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                >
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="info" size="sm">
                            {notification.priority}
                        </Badge>
                        <Badge
                            tone={notification.status === "UNREAD" ? "warning" : "neutral"}
                            size="sm"
                        >
                            {notification.status}
                        </Badge>
                    </div>
                    <p className="mt-3 text-label text-[color:var(--color-text-default)]">
                        {notification.title}
                    </p>
                    {notification.body ? (
                        <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                            {notification.body}
                        </p>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

function EmptyText({ children }: { children: ReactNode }) {
    return (
        <p className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4 text-body-small text-[color:var(--color-text-muted)]">
            {children}
        </p>
    );
}
