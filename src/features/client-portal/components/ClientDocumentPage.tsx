import { ArrowLeft, CheckCircle2, CircleAlert } from "lucide-react";

import { Badge, Button, Select, Textarea } from "@/components/ui";
import { ComposedDocumentArticle } from "@/features/documents/components/ComposedDocumentArticle";
import { respondClientValidationAction } from "@/server/client-portal/actions";
import type { getClientComposedDocument } from "@/server/client-portal/portal";

type ClientDocument = Awaited<ReturnType<typeof getClientComposedDocument>>;

export function ClientDocumentPage({
    document,
    validationStatus,
}: {
    document: ClientDocument;
    validationStatus?: string;
}) {
    const validation = document.validation;
    const awaitingResponse = validation?.status === "PENDING";

    return (
        <div className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                    href={`/espace-client/projets/${document.projectId}`}
                    variant="secondary"
                    size="sm"
                    iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                >
                    Retour au projet
                </Button>
                <Badge tone={document.status === "APPROVED" ? "success" : "info"}>
                    {document.status === "APPROVED"
                        ? "Validé"
                        : `Version v${String(document.version).padStart(2, "0")}`}
                </Badge>
            </div>

            {validationStatus === "APPROVED" ? (
                <p className="flex items-start gap-2 rounded-2xl border border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] p-4 text-body-small text-[color:var(--color-success-text)]">
                    <CheckCircle2
                        className="mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                    />
                    Merci ! Votre validation est enregistrée — Stéphanie est
                    prévenue et le projet avance.
                </p>
            ) : null}
            {validationStatus === "CHANGES_REQUESTED" ? (
                <p className="flex items-start gap-2 rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-body-small text-[color:var(--color-warning-text)]">
                    <CircleAlert
                        className="mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                    />
                    Votre demande d’ajustement est envoyée — Stéphanie revient
                    vers vous avec une nouvelle version.
                </p>
            ) : null}

            {/* Le document, en rendu « papier » lisible */}
            <div className="rounded-3xl bg-[var(--paper-bg)] p-3 sm:p-6">
                <ComposedDocumentArticle
                    clientName={document.clientName}
                    content={document.content}
                    issuedAt={document.sharedAt}
                    reference={document.reference}
                    sections={document.model.sections}
                    title={document.title}
                    version={document.version}
                />
            </div>

            {/* Votre décision */}
            {validation ? (
                awaitingResponse ? (
                    <form
                        action={respondClientValidationAction}
                        className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-5"
                    >
                        <input
                            type="hidden"
                            name="projectId"
                            value={document.projectId}
                        />
                        <input
                            type="hidden"
                            name="validationId"
                            value={validation.id}
                        />
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Votre décision
                        </p>
                        <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                            Validez ce document ou demandez un ajustement — votre
                            retour part directement dans le suivi du projet.
                        </p>
                        <Select
                            name="status"
                            label="Réponse"
                            defaultValue="APPROVED"
                            options={[
                                { label: "Je valide ce document", value: "APPROVED" },
                                {
                                    label: "Je demande des ajustements",
                                    value: "CHANGES_REQUESTED",
                                },
                            ]}
                            className="mt-4"
                        />
                        <Textarea
                            name="responseComment"
                            label="Commentaire (optionnel, requis si ajustements)"
                            rows={3}
                            className="mt-3"
                        />
                        <Button
                            type="submit"
                            variant="solid"
                            tone="success"
                            className="mt-4"
                        >
                            Envoyer ma réponse
                        </Button>
                    </form>
                ) : (
                    <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-5">
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Votre décision
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge
                                tone={
                                    validation.status === "APPROVED"
                                        ? "success"
                                        : "warning"
                                }
                            >
                                {validation.status === "APPROVED"
                                    ? "Document validé"
                                    : "Ajustements demandés"}
                            </Badge>
                            {validation.respondedAt ? (
                                <span className="text-caption text-[color:var(--color-text-subtle)]">
                                    le{" "}
                                    {new Intl.DateTimeFormat("fr-FR", {
                                        dateStyle: "long",
                                    }).format(validation.respondedAt)}
                                </span>
                            ) : null}
                        </div>
                        {validation.responseComment ? (
                            <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                                « {validation.responseComment} »
                            </p>
                        ) : null}
                    </div>
                )
            ) : null}
        </div>
    );
}
