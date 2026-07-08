import { ArrowLeft, Eye, Send } from "lucide-react";

import { Badge, Button, TextField, Textarea } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import {
    shareComposedDocumentAction,
    updateComposedDocumentAction,
} from "@/server/documents/actions";
import type { getComposedDocument } from "@/server/documents/composer";

type ComposedDocument = Awaited<ReturnType<typeof getComposedDocument>>;

export function ComposedDocumentEditorPage({
    document,
    documentStatus,
}: {
    document: ComposedDocument;
    documentStatus?: string;
}) {
    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow={`Document · ${document.model.name}`}
                title={document.title}
                description={`${document.reference} · v${String(
                    document.currentVersion,
                ).padStart(2, "0")} · ${document.clientName}. Les sections pré-remplies restent entièrement modifiables.`}
                actions={
                    <div className="flex flex-wrap gap-2">
                        <Button
                            href={`/admin/projets/${document.project.id}/documents`}
                            variant="secondary"
                            size="sm"
                            iconLeft={
                                <ArrowLeft className="size-4" aria-hidden="true" />
                            }
                        >
                            Documents du projet
                        </Button>
                        <Button
                            href={`/apercu-document/${document.id}`}
                            target="_blank"
                            variant="secondary"
                            size="sm"
                            iconLeft={<Eye className="size-4" aria-hidden="true" />}
                        >
                            Aperçu brandé
                        </Button>
                    </div>
                }
            />

            {documentStatus === "saved" ? (
                <p className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-4 text-body-small text-[color:var(--color-success-text)]">
                    Document enregistré.
                </p>
            ) : null}
            {documentStatus === "shared" ? (
                <p className="rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-4 text-body-small text-[color:var(--color-success-text)]">
                    Version v
                    {String(document.currentVersion).padStart(2, "0")} partagée
                    au client : il est notifié et peut valider ou demander un
                    ajustement depuis son espace.
                </p>
            ) : null}

            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Partage client
                        </p>
                        <p className="mt-2 max-w-[640px] text-body-small text-[color:var(--color-text-muted)]">
                            Le partage fige la version actuelle (v
                            {String(document.currentVersion + 1).padStart(2, "0")}
                            ), rend le document lisible dans l’espace client et
                            ouvre la validation. Pense à enregistrer avant.
                        </p>
                    </div>
                    <form action={shareComposedDocumentAction}>
                        <input
                            type="hidden"
                            name="documentId"
                            value={document.id}
                        />
                        <input
                            type="hidden"
                            name="projectId"
                            value={document.project.id}
                        />
                        <Button
                            type="submit"
                            variant="solid"
                            tone="success"
                            iconLeft={<Send className="size-4" aria-hidden="true" />}
                        >
                            Partager au client (v
                            {String(document.currentVersion + 1).padStart(2, "0")})
                        </Button>
                    </form>
                </div>
            </section>

            <form
                action={updateComposedDocumentAction}
                className="grid max-w-[860px] gap-4"
            >
                <input type="hidden" name="documentId" value={document.id} />
                <input
                    type="hidden"
                    name="projectId"
                    value={document.project.id}
                />

                <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            En-tête
                        </p>
                        <Badge tone={document.status === "DRAFT" ? "draft" : "info"}>
                            {document.status === "DRAFT"
                                ? "Brouillon"
                                : document.status}
                        </Badge>
                    </div>
                    <TextField
                        label="Titre du document"
                        name="title"
                        defaultValue={document.title}
                        required
                        maxLength={180}
                        className="mt-4"
                    />
                </section>

                {document.model.sections.map((section, index) => (
                    <section
                        key={section.key}
                        className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                    >
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            {index + 1}. {section.title}
                        </p>
                        <Textarea
                            label="Contenu"
                            helperText={section.helpText}
                            name={`section:${section.key}`}
                            defaultValue={
                                document.content.sections[section.key] ?? ""
                            }
                            rows={5}
                            className="mt-3 [&_textarea]:min-h-32"
                        />
                    </section>
                ))}

                <Button type="submit" className="justify-self-start">
                    Enregistrer le document
                </Button>
            </form>
        </AdminPageShell>
    );
}
