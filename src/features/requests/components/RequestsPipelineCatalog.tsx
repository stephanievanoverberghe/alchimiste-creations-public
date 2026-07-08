"use client";

import {
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    Grid2X2,
    List,
    Map,
} from "lucide-react";
import { formatDistanceToNowStrict, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";

import { Badge, Button, DataViewToolbar, Select } from "@/components/ui";
import {
    RequestsPipelineTable,
    type RequestsPipelineTableOpportunity,
} from "@/features/requests/components/RequestsPipelineTable";
import { requestViewOptions } from "@/features/requests/lib/opportunity-labels";
import {
    getOpportunityPriority,
    getOpportunityStatus,
} from "@/lib/status-labels";
import type { getCrmPipeline as getRequestsPipeline } from "@/server/crm/opportunities";

type RequestsPipelineCatalogProps = {
    offers: Awaited<ReturnType<typeof getRequestsPipeline>>["offers"];
    opportunities: RequestsPipelineTableOpportunity[];
    statusCounts: Awaited<ReturnType<typeof getRequestsPipeline>>["statusCounts"];
};

type ViewMode = "table" | "cards";

export function RequestsPipelineCatalog({
    offers,
    opportunities,
    statusCounts,
}: RequestsPipelineCatalogProps) {
    const [offerFilter, setOfferFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [viewFilter, setViewFilter] = useState("all");

    const filteredOpportunities = useMemo(
        () =>
            opportunities.filter((opportunity) => {
                const matchesView = matchesPipelineView(opportunity, viewFilter);
                const matchesStatus =
                    statusFilter === "all" || opportunity.status === statusFilter;
                const matchesOffer =
                    offerFilter === "all" || opportunity.offerId === offerFilter;

                return matchesView && matchesStatus && matchesOffer;
            }),
        [offerFilter, opportunities, statusFilter, viewFilter],
    );

    return (
        <section className="grid gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Tunnel commercial
                    </p>
                    <h2 className="mt-1 text-h2 text-[color:var(--color-text-default)]">
                        Opportunités
                    </h2>
                </div>
            </div>

            <DataViewToolbar
                countLabel={`${filteredOpportunities.length} opportunité(s) affichée(s) sur ${opportunities.length}`}
                className="lg:items-end"
                filtersClassName="md:grid-cols-3 lg:grid-cols-[minmax(120px,0.75fr)_minmax(160px,1fr)_minmax(170px,1.1fr)] xl:grid-cols-[minmax(150px,0.8fr)_minmax(180px,1fr)_minmax(200px,1.15fr)]"
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
                <Select
                    label="Suivi"
                    value={viewFilter}
                    onValueChange={setViewFilter}
                    options={[...requestViewOptions]}
                />
                <Select
                    label="Statut"
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    options={[
                        { value: "all", label: "Tous les statuts" },
                        ...Object.entries(statusCounts).map(([status, count]) => ({
                            value: status,
                            label: `${getOpportunityStatus(status).label} (${count})`,
                        })),
                    ]}
                />
                <Select
                    label="Offre"
                    value={offerFilter}
                    onValueChange={setOfferFilter}
                    options={[
                        { value: "all", label: "Toutes les offres" },
                        ...offers.map((offer) => ({
                            value: offer.id,
                            label: offer.name,
                        })),
                    ]}
                />
            </DataViewToolbar>

            {filteredOpportunities.length > 0 ? (
                viewMode === "table" ? (
                    <RequestsPipelineTable opportunities={filteredOpportunities} />
                ) : (
                    <RequestsPipelineCards opportunities={filteredOpportunities} />
                )
            ) : (
                <EmptyState />
            )}
        </section>
    );
}

function RequestsPipelineCards({
    opportunities,
}: {
    opportunities: RequestsPipelineTableOpportunity[];
}) {
    return (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {opportunities.map((opportunity) => {
                const progressPercent = getCommercialProgressPercent(opportunity);
                const currentStep =
                    opportunity.commercialProgress?.currentStep.title ??
                    getOpportunityStatus(opportunity.status).label;
                const followUp = opportunity.nextFollowUpAt
                    ? new Date(opportunity.nextFollowUpAt)
                    : null;
                const followUpIsOverdue = followUp ? isPast(followUp) : false;

                return (
                    <article
                        key={opportunity.id}
                        className="group flex min-h-[390px] flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]"
                    >
                        <div className="border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            tone={getOpportunityStatus(opportunity.status).tone}
                                            size="sm"
                                        >
                                            {getOpportunityStatus(opportunity.status).label}
                                        </Badge>
                                        <Badge
                                            tone={getOpportunityPriority(opportunity.priority).tone}
                                            size="sm"
                                        >
                                            {getOpportunityPriority(opportunity.priority).label}
                                        </Badge>
                                    </div>
                                    <h3 className="mt-3 line-clamp-2 text-h3 text-[color:var(--color-text-default)]">
                                        {opportunity.title}
                                    </h3>
                                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                                        {opportunity.prospectName}
                                        {opportunity.organizationName
                                            ? ` · ${opportunity.organizationName}`
                                            : ""}
                                    </p>
                                </div>
                                {opportunity.convertedProject ? (
                                    <Badge tone="success" size="sm">
                                        Projet créé
                                    </Badge>
                                ) : (
                                    <Badge tone="neutral" size="sm">
                                        Commercial
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="grid flex-1 gap-4 p-4">
                            <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
                                <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                                    Prochaine action
                                </p>
                                {opportunity.nextAction?.trim() ? (
                                    <p className="mt-2 line-clamp-3 text-body-small text-[color:var(--color-text-default)]">
                                        {opportunity.nextAction}
                                    </p>
                                ) : (
                                    <Badge tone="danger" className="mt-2">
                                        Action manquante
                                    </Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <RequestCardInfo
                                    label="Avancement"
                                    value={currentStep}
                                    tone={progressPercent < 55 ? "warning" : "success"}
                                />
                                <RequestCardInfo
                                    label="Valeur"
                                    value={getBudgetLabel(opportunity)}
                                />
                                <RequestCardInfo
                                    label="Offre"
                                    value={opportunity.offer?.name ?? "À confirmer"}
                                />
                                <RequestCardInfo
                                    label="Relance"
                                    value={getFollowUpLabel(followUp)}
                                    tone={
                                        followUpIsOverdue
                                            ? "danger"
                                            : followUp
                                                ? "info"
                                                : "neutral"
                                    }
                                />
                            </div>

                            {opportunity.commercialBlocker ? (
                                <div className="rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-3">
                                    <p className="text-caption uppercase text-[color:var(--color-warning-text)]">
                                        Blocage à lever
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-body-small text-[color:var(--color-warning-text)]">
                                        {opportunity.commercialBlocker}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--color-border-subtle)] p-4">
                            <div className="flex items-center gap-2 text-caption text-[color:var(--color-text-subtle)]">
                                {opportunity.convertedProject ? (
                                    <CheckCircle2 className="size-4 text-[color:var(--color-success-text)]" />
                                ) : (
                                    <CalendarClock className="size-4" />
                                )}
                                <span>
                                    {opportunity.convertedProject
                                        ? "À piloter côté projets"
                                        : "À piloter côté commercial"}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    href={`/admin/demandes/${opportunity.id}`}
                                    variant="secondary"
                                    size="sm"
                                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                                >
                                    Fiche
                                </Button>
                                {opportunity.convertedProject ? (
                                    <Button
                                        href={`/admin/projets/${opportunity.convertedProject.id}/roadmap`}
                                        variant="secondary"
                                        size="sm"
                                        iconRight={<Map className="size-4" aria-hidden="true" />}
                                    >
                                        Roadmap
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

function RequestCardInfo({
    label,
    tone = "neutral",
    value,
}: {
    label: string;
    tone?: "danger" | "info" | "neutral" | "success" | "warning";
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-3">
            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {label}
            </p>
            <p
                className={`mt-1 line-clamp-2 text-label ${
                    tone === "danger"
                        ? "text-[color:var(--color-danger-text)]"
                        : tone === "warning"
                            ? "text-[color:var(--color-warning-text)]"
                            : tone === "success"
                                ? "text-[color:var(--color-success-text)]"
                                : tone === "info"
                                    ? "text-[color:var(--color-info-text)]"
                                    : "text-[color:var(--color-text-default)]"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function EmptyState() {
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

function matchesPipelineView(
    opportunity: RequestsPipelineCatalogProps["opportunities"][number],
    view: string,
) {
    if (view === "all") return true;
    if (view === "new") return opportunity.status === "NOUVEAU";
    if (view === "qualification") {
        return [
            "A_QUALIFIER",
            "APPEL_A_PLANIFIER",
            "APPEL_PREVU",
            "CADRAGE_A_PRODUIRE",
        ].includes(opportunity.status);
    }
    if (view === "followups") {
        return (
            opportunity.status === "RELANCE_A_FAIRE" ||
            Boolean(
                opportunity.nextFollowUpAt &&
                    new Date(opportunity.nextFollowUpAt).getTime() <= Date.now(),
            )
        );
    }
    if (view === "quotes") {
        return [
            "PROPOSITION_A_ENVOYER",
            "DEVIS_ENVOYE",
            "NEGOCIATION_AJUSTEMENT",
        ].includes(opportunity.status);
    }
    if (view === "accepted") return opportunity.status === "ACCEPTE";

    return true;
}

function getCommercialProgressPercent(
    opportunity: RequestsPipelineTableOpportunity,
) {
    return opportunity.commercialProgress?.completionPercent ?? 0;
}

function getBudgetLabel(opportunity: RequestsPipelineTableOpportunity) {
    if (opportunity.estimatedValueCents !== null) {
        return new Intl.NumberFormat("fr-FR", {
            currency: "EUR",
            maximumFractionDigits: 0,
            style: "currency",
        }).format(opportunity.estimatedValueCents / 100);
    }

    return opportunity.estimatedBudgetRange ?? "À cadrer";
}

function getFollowUpLabel(value: Date | null) {
    if (!value) return "À dater";

    return formatDistanceToNowStrict(value, {
        addSuffix: true,
        locale: fr,
    });
}
