"use client";

import {
    Archive,
    ArrowRight,
    CheckCircle2,
    Edit3,
    ExternalLink,
    GalleryHorizontalEnd,
    Grid2X2,
    Images,
    List,
    PauseCircle,
    RotateCcw,
    Search,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import {
    Badge,
    Button,
    ConfirmActionButton,
    DataViewToolbar,
    Pagination,
    Select,
    TextField,
    Toast,
} from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import {
    archivePortfolioProjectAction,
    restorePortfolioProjectAction,
} from "@/server/portfolio/actions";
import { getAdminRealisations } from "@/server/portfolio/realisations";

type AdminRealisationsPageProps = {
    data: Awaited<ReturnType<typeof getAdminRealisations>>;
    status?: string;
};

type PortfolioProject = Awaited<
    ReturnType<typeof getAdminRealisations>
>["realisations"][number];

type ViewMode = "table" | "cards";

const REALISATIONS_PAGE_SIZE = 9;

const kindOptions = [
    { value: "all", label: "Toutes les natures" },
    { value: "CLIENT", label: "Client" },
    { value: "DEMO", label: "Démo" },
    { value: "REFONTE", label: "Refonte" },
    { value: "CONCEPT", label: "Concept" },
];

const publicationOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "PUBLISHED", label: "Publiées" },
    { value: "DRAFT", label: "Brouillons" },
    { value: "STANDBY", label: "Stand-by" },
    { value: "ARCHIVED", label: "Archivées" },
];

export function AdminRealisationsPage({
    data,
    status,
}: AdminRealisationsPageProps) {
    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Portfolio"
                title="Réalisations"
                description="Pilote les cas portfolio depuis l’admin : nature, statut, images, preuves, ordre et publication future. Le site public reste alimenté par le contenu statique pendant ce sprint."
                actions={
                    <Button
                        href="/admin/realisations/nouvelle"
                        variant="primary"
                        size="sm"
                        iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    >
                        Nouvelle réalisation
                    </Button>
                }
                metrics={
                    <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[640px]">
                        <MetricCard
                            icon={<Images className="size-4" aria-hidden="true" />}
                            label="Cas"
                            value={String(data.totals.realisations)}
                        />
                        <MetricCard
                            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            label="Publiées"
                            value={String(data.totals.published)}
                        />
                        <MetricCard
                            icon={<Sparkles className="size-4" aria-hidden="true" />}
                            label="Brouillons"
                            value={String(data.totals.draft)}
                        />
                        <MetricCard
                            icon={<PauseCircle className="size-4" aria-hidden="true" />}
                            label="Stand-by"
                            value={String(data.totals.standby)}
                        />
                    </div>
                }
            />

            <PortfolioStatusMessage status={status} />

            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Règle de publication
                        </p>
                        <p className="mt-2 max-w-[960px] text-body-small text-[color:var(--color-text-muted)]">
                            Une réalisation client, une démo personnelle, une refonte et un concept ne racontent pas la même preuve. L’admin garde cette distinction claire avant tout futur branchement public.
                        </p>
                    </div>
                    <Badge tone="info">Public non branché à la DB</Badge>
                </div>
            </section>

            <PortfolioCatalog projects={data.realisations} />
        </AdminPageShell>
    );
}

