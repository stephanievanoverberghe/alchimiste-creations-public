import {
    ExternalLink,
    FileText,
    FolderOpen,
    ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import { Container, Section } from "@/components/layout";
import { Badge, Button, Select, Textarea, TextField } from "@/components/ui";
import {
    documentStatusOptions,
    documentTypeOptions,
    getDocumentStatus,
    getDocumentType,
} from "@/lib/status-labels";
import { createRealDocumentAction } from "@/server/documents/actions";
import { getAdminDocuments } from "@/server/documents/documents";

type AdminDocumentsPageProps = {
    createdStatus?: string;
};

export async function AdminDocumentsPage({
    createdStatus,
}: AdminDocumentsPageProps) {
    const data = await getAdminDocuments();
    const visibleDocuments = data.documents.filter(
        (document) => document.isClientVisible,
    ).length;

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
                                Documents
                            </p>
                            <h1 className="text-h1 text-[color:var(--color-text-default)]">
                                Documents référencés
                            </h1>
                            <p className="text-body text-[color:var(--color-text-muted)]">
                                Les vrais fichiers restent dans Google Drive. Le CRM ne
                                stocke que les liens, statuts, références et permissions.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
                            <MetricCard
                                icon={<FileText className="size-4" aria-hidden="true" />}
                                label="Documents"
                                value={String(data.documents.length)}
                            />
                            <MetricCard
                                icon={<ShieldCheck className="size-4" aria-hidden="true" />}
                                label="Visibles client"
                                value={String(visibleDocuments)}
                            />
                        </div>
                    </div>

                    <CreationStatus status={createdStatus} />

                    <form
                        action={createRealDocumentAction}
                        className="grid gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 md:grid-cols-2"
                    >
                        <TextField name="reference" label="Référence" required />
                        <TextField name="title" label="Titre" required />
                        <TextField name="clientName" label="Client" required />
                        <TextField name="documentUrl" label="Lien Drive ou PDF" required />
                        <Select
                            name="type"
                            label="Type"
                            defaultValue="DELIVERABLE"
                            options={documentTypeOptions}
                        />
                        <Select
                            name="status"
                            label="Statut"
                            defaultValue="REFERENCED"
                            options={documentStatusOptions}
                        />
                        <Select
                            name="projectId"
                            label="Projet"
                            options={data.projects.map((project) => ({
                                value: project.id,
                                label: `${project.name} - ${project.opportunity.prospectName}`,
                            }))}
                        />
                        <Select
                            name="deliverableId"
                            label="Livrable lié"
                            options={[
                                { value: "", label: "Aucun livrable lié" },
                                ...data.deliverables.map((deliverable) => ({
                                    value: deliverable.id,
                                    label: `${deliverable.project.name} - ${deliverable.name}`,
                                })),
                            ]}
                        />
                        <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] px-4 py-3 text-body-small text-[color:var(--color-text-muted)] md:col-span-2">
                            <input
                                type="checkbox"
                                name="isClientVisible"
                                className="size-4 accent-[var(--color-action-default)]"
                            />
                            Visible dans le futur espace client
                        </label>
                        <Textarea
                            name="notes"
                            label="Notes internes"
                            rows={3}
                            className="md:col-span-2"
                        />
                        <div className="md:col-span-2">
                            <Button type="submit" variant="solid" tone="info">
                                Référencer le document
                            </Button>
                        </div>
                    </form>

                    <div className="grid gap-4">
                        {data.documents.length > 0 ? (
                            data.documents.map((document) => (
                                <DocumentCard key={document.id} document={document} />
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

function DocumentCard({
    document,
}: {
    document: Awaited<ReturnType<typeof getAdminDocuments>>["documents"][number];
}) {
    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="info">{getDocumentType(document.type).label}</Badge>
                        <Badge tone={getDocumentStatus(document.status).tone}>
                            {getDocumentStatus(document.status).label}
                        </Badge>
                        {document.isClientVisible ? (
                            <Badge tone="success">Client</Badge>
                        ) : null}
                    </div>
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        {document.title}
                    </h2>
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {document.reference} - {document.clientName}
                    </p>
                    <p className="text-caption text-[color:var(--color-text-subtle)]">
                        Projet : {document.project.name}
                        {document.deliverable
                            ? ` - Livrable : ${document.deliverable.name}`
                            : ""}
                    </p>
                </div>
                <Button
                    href={document.documentUrl}
                    variant="secondary"
                    size="sm"
                    iconRight={<ExternalLink className="size-4" aria-hidden="true" />}
                >
                    Ouvrir
                </Button>
            </div>
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

function CreationStatus({ status }: { status?: string }) {
    if (!status) return null;

    const message =
        status === "missing-project"
            ? "Document non créé : le projet est introuvable."
            : "Document référencé.";

    return (
        <div className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-3 text-body-small text-[color:var(--color-success-text)]">
            {message}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-8 text-center">
            <FolderOpen
                className="mx-auto size-8 text-[color:var(--color-text-subtle)]"
                aria-hidden="true"
            />
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                Aucun document référencé.
            </p>
        </div>
    );
}
