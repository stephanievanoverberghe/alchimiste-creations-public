import { ArrowLeft, ExternalLink, FilePlus2, FileText } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import { getDocumentStatus } from "@/lib/status-labels";
import { createComposedDocumentAction } from "@/server/documents/actions";
import type { getProjectDocumentsOverview } from "@/server/documents/composer";

type DocumentsOverview = Awaited<ReturnType<typeof getProjectDocumentsOverview>>;

export function ProjectDocumentsPage({
    data,
    documentStatus,
}: {
    data: DocumentsOverview;
    documentStatus?: string;
}) {
    const { composedDocuments, documentModels, linkedDocuments, project } = data;

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Documents du projet"
                title={project.name}
                description={`${project.opportunity.prospectName} · Les documents officiels se rédigent ici, pré-remplis depuis le projet. Drive ne garde que les archives et les fichiers bruts.`}
                actions={
                    <Button
                        href={`/admin/projets/${project.id}`}
                        variant="secondary"
                        size="sm"
                        iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                        Retour au cockpit
                    </Button>
                }
            />

            {documentStatus === "missing-model" ? (
                <p className="rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-body-small text-[color:var(--color-warning-text)]">
                    Ce gabarit n’existe plus. Choisis-en un autre ci-dessous.
                </p>
            ) : null}

            {/* Documents composés du projet */}
            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Documents du projet
                </p>
                {composedDocuments.length ? (
                    <ul className="mt-4 grid gap-2">
                        {composedDocuments.map((document) => (
                            <li
                                key={document.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-label text-[color:var(--color-text-default)]">
                                        {document.title}
                                    </p>
                                    <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                                        {document.reference} · v
                                        {String(document.currentVersion).padStart(
                                            2,
                                            "0",
                                        )}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <Badge
                                        tone={
                                            document.status === "APPROVED"
                                                ? "success"
                                                : document.status === "DRAFT"
                                                  ? "draft"
                                                  : "info"
                                        }
                                        size="sm"
                                    >
                                        {getDocumentStatus(document.status).label}
                                    </Badge>
                                    <Button
                                        href={`/admin/projets/${project.id}/documents/${document.id}`}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        Ouvrir
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                        Aucun document composé pour l’instant — crée le premier
                        depuis un gabarit ci-dessous.
                    </p>
                )}
            </section>

            {/* Créer depuis un gabarit */}
            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Créer un document
                    </p>
                    <FilePlus2
                        className="size-4 text-[color:var(--color-action-default)]"
                        aria-hidden="true"
                    />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {documentModels.map((model) => (
                        <form
                            key={model.id}
                            action={createComposedDocumentAction}
                            className="flex flex-col rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                        >
                            <input
                                type="hidden"
                                name="projectId"
                                value={project.id}
                            />
                            <input
                                type="hidden"
                                name="modelKey"
                                value={model.key}
                            />
                            <p className="text-label text-[color:var(--color-text-default)]">
                                {model.name}
                            </p>
                            {model.description ? (
                                <p className="mt-2 flex-1 text-body-small text-[color:var(--color-text-muted)]">
                                    {model.description}
                                </p>
                            ) : (
                                <span className="flex-1" />
                            )}
                            <Button
                                type="submit"
                                variant="secondary"
                                size="sm"
                                className="mt-3 justify-self-start"
                            >
                                Créer (pré-rempli)
                            </Button>
                        </form>
                    ))}
                </div>
            </section>

            {/* Fichiers référencés */}
            {linkedDocuments.length ? (
                <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Fichiers référencés (Drive, exports)
                    </p>
                    <ul className="mt-4 grid gap-2">
                        {linkedDocuments.map((document) => (
                            <li
                                key={document.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--color-surface-interactive)] p-4"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <FileText
                                        className="size-4 shrink-0 text-[color:var(--color-text-subtle)]"
                                        aria-hidden="true"
                                    />
                                    <p className="truncate text-body-small text-[color:var(--color-text-default)]">
                                        {document.title}
                                    </p>
                                </div>
                                {document.documentUrl ? (
                                    <Button
                                        href={document.documentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        variant="ghost"
                                        size="sm"
                                        iconRight={
                                            <ExternalLink
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        Ouvrir
                                    </Button>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </AdminPageShell>
    );
}
