"use client";

/* eslint-disable react-hooks/incompatible-library -- TanStack Table returns table helpers that React Compiler intentionally skips. */

import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { formatDistanceToNowStrict, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarClock, Eye, Map } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import {
    getOpportunityPriority,
    getOpportunityStatus,
} from "@/lib/status-labels";
import type { CrmCommercialProgress } from "@/server/crm/opportunities";

export type RequestsPipelineTableOpportunity = {
    commercialProgress: CrmCommercialProgress | null;
    commercialBlocker: string | null;
    clientAccount: {
        id: string;
        name: string;
        status: string;
        type: string;
    } | null;
    contact: {
        email: string;
        firstName: string | null;
        id: string;
        lastName: string | null;
        status: string;
    } | null;
    convertedProject: {
        id: string;
        name: string;
    } | null;
    createdAt: string;
    estimatedBudgetRange: string | null;
    estimatedValueCents: number | null;
    fit: string;
    id: string;
    lastContactAt: string | null;
    nextAction: string | null;
    nextFollowUpAt: string | null;
    nextGate: string | null;
    notes: string | null;
    objective: string | null;
    offer: { id: string; name: string } | null;
    offerId: string | null;
    organizationName: string | null;
    phase: string;
    priority: string;
    probability: number | null;
    projectTypeId: string | null;
    projectRequest: {
        projectTypeLabel: string | null;
        requestId: string;
    } | null;
    projectType: { id: string; name: string } | null;
    prospectEmail: string;
    prospectName: string;
    qualificationScore: number | null;
    rawNeed: string | null;
    readyToConvert: boolean;
    source: string | null;
    status: string;
    title: string;
    updatedAt: string;
};

type RequestsPipelineTableProps = {
    opportunities: RequestsPipelineTableOpportunity[];
};

export function RequestsPipelineTable({ opportunities }: RequestsPipelineTableProps) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);

    const columns = useMemo<ColumnDef<RequestsPipelineTableOpportunity>[]>(
        () => [
            {
                accessorKey: "updatedAt",
                header: "Mise à jour",
            },
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: opportunities,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    });

    if (opportunities.length === 0) {
        return (
            <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
                <p className="text-h3 text-[color:var(--color-text-default)]">
                    Aucune opportunité dans cette vue.
                </p>
                <p className="mt-2 text-body text-[color:var(--color-text-muted)]">
                    Change un filtre ou attends une nouvelle demande projet.
                </p>
            </div>
        );
    }

    return (
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3">
                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                    Opportunités commerciales
                </p>
                <button
                    type="button"
                    className="text-caption uppercase text-[color:var(--color-text-subtle)] hover:text-[color:var(--color-text-default)]"
                    onClick={table.getColumn("updatedAt")?.getToggleSortingHandler()}
                >
                    Tri mise à jour
                    {table.getColumn("updatedAt")?.getIsSorted() === "asc"
                        ? " ↑"
                        : table.getColumn("updatedAt")?.getIsSorted() === "desc"
                            ? " ↓"
                            : ""}
                </button>
            </div>

            <div className="hidden border-b border-[color:var(--color-border-subtle)] px-4 py-2 text-caption uppercase text-[color:var(--color-text-subtle)] lg:grid lg:grid-cols-[minmax(210px,1fr)_minmax(240px,1fr)_72px] lg:gap-4 xl:grid-cols-[minmax(260px,1fr)_minmax(190px,220px)_minmax(220px,0.85fr)_76px] 2xl:grid-cols-[minmax(360px,1fr)_minmax(240px,0.78fr)_minmax(360px,1fr)_minmax(220px,0.7fr)_96px] 2xl:gap-6 2xl:px-6">
                <span>Demande</span>
                <span className="xl:hidden">Suivi</span>
                <span className="hidden xl:block">Avancement</span>
                <span className="hidden xl:block">Action à faire</span>
                <span className="hidden 2xl:block">Relance</span>
                <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-[color:var(--color-border-subtle)]">
                {table.getRowModel().rows.map((row) => (
                    <article
                        key={row.id}
                        className="grid min-w-0 gap-4 px-4 py-4 lg:grid-cols-[minmax(210px,1fr)_minmax(240px,1fr)_72px] lg:items-center lg:gap-4 xl:grid-cols-[minmax(260px,1fr)_minmax(190px,220px)_minmax(220px,0.85fr)_76px] 2xl:grid-cols-[minmax(360px,1fr)_minmax(240px,0.78fr)_minmax(360px,1fr)_minmax(220px,0.7fr)_96px] 2xl:gap-6 2xl:px-6 2xl:py-5"
                    >
                        <OpportunityIdentity opportunity={row.original} />
                        <div className="grid min-w-0 gap-3 xl:contents">
                            <PipelineState opportunity={row.original} />
                            <NextAction opportunity={row.original} hideFollowUpOnWide />
                            <FollowUpCell opportunity={row.original} />
                        </div>
                        <OpportunityActions opportunity={row.original} />
                    </article>
                ))}
            </div>
        </div>
    );
}

