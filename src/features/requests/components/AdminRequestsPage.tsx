import type { ReactNode } from "react";
import {
    AlertTriangle,
    ArrowRight,
    BriefcaseBusiness,
    Clock,
    Gauge,
    GitBranch,
    ListChecks,
    MessagesSquare,
} from "lucide-react";

import { Badge, Button } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { RequestsPipelineCatalog } from "@/features/requests/components/RequestsPipelineCatalog";
import { getCrmPipeline as getRequestsPipeline } from "@/server/crm/opportunities";

type AdminRequestsPageProps = {
    searchParams: Record<string, string | string[] | undefined>;
};

export async function AdminRequestsPage({ searchParams }: AdminRequestsPageProps) {
    const pipeline = await getRequestsPipeline({});

    const rows = pipeline.opportunities.map((opportunity) => ({
        ...opportunity,
        createdAt: opportunity.createdAt.toISOString(),
        lastContactAt: opportunity.lastContactAt?.toISOString() ?? null,
        nextFollowUpAt: opportunity.nextFollowUpAt?.toISOString() ?? null,
        updatedAt: opportunity.updatedAt.toISOString(),
    }));

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Commercial"
                title="Demandes"
                description="Suis les demandes transformées en opportunités : où ça en est, quoi faire maintenant, quand relancer et ce qui bloque la conversion."
                actions={
                    <Button
                        href="/admin"
                        variant="secondary"
                        size="sm"
                        iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    >
                        Dashboard admin
                    </Button>
                }
                metrics={
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <RequestMetricCard
                            icon={<ListChecks className="size-4" aria-hidden="true" />}
                            label="Opportunités"
                            value={String(rows.length)}
                        />
                        <RequestMetricCard
                            icon={<Clock className="size-4" aria-hidden="true" />}
                            label="Relances en retard"
                            value={String(pipeline.overdueFollowUpCount)}
                            tone={
                                pipeline.overdueFollowUpCount > 0
                                    ? "warning"
                                    : "neutral"
                            }
                        />
                        <RequestMetricCard
                            icon={<AlertTriangle className="size-4" aria-hidden="true" />}
                            label="Sans action"
                            value={String(pipeline.missingNextActionCount)}
                            tone={
                                pipeline.missingNextActionCount > 0
                                    ? "danger"
                                    : "neutral"
                            }
                        />
                        <div className="hidden xl:block">
                            <RequestMetricCard
                                icon={<Gauge className="size-4" aria-hidden="true" />}
                                label="À qualifier"
                                value={String(pipeline.qualificationAttentionCount)}
                                tone={
                                    pipeline.qualificationAttentionCount > 0
                                        ? "warning"
                                        : "neutral"
                                }
                            />
                        </div>
                    </div>
                }
            />

            {getPipelineStatusMessage(getStringParam(searchParams.update)) ? (
                <div className="rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-body-small text-[color:var(--color-warning-text)]">
                    {getPipelineStatusMessage(getStringParam(searchParams.update))}
                </div>
            ) : null}

            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Cycle de pilotage
                        </p>
                        <p className="mt-2 max-w-[960px] text-body-small text-[color:var(--color-text-muted)]">
                            Une opportunité active doit toujours avoir une prochaine
                            action et une relance claire. Après conversion, elle reste
                            consultable ici pour l&apos;historique commercial, mais le
                            pilotage quotidien bascule dans les projets.
                        </p>
                    </div>
                    <Badge tone="info" className="shrink-0 whitespace-nowrap">
                        Tunnel commercial
                    </Badge>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
                    <LifecycleStep
                        icon={<MessagesSquare className="size-4" aria-hidden="true" />}
                        title="Demande"
                        description="La demande entrante est capturée et rattachée à une opportunité."
                    />
                    <LifecycleStep
                        icon={<ListChecks className="size-4" aria-hidden="true" />}
                        title="Commercial"
                        description="Qualification, proposition, devis, acompte et relances."
                    />
                    <LifecycleStep
                        icon={<GitBranch className="size-4" aria-hidden="true" />}
                        title="Conversion"
                        description="La conversion crée seulement une fiche projet centrale."
                    />
                    <LifecycleStep
                        icon={<BriefcaseBusiness className="size-4" aria-hidden="true" />}
                        title="Projet"
                        description="La roadmap et la production se pilotent dans l’espace Projets."
                    />
                </div>
            </section>

            <RequestsPipelineCatalog
                offers={pipeline.offers}
                opportunities={rows}
                statusCounts={pipeline.statusCounts}
            />
        </AdminPageShell>
    );
}

function LifecycleStep({
    description,
    icon,
    title,
}: {
    description: string;
    icon: ReactNode;
    title: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
            <div className="flex items-center gap-2">
                <Badge tone="neutral" size="sm">
                    {icon}
                </Badge>
                <p className="text-label text-[color:var(--color-text-default)]">
                    {title}
                </p>
            </div>
            <p className="mt-2 text-caption text-[color:var(--color-text-subtle)]">
                {description}
            </p>
        </div>
    );
}

function RequestMetricCard({
    icon,
    label,
    tone = "neutral",
    value,
}: {
    icon: ReactNode;
    label: string;
    tone?: "danger" | "neutral" | "warning";
    value: string;
}) {
    const badgeTone =
        tone === "danger" ? "danger" : tone === "warning" ? "warning" : "neutral";

    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    {label}
                </p>
                <Badge tone={badgeTone} size="sm">
                    {icon}
                </Badge>
            </div>
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}

function getStringParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function getPipelineStatusMessage(status: string | undefined) {
    if (status === "missing-next-action") {
        return "Sauvegarde refusée : une opportunité active doit toujours avoir une prochaine action.";
    }

    return null;
}
