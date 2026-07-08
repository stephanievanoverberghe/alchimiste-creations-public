import {
    ArrowRight,
    BookOpenCheck,
    BriefcaseBusiness,
    FileText,
    Home,
    Images,
    KanbanSquare,
    PackageOpen,
    Receipt,
    UserRound,
    UserRoundPlus,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge, Button, Select, TextField } from "@/components/ui";
import { AdminNowDashboard } from "@/features/admin/components/AdminNowDashboard";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { getAdminNowDashboard } from "@/server/admin/now-dashboard";
import { grantClientPortalAccessAction } from "@/server/client-portal/admin-actions";

type AdminHomePageProps = {
    clientAccessStatus?: string;
    clientPortalProjects: Array<{
        id: string;
        name: string;
        opportunity: {
            prospectEmail: string;
            prospectName: string;
        };
    }>;
    nowDashboard: Awaited<ReturnType<typeof getAdminNowDashboard>>;
};

export function AdminHomePage({
    clientAccessStatus,
    clientPortalProjects,
    nowDashboard,
}: AdminHomePageProps) {
    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Cockpit interne"
                title="Piloter Alchimiste Créations"
                description="Une vue pour suivre les demandes, les relances, les devis, les projets actifs, les validations client et les alertes."
                actions={
                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
                                <Button
                                    href="/"
                                    variant="secondary"
                                    iconLeft={<Home className="size-4" aria-hidden="true" />}
                                    className="justify-center"
                                >
                                    Site public
                                </Button>
                                <Button
                                    href="/espace-client"
                                    variant="secondary"
                                    iconLeft={
                                        <UserRound
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    }
                                    className="justify-center"
                                >
                                    Espace client
                                </Button>
                            </div>
                }
            />

                    <AdminNowDashboard dashboard={nowDashboard} />

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <AdminAreaCard
                            description="Lire, qualifier et convertir les opportunités issues des demandes projet."
                            href="/admin/demandes"
                            icon={<KanbanSquare className="size-4" aria-hidden="true" />}
                            label="Demandes"
                        />
                        <AdminAreaCard
                            description="Piloter les projets convertis, leurs roadmaps et leurs actions de production."
                            href="/admin/projets"
                            icon={
                                <BriefcaseBusiness
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            }
                            label="Projets"
                        />
                        <AdminAreaCard
                            description="Voir les comptes, prospects, clients et contacts rattachés."
                            href="/admin/clients"
                            icon={
                                <BriefcaseBusiness
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            }
                            label="Clients"
                        />
                        <AdminAreaCard
                            description="Piloter les offres, familles, priorités et offres en stand-by."
                            href="/admin/offres"
                            icon={<PackageOpen className="size-4" aria-hidden="true" />}
                            label="Offres"
                        />
                        <AdminAreaCard
                            description="Préparer les cas portfolio, preuves publiques et réalisations."
                            href="/admin/realisations"
                            icon={<Images className="size-4" aria-hidden="true" />}
                            label="Réalisations"
                        />
                        <AdminAreaCard
                            description="Référencer les liens Drive/PDF des projets, livrables et validations."
                            href="/admin/documents"
                            icon={<FileText className="size-4" aria-hidden="true" />}
                            label="Documents"
                        />
                        <AdminAreaCard
                            description="Suivre les devis, factures, acomptes, soldes et paiements."
                            href="/admin/finance"
                            icon={<Receipt className="size-4" aria-hidden="true" />}
                            label="Finance"
                        />
                        <AdminAreaCard
                            description="Vérifier les playbooks avant leur application explicite sur un projet."
                            href="/admin/playbooks"
                            icon={<BookOpenCheck className="size-4" aria-hidden="true" />}
                            label="Playbooks"
                        />
                    </section>

                    <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                    Accès client
                                </p>
                                <Badge tone="info">Permissions</Badge>
                            </div>
                            <p className="max-w-[760px] text-body-small text-[color:var(--color-text-muted)]">
                                Autorise une adresse à accéder à un projet précis dans
                                l’espace client. Le portail reste filtré par utilisateur,
                                même pour un compte admin.
                            </p>
                        </div>

                        {clientAccessStatus ? (
                            <ClientAccessStatus status={clientAccessStatus} />
                        ) : null}

                        <form
                            action={grantClientPortalAccessAction}
                            className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]"
                        >
                            <TextField
                                name="email"
                                type="email"
                                label="Email client"
                                required
                            />
                            <Select
                                name="projectId"
                                label="Projet"
                                options={clientPortalProjects.map((project) => ({
                                    value: project.id,
                                    label: `${project.name} - ${project.opportunity.prospectName}`,
                                }))}
                            />
                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    variant="solid"
                                    tone="info"
                                    iconLeft={
                                        <UserRoundPlus
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    Autoriser
                                </Button>
                            </div>
                        </form>
                    </section>
        </AdminPageShell>
    );
}

function ClientAccessStatus({ status }: { status: string }) {
    const message =
        status === "missing-project"
            ? "Accès non créé : le projet est introuvable."
            : "Accès client activé.";

    return (
        <div className="mt-4 rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
            {message}
        </div>
    );
}

function AdminAreaCard({
    description,
    href,
    icon,
    label,
}: {
    description: string;
    href: string;
    icon: ReactNode;
    label: string;
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6">
            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                {label}
            </p>
            <div className="flex flex-1 flex-col gap-3">
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {description}
                </p>
                <Button
                    href={href}
                    variant="secondary"
                    iconLeft={icon}
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    className="mt-auto w-fit"
                >
                    Ouvrir
                </Button>
            </div>
        </div>
    );
}
