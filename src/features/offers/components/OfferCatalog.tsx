"use client";

/* eslint-disable react-hooks/incompatible-library -- TanStack Table returns table helpers that React Compiler intentionally skips. */

import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import {
    Edit3,
    ExternalLink,
    Grid2X2,
    List,
    PackageOpen,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge, DataViewToolbar, Select } from "@/components/ui";
import { ConfirmDeleteButton } from "@/features/offers/components/ConfirmDeleteButton";
import { deleteOfferAction } from "@/server/offers/actions";

export type OfferCatalogFamily = {
    id: string;
    name: string;
    slug: string;
};

export type OfferCatalogOffer = {
    _count: {
        financialDocuments: number;
        opportunities: number;
        projects: number;
    };
    family: string;
    familyId: string | null;
    familyLabel: string;
    id: string;
    isActive: boolean;
    name: string;
    publicContent: {
        description: string;
        image: {
            alt: string;
            desktop: string;
            src: string;
            tablet: string;
        };
        price: string;
    } | null;
    publicHref: string | null;
    slug: string;
    sortOrder: number;
    startingPriceCents: number | null;
    startingPriceLabel: string | null;
};

type OfferCatalogProps = {
    families: OfferCatalogFamily[];
    offers: OfferCatalogOffer[];
};

type ViewMode = "cards" | "table";

export function OfferCatalog({ families, offers }: OfferCatalogProps) {
    const [familyFilter, setFamilyFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState<ViewMode>("table");

    const filteredOffers = useMemo(
        () =>
            offers.filter((offer) => {
                const matchesFamily =
                    familyFilter === "all" ||
                    offer.familyId === familyFilter ||
                    offer.family === familyFilter;
                const matchesStatus =
                    statusFilter === "all" ||
                    (statusFilter === "active" && offer.isActive) ||
                    (statusFilter === "standby" && !offer.isActive);

                return matchesFamily && matchesStatus;
            }),
        [familyFilter, offers, statusFilter],
    );

    return (
        <section className="grid gap-4">
            <div className="grid gap-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Catalogue
                        </p>
                        <h2 className="mt-1 text-h2 text-[color:var(--color-text-default)]">
                            Offres
                        </h2>
                    </div>
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {filteredOffers.length} offre(s) affichée(s) sur {offers.length}
                    </p>
                </div>

                <DataViewToolbar
                    viewMode={viewMode}
                    onViewModeChange={(nextValue) =>
                        setViewMode(nextValue as ViewMode)
                    }
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
                    <Select
                        label="Famille"
                        value={familyFilter}
                        onValueChange={setFamilyFilter}
                        options={[
                            { value: "all", label: "Toutes les familles" },
                            ...families.map((family) => ({
                                value: family.id,
                                label: family.name,
                            })),
                        ]}
                    />
                    <Select
                        label="Statut"
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                        options={[
                            { value: "all", label: "Tous les statuts" },
                            { value: "active", label: "Actives" },
                            { value: "standby", label: "Stand-by" },
                        ]}
                    />
                </DataViewToolbar>
            </div>

            {filteredOffers.length > 0 ? (
                viewMode === "table" ? (
                    <OfferTable offers={filteredOffers} />
                ) : (
                    <OfferCards offers={filteredOffers} />
                )
            ) : (
                <EmptyState />
            )}
        </section>
    );
}

function OfferTable({ offers }: { offers: OfferCatalogOffer[] }) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "name", desc: false },
    ]);

    const columns = useMemo<ColumnDef<OfferCatalogOffer>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Offre",
                cell: ({ row }) => <OfferIdentity offer={row.original} />,
            },
            {
                accessorKey: "familyLabel",
                header: "Famille",
                cell: ({ row }) => (
                    <span className="inline-flex whitespace-nowrap">
                        <Badge tone="info" size="sm" className="whitespace-nowrap">
                            {row.original.familyLabel}
                        </Badge>
                    </span>
                ),
            },
            {
                accessorKey: "isActive",
                header: "Statut",
                cell: ({ row }) => (
                    <span className="inline-flex whitespace-nowrap">
                        <Badge
                            tone={row.original.isActive ? "success" : "draft"}
                            size="sm"
                            className="whitespace-nowrap"
                        >
                            {row.original.isActive ? "Active" : "Stand-by"}
                        </Badge>
                    </span>
                ),
            },
            {
                id: "price",
                header: "Prix",
                cell: ({ row }) => (
                    <span className="line-clamp-2 text-caption text-[color:var(--color-text-subtle)]">
                        {getOfferPrice(row.original)}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => <OfferActions offer={row.original} />,
            },
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: offers,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    });

    return (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    Offres du catalogue
                </p>
                <button
                    type="button"
                    className="text-caption uppercase text-[color:var(--color-text-subtle)] hover:text-[color:var(--color-text-default)]"
                    onClick={table.getColumn("name")?.getToggleSortingHandler()}
                >
                    Tri nom
                    {table.getColumn("name")?.getIsSorted() === "asc"
                        ? " ↑"
                        : table.getColumn("name")?.getIsSorted() === "desc"
                            ? " ↓"
                            : ""}
                </button>
            </div>
            <div className="divide-y divide-[color:var(--color-border-subtle)]">
                {table.getRowModel().rows.map((row) => (
                    <article
                        key={row.id}
                        className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)_auto] md:items-center"
                    >
                        <OfferIdentity offer={row.original} />
                        <OfferMeta offer={row.original} />
                        <OfferActions offer={row.original} />
                    </article>
                ))}
            </div>
        </div>
    );
}