function PortfolioCatalog({ projects }: { projects: PortfolioProject[] }) {
    const [queryFilter, setQueryFilter] = useState("");
    const [kindFilter, setKindFilter] = useState("all");
    const [offerFilter, setOfferFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState<ViewMode>("table");

    const offerOptions = useMemo(() => {
        const options = new Map<string, string>();

        projects.forEach((project) => {
            if (project.relatedOffer) {
                options.set(project.relatedOffer.id, project.relatedOffer.name);
            }
        });

        return [
            { value: "all", label: "Toutes les offres" },
            ...Array.from(options, ([value, label]) => ({ value, label })).sort(
                (left, right) => left.label.localeCompare(right.label),
            ),
        ];
    }, [projects]);

    const filteredProjects = useMemo(
        () =>
            projects.filter((project) => {
                const normalizedQuery = queryFilter.trim().toLowerCase();
                const matchesQuery =
                    !normalizedQuery ||
                    [
                        project.title,
                        project.slug,
                        project.shortDescription,
                        project.status,
                        project.typeLabel,
                        project.relatedOffer?.name,
                        ...project.tags,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase()
                        .includes(normalizedQuery);
                const matchesKind =
                    kindFilter === "all" || project.kind === kindFilter;
                const matchesStatus =
                    statusFilter === "all" ||
                    project.publicationStatus === statusFilter;
                const matchesOffer =
                    offerFilter === "all" || project.relatedOfferId === offerFilter;

                return matchesQuery && matchesKind && matchesStatus && matchesOffer;
            }),
        [kindFilter, offerFilter, projects, queryFilter, statusFilter],
    );
    const totalPages = Math.ceil(filteredProjects.length / REALISATIONS_PAGE_SIZE);
    const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
    const paginatedProjects = filteredProjects.slice(
        (safePage - 1) * REALISATIONS_PAGE_SIZE,
        safePage * REALISATIONS_PAGE_SIZE,
    );

    function resetPage() {
        setPage(1);
    }

    return (
        <section className="grid gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Portfolio
                    </p>
                    <h2 className="mt-1 text-h2 text-[color:var(--color-text-default)]">
                        Cas administrables
                    </h2>
                </div>
            </div>

            <DataViewToolbar
                countLabel={`${filteredProjects.length} réalisation(s) affichée(s) sur ${projects.length}`}
                className="xl:items-end"
                filtersClassName="md:grid-cols-2 xl:grid-cols-[minmax(280px,420px)_minmax(180px,230px)_minmax(170px,220px)_minmax(150px,180px)]"
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
                    onChange={(event) => {
                        setQueryFilter(event.target.value);
                        resetPage();
                    }}
                    placeholder="Titre, tag, offre..."
                    iconLeft={<Search className="size-4" />}
                />
                <Select
                    label="Nature"
                    value={kindFilter}
                    onValueChange={(nextValue) => {
                        setKindFilter(nextValue);
                        resetPage();
                    }}
                    options={kindOptions}
                />
                <Select
                    label="Offre / type"
                    value={offerFilter}
                    onValueChange={(nextValue) => {
                        setOfferFilter(nextValue);
                        resetPage();
                    }}
                    options={offerOptions}
                />
                <Select
                    label="Publication"
                    value={statusFilter}
                    onValueChange={(nextValue) => {
                        setStatusFilter(nextValue);
                        resetPage();
                    }}
                    options={publicationOptions}
                />
            </DataViewToolbar>

            {filteredProjects.length > 0 ? (
                <>
                    {viewMode === "table" ? (
                        <PortfolioProjectTable projects={paginatedProjects} />
                    ) : (
                        <PortfolioProjectCards projects={paginatedProjects} />
                    )}
                    {filteredProjects.length > REALISATIONS_PAGE_SIZE ? (
                        <Pagination
                            ariaLabel="Pagination des réalisations admin"
                            currentPage={safePage}
                            onPageChange={setPage}
                            totalPages={totalPages}
                        />
                    ) : null}
                </>
            ) : (
                <EmptyState />
            )}
        </section>
    );
}

function PortfolioProjectTable({ projects }: { projects: PortfolioProject[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="grid gap-3 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3 text-caption uppercase text-[color:var(--color-text-subtle)] md:grid-cols-[minmax(0,1fr)_minmax(210px,260px)_auto]">
                <span>Réalisation</span>
                <span className="hidden md:block">Statut</span>
                <span className="hidden text-right md:block">Actions</span>
            </div>
            <div className="divide-y divide-[color:var(--color-border-subtle)]">
                {projects.map((project) => (
                    <article
                        key={project.id}
                        className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(210px,260px)_auto] md:items-center"
                    >
                        <PortfolioIdentity project={project} />
                        <PortfolioMeta project={project} />
                        <PortfolioActions project={project} />
                    </article>
                ))}
            </div>
        </div>
    );
}

function PortfolioProjectCards({ projects }: { projects: PortfolioProject[] }) {
    return (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {projects.map((project) => (
                <article
                    key={project.id}
                    className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]"
                >
                    <PortfolioCardBackground project={project} />
                    <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.28),rgba(10,8,5,0.64)_42%,rgba(10,8,5,0.95))]"
                        aria-hidden="true"
                    />
                    <div className="relative z-10 flex min-h-[360px] flex-col justify-between gap-8 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-wrap gap-2">
                                <Badge tone={getPublicationTone(project.publicationStatus)} size="sm">
                                    {getPublicationLabel(project.publicationStatus)}
                                </Badge>
                                <Badge tone={getKindTone(project.kind)} size="sm">
                                    {getKindLabel(project.kind)}
                                </Badge>
                            </div>
                            <div className="rounded-full border border-white/10 bg-black/25 p-1 shadow-lg shadow-black/25 backdrop-blur-sm">
                                <PortfolioActions project={project} />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <p className="text-caption uppercase text-[color:var(--color-decor-gold)]">
                                    {getPortfolioTypeLabel(project)}
                                </p>
                                <h3 className="mt-2 text-h3 text-white">
                                    {project.title}
                                </h3>
                                <p className="mt-2 line-clamp-3 text-body-small text-white/76">
                                    {project.shortDescription}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} tone="neutral" size="sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

function PortfolioIdentity({ project }: { project: PortfolioProject }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <span
                className="block size-14 shrink-0 overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-cover bg-center"
                style={{
                    backgroundImage: project.coverImageUrl
                        ? `url(${project.coverImageUrl})`
                        : undefined,
                }}
                aria-hidden="true"
            >
                {!project.coverImageUrl ? (
                    <span className="flex size-full items-center justify-center text-[color:var(--color-text-subtle)]">
                        <GalleryHorizontalEnd className="size-5" />
                    </span>
                ) : null}
            </span>
            <div className="min-w-0">
                <p className="truncate text-label text-[color:var(--color-text-default)]">
                    {project.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-caption text-[color:var(--color-text-subtle)]">
                    {project.shortDescription}
                </p>
            </div>
        </div>
    );
}

function PortfolioMeta({ project }: { project: PortfolioProject }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2 md:justify-end">
            <Badge tone={getPublicationTone(project.publicationStatus)} size="sm">
                {getPublicationLabel(project.publicationStatus)}
            </Badge>
            <Badge tone={getKindTone(project.kind)} size="sm">
                {getKindLabel(project.kind)}
            </Badge>
            {getPortfolioTypeLabel(project) !== "Réalisation" ? (
                <span className="min-w-0 text-caption text-[color:var(--color-text-subtle)] md:basis-full md:text-right">
                    {getPortfolioTypeLabel(project)}
                </span>
            ) : null}
        </div>
    );
}

function PortfolioActions({ project }: { project: PortfolioProject }) {
    return (
        <div className="flex shrink-0 justify-end gap-2">
            {project.publicHref ? (
                <Link
                    href={project.publicHref}
                    className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                    title="Voir la page publique"
                >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    <span className="sr-only">Voir {project.title}</span>
                </Link>
            ) : null}
            <Link
                href={`/admin/realisations/${project.id}/modifier`}
                className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]"
                title="Modifier"
            >
                <Edit3 className="size-4" aria-hidden="true" />
                <span className="sr-only">Modifier {project.title}</span>
            </Link>
            {project.publicationStatus === "ARCHIVED" ? (
                <ConfirmActionButton
                    action={restorePortfolioProjectAction}
                    confirmDescription={`Cette action remettra "${project.title}" en stand-by dans le portfolio admin.`}
                    confirmIcon={<RotateCcw className="size-4" aria-hidden="true" />}
                    confirmLabel="Remettre en stand-by"
                    confirmTitle="Restaurer cette réalisation ?"
                    id={project.id}
                    itemName={project.title}
                    tone="info"
                    triggerIcon={<RotateCcw className="size-4" aria-hidden="true" />}
                    triggerTitle="Restaurer"
                />
            ) : (
                <ConfirmActionButton
                    action={archivePortfolioProjectAction}
                    confirmDescription={`Cette action archivera "${project.title}" dans l’admin sans supprimer le contenu public ni les images.`}
                    confirmIcon={<Archive className="size-4" aria-hidden="true" />}
                    confirmLabel="Archiver"
                    confirmTitle="Archiver cette réalisation ?"
                    id={project.id}
                    itemName={project.title}
                    tone="danger"
                    triggerIcon={<Archive className="size-4" aria-hidden="true" />}
                    triggerTitle="Archiver"
                />
            )}
        </div>
    );
}

