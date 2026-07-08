import {
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    Receipt,
    WalletCards,
} from "lucide-react";
import type { ReactNode } from "react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, Select, Textarea, TextField } from "@/components/ui";
import { formatDate, formatMoneyFromCents } from "@/lib/formatters";
import {
    financialStatusOptions,
    financialTypeOptions,
    getFinancialStatus,
    getFinancialType,
} from "@/lib/status-labels";
import { createFinancialDocumentAction } from "@/server/finance/actions";
import { getAdminFinance } from "@/server/finance/finance";

type AdminFinancePageProps = {
    createdStatus?: string;
};

export async function AdminFinancePage({ createdStatus }: AdminFinancePageProps) {
    const data = await getAdminFinance();

    return (
        <Section
            spacing="none"
            className="min-h-[calc(100vh-56px)] py-4 md:py-5 lg:py-6"
        >
            <Container>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex max-w-[820px] flex-col gap-3">
                            <Button href="/admin" variant="ghost" size="sm" className="w-fit">
                                Admin
                            </Button>
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                Finance
                            </p>
                            <h1 className="text-h1 text-[color:var(--color-text-default)]">
                                Devis, factures et paiements
                            </h1>
                            <p className="text-body text-[color:var(--color-text-muted)]">
                                Vue interne des documents financiers. Les PDF restent
                                dans Drive ou l’outil d’édition, le CRM référence le
                                lien, le statut et les montants.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[760px] xl:grid-cols-3">
                            <MetricCard
                                icon={<FileText className="size-4" aria-hidden="true" />}
                                label="Documents"
                                value={String(data.documents.length)}
                            />
                            <MetricCard
                                icon={<WalletCards className="size-4" aria-hidden="true" />}
                                label="Devis"
                                value={String(data.summary.quoteCount)}
                            />
                            <MetricCard
                                icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                                label="Devis acceptés"
                                value={String(data.summary.acceptedQuoteCount)}
                                tone={
                                    data.summary.acceptedQuoteCount > 0
                                        ? "success"
                                        : "neutral"
                                }
                            />
                            <MetricCard
                                icon={<Clock className="size-4" aria-hidden="true" />}
                                label="Acomptes à recevoir"
                                value={String(data.summary.pendingDepositCount)}
                                tone={
                                    data.summary.pendingDepositCount > 0
                                        ? "warning"
                                        : "neutral"
                                }
                            />
                            <MetricCard
                                icon={<WalletCards className="size-4" aria-hidden="true" />}
                                label="Acomptes encaissés"
                                value={formatMoneyFromCents(
                                    data.summary.paidDepositAmountCents,
                                    "Montant non renseigné",
                                )}
                                tone={
                                    data.summary.paidDepositAmountCents > 0
                                        ? "success"
                                        : "neutral"
                                }
                            />
                            <MetricCard
                                icon={<Receipt className="size-4" aria-hidden="true" />}
                                label="En retard"
                                value={String(data.summary.lateCount)}
                                tone={data.summary.lateCount > 0 ? "danger" : "neutral"}
                            />
                        </div>
                    </div>

                    {createdStatus ? <CreationStatus /> : null}

                    <form
                        action={createFinancialDocumentAction}
                        className="grid gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:grid-cols-2"
                    >
                        <TextField name="reference" label="Référence" required />
                        <TextField name="clientName" label="Client" required />
                        <TextField
                            name="documentUrl"
                            label="Lien PDF ou Drive"
                            required
                        />
                        <TextField
                            name="amount"
                            type="number"
                            min={0}
                            step="0.01"
                            label="Montant TTC (€)"
                        />
                        <Select
                            name="type"
                            label="Type"
                            defaultValue="QUOTE"
                            options={financialTypeOptions}
                        />
                        <Select
                            name="status"
                            label="Statut"
                            defaultValue="DRAFT"
                            options={financialStatusOptions}
                        />
                        <TextField
                            name="depositPercent"
                            type="number"
                            min={0}
                            max={100}
                            label="Acompte (%)"
                        />
                        <TextField name="issuedAt" type="date" label="Date émission" />
                        <TextField name="dueAt" type="date" label="Date échéance" />
                        <Select
                            name="offerId"
                            label="Offre"
                            options={[
                                { value: "", label: "Aucune offre liée" },
                                ...data.offers.map((offer) => ({
                                    value: offer.id,
                                    label: offer.name,
                                })),
                            ]}
                        />
                        <Select
                            name="opportunityId"
                            label="Opportunité"
                            options={[
                                { value: "", label: "Aucune opportunité liée" },
                                ...data.opportunities.map((opportunity) => ({
                                    value: opportunity.id,
                                    label: `${opportunity.title} - ${opportunity.prospectName}`,
                                })),
                            ]}
                        />
                        <Select
                            name="projectId"
                            label="Projet"
                            options={[
                                { value: "", label: "Aucun projet lié" },
                                ...data.projects.map((project) => ({
                                    value: project.id,
                                    label: project.name,
                                })),
                            ]}
                        />
                        <Textarea
                            name="notes"
                            label="Notes internes"
                            rows={3}
                            className="md:col-span-2"
                        />
                        <div className="md:col-span-2">
                            <Button type="submit" variant="solid" tone="info">
                                Ajouter le document financier
                            </Button>
                        </div>
                    </form>

                    <div className="grid gap-4">
                        {data.documents.length > 0 ? (
                            data.documents.map((document) => (
                                <FinancialDocumentCard
                                    key={document.id}
                                    document={document}
                                />
                            ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
}

function FinancialDocumentCard({
    document,
}: {
    document: Awaited<ReturnType<typeof getAdminFinance>>["documents"][number];
}) {
    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="info">{getFinancialType(document.type).label}</Badge>
                        <Badge tone={getFinancialStatus(document.status).tone}>
                            {getFinancialStatus(document.status).label}
                        </Badge>
                    </div>
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        {document.reference}
                    </h2>
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {document.clientName} -{" "}
                        {formatMoneyFromCents(
                            document.amountCents,
                            "Montant non renseigné",
                        )}
                    </p>
                    <p className="text-caption text-[color:var(--color-text-subtle)]">
                        {document.project
                            ? `Projet : ${document.project.name}`
                            : document.opportunity
                                ? `Opportunité : ${document.opportunity.title}`
                                : "Aucun rattachement"}
                    </p>
                </div>
                {document.documentUrl ? (
                    <Button
                        href={document.documentUrl}
                        variant="secondary"
                        size="sm"
                        iconRight={
                            <ExternalLink className="size-4" aria-hidden="true" />
                        }
                    >
                        Ouvrir
                    </Button>
                ) : null}
            </div>
            <dl className="mt-4 grid gap-3 text-caption text-[color:var(--color-text-subtle)] md:grid-cols-4">
                <InfoItem
                    label="Émis"
                    value={formatDate(document.issuedAt, "numeric", "Non renseigné")}
                />
                <InfoItem
                    label="Échéance"
                    value={formatDate(document.dueAt, "numeric", "Non renseigné")}
                />
                <InfoItem
                    label="Payé"
                    value={formatDate(document.paidAt, "numeric", "Non renseigné")}
                />
                <InfoItem
                    label="Acompte"
                    value={
                        document.depositPercent === null
                            ? "Non renseigné"
                            : `${document.depositPercent}%`
                    }
                />
            </dl>
            {document.notes ? (
                <p className="mt-4 text-body-small text-[color:var(--color-text-muted)]">
                    {document.notes}
                </p>
            ) : null}
        </article>
    );
}

function MetricCard({
    icon,
    label,
    tone = "neutral",
    value,
}: {
    icon: ReactNode;
    label: string;
    tone?: "danger" | "neutral" | "success" | "warning";
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

function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <dt className="uppercase">{label}</dt>
            <dd className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                {value}
            </dd>
        </div>
    );
}

function CreationStatus() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
            Document financier ajouté.
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <Receipt
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun document financier.
            </p>
        </div>
    );
}
