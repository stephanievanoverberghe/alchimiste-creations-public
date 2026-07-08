import {
    ArrowRight,
    CheckCircle2,
    FolderTree,
    PackageOpen,
    PauseCircle,
    Tags,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge, Button, Toast } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { OfferCatalog } from "@/features/offers/components/OfferCatalog";
import { OfferFamiliesTable } from "@/features/offers/components/OfferFamiliesTable";
import { getAdminOffers } from "@/server/offers/offers";

type AdminOffersPageProps = {
    data: Awaited<ReturnType<typeof getAdminOffers>>;
    status?: string;
};

type OfferFamily = Awaited<
    ReturnType<typeof getAdminOffers>
>["families"][number];

export function AdminOffersPage({ data, status }: AdminOffersPageProps) {
    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Catalogue"
                title="Offres et familles"
                description="Pilote ton catalogue CRM : familles, offres actives, offres en stand-by, prix de cadrage et liens publics. La création se fait sur des pages dédiées pour garder ce dashboard lisible."
                actions={
                    <div className="flex flex-wrap gap-2">
                        <Button
                            href="/admin/offres/nouvelle"
                            variant="primary"
                            size="sm"
                            iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                        >
                            Nouvelle offre
                        </Button>
                        <Button
                            href="/admin/offres/familles/nouvelle"
                            variant="secondary"
                            size="sm"
                            iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                        >
                            Nouvelle famille
                        </Button>
                    </div>
                }
                metrics={
                    <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[620px]">
                        <MetricCard
                            icon={<PackageOpen className="size-4" aria-hidden="true" />}
                            label="Offres"
                            value={String(data.totals.offers)}
                        />
                        <MetricCard
                            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            label="Actives"
                            value={String(data.totals.active)}
                        />
                        <MetricCard
                            icon={<PauseCircle className="size-4" aria-hidden="true" />}
                            label="Stand-by"
                            value={String(data.totals.standby)}
                        />
                        <MetricCard
                            icon={<Tags className="size-4" aria-hidden="true" />}
                            label="Familles"
                            value={String(data.totals.families)}
                        />
                    </div>
                }
            />

            <OfferStatusMessage status={status} />

            <section className="grid items-stretch gap-4 xl:grid-cols-[minmax(260px,0.35fr)_minmax(0,1fr)]">
                <div className="grid gap-4 xl:grid-rows-2">
                    <DashboardActionCard
                        href="/admin/offres/nouvelle"
                        icon={<PackageOpen className="size-5" aria-hidden="true" />}
                        title="Créer une offre"
                        description="Ajoute une offre CRM propre, avec famille, prix, statut et lien public."
                    />
                    <DashboardActionCard
                        href="/admin/offres/familles/nouvelle"
                        icon={<FolderTree className="size-5" aria-hidden="true" />}
                        title="Créer une famille"
                        description="Classe ton catalogue par familles commerciales réutilisables."
                    />
                </div>

                <FamilyOverview families={data.families} />
            </section>

            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Règle de gestion
                        </p>
                        <p className="mt-2 max-w-[960px] text-body-small text-[color:var(--color-text-muted)]">
                            Les offres prioritaires restent vendables. Les offres secondaires
                            ou à valider passent en stand-by sans être supprimées : elles
                            restent utiles pour le CRM, les playbooks et les futurs cas
                            concrets.
                        </p>
                    </div>
                    <Badge tone="info">Public non branché à la DB</Badge>
                </div>
            </section>

            <OfferCatalog families={data.families} offers={data.offers} />
        </AdminPageShell>
    );
}

function DashboardActionCard({
    description,
    href,
    icon,
    title,
}: {
    description: string;
    href: string;
    icon: ReactNode;
    title: string;
}) {
    return (
        <article className="flex h-full flex-col justify-between rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-start justify-between gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                    {icon}
                </span>
                <Button
                    href={href}
                    variant="secondary"
                    size="sm"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                >
                    Ouvrir
                </Button>
            </div>
            <h2 className="mt-4 text-h3 text-[color:var(--color-text-default)]">
                {title}
            </h2>
            <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                {description}
            </p>
        </article>
    );
}

function FamilyOverview({ families }: { families: OfferFamily[] }) {
    return (
        <aside className="flex h-full flex-col rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Familles
                    </p>
                    <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        Classification commerciale.
                    </p>
                </div>
                <Badge tone="neutral">{families.length}</Badge>
            </div>

            <OfferFamiliesTable families={families} />
        </aside>
    );
}

function OfferStatusMessage({ status }: { status?: string }) {
    if (!status) return null;

    const messages: Record<
        string,
        { message: string; title: string; tone: "danger" | "success" | "warning" }
    > = {
        "family-created": {
            message: "La famille est disponible pour classer tes offres.",
            title: "Famille ajoutée",
            tone: "success",
        },
        "family-deleted": {
            message: "La famille a bien été supprimée du catalogue.",
            title: "Suppression effectuée",
            tone: "danger",
        },
        "family-delete-blocked": {
            message: "Suppression impossible : cette famille contient déjà des offres.",
            title: "Suppression bloquée",
            tone: "warning",
        },
        "family-updated": {
            message: "La famille a été mise à jour.",
            title: "Famille mise à jour",
            tone: "success",
        },
        created: {
            message: "Offre créée.",
            title: "Catalogue mis à jour",
            tone: "success",
        },
        deleted: {
            message: "L'offre a bien été supprimée du catalogue.",
            title: "Suppression effectuée",
            tone: "danger",
        },
        "delete-blocked": {
            message:
                "Suppression impossible : cette offre est déjà liée à des opportunités, projets ou documents.",
            title: "Suppression bloquée",
            tone: "warning",
        },
        "duplicate-family": {
            message: "Une famille utilise déjà ce slug.",
            title: "Famille déjà existante",
            tone: "danger",
        },
        "duplicate-slug": {
            message: "Slug déjà utilisé par une autre offre.",
            title: "Slug déjà utilisé",
            tone: "danger",
        },
        "invalid-family-slug": {
            message: "Renseigne un nom ou un slug de famille exploitable.",
            title: "Slug famille invalide",
            tone: "danger",
        },
        "invalid-slug": {
            message: "Slug invalide. Renseigne un nom ou un slug exploitable.",
            title: "Slug invalide",
            tone: "danger",
        },
        "missing-family": {
            message: "Choisis une famille existante ou ajoute-la d'abord.",
            title: "Famille introuvable",
            tone: "warning",
        },
        "missing-offer": {
            message: "Offre introuvable.",
            title: "Offre introuvable",
            tone: "danger",
        },
        updated: {
            message: "Offre mise à jour.",
            title: "Catalogue mis à jour",
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
