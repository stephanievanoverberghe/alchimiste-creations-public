import {
    BriefcaseBusiness,
    FolderKanban,
    UserRoundCheck,
    UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { getClientAccountStatus } from "@/lib/status-labels";
import { getAdminClients } from "@/server/clients/clients";

type AdminClientsPageProps = {
    data: Awaited<ReturnType<typeof getAdminClients>>;
};

export function AdminClientsPage({ data }: AdminClientsPageProps) {
    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Clients"
                title="Comptes clients et prospects"
                description="Cette page centralise les comptes métiers issus des demandes, prospects, clients actifs et contacts rattachés. Elle prépare la future gestion complète des fiches clients."
                metrics={
                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                            <MetricCard
                                icon={<UsersRound className="size-4" aria-hidden="true" />}
                                label="Comptes"
                                value={String(data.totals.accounts)}
                            />
                            <MetricCard
                                icon={
                                    <UserRoundCheck
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Clients"
                                value={String(data.totals.activeClients)}
                            />
                            <MetricCard
                                icon={
                                    <FolderKanban
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Leads"
                                value={String(data.totals.leads)}
                            />
                        </div>
                }
            />

                    <div className="grid gap-4">
                        {data.clients.length > 0 ? (
                            data.clients.map((client) => (
                                <ClientCard key={client.id} client={client} />
                            ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
        </AdminPageShell>
    );
}

function ClientCard({
    client,
}: {
    client: Awaited<ReturnType<typeof getAdminClients>>["clients"][number];
}) {
    const primaryContact = client.contacts[0];

    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex max-w-[760px] flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge tone={getClientAccountStatus(client.status).tone}>
                            {getClientAccountStatus(client.status).label}
                        </Badge>
                        <Badge tone="neutral">{client.type}</Badge>
                        {client.source ? <Badge tone="info">{client.source}</Badge> : null}
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-h3 text-[color:var(--color-text-default)]">
                            {client.name}
                        </h2>
                        <p className="text-body-small text-[color:var(--color-text-muted)]">
                            {client.brandName ?? client.companyName ?? "Compte individuel"}
                        </p>
                    </div>
                    {primaryContact ? (
                        <p className="text-caption text-[color:var(--color-text-subtle)]">
                            Contact principal : {formatContactName(primaryContact)} ·{" "}
                            {primaryContact.email}
                        </p>
                    ) : (
                        <p className="text-caption text-[color:var(--color-text-subtle)]">
                            Aucun contact rattaché pour le moment.
                        </p>
                    )}
                </div>

                <div className="grid min-w-full gap-2 sm:grid-cols-3 lg:min-w-[420px]">
                    <CompactCount label="Contacts" value={client._count.contacts} />
                    <CompactCount
                        label="Demandes"
                        value={client._count.projectRequests}
                    />
                    <CompactCount
                        label="Opportunités"
                        value={client._count.opportunities}
                    />
                </div>
            </div>
        </article>
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

function CompactCount({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3">
            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {label}
            </p>
            <p className="mt-1 text-label text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <BriefcaseBusiness
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun compte client.
            </p>
            <p className="mx-auto mt-2 max-w-[520px] text-body-small text-[color:var(--color-text-muted)]">
                Les comptes apparaîtront ici quand les demandes projet ou les
                conversions créeront des comptes métiers.
            </p>
        </div>
    );
}

function formatContactName(
    contact: Awaited<ReturnType<typeof getAdminClients>>["clients"][number]["contacts"][number],
) {
    const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");

    return fullName || contact.email;
}