function PortfolioCardBackground({ project }: { project: PortfolioProject }) {
    if (!project.coverImageUrl) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--color-surface-interactive),var(--color-bg-deep))] text-[color:var(--color-text-subtle)]">
                <GalleryHorizontalEnd className="size-10" aria-hidden="true" />
            </div>
        );
    }

    return (
        <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${project.coverImageUrl})` }}
            aria-hidden="true"
        />
    );
}

function PortfolioStatusMessage({ status }: { status?: string }) {
    if (!status) return null;

    const messages: Record<
        string,
        { message: string; title: string; tone: "danger" | "success" | "warning" }
    > = {
        archived: {
            message: "La réalisation est archivée dans l’admin, sans suppression du contenu public.",
            title: "Réalisation archivée",
            tone: "warning",
        },
        created: {
            message: "La réalisation est disponible dans le portfolio admin.",
            title: "Réalisation créée",
            tone: "success",
        },
        "duplicate-slug": {
            message: "Une réalisation utilise déjà ce slug.",
            title: "Slug déjà utilisé",
            tone: "danger",
        },
        "invalid-slug": {
            message: "Renseigne un titre ou un slug exploitable.",
            title: "Slug invalide",
            tone: "danger",
        },
        "missing-project": {
            message: "La réalisation demandée est introuvable.",
            title: "Réalisation introuvable",
            tone: "danger",
        },
        restored: {
            message: "La réalisation est remise en stand-by.",
            title: "Réalisation restaurée",
            tone: "success",
        },
        updated: {
            message: "La réalisation a bien été mise à jour.",
            title: "Réalisation mise à jour",
            tone: "success",
        },
    };

    const feedback = messages[status];
    if (!feedback) return null;

    return (
        <Toast
            autoDismiss
            dismissible
            durationMs={6500}
            placement="bottom-right"
            showProgress
            tone={feedback.tone}
            title={feedback.title}
        >
            {feedback.message}
        </Toast>
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
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-10 text-center">
            <Images
                className="mx-auto size-10 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <h2 className="mt-4 text-h3 text-[color:var(--color-text-default)]">
                Aucune réalisation dans cette vue.
            </h2>
            <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                Crée une réalisation ou ajuste les filtres.
            </p>
        </div>
    );
}

function getPortfolioTypeLabel(project: PortfolioProject) {
    return project.relatedOffer?.name ?? project.typeLabel ?? "Réalisation";
}

function getPublicationLabel(value: string) {
    const labels: Record<string, string> = {
        ARCHIVED: "Archivée",
        DRAFT: "Brouillon",
        PUBLISHED: "Publiée",
        STANDBY: "Stand-by",
    };

    return labels[value] ?? value;
}

function getKindLabel(value: string) {
    const labels: Record<string, string> = {
        CLIENT: "Client",
        CONCEPT: "Concept",
        DEMO: "Démo",
        REFONTE: "Refonte",
    };

    return labels[value] ?? value;
}

function getPublicationTone(value: string) {
    if (value === "PUBLISHED") return "success";
    if (value === "STANDBY") return "warning";
    if (value === "ARCHIVED") return "draft";

    return "neutral" as const;
}

function getKindTone(value: string) {
    if (value === "CLIENT") return "success";
    if (value === "DEMO") return "info";
    if (value === "REFONTE") return "warning";

    return "neutral" as const;
}
