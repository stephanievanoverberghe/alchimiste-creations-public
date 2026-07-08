import {
    AlertTriangle,
    ArrowRight,
    Bell,
    Clock,
    ClipboardList,
    FileCheck2,
    FolderKanban,
    History,
    Receipt,
    Send,
    UserRoundSearch,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge, Button } from "@/components/ui";
import { formatDate, formatMoneyFromCents } from "@/lib/formatters";
import {
    getOpportunityPriority,
    getOpportunityStatus,
} from "@/lib/status-labels";
import { getAdminNowDashboard } from "@/server/admin/now-dashboard";

type AdminNowDashboardProps = {
    dashboard: Awaited<ReturnType<typeof getAdminNowDashboard>>;
};

export function AdminNowDashboard({ dashboard }: AdminNowDashboardProps) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        À faire maintenant
                    </p>
                    <h2 className="mt-2 text-h2 text-[color:var(--color-text-default)]">
                        Pilotage du jour
                    </h2>
                    <p className="mt-2 max-w-[760px] text-body-small text-[color:var(--color-text-muted)]">
                        Relances, devis, validations client, projets bloqués et
                        paiements à suivre depuis une seule vue.
                    </p>
                </div>
                <Button
                    href="/admin/demandes?view=followups"
                    variant="secondary"
                    size="sm"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                >
                    Voir les relances
                </Button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-9">
                <NowMetric
                    icon={<UserRoundSearch className="size-4" aria-hidden="true" />}
                    label="À qualifier"
                    value={dashboard.counts.opportunitiesToQualify}
                />
                <NowMetric
                    icon={<Clock className="size-4" aria-hidden="true" />}
                    label="Relances"
                    tone={dashboard.counts.followUpsDue > 0 ? "warning" : "neutral"}
                    value={dashboard.counts.followUpsDue}
                />
                <NowMetric
                    icon={<Send className="size-4" aria-hidden="true" />}
                    label="Devis sans relance"
                    tone={
                        dashboard.counts.quotesWithoutFollowUp > 0
                            ? "warning"
                            : "neutral"
                    }
                    value={dashboard.counts.quotesWithoutFollowUp}
                />
                <NowMetric
                    icon={<AlertTriangle className="size-4" aria-hidden="true" />}
                    label="Projets bloqués"
                    tone={dashboard.counts.blockedProjects > 0 ? "danger" : "neutral"}
                    value={dashboard.counts.blockedProjects}
                />
                <NowMetric
                    icon={<FileCheck2 className="size-4" aria-hidden="true" />}
                    label="Validations"
                    tone={
                        dashboard.counts.pendingClientValidations > 0
                            ? "warning"
                            : "neutral"
                    }
                    value={dashboard.counts.pendingClientValidations}
                />
                <NowMetric
                    icon={<Receipt className="size-4" aria-hidden="true" />}
                    label="À encaisser"
                    tone={dashboard.counts.invoicesToCollect > 0 ? "info" : "neutral"}
                    value={dashboard.counts.invoicesToCollect}
                />
                <NowMetric
                    icon={<FolderKanban className="size-4" aria-hidden="true" />}
                    label="Projets actifs"
                    tone={dashboard.counts.activeProjects > 0 ? "info" : "neutral"}
                    value={dashboard.counts.activeProjects}
                />
                <NowMetric
                    icon={<ClipboardList className="size-4" aria-hidden="true" />}
                    label="Questionnaires"
                    tone={dashboard.counts.openQuestionnaires > 0 ? "warning" : "neutral"}
                    value={dashboard.counts.openQuestionnaires}
                />
                <NowMetric
                    icon={<Bell className="size-4" aria-hidden="true" />}
                    label="Notifications"
                    tone={dashboard.counts.unreadNotifications > 0 ? "warning" : "neutral"}
                    value={dashboard.counts.unreadNotifications}
                />
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <NowPanel
                    actionHref="/admin/projets"
                    actionLabel="Tous les projets"
                    title="Cette semaine"
                >
                    {dashboard.weeklyFocus.length > 0 ? (
                        dashboard.weeklyFocus.map((project) => (
                            <CompactItem
                                key={project.id}
                                href={`/admin/projets/${project.id}`}
                                meta={
                                    project.currentPhaseName
                                        ? `Phase : ${project.currentPhaseName} — ${project.nextAction ?? "prochaine action à définir"}`
                                        : (project.nextAction ??
                                          "Playbook à appliquer")
                                }
                                title={project.name}
                            >
                                {project.hasActiveBlocker ? (
                                    <Badge tone="danger" size="sm">
                                        Blocage
                                    </Badge>
                                ) : null}
                                <Badge tone="success" size="sm">
                                    {project.openDeliverables} livrable(s)
                                </Badge>
                                <Badge tone="warning" size="sm">
                                    {project.openBlockingActions} bloquante(s)
                                </Badge>
                            </CompactItem>
                        ))
                    ) : (
                        <EmptyLine text="Aucun projet actif cette semaine." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin/demandes?view=qualification"
                    actionLabel="Ouvrir qualification"
                    title="Opportunités à qualifier"
                >
                    {dashboard.opportunitiesToQualify.length > 0 ? (
                        dashboard.opportunitiesToQualify.map((opportunity) => (
                            <OpportunityItem
                                key={opportunity.id}
                                opportunity={opportunity}
                            />
                        ))
                    ) : (
                        <EmptyLine text="Aucune opportunité à qualifier." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin/demandes?view=followups"
                    actionLabel="Ouvrir relances"
                    title="Relances du jour"
                >
                    {dashboard.followUpsDue.length > 0 ? (
                        dashboard.followUpsDue.map((opportunity) => (
                            <OpportunityItem
                                key={opportunity.id}
                                opportunity={opportunity}
                            />
                        ))
                    ) : (
                        <EmptyLine text="Aucune relance échue." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin/demandes?view=quotes"
                    actionLabel="Ouvrir devis"
                    title="Devis envoyés sans relance"
                >
                    {dashboard.quotesWithoutFollowUp.length > 0 ? (
                        dashboard.quotesWithoutFollowUp.map((quote) => (
                            <CompactItem
                                key={quote.id}
                                href={`/admin/demandes/${quote.id}`}
                                meta={`Envoyé : ${formatDate(quote.quoteSentAt, "numeric", "non renseignée")}`}
                                title={`${quote.title} - ${quote.prospectName}`}
                            >
                                <Badge tone={getOpportunityStatus(quote.status).tone} size="sm">
                                    {getOpportunityStatus(quote.status).label}
                                </Badge>
                            </CompactItem>
                        ))
                    ) : (
                        <EmptyLine text="Aucun devis sans relance." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin"
                    actionLabel="Voir admin"
                    title="Projets bloqués"
                >
                    {dashboard.blockedProjects.length > 0 ? (
                        dashboard.blockedProjects.map((project) => (
                            <CompactItem
                                key={project.id}
                                href="/admin"
                                meta={`Prochaine action : ${project.nextAction ?? "à définir"}`}
                                title={project.name}
                            >
                                <Badge tone="danger" size="sm">
                                    {project.stage}
                                </Badge>
                            </CompactItem>
                        ))
                    ) : (
                        <EmptyLine text="Aucun projet marqué comme bloqué." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin/documents"
                    actionLabel="Ouvrir documents"
                    title="Validations client en attente"
                >
                    {dashboard.pendingClientValidations.length > 0 ? (
                        dashboard.pendingClientValidations.map((validation) => (
                            <CompactItem
                                key={validation.id}
                                href={`/espace-client/projets/${validation.project.id}`}
                                meta={`Projet : ${validation.project.name}`}
                                title={validation.title}
                            >
                                <Badge tone="warning" size="sm">
                                    En attente
                                </Badge>
                            </CompactItem>
                        ))
                    ) : (
                        <EmptyLine text="Aucune validation client en attente." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin/finance"
                    actionLabel="Ouvrir finance"
                    title="Factures à encaisser"
                >
                    {dashboard.invoicesToCollect.length > 0 ? (
                        dashboard.invoicesToCollect.map((invoice) => (
                            <CompactItem
                                key={invoice.id}
                                href="/admin/finance"
                                meta={`${invoice.clientName} - échéance : ${formatDate(invoice.dueAt, "numeric", "non renseignée")}`}
                                title={`${invoice.reference} - ${formatMoneyFromCents(invoice.amountCents, "montant non renseigné")}`}
                            >
                                <Badge tone={invoice.status === "LATE" ? "danger" : "info"} size="sm">
                                    {invoice.status}
                                </Badge>
                            </CompactItem>
                        ))
                    ) : (
                        <EmptyLine text="Aucune facture à encaisser." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin"
                    actionLabel="Voir admin"
                    title="Notifications récentes"
                >
                    {dashboard.recentNotifications.length > 0 ? (
                        dashboard.recentNotifications.map((notification) => (
                            <CompactItem
                                key={notification.id}
                                href={notification.actionHref ?? "/admin"}
                                meta={`${notification.project?.name ?? "Projet"} - ${formatDate(notification.createdAt, "numeric", "non renseignée")}`}
                                title={notification.title}
                            >
                                <Badge
                                    tone={
                                        notification.status === "UNREAD"
                                            ? "warning"
                                            : "neutral"
                                    }
                                    size="sm"
                                >
                                    {notification.priority}
                                </Badge>
                            </CompactItem>
                        ))
                    ) : (
                        <EmptyLine text="Aucune notification récente." />
                    )}
                </NowPanel>

                <NowPanel
                    actionHref="/admin"
                    actionLabel="Voir projets"
                    title="Derniers événements"
                >
                    {dashboard.recentTimelineEvents.length > 0 ? (
                        dashboard.recentTimelineEvents.map((event) => (
                            <CompactItem
                                key={event.id}
                                href={
                                    event.project
                                        ? `/admin/projets/${event.project.id}/timeline`
                                        : "/admin"
                                }
                                meta={`${event.project?.name ?? "Projet"} - ${formatDate(event.happenedAt, "numeric", "non renseignée")}`}
                                title={event.title}
                            >
                                <Badge tone="info" size="sm">
                                    <History className="size-3" aria-hidden="true" />
                                    {event.kind}
                                </Badge>
                            </CompactItem>
                        ))
                    ) : (
                        <EmptyLine text="Aucun événement projet récent." />
                    )}
                </NowPanel>
            </div>
        </section>
    );
}

function NowMetric({
    icon,
    label,
    tone = "neutral",
    value,
}: {
    icon: ReactNode;
    label: string;
    tone?: "danger" | "info" | "neutral" | "warning";
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
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

function NowPanel({
    actionHref,
    actionLabel,
    children,
    title,
}: {
    actionHref: string;
    actionLabel: string;
    children: ReactNode;
    title: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-h3 text-[color:var(--color-text-default)]">
                    {title}
                </h3>
                <Button href={actionHref} variant="ghost" size="sm">
                    {actionLabel}
                </Button>
            </div>
            <div className="mt-4 flex flex-col gap-3">{children}</div>
        </div>
    );
}

function OpportunityItem({
    opportunity,
}: {
    opportunity: Awaited<
        ReturnType<typeof getAdminNowDashboard>
    >["opportunitiesToQualify"][number];
}) {
    return (
        <CompactItem
            href={`/admin/demandes/${opportunity.id}`}
            meta={`${opportunity.prospectName} - ${opportunity.nextAction ?? "action à définir"}`}
            title={opportunity.title}
        >
            <Badge tone={getOpportunityStatus(opportunity.status).tone} size="sm">
                {getOpportunityStatus(opportunity.status).label}
            </Badge>
            <Badge tone={getOpportunityPriority(opportunity.priority).tone} size="sm">
                {getOpportunityPriority(opportunity.priority).label}
            </Badge>
        </CompactItem>
    );
}

function CompactItem({
    children,
    href,
    meta,
    title,
}: {
    children: ReactNode;
    href: string;
    meta: string;
    title: string;
}) {
    return (
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <a
                        href={href}
                        className="text-label text-[color:var(--color-text-default)] no-underline hover:text-[color:var(--color-action-default)]"
                    >
                        {title}
                    </a>
                    <p className="mt-1 break-words text-caption text-[color:var(--color-text-subtle)]">
                        {meta}
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
            </div>
        </div>
    );
}

function EmptyLine({ text }: { text: string }) {
    return (
        <p className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-3 text-body-small text-[color:var(--color-text-muted)]">
            {text}
        </p>
    );
}
