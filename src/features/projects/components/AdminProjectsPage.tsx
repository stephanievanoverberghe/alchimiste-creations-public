"use client";

import {
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    FileCheck2,
    Grid2X2,
    List,
    Map,
    MessageSquareText,
    Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import {
    Badge,
    DataViewToolbar,
    Select,
    TextField,
} from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { formatDate } from "@/lib/formatters";
import {
    getProjectStage,
    getProjectStatusForAdmin,
} from "@/lib/status-labels";
import type { getAdminProjects } from "@/server/projects/projects";

type AdminProjectsPageProps = {
    data: Awaited<ReturnType<typeof getAdminProjects>>;
};

type AdminProject = Awaited<ReturnType<typeof getAdminProjects>>["projects"][number];
type ViewMode = "table" | "cards";

const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "PREPARATION", label: "Préparation" },
    { value: "EN_COURS", label: "En cours" },
    { value: "EN_VALIDATION", label: "En validation" },
    { value: "LIVRE", label: "Livré" },
    { value: "CLOTURE", label: "Clôturé" },
    { value: "ARCHIVE", label: "Archivé" },
];

const stageOptions = [
    { value: "all", label: "Toutes les étapes" },
    { value: "CADRAGE", label: "Cadrage" },
    { value: "UX", label: "UX" },
    { value: "UI", label: "UI" },
    { value: "CONTENUS", label: "Contenus" },
    { value: "DEVELOPPEMENT", label: "Développement" },
    { value: "QA", label: "QA" },
    { value: "LIVRAISON", label: "Livraison" },
];

export function AdminProjectsPage({ data }: AdminProjectsPageProps) {
    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Production"
                title="Projets"
                description="Pilote les projets convertis : statut, étape, prochaine action, blocages et accès direct aux roadmaps."
                metrics={
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <ProjectMetric
                            icon={<Map className="size-4" aria-hidden="true" />}
                            label="Projets"
                            value={String(data.totals.projects)}
                        />
                        <ProjectMetric
                            icon={<CalendarClock className="size-4" aria-hidden="true" />}
                            label="Actifs"
                            value={String(data.totals.active)}
                            tone={data.totals.active > 0 ? "info" : "neutral"}
                        />
                        <ProjectMetric
                            icon={<AlertTriangle className="size-4" aria-hidden="true" />}
                            label="Bloqués"
                            value={String(data.totals.blocked)}
                            tone={data.totals.blocked > 0 ? "danger" : "neutral"}
                        />
                        <div className="hidden xl:block">
                            <ProjectMetric
                                icon={
                                    <CheckCircle2
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Livrés"
                                value={String(data.totals.delivered)}
                                tone={
                                    data.totals.delivered > 0 ? "success" : "neutral"
                                }
                            />
                        </div>
                    </div>
                }
            />

            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Règle de production
                        </p>
                        <p className="mt-2 max-w-[940px] text-body-small text-[color:var(--color-text-muted)]">
                            Cette page démarre après conversion. Elle centralise les
                            fiches projet et donne accès aux roadmaps. L’application du
                            playbook reste une action explicite sur chaque projet.
                        </p>
                    </div>
                    <Badge tone="info">Après conversion</Badge>
                </div>
            </section>

            <ProjectsCatalog projects={data.projects} />
        </AdminPageShell>
    );
}

