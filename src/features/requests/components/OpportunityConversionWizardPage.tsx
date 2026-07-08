import {
    ArrowLeft,
    CheckCircle2,
    CircleAlert,
    CircleDashed,
    PackagePlus,
    Rocket,
} from "lucide-react";

import { Badge, Button, Checkbox, Select } from "@/components/ui";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import type { getConversionWizardData } from "@/server/project-os/conversion-wizard";
import { convertAndGenerateProjectAction } from "@/server/project-os/actions";

type WizardData = NonNullable<Awaited<ReturnType<typeof getConversionWizardData>>>;

export function OpportunityConversionWizardPage({
    data,
    wizardStatus,
}: {
    data: WizardData;
    wizardStatus?: string;
}) {
    const { opportunity, preview, projectTypes, readiness, selectedTypeId } =
        data;
    const playbook = preview?.playbook ?? null;
    const alreadyConverted = Boolean(opportunity.convertedProject);
    const canSubmit =
        (readiness.readyToConvert || alreadyConverted) &&
        Boolean(selectedTypeId && playbook);

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow="Conversion en projet"
                title={opportunity.title}
                description={`${opportunity.prospectName} · ${
                    opportunity.offer?.name ?? "Offre non renseignée"
                }. Vérifie les pré-conditions, confirme le type de projet, choisis les modules, puis génère le fil rouge.`}
                actions={
                    <Button
                        href={`/admin/demandes/${opportunity.id}`}
                        variant="secondary"
                        size="sm"
                        iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                        Retour à la demande
                    </Button>
                }
            />

            {wizardStatus ? <WizardStatusNotice status={wizardStatus} /> : null}

            {/* Étape 1 — pré-conditions */}
            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    1. Pré-conditions commerciales
                </p>
                {alreadyConverted ? (
                    <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                        Ce dossier est déjà converti : la fiche projet existe.
                        L’assistant servira uniquement à générer le fil rouge si
                        ce n’est pas déjà fait.
                    </p>
                ) : null}
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {readiness.gates.map((gate) => (
                        <li
                            key={gate.key}
                            className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-interactive)] px-3 py-2.5"
                        >
                            {gate.passed ? (
                                <CheckCircle2
                                    className="size-4 shrink-0 text-[color:var(--color-success-text)]"
                                    aria-hidden="true"
                                />
                            ) : (
                                <CircleDashed
                                    className="size-4 shrink-0 text-[color:var(--color-warning-text)]"
                                    aria-hidden="true"
                                />
                            )}
                            <span className="text-body-small text-[color:var(--color-text-default)]">
                                {gate.label}
                            </span>
                        </li>
                    ))}
                </ul>
                {!readiness.readyToConvert && !alreadyConverted ? (
                    <p className="mt-4 flex items-start gap-2 rounded-xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-3 text-body-small text-[color:var(--color-warning-text)]">
                        <CircleAlert
                            className="mt-0.5 size-4 shrink-0"
                            aria-hidden="true"
                        />
                        Complète les pré-conditions manquantes sur la fiche
                        demande avant de convertir. La conversion restera
                        bloquée tant qu’un point n’est pas levé (ou couvert par
                        une exception écrite pour l’acompte).
                    </p>
                ) : null}
            </section>

            {/* Étape 2 — type de projet */}
            <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    2. Type de projet
                </p>
                <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                    Le type de projet détermine le playbook appliqué. Il est
                    pré-rempli depuis la qualification.
                </p>
                <form method="get" className="mt-4 grid max-w-[480px] gap-3">
                    <Select
                        label="Type de projet"
                        name="typeId"
                        defaultValue={selectedTypeId ?? undefined}
                        options={projectTypes.map((projectType) => ({
                            label: projectType.name,
                            value: projectType.id,
                        }))}
                        placeholder="Choisir un type de projet"
                    />
                    <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="justify-self-start"
                    >
                        Actualiser l’aperçu
                    </Button>
                </form>
            </section>

            {/* Étapes 3 & 4 — aperçu + modules + génération */}
            {playbook ? (
                <form action={convertAndGenerateProjectAction} className="grid gap-4">
                    <input
                        type="hidden"
                        name="opportunityId"
                        value={opportunity.id}
                    />
                    <input
                        type="hidden"
                        name="projectTypeId"
                        value={selectedTypeId ?? ""}
                    />

                    <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                3. Playbook appliqué
                            </p>
                            <Badge tone="info">{playbook.name}</Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge tone="neutral">
                                {playbook.core.phases} phase(s)
                            </Badge>
                            <Badge tone="warning">
                                {playbook.core.gates} validation(s)
                            </Badge>
                            <Badge tone="success">
                                {playbook.core.deliverables} livrable(s)
                            </Badge>
                            <Badge tone="neutral">
                                {playbook.core.actions} tâche(s)
                            </Badge>
                            <Badge tone="info">
                                {playbook.core.documents} document(s)
                            </Badge>
                        </div>
                        <ol className="mt-4 grid gap-1.5">
                            {playbook.phases.map((phase, index) => (
                                <li
                                    key={phase.key}
                                    className="flex items-center gap-2 text-body-small text-[color:var(--color-text-muted)]"
                                >
                                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-interactive)] text-caption text-[color:var(--color-action-default)]">
                                        {index + 1}
                                    </span>
                                    {phase.name}
                                </li>
                            ))}
                        </ol>
                        <p className="mt-4 text-caption text-[color:var(--color-text-subtle)]">
                            Les phases cœur et leurs validations ne sont pas
                            désactivables : c’est le cadre qui protège le
                            projet.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                                4. Modules optionnels
                            </p>
                            <PackagePlus
                                className="size-4 text-[color:var(--color-action-default)]"
                                aria-hidden="true"
                            />
                        </div>
                        {playbook.modules.length ? (
                            <div className="mt-4 grid gap-3">
                                {playbook.modules.map((moduleTemplate) => (
                                    <div
                                        key={moduleTemplate.key}
                                        className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                                    >
                                        <Checkbox
                                            label={moduleTemplate.name}
                                            name="modules"
                                            value={moduleTemplate.key}
                                            defaultChecked={
                                                moduleTemplate.isDefault
                                            }
                                        />
                                        {moduleTemplate.description ? (
                                            <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                                                {moduleTemplate.description}
                                            </p>
                                        ) : null}
                                        {moduleTemplate.contentCount === 0 ? (
                                            <p className="mt-2 text-caption text-[color:var(--color-warning-text)]">
                                                Module encore vide : le cocher
                                                ne génèrera rien tant que son
                                                contenu n’est pas défini dans le
                                                playbook.
                                            </p>
                                        ) : (
                                            <p className="mt-2 text-caption text-[color:var(--color-text-subtle)]">
                                                {moduleTemplate.contentCount}{" "}
                                                élément(s) ajoutés au fil rouge
                                                si activé.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                                Ce playbook n’expose aucun module optionnel : le
                                périmètre généré sera le périmètre cœur.
                            </p>
                        )}
                    </section>

                    <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            5. Génération
                        </p>
                        <p className="mt-2 max-w-[760px] text-body-small text-[color:var(--color-text-muted)]">
                            La conversion crée la fiche projet, active l’accès
                            client et fige le périmètre choisi (playbook +
                            modules) dans l’instance. Le fil rouge est ensuite
                            généré : phases, gates, tâches, livrables,
                            validations et documents attendus.
                        </p>
                        <Button
                            type="submit"
                            variant="solid"
                            tone={canSubmit ? "success" : "neutral"}
                            disabled={!canSubmit}
                            iconLeft={<Rocket className="size-4" aria-hidden="true" />}
                            className="mt-4"
                        >
                            {alreadyConverted
                                ? "Générer le fil rouge du projet"
                                : "Convertir et générer le fil rouge"}
                        </Button>
                        {!canSubmit ? (
                            <p className="mt-3 text-caption text-[color:var(--color-text-subtle)]">
                                {!readiness.readyToConvert && !alreadyConverted
                                    ? "Bloqué par les pré-conditions de l’étape 1."
                                    : "Choisis un type de projet avec un playbook pour continuer."}
                            </p>
                        ) : null}
                    </section>
                </form>
            ) : (
                <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        3. Playbook appliqué
                    </p>
                    <p className="mt-3 text-body-small text-[color:var(--color-text-muted)]">
                        {selectedTypeId
                            ? "Aucun playbook n’est associé à ce type de projet. Vérifie le référentiel dans /admin/playbooks."
                            : "Choisis d’abord un type de projet à l’étape 2 pour voir le playbook et ses modules."}
                    </p>
                </section>
            )}
        </AdminPageShell>
    );
}

function WizardStatusNotice({ status }: { status: string }) {
    const message =
        status === "blocked"
            ? "La conversion a été refusée : une pré-condition n’est plus remplie. Vérifie la liste ci-dessous."
            : status === "unknown-type"
              ? "Le type de projet choisi n’existe plus. Sélectionne un type valide."
              : status === "conversion-failed"
                ? "La conversion n’a pas abouti. Réessaie ou vérifie la fiche demande."
                : null;

    if (!message) return null;

    return (
        <p className="flex items-start gap-2 rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-body-small text-[color:var(--color-warning-text)]">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {message}
        </p>
    );
}
