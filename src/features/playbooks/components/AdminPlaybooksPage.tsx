"use client";

import { BookOpenCheck, Boxes, CheckCircle2, Eye, FileText, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import {
    Badge,
    Button,
    DataViewToolbar,
    Pagination,
    Select,
    TextField,
} from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { getPlaybookStatus } from "@/lib/status-labels";
import type { getAdminPlaybooks } from "@/server/playbooks/playbooks";

type AdminPlaybooksPageProps = {
    data: Awaited<ReturnType<typeof getAdminPlaybooks>>;
};

type Playbook = Awaited<ReturnType<typeof getAdminPlaybooks>>["playbooks"][number];

const PLAYBOOKS_PAGE_SIZE = 9;

const priorityOptions = [
    { value: "all", label: "Toutes les priorités" },
    { value: "PRIORITY", label: "Prioritaires" },
    { value: "PARKING", label: "Parking" },
];

const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "ACTIVE", label: "Actifs" },
    { value: "DRAFT", label: "Brouillons" },
    { value: "ARCHIVED", label: "Archivés" },
];

export function AdminPlaybooksPage({ data }: AdminPlaybooksPageProps) {
    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Commercial + Production"
                title="Playbooks"
                description="Contrôle la méthode commerciale et les méthodes de production. Le commercial pilote l’opportunité avant conversion ; la production démarre seulement après création du projet."
                metrics={
                    <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[640px]">
                        <MetricCard
                            icon={<BookOpenCheck className="size-4" aria-hidden="true" />}
                            label="Playbooks"
                            value={String(data.totals.playbooks)}
                        />
                        <MetricCard
                            icon={<Boxes className="size-4" aria-hidden="true" />}
                            label="Phases"
                            value={String(data.totals.phases)}
                        />
                        <MetricCard
                            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            label="Validations"
                            value={String(data.totals.gates)}
                        />
                        <MetricCard
                            icon={<FileText className="size-4" aria-hidden="true" />}
                            label="Livrables"
                            value={String(data.totals.deliverables)}
                        />
                    </div>
                }
            />

            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Règle de séparation
                        </p>
                        <p className="mt-2 max-w-[980px] text-body-small text-[color:var(--color-text-muted)]">
                            Le playbook commercial couvre demande, qualification, devis,
                            acompte et conversion. Les playbooks de production couvrent le
                            travail après conversion et restent appliqués uniquement par une
                            action admin explicite.
                        </p>
                    </div>
                    <Badge tone="info">Commercial avant production</Badge>
                </div>
            </section>

            <PlaybookCatalog playbooks={data.playbooks} />
        </AdminPageShell>
    );
}