function OfferCards({ offers }: { offers: OfferCatalogOffer[] }) {
    return (
        <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {offers.map((offer) => (
                <article
                    key={offer.id}
                    className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]"
                >
                    <OfferCardBackground offer={offer} />
                    <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.42),rgba(10,8,5,0.72)_46%,rgba(10,8,5,0.94))]"
                        aria-hidden="true"
                    />
                    <div className="relative z-10 flex min-h-[360px] flex-col justify-between gap-8 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 pt-1">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex whitespace-nowrap">
                                        <Badge
                                            tone={offer.isActive ? "success" : "draft"}
                                            size="sm"
                                            className="whitespace-nowrap"
                                        >
                                            {offer.isActive ? "Active" : "Stand-by"}
                                        </Badge>
                                    </span>
                                    <span className="inline-flex whitespace-nowrap">
                                        <Badge tone="info" size="sm" className="whitespace-nowrap">
                                            {offer.familyLabel}
                                        </Badge>
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-full border border-white/10 bg-black/25 p-1 shadow-lg shadow-black/25 backdrop-blur-sm">
                                <OfferActions offer={offer} />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <p className="text-caption uppercase text-[color:var(--color-decor-gold)]">
                                    {getOfferPrice(offer)}
                                </p>
                                <h3 className="mt-2 text-h3 text-white">
                                    {offer.name}
                                </h3>
                                {offer.publicContent?.description ? (
                                    <p className="mt-2 line-clamp-2 text-body-small text-white/76">
                                        {offer.publicContent.description}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-body-small text-white/60">
                                        Aucun descriptif public relié pour le moment.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <CompactStat
                                    label="Opportunités"
                                    value={offer._count.opportunities}
                                    variant="overlay"
                                />
                                <CompactStat
                                    label="Projets"
                                    value={offer._count.projects}
                                    variant="overlay"
                                />
                                <CompactStat
                                    label="Docs"
                                    value={offer._count.financialDocuments}
                                    variant="overlay"
                                />
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

function OfferCardBackground({ offer }: { offer: OfferCatalogOffer }) {
    const image = offer.publicContent?.image;

    if (!image) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--color-surface-interactive),var(--color-bg-deep))] text-[color:var(--color-text-subtle)]">
                <PackageOpen className="size-10" aria-hidden="true" />
            </div>
        );
    }

    return (
        <picture className="absolute inset-0 block">
            <source media="(min-width: 1024px)" srcSet={image.desktop} />
            <source media="(min-width: 768px)" srcSet={image.tablet} />
            <img
                src={image.src}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                aria-hidden="true"
            />
        </picture>
    );
}
function OfferIdentity({ offer }: { offer: OfferCatalogOffer }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <OfferImage offer={offer} variant="thumb" />
            <div className="min-w-0">
                <p className="truncate text-label text-[color:var(--color-text-default)]">
                    {offer.name}
                </p>
                {offer.publicContent?.description ? (
                    <p className="mt-0.5 line-clamp-1 text-caption text-[color:var(--color-text-subtle)]">
                        {offer.publicContent.description}
                    </p>
                ) : (
                    <p className="mt-0.5 text-caption text-[color:var(--color-text-subtle)]">
                        {offer.slug}
                    </p>
                )}
            </div>
        </div>
    );
}