function ProjectsCatalog({ projects }: { projects: AdminProject[] }) {
    const [queryFilter, setQueryFilter] = useState("");
    const [stageFilter, setStageFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState<ViewMode>("table");

    const filteredProjects = useMemo(
        () =>
            projects.filter((project) => {
                const normalizedQuery = queryFilter.trim().toLowerCase();
                const matchesQuery =
                    !normalizedQuery ||
                    [
                        project.name,
                        project.nextAction,
                        project.offer?.name,
                        project.opportunity.prospectEmail,
                        project.opportunity.prospectName,
                        project.projectType?.name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase()
                        .includes(normalizedQuery);
                const matchesStatus =
                    statusFilter === "all" || project.status === statusFilter;
                const matchesStage =
                    stageFilter === "all" || project.stage === stageFilter;

                return matchesQuery && matchesStatus && matchesStage;
            }),
        [projects, queryFilter, stageFilter, statusFilter],
    );

    return (
        <section className="grid gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Production
                    </p>
                    <h2 className="mt-1 text-h2 text-[color:var(--color-text-default)]">
                        Projets convertis
                    </h2>
                </div>
            </div>

            <DataViewToolbar
                countLabel={`${filteredProjects.length} projet(s) affiché(s) sur ${projects.length}`}
                className="xl:items-end"
                filtersClassName="md:grid-cols-2 xl:grid-cols-[minmax(280px,420px)_minmax(180px,230px)_minmax(180px,230px)]"
                viewMode={viewMode}
                onViewModeChange={(nextValue) => setViewMode(nextValue as ViewMode)}
                viewOptions={[
                    {
                        value: "table",
                        label: "Table",
                        icon: <List className="size-4" />,
                    },
                    {
                        value: "cards",
                        label: "Cartes",
                        icon: <Grid2X2 className="size-4" />,
                    },
                ]}
            >
                <TextField
                    label="Recherche"
                    value={queryFilter}
                    onChange={(event) => setQueryFilter(event.target.value)}
                    placeholder="Projet, client, action..."
                    iconLeft={<Search className="size-4" />}
                />
                <Select
                    label="Statut"
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    options={statusOptions}
                />
                <Select
                    label="Étape"
                    value={stageFilter}
                    onValueChange={setStageFilter}
                    options={stageOptions}
                />
            </DataViewToolbar>

            {filteredProjects.length > 0 ? (
                viewMode === "table" ? (
                    <ProjectsTable projects={filteredProjects} />
                ) : (
                    <ProjectsCards projects={filteredProjects} />
                )
            ) : (
                <EmptyProjects />
            )}
        </section>
    );
}

function ProjectsTable({ projects }: { projects: AdminProject[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="grid gap-4 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3 text-caption uppercase text-[color:var(--color-text-subtle)] xl:grid-cols-[minmax(0,1fr)_minmax(190px,230px)_minmax(240px,1fr)_128px]">
                <span>Projet</span>
                <span className="hidden xl:block">Statut</span>
                <span className="hidden xl:block">Prochaine action</span>
                <span className="hidden text-right xl:block">Actions</span>
            </div>
            <div className="divide-y divide-[color:var(--color-border-subtle)]">
                {projects.map((project) => (
                    <article
                        key={project.id}
                        className="grid gap-4 px-4 py-4 xl:grid-cols-[minmax(0,1fr)_minmax(190px,230px)_minmax(240px,1fr)_128px] xl:items-center"
                    >
                        <ProjectIdentity project={project} />
                        <ProjectStatus project={project} />
                        <ProjectNextAction project={project} />
                        <ProjectActions project={project} />
                    </article>
                ))}
            </div>
        </div>
    );
}

function ProjectsCards({ projects }: { projects: AdminProject[] }) {
    return (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {projects.map((project) => (
                <article
                    key={project.id}
                    className="flex min-h-[300px] flex-col justify-between rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                >
                    <div className="grid gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap gap-2">
                                    <Badge tone={getProjectStatusForAdmin(project.status).tone} size="sm">
                                        {getProjectStatusForAdmin(project.status).label}
                                    </Badge>
                                    <Badge tone="info" size="sm">
                                        {getProjectStage(project.stage).label}
                                    </Badge>
                                </div>
                                <h3 className="mt-3 line-clamp-2 text-h3 text-[color:var(--color-text-default)]">
                                    {project.name}
                                </h3>
                                <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                                    {project.opportunity.prospectName}
                                </p>
                            </div>
                            {project.hasActiveBlocker ? (
                                <Badge tone="danger" size="sm">
                                    Bloqué
                                </Badge>
                            ) : null}
                        </div>

                        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
                            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                                Prochaine action
                            </p>
                            <p className="mt-2 line-clamp-3 text-body-small text-[color:var(--color-text-default)]">
                                {project.nextAction ?? "À définir"}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <CompactProjectStat label="Lots" value={project._count.lots} />
                            <CompactProjectStat label="Tâches" value={project._count.tasks} />
                            <CompactProjectStat label="Validations" value={project._count.validations} />
                        </div>
                    </div>

                    <div className="mt-5">
                        <ProjectActions project={project} />
                    </div>
                </article>
            ))}
        </div>
    );
}

function ProjectIdentity({ project }: { project: AdminProject }) {
    return (
        <div className="min-w-0">
            <Link
                href={`/admin/projets/${project.id}`}
                className="line-clamp-1 text-label text-[color:var(--color-text-default)] no-underline hover:text-[color:var(--color-action-default)]"
            >
                {project.name}
            </Link>
            <p className="mt-1 line-clamp-1 text-caption text-[color:var(--color-text-subtle)]">
                {project.opportunity.prospectName} · {project.opportunity.prospectEmail}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
                {project.offer ? (
                    <Badge tone="brand" size="sm">
                        {project.offer.name}
                    </Badge>
                ) : null}
                {project.projectType ? (
                    <Badge tone="neutral" size="sm">
                        {project.projectType.name}
                    </Badge>
                ) : null}
            </div>
        </div>
    );
}

function ProjectStatus({ project }: { project: AdminProject }) {
    return (
        <div className="grid gap-2">
            <div className="flex flex-wrap gap-2">
                <Badge tone={getProjectStatusForAdmin(project.status).tone} size="sm">
                    {getProjectStatusForAdmin(project.status).label}
                </Badge>
                <Badge tone="info" size="sm">
                    {getProjectStage(project.stage).label}
                </Badge>
            </div>
            <p className="text-caption text-[color:var(--color-text-subtle)]">
                Mis à jour le {formatDate(project.updatedAt, "numeric")}
            </p>
            {project.hasActiveBlocker ? (
                <Badge tone="danger" size="sm" className="w-fit">
                    Blocage actif
                </Badge>
            ) : null}
        </div>
    );
}

function ProjectNextAction({ project }: { project: AdminProject }) {
    return (
        <p className="line-clamp-2 text-body-small text-[color:var(--color-text-default)]">
            {project.nextAction ?? "Prochaine action à définir"}
        </p>
    );
}

function ProjectActions({ project }: { project: AdminProject }) {
    return (
        <div className="flex shrink-0 justify-end gap-2">
            <ProjectActionLink
                href={`/admin/projets/${project.id}`}
                icon={<Map className="size-4" aria-hidden="true" />}
                label="Cockpit"
            />
            <ProjectActionLink
                href={`/admin/projets/${project.id}/timeline`}
                icon={<CalendarClock className="size-4" aria-hidden="true" />}
                label="Timeline"
            />
            <ProjectActionLink
                href={`/admin/projets/${project.id}/messages`}
                icon={<MessageSquareText className="size-4" aria-hidden="true" />}
                label="Messages"
            />
            <ProjectActionLink
                href={`/admin/projets/${project.id}/questionnaires`}
                icon={<FileCheck2 className="size-4" aria-hidden="true" />}
                label="Questionnaires"
            />
        </div>
    );
}

function ProjectActionLink({
    href,
    icon,
    label,
}: {
    href: string;
    icon: ReactNode;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]"
            title={label}
        >
            {icon}
            <span className="sr-only">{label}</span>
        </Link>
    );
}

function CompactProjectStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3">
            <p className="text-caption text-[color:var(--color-text-subtle)]">
                {label}
            </p>
            <p className="mt-1 text-label text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}

function ProjectMetric({
    icon,
    label,
    tone = "neutral",
    value,
}: {
    icon: ReactNode;
    label: string;
    tone?: "danger" | "info" | "neutral" | "success";
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

function EmptyProjects() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <p className="text-h3 text-[color:var(--color-text-default)]">
                Aucun projet dans cette vue.
            </p>
            <p className="mt-2 text-body text-[color:var(--color-text-muted)]">
                Convertis une demande commerciale pour créer une fiche projet.
            </p>
        </div>
    );
}