function PlaybookCatalog({ playbooks }: { playbooks: Playbook[] }) {
    const [page, setPage] = useState(1);
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [queryFilter, setQueryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const typeOptions = useMemo(() => {
        const options = new Map<string, string>();

        playbooks.forEach((playbook) => {
            options.set(getPlaybookTypeKey(playbook), getPlaybookTypeLabel(playbook));
        });

        return [
            { value: "all", label: "Tous les domaines" },
            ...Array.from(options, ([value, label]) => ({ value, label })).sort(
                (left, right) => left.label.localeCompare(right.label),
            ),
        ];
    }, [playbooks]);

    const filteredPlaybooks = useMemo(
        () =>
            playbooks.filter((playbook) => {
                const normalizedQuery = queryFilter.trim().toLowerCase();
                const matchesQuery =
                    !normalizedQuery ||
                    [
                        playbook.name,
                        playbook.key,
                        playbook.description,
                        playbook.sourceProjectOsId,
                        playbook.sourceTemplateId,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase()
                        .includes(normalizedQuery);
                const matchesPriority =
                    priorityFilter === "all" || playbook.priority === priorityFilter;
                const matchesStatus =
                    statusFilter === "all" || playbook.status === statusFilter;
                const matchesType =
                    typeFilter === "all" || getPlaybookTypeKey(playbook) === typeFilter;

                return matchesQuery && matchesPriority && matchesStatus && matchesType;
            }),
        [playbooks, priorityFilter, queryFilter, statusFilter, typeFilter],
    );

    const totalPages = Math.ceil(filteredPlaybooks.length / PLAYBOOKS_PAGE_SIZE);
    const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
    const paginatedPlaybooks = filteredPlaybooks.slice(
        (safePage - 1) * PLAYBOOKS_PAGE_SIZE,
        safePage * PLAYBOOKS_PAGE_SIZE,
    );

    function resetPage() {
        setPage(1);
    }

    return (
        <section className="grid gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Référentiel
                    </p>
                    <h2 className="mt-1 text-h2 text-[color:var(--color-text-default)]">
                        Méthodes commerciales et production
                    </h2>
                </div>
                <p className="text-body-small text-[color:var(--color-text-muted)]">
                    {filteredPlaybooks.length} playbook(s) affiché(s) sur {playbooks.length}
                </p>
            </div>

            <DataViewToolbar
                filtersClassName="md:grid-cols-2 xl:grid-cols-[minmax(260px,420px)_minmax(170px,220px)_minmax(170px,220px)_minmax(190px,260px)]"
            >
                <TextField
                    label="Recherche"
                    value={queryFilter}
                    onChange={(event) => {
                        setQueryFilter(event.target.value);
                        resetPage();
                    }}
                    placeholder="Nom, méthode, offre..."
                    iconLeft={<Search className="size-4" />}
                />
                <Select
                    label="Priorité"
                    value={priorityFilter}
                    onValueChange={(nextValue) => {
                        setPriorityFilter(nextValue);
                        resetPage();
                    }}
                    options={priorityOptions}
                />
                <Select
                    label="Statut"
                    value={statusFilter}
                    onValueChange={(nextValue) => {
                        setStatusFilter(nextValue);
                        resetPage();
                    }}
                    options={statusOptions}
                />
                <Select
                    label="Domaine / type"
                    value={typeFilter}
                    onValueChange={(nextValue) => {
                        setTypeFilter(nextValue);
                        resetPage();
                    }}
                    options={typeOptions}
                />
            </DataViewToolbar>

            {filteredPlaybooks.length > 0 ? (
                <>
                    <PlaybookSections playbooks={paginatedPlaybooks} />
                    {filteredPlaybooks.length > PLAYBOOKS_PAGE_SIZE ? (
                        <Pagination
                            ariaLabel="Pagination des playbooks admin"
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

function PlaybookSections({ playbooks }: { playbooks: Playbook[] }) {
    const commercialPlaybooks = playbooks.filter(isRequestOsPlaybook);
    const productionPlaybooks = playbooks.filter(
        (playbook) => !isRequestOsPlaybook(playbook),
    );

    return (
        <div className="grid gap-4">
            {commercialPlaybooks.length ? (
                <PlaybookTable
                    description="Avant-projet : demande, qualification, devis, acompte et conversion."
                    playbooks={commercialPlaybooks}
                    title="Commercial"
                />
            ) : null}
            {productionPlaybooks.length ? (
                <PlaybookTable
                    description="Après conversion : production, livrables, validations et documents projet."
                    playbooks={productionPlaybooks}
                    title="Production"
                />
            ) : null}
        </div>
    );
}

function PlaybookTable({
    description,
    playbooks,
    title,
}: {
    description: string;
    playbooks: Playbook[];
    title: string;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="border-b border-[color:var(--color-border-subtle)] px-4 py-3">
                <p className="text-label text-[color:var(--color-text-default)]">
                    {title}
                </p>
                <p className="mt-1 text-caption text-[color:var(--color-text-muted)]">
                    {description}
                </p>
            </div>
            <div className="grid gap-3 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3 text-caption uppercase text-[color:var(--color-text-subtle)] md:grid-cols-[minmax(0,1fr)_minmax(260px,360px)_auto]">
                <span>Playbook</span>
                <span className="hidden md:block">Statut</span>
                <span className="hidden text-right md:block">Action</span>
            </div>
            <div className="divide-y divide-[color:var(--color-border-subtle)]">
                {playbooks.map((playbook) => (
                    <article
                        key={playbook.id}
                        className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(260px,360px)_auto] md:items-center"
                    >
                        <PlaybookIdentity playbook={playbook} />
                        <PlaybookStatus playbook={playbook} />
                        <PlaybookAction playbook={playbook} />
                    </article>
                ))}
            </div>
        </div>
    );
}

function PlaybookIdentity({ playbook }: { playbook: Playbook }) {
    return (
        <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] text-[color:var(--color-action-default)]">
                    <BookOpenCheck className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <p className="truncate text-label text-[color:var(--color-text-default)]">
                        {playbook.name}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-caption text-[color:var(--color-text-muted)]">
                        {playbook.description ??
                            (isRequestOsPlaybook(playbook)
                                ? "Méthode commerciale de référence."
                                : "Méthode de production issue de la Méthode Alchimiste.")}
                    </p>
                </div>
            </div>
        </div>
    );
}

function PlaybookStatus({ playbook }: { playbook: Playbook }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
            <PriorityBadge priority={playbook.priority} />
            <Badge tone="neutral" size="sm">
                {getPlaybookStatus(playbook.status).label}
            </Badge>
            <Badge tone="info" size="sm">
                {isRequestOsPlaybook(playbook)
                    ? "Commercial"
                    : getPlaybookTypeLabel(playbook)}
            </Badge>
        </div>
    );
}

function PlaybookAction({ playbook }: { playbook: Playbook }) {
    return (
        <div className="flex justify-start md:justify-end">
            <Button
                href={`/admin/playbooks/${playbook.id}`}
                variant="secondary"
                size="sm"
                iconLeft={<Eye className="size-4" aria-hidden="true" />}
            >
                Inspecter
            </Button>
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
                <span className="text-[color:var(--color-action-default)]">{icon}</span>
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
            <BookOpenCheck
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun playbook dans cette vue.
            </p>
            <p className="mx-auto mt-2 max-w-[520px] text-body-small text-[color:var(--color-text-muted)]">
                Ajuste les filtres ou relance la synchronisation des méthodes.
            </p>
        </div>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    return (
        <Badge tone={priority === "PRIORITY" ? "success" : "draft"} size="sm">
            {priority === "PRIORITY" ? "Prioritaire" : "Parking"}
        </Badge>
    );
}

function getPlaybookTypeKey(playbook: Playbook) {
    if (isRequestOsPlaybook(playbook)) return "request-os-commercial";

    return playbook.sourceProjectOsId ?? playbook.sourceTemplateId ?? playbook.key;
}

function getPlaybookTypeLabel(playbook: Playbook) {
    if (isRequestOsPlaybook(playbook)) return "Commercial";

    return formatKeyLabel(getPlaybookTypeKey(playbook));
}

function isRequestOsPlaybook(playbook: Playbook) {
    return (
        playbook.sourceTemplateId?.startsWith("request-os") ||
        getSnapshotKind(playbook.sourceSnapshot) === "request-os-playbook"
    );
}

function getSnapshotKind(sourceSnapshot: unknown) {
    return isRecord(sourceSnapshot) && typeof sourceSnapshot.kind === "string"
        ? sourceSnapshot.kind
        : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatKeyLabel(value: string) {
    return value
        .replace(/^template_/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
