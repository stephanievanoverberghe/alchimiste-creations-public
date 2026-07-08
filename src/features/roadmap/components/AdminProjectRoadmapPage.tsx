import {
    ArrowLeft,
    CheckCircle2,
    ClipboardList,
    History,
    ListChecks,
    MessageSquareText,
    Route,
} from "lucide-react";
import type { ReactNode } from "react";

import { Container, Section } from "@/components/layout";
import { Badge, Button } from "@/components/ui";
import { getAdminProjectRoadmap } from "@/server/roadmap/roadmap";

type AdminProjectRoadmapPageProps = {
    project: Awaited<ReturnType<typeof getAdminProjectRoadmap>>;
};

export function AdminProjectRoadmapPage({
    project,
}: AdminProjectRoadmapPageProps) {
    const summary = project.playbookInstance?.generationSummary;

    return (
        <Section
            spacing="none"
            className="min-h-[calc(100vh-56px)] py-4 md:py-5 lg:py-6"
        >
            <Container>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-8">
                        <Button
                            href={`/admin/demandes/${project.opportunity.id}`}
                            variant="ghost"
                            size="sm"
                            iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                            className="w-fit"
                        >
                            Fiche opportunité
                        </Button>
                        <div className="flex flex-wrap gap-2">
                            <Badge tone="info">{project.status}</Badge>
                            <Badge tone="neutral">{project.stage}</Badge>
                            {project.playbookInstance ? (
                                <Badge tone="success">
                                    {project.playbookInstance.playbookTemplate.name}
                                </Badge>
                            ) : (
                                <Badge tone="warning">Aucun playbook</Badge>
                            )}
                        </div>
                        <div>
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                Roadmap admin
                            </p>
                            <h1 className="mt-2 text-h1 text-[color:var(--color-text-default)]">
                                {project.name}
                            </h1>
                            <p className="mt-3 max-w-[760px] text-body text-[color:var(--color-text-muted)]">
                                Prochaine action : {project.nextAction ?? "à définir"}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                href={`/admin/projets/${project.id}/messages`}
                                variant="secondary"
                                size="sm"
                                iconLeft={
                                    <MessageSquareText
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                Messages
                            </Button>
                            <Button
                                href={`/admin/projets/${project.id}/questionnaires`}
                                variant="secondary"
                                size="sm"
                                iconLeft={
                                    <ClipboardList
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                Questionnaires
                            </Button>
                            <Button
                                href={`/admin/projets/${project.id}/timeline`}
                                variant="secondary"
                                size="sm"
                                iconLeft={
                                    <History
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                            >
                                Timeline
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4">
                        <MetricCard
                            icon={<Route className="size-4" aria-hidden="true" />}
                            label="Phases"
                            value={String(project.phases.length)}
                        />
                        <MetricCard
                            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            label="Gates"
                            value={String(countPhaseItems(project.phases, "gates") + project.gates.length)}
                        />
                        <MetricCard
                            icon={<ListChecks className="size-4" aria-hidden="true" />}
                            label="Actions"
                            value={String(countPhaseItems(project.phases, "actions") + project.actions.length)}
                        />
                        <MetricCard
                            icon={<Route className="size-4" aria-hidden="true" />}
                            label="Résumé"
                            value={formatSummaryValue(summary)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {project.phases.length > 0 ? (
                            project.phases.map((phase) => (
                                <PhaseCard key={phase.id} phase={phase} />
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

function PhaseCard({
    phase,
}: {
    phase: AdminProjectRoadmapPageProps["project"]["phases"][number];
}) {
    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="neutral">{phase.status}</Badge>
                        <Badge tone="info">{phase.key}</Badge>
                    </div>
                    <h2 className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                        {phase.name}
                    </h2>
                    {phase.description ? (
                        <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                            {phase.description}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <RoadmapList
                    emptyLabel="Aucune gate dans cette phase."
                    items={phase.gates.map((gate) => ({
                        id: gate.id,
                        badges: [
                            gate.status,
                            gate.type ?? "GATE",
                            gate.isClientVisible ? "Client" : "Interne",
                        ],
                        label: gate.title,
                    }))}
                    title="Gates"
                />
                <RoadmapList
                    emptyLabel="Aucune action dans cette phase."
                    items={phase.actions.map((action) => ({
                        id: action.id,
                        badges: [
                            action.status,
                            action.ownerRole ?? "Équipe",
                            action.isClientVisible ? "Client" : "Interne",
                        ],
                        label: action.title,
                    }))}
                    title="Actions"
                />
                <RoadmapList
                    emptyLabel="Aucun livrable dans cette phase."
                    items={phase.deliverables.map((deliverable) => ({
                        id: deliverable.id,
                        badges: [
                            deliverable.status,
                            deliverable.isClientVisible ? "Client" : "Interne",
                        ],
                        label: deliverable.name,
                    }))}
                    title="Livrables"
                />
            </div>
        </article>
    );
}

function RoadmapList({
    emptyLabel,
    items,
    title,
}: {
    emptyLabel: string;
    items: Array<{ badges: string[]; id: string; label: string }>;
    title: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {title}
            </p>
            <div className="mt-3 flex flex-col gap-3">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id}>
                            <p className="text-body-small text-[color:var(--color-text-default)]">
                                {item.label}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {item.badges.map((badge) => (
                                    <Badge key={badge} tone="neutral" size="sm">
                                        {badge}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {emptyLabel}
                    </p>
                )}
            </div>
        </div>
    );
}

function MetricCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    {label}
                </p>
                <Badge tone="neutral" size="sm">
                    {icon}
                </Badge>
            </div>
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <Route
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun playbook appliqué.
            </p>
        </div>
    );
}

function countPhaseItems(
    phases: AdminProjectRoadmapPageProps["project"]["phases"],
    key: "actions" | "gates",
) {
    return phases.reduce((total, phase) => total + phase[key].length, 0);
}

function formatSummaryValue(summary: unknown) {
    if (!summary || typeof summary !== "object") return "V2";

    const value = summary as { playbookKey?: unknown };

    return typeof value.playbookKey === "string" ? value.playbookKey : "V2";
}