function OpportunityIdentity({
    opportunity,
}: {
    opportunity: RequestsPipelineTableOpportunity;
}) {
    return (
        <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                    <Link
                        href={`/admin/demandes/${opportunity.id}`}
                        className="line-clamp-1 text-label text-[color:var(--color-text-default)] no-underline hover:text-[color:var(--color-action-default)]"
                    >
                        {opportunity.title}
                    </Link>
                    <p className="mt-1 line-clamp-1 text-caption text-[color:var(--color-text-subtle)]">
                        {opportunity.prospectName}
                        {opportunity.organizationName
                            ? ` · ${opportunity.organizationName}`
                            : ""}
                    </p>
                </div>
                {opportunity.convertedProject ? (
                    <Badge tone="success" size="sm" className="shrink-0 whitespace-nowrap">
                        Projet
                    </Badge>
                ) : null}
            </div>
            <p className="line-clamp-1 text-caption text-[color:var(--color-text-subtle)]">
                {opportunity.prospectEmail}
            </p>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                {opportunity.offer ? (
                    <Badge tone="brand" size="sm" className="max-w-full">
                        <span className="truncate">{opportunity.offer.name}</span>
                    </Badge>
                ) : (
                    <Badge tone="neutral" size="sm">
                        Offre à confirmer
                    </Badge>
                )}
                <span className="text-caption text-[color:var(--color-text-subtle)]">
                    {formatOpportunityValue(opportunity)}
                </span>
            </div>
        </div>
    );
}

