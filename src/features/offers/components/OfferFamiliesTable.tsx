"use client";

/* eslint-disable react-hooks/incompatible-library -- TanStack Table returns table helpers that React Compiler intentionally skips. */

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { Edit3, ExternalLink, FolderTree } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui";
import { ConfirmDeleteButton } from "@/features/offers/components/ConfirmDeleteButton";
import { deleteOfferFamilyAction } from "@/server/offers/actions";

export type OfferFamiliesTableFamily = {
    _count: {
        offers: number;
    };
    badge: string | null;
    description: string | null;
    eyebrow: string | null;
    id: string;
    imageAlt: string | null;
    imageDesktop: string | null;
    imageSrc: string | null;
    imageTablet: string | null;
    isActive: boolean;
    name: string;
    publicHref: string | null;
    slug: string;
    sortOrder: number;
    title: string | null;
};

type OfferFamiliesTableProps = {
    families: OfferFamiliesTableFamily[];
};

export function OfferFamiliesTable({ families }: OfferFamiliesTableProps) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "name", desc: false },
    ]);

    const columns = useMemo<ColumnDef<OfferFamiliesTableFamily>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Famille",
                cell: ({ row }) => <FamilyIdentity family={row.original} />,
            },
            {
                accessorKey: "isActive",
                header: "Statut",
                cell: ({ row }) => (
                    <span className="inline-flex whitespace-nowrap">
                        <Badge tone={row.original.isActive ? "success" : "draft"} size="sm">
                            {row.original.isActive ? "Active" : "Stand-by"}
                        </Badge>
                    </span>
                ),
            },
            {
                id: "offers",
                header: "Offres",
                cell: ({ row }) => (
                    <span className="text-caption text-[color:var(--color-text-subtle)]">
                        {row.original._count.offers}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => <FamilyActions family={row.original} />,
            },
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: families,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    });

    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border-subtle)] px-4 py-2.5">
                <div>
                    <p className="text-label text-[color:var(--color-text-default)]">
                        Familles du catalogue
                    </p>
                    <p className="text-caption text-[color:var(--color-text-subtle)]">
                        Image, description, statut et rattachement des offres.
                    </p>
                </div>
            </div>

            {families.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] table-fixed border-collapse">
                        <thead className="bg-[var(--color-surface-interactive)]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            scope="col"
                                            className={`border-b border-[color:var(--color-border-subtle)] px-4 py-2.5 text-left text-caption uppercase text-[color:var(--color-text-subtle)] ${getColumnWidthClass(header.id)}`}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <button
                                                    type="button"
                                                    className="text-left"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    {header.column.getIsSorted() === "asc"
                                                        ? " ↑"
                                                        : header.column.getIsSorted() === "desc"
                                                            ? " ↓"
                                                            : ""}
                                                </button>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-[color:var(--color-border-subtle)] last:border-b-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`align-middle px-4 py-2.5 text-body-small text-[color:var(--color-text-muted)] ${getColumnWidthClass(cell.column.id)}`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-6 text-body-small text-[color:var(--color-text-muted)]">
                    Aucune famille en base pour le moment.
                </div>
            )}
        </div>
    );
}

function FamilyIdentity({ family }: { family: OfferFamiliesTableFamily }) {
    return (
        <div className="flex min-w-[260px] items-center gap-3">
            <FamilyThumb family={family} />
            <div className="min-w-0">
                <p className="truncate text-label text-[color:var(--color-text-default)]">
                    {family.name}
                </p>
                {family.description ? (
                    <p className="mt-0.5 line-clamp-1 text-caption text-[color:var(--color-text-subtle)]">
                        {family.description}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

function getColumnWidthClass(columnId: string) {
    if (columnId === "name") return "w-[58%]";
    if (columnId === "isActive") return "w-[18%]";
    if (columnId === "offers") return "w-[10%]";
    if (columnId === "actions") return "w-[14%]";

    return "";
}

function FamilyActions({ family }: { family: OfferFamiliesTableFamily }) {
    const canDelete = family._count.offers === 0;
    const publicHref = family.publicHref || `/offres/${family.slug}`;

    return (
        <div className="flex justify-end gap-2">
            <Link
                href={publicHref}
                className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                title="Voir"
            >
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only">Voir {family.name}</span>
            </Link>
            <Link
                href={`/admin/offres/familles/${family.id}/modifier`}
                className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]"
                title="Modifier"
            >
                <Edit3 className="size-4" aria-hidden="true" />
                <span className="sr-only">Modifier {family.name}</span>
            </Link>
            <ConfirmDeleteButton
                action={deleteOfferFamilyAction}
                confirmDescription={`Cette action supprimera définitivement la famille "${family.name}". Elle ne sera plus disponible pour classer les offres.`}
                confirmTitle="Supprimer cette famille ?"
                disabled={!canDelete}
                disabledTitle="Suppression impossible : cette famille contient des offres"
                id={family.id}
                itemName={family.name}
            />
        </div>
    );
}

function FamilyThumb({ family }: { family: OfferFamiliesTableFamily }) {
    if (!family.imageSrc) {
        return (
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] text-[color:var(--color-text-subtle)]">
                <FolderTree className="size-5" aria-hidden="true" />
            </span>
        );
    }

    return (
        <picture className="block size-12 shrink-0 overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            {family.imageDesktop ? (
                <source media="(min-width: 1024px)" srcSet={family.imageDesktop} />
            ) : null}
            {family.imageTablet ? (
                <source media="(min-width: 768px)" srcSet={family.imageTablet} />
            ) : null}
            <img
                src={family.imageSrc}
                alt={family.imageAlt ?? ""}
                className="h-full w-full object-cover"
            />
        </picture>
    );
}