function OfferMeta({ offer }: { offer: OfferCatalogOffer }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2 md:justify-end">
            <Badge tone="info" size="sm" className="whitespace-nowrap">
                {offer.familyLabel}
            </Badge>
            <Badge
                tone={offer.isActive ? "success" : "draft"}
                size="sm"
                className="whitespace-nowrap"
            >
                {offer.isActive ? "Active" : "Stand-by"}
            </Badge>
            <span className="min-w-0 text-caption text-[color:var(--color-text-subtle)] md:basis-full md:text-right">
                {getOfferPrice(offer)}
            </span>
        </div>
    );
}

function OfferActions({ offer }: { offer: OfferCatalogOffer }) {
    const canDelete =
        offer._count.financialDocuments +
        offer._count.opportunities +
        offer._count.projects ===
        0;

    return (
        <div className="flex shrink-0 justify-end gap-2">
            {offer.publicHref ? (
                <Link
                    href={offer.publicHref}
                    className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                    title="Voir la page publique"
                >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    <span className="sr-only">Voir {offer.name}</span>
                </Link>
            ) : null}
            <Link
                href={`/admin/offres/${offer.id}/modifier`}
                className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]"
                title="Modifier"
            >
                <Edit3 className="size-4" aria-hidden="true" />
                <span className="sr-only">Modifier {offer.name}</span>
            </Link>
            <ConfirmDeleteButton
                action={deleteOfferAction}
                confirmDescription={`Cette action supprimera définitivement l'offre "${offer.name}" du catalogue CRM.`}
                confirmTitle="Supprimer cette offre ?"
                disabled={!canDelete}
                disabledTitle="Suppression impossible : cette offre est liée au CRM"
                id={offer.id}
                itemName={offer.name}
            />
        </div>
    );
}

function OfferImage({
    offer,
    variant,
}: {
    offer: OfferCatalogOffer;
    variant: "card" | "thumb";
}) {
    const image = offer.publicContent?.image;
    const sizeClasses =
        variant === "card"
            ? "h-20 w-full"
            : "size-12 rounded-xl";

    if (!image) {
        return (
            <span
                className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] text-[color:var(--color-text-subtle)]`}
                aria-hidden="true"
            >
                <PackageOpen className="size-5" />
            </span>
        );
    }

    return (
        <picture
            className={`${sizeClasses} block shrink-0 overflow-hidden border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)]`}
        >
            <source media="(min-width: 1024px)" srcSet={image.desktop} />
            <source media="(min-width: 768px)" srcSet={image.tablet} />
            <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
            />
        </picture>
    );
}

function CompactStat({
    label,
    value,
    variant = "default",
}: {
    label: string;
    value: number;
    variant?: "default" | "overlay";
}) {
    const isOverlay = variant === "overlay";

    return (
        <div
            className={
                isOverlay
                    ? "rounded-xl border border-white/10 bg-white/[0.07] p-3 shadow-inner shadow-white/5 backdrop-blur-sm"
                    : "rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3"
            }
        >
            <p
                className={
                    isOverlay
                        ? "text-caption text-white/58"
                        : "text-caption text-[color:var(--color-text-subtle)]"
                }
            >
                {label}
            </p>
            <p
                className={
                    isOverlay
                        ? "mt-1 text-label text-white"
                        : "mt-1 text-label text-[color:var(--color-text-default)]"
                }
            >
                {value}
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <PackageOpen
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucune offre dans cette vue.
            </p>
        </div>
    );
}

function getOfferPrice(offer: OfferCatalogOffer) {
    return (
        offer.publicContent?.price ??
        offer.startingPriceLabel ??
        formatPrice(offer.startingPriceCents) ??
        "Prix à cadrer"
    );
}

function formatPrice(value: number | null) {
    if (!value) return null;

    return `À partir de ${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(value / 100)}`;
}