function PipelineState({
    opportunity,
}: {
    opportunity: RequestsPipelineTableOpportunity;
}) {
    const progressPercent = getCommercialProgressPercent(opportunity);
    const currentStep =
        opportunity.commercialProgress?.currentStep.title ??
        getOpportunityStatus(opportunity.status).label;

    return (
        <div className="grid min-w-0 gap-2">
            <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                <Badge
                    tone={getOpportunityStatus(opportunity.status).tone}
                    size="sm"
                    className="whitespace-nowrap"
                >
                    {getOpportunityStatus(opportunity.status).label}
                </Badge>
                <Badge
                    tone={getOpportunityPriority(opportunity.priority).tone}
                    size="sm"
                    className="whitespace-nowrap"
                >
                    {getOpportunityPriority(opportunity.priority).label}
                </Badge>
            </div>
            <div className="grid gap-1">
                <div className="flex items-center justify-between gap-2 text-caption text-[color:var(--color-text-subtle)]">
                    <span>Avancement de la demande</span>
                    <span className="line-clamp-1 text-right">{currentStep}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-default)]">
                    <span
                        className={`block h-full rounded-full ${
                            progressPercent < 55
                                ? "bg-[var(--color-warning-solid)]"
                                : "bg-[var(--color-success-solid)]"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
            <p className="text-caption text-[color:var(--color-text-subtle)]">
                Mis à jour le {formatDate(new Date(opportunity.updatedAt), "abbr")}
            </p>
        </div>
    );
}

function NextAction({
    hideFollowUpOnWide = false,
    opportunity,
}: {
    hideFollowUpOnWide?: boolean;
    opportunity: RequestsPipelineTableOpportunity;
}) {
    const hasNextAction = Boolean(opportunity.nextAction?.trim());
    const followUp = opportunity.nextFollowUpAt
        ? new Date(opportunity.nextFollowUpAt)
        : null;
    const isOverdue = followUp ? isPast(followUp) : false;

    return (
        <div className="grid min-w-0 gap-2">
            {hasNextAction ? (
                <p className="line-clamp-2 text-body-small text-[color:var(--color-text-default)]">
                    {opportunity.nextAction}
                </p>
            ) : (
                <Badge tone="danger" className="w-fit">
                    Action manquante
                </Badge>
            )}
            <div
                className={`flex items-center gap-2 text-caption ${
                    hideFollowUpOnWide ? "2xl:hidden" : ""
                }`}
            >
                <CalendarClock className="size-4 text-[color:var(--color-text-subtle)]" />
                {followUp ? (
                    <span
                        className={
                            isOverdue
                                ? "text-[color:var(--color-danger-text)]"
                                : "text-[color:var(--color-text-subtle)]"
                        }
                    >
                        Relance {formatDistanceToNowStrict(followUp, {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </span>
                ) : (
                    <span className="text-[color:var(--color-text-subtle)]">
                        Relance à dater
                    </span>
                )}
            </div>
            {opportunity.commercialBlocker ? (
                <Badge
                    tone="warning"
                    size="sm"
                    className={`w-fit ${hideFollowUpOnWide ? "2xl:hidden" : ""}`}
                >
                    Blocage commercial
                </Badge>
            ) : null}
        </div>
    );
}

function FollowUpCell({
    opportunity,
}: {
    opportunity: RequestsPipelineTableOpportunity;
}) {
    const followUp = opportunity.nextFollowUpAt
        ? new Date(opportunity.nextFollowUpAt)
        : null;
    const isOverdue = followUp ? isPast(followUp) : false;

    return (
        <div className="hidden min-w-0 gap-2 2xl:grid">
            <div className="flex items-center gap-2 text-caption">
                <CalendarClock className="size-4 text-[color:var(--color-text-subtle)]" />
                {followUp ? (
                    <span
                        className={
                            isOverdue
                                ? "text-[color:var(--color-danger-text)]"
                                : "text-[color:var(--color-text-subtle)]"
                        }
                    >
                        {formatDistanceToNowStrict(followUp, {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </span>
                ) : (
                    <span className="text-[color:var(--color-text-subtle)]">
                        À dater
                    </span>
                )}
            </div>
            {opportunity.commercialBlocker ? (
                <Badge tone="warning" size="sm" className="w-fit whitespace-nowrap">
                    Blocage à lever
                </Badge>
            ) : null}
        </div>
    );
}

function OpportunityActions({
    opportunity,
}: {
    opportunity: RequestsPipelineTableOpportunity;
}) {
    return (
        <div className="flex min-w-0 shrink-0 justify-end gap-2">
            <Link
                href={`/admin/demandes/${opportunity.id}`}
                className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-default)]"
                title="Ouvrir la fiche commerciale"
            >
                <Eye className="size-4" aria-hidden="true" />
                <span className="sr-only">Ouvrir {opportunity.title}</span>
            </Link>
            {opportunity.convertedProject ? (
                <Link
                    href={`/admin/projets/${opportunity.convertedProject.id}/roadmap`}
                    className="focus-ring inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition hover:bg-[var(--color-surface-interactive)] hover:text-[color:var(--color-text-default)]"
                    title="Ouvrir la roadmap projet"
                >
                    <Map className="size-4" aria-hidden="true" />
                    <span className="sr-only">
                        Ouvrir la roadmap {opportunity.convertedProject.name}
                    </span>
                </Link>
            ) : (
                <span
                    className="inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-disabled)]"
                    title="Roadmap disponible après conversion"
                >
                    <Map className="size-4" aria-hidden="true" />
                    <span className="sr-only">Roadmap disponible après conversion</span>
                </span>
            )}
        </div>
    );
}

function getCommercialProgressPercent(
    opportunity: RequestsPipelineTableOpportunity,
) {
    return opportunity.commercialProgress?.completionPercent ?? 0;
}

function formatOpportunityValue(opportunity: RequestsPipelineTableOpportunity) {
    if (opportunity.estimatedValueCents !== null) {
        return new Intl.NumberFormat("fr-FR", {
            currency: "EUR",
            maximumFractionDigits: 0,
            style: "currency",
        }).format(opportunity.estimatedValueCents / 100);
    }

    return opportunity.estimatedBudgetRange ?? "Budget à cadrer";
}
