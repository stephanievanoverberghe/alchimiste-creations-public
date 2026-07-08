import {
    ArrowLeft,
    ArrowRight,
    Boxes,
    CheckCircle2,
    CircleDot,
    Clock3,
    Eye,
    FileText,
    ListChecks,
    ShieldCheck,
    Target,
    UserCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge, Button, TextField, Textarea } from "@/components/ui";
import { updatePlaybookModuleAction } from "@/server/playbooks/actions";
import {
    AdminPageHeader,
    AdminPageShell,
} from "@/features/admin/components/AdminPageShell";
import {
    PlaybookWorkflowTabs,
    type PlaybookWorkflowLot,
} from "@/features/playbooks/components/PlaybookWorkflowTabs";
import { getPlaybookStatus } from "@/lib/status-labels";
import type { CommercialPlaybookReference } from "@/server/playbooks/commercial-reference";
import type { getAdminPlaybook } from "@/server/playbooks/playbooks";

type Playbook = NonNullable<Awaited<ReturnType<typeof getAdminPlaybook>>>;
type Phase = Playbook["phases"][number];
type Action = Playbook["actions"][number];
type Deliverable = Playbook["deliverables"][number];
type DocumentTemplate = Playbook["documents"][number];
type CommercialStep = CommercialPlaybookReference["steps"][number];

const COMMERCIAL_STEP_GROUPS = [
    {
        description:
            "Comprendre la demande, vérifier si elle mérite ton temps et clarifier le besoin.",
        from: 1,
        title: "Qualifier la demande",
        to: 3,
    },
    {
        description:
            "Transformer le besoin en proposition claire, compréhensible et chiffrable.",
        from: 4,
        title: "Cadrer et vendre",
        to: 7,
    },
    {
        description:
            "Suivre la décision, traiter les objections et sécuriser l'engagement financier.",
        from: 8,
        title: "Sécuriser l'accord",
        to: 10,
    },
    {
        description:
            "Vérifier les prérequis, créer la fiche projet et préparer le passage en production.",
        from: 11,
        title: "Convertir en projet",
        to: 13,
    },
];

export function AdminPlaybookDetailPage({ playbook }: { playbook: Playbook }) {
    const isRequestOs = isRequestOsPlaybook(playbook);
    const commercialReference = playbook.commercialReference;
    const workflowLots = buildWorkflowLots(playbook);
    const orphanActions = playbook.actions.filter((action) => !action.sourcePhaseKey);
    const orphanDeliverables = playbook.deliverables.filter(
        (deliverable) => !deliverable.sourcePhaseKey,
    );
    const orphanDocuments = playbook.documents.filter(
        (document) => !document.sourcePhaseKey,
    );

    return (
        <AdminPageShell>
            <AdminPageHeader
                eyebrow={isRequestOs ? "Playbook commercial" : "Playbook de production"}
                title={playbook.name}
                description={
                    isRequestOs
                        ? "Visualise le parcours commercial avant conversion : étapes, tâches, validations, documents, délais et règles de relance."
                        : "Visualise la méthode de production avant application à un projet. Cette page montre le déroulé prévu : lots, phases, tâches, validations, livrables et documents."
                }
                actions={
                    <Button
                        href="/admin/playbooks"
                        variant="secondary"
                        size="sm"
                        iconLeft={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                        Retour aux playbooks
                    </Button>
                }
                metrics={
                    <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[640px]">
                        <MetricCard
                            icon={<Boxes className="size-4" aria-hidden="true" />}
                            label={isRequestOs ? "Étapes" : "Phases"}
                            value={String(
                                isRequestOs && commercialReference
                                    ? commercialReference.steps.length
                                    : playbook._count.phases,
                            )}
                        />
                        <MetricCard
                            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                            label="Validations"
                            value={String(
                                isRequestOs && commercialReference
                                    ? commercialReference.steps.filter(
                                          (step) => step.validation,
                                      ).length
                                    : playbook._count.gates,
                            )}
                        />
                        <MetricCard
                            icon={<ListChecks className="size-4" aria-hidden="true" />}
                            label={isRequestOs ? "Actions" : "Tâches"}
                            value={String(
                                isRequestOs && commercialReference
                                    ? commercialReference.steps.reduce(
                                          (count, step) => count + step.todos.length,
                                          0,
                                      )
                                    : playbook._count.actions,
                            )}
                        />
                        <MetricCard
                            icon={<FileText className="size-4" aria-hidden="true" />}
                            label={isRequestOs ? "Documents" : "Livrables"}
                            value={String(
                                isRequestOs && commercialReference
                                    ? new Set(
                                          commercialReference.steps.flatMap(
                                              (step) => step.documents,
                                          ),
                                      ).size
                                    : playbook._count.deliverables,
                            )}
                        />
                    </div>
                }
            />

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Résumé
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <InfoBlock
                            label={isRequestOs ? "Domaine" : "Offre / type"}
                            value={
                                isRequestOs
                                    ? "Commercial"
                                    : formatKeyLabel(
                                          playbook.sourceProjectOsId ??
                                              playbook.sourceTemplateId ??
                                              playbook.key,
                                      )
                            }
                        />
                        <InfoBlock
                            label={isRequestOs ? "Déclenchement" : "Référence"}
                            value={
                                isRequestOs
                                    ? "Nouvelle demande client"
                                    : (playbook.sourceProjectOsId ?? "Non renseignée")
                            }
                        />
                        {isRequestOs ? (
                            <InfoBlock
                                label="Fin du parcours"
                                value="Fiche projet centrale créée"
                            />
                        ) : (
                            <InfoBlock
                                label="Identifiant interne"
                                value={playbook.key}
                            />
                        )}
                        <InfoBlock
                            label={isRequestOs ? "Utilisation" : "Instances projet"}
                            value={
                                isRequestOs
                                    ? "Méthode de référence"
                                    : String(playbook._count.instances)
                            }
                        />
                    </div>
                    {playbook.description ? (
                        <p className="mt-5 text-body-small text-[color:var(--color-text-muted)]">
                            {playbook.description}
                        </p>
                    ) : null}
                </div>

                <aside className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Règle de contrôle
                    </p>
                    <div className="mt-4 grid gap-3">
                        <Badge tone="info">Méthode de référence</Badge>
                        <Badge tone="neutral">{getPlaybookStatus(playbook.status).label}</Badge>
                        <Badge tone={playbook.priority === "PRIORITY" ? "success" : "draft"}>
                            {playbook.priority === "PRIORITY" ? "Prioritaire" : "Parking"}
                        </Badge>
                    </div>
                    <p className="mt-5 text-body-small text-[color:var(--color-text-muted)]">
                        {isRequestOs
                            ? "Cette méthode pilote l’opportunité avant conversion. Elle prépare la fiche projet centrale et la passation, sans créer automatiquement la production."
                            : "Un projet ne modifie jamais cette méthode de référence. L’application créera une copie de travail séparée, déclenchée uniquement par une action admin explicite."}
                    </p>
                </aside>
            </section>

            {!isRequestOs && playbook.modules.length ? (
                <ModulesPanel playbook={playbook} />
            ) : null}

            {isRequestOs && commercialReference ? (
                <CommercialReferencePanel reference={commercialReference} />
            ) : null}

            {!isRequestOs || !commercialReference ? (
                <PlaybookWorkflowTabs
                    actions={playbook.actions}
                    deliverables={playbook.deliverables}
                    documents={playbook.documents}
                    gates={playbook.gates}
                    lots={workflowLots}
                    mode={isRequestOs ? "request" : "project"}
                    playbookId={playbook.id}
                />
            ) : null}

            {(!isRequestOs || !commercialReference) &&
            (orphanActions.length ||
                orphanDeliverables.length ||
                orphanDocuments.length) ? (
                <UnlinkedPanel
                    actions={orphanActions}
                    deliverables={orphanDeliverables}
                    documents={orphanDocuments}
                />
            ) : null}
        </AdminPageShell>
    );
}

function CommercialReferencePanel({
    reference,
}: {
    reference: CommercialPlaybookReference;
}) {
    const stepGroups = groupCommercialSteps(reference.steps);

    return (
        <section className="grid gap-4">
            <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
                <div className="grid gap-5 border-b border-[color:var(--color-border-subtle)] p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="info">Document officiel</Badge>
                            <Badge tone="neutral">Méthode commerciale</Badge>
                        </div>
                        <p className="mt-4 text-label uppercase text-[color:var(--color-decor-gold)]">
                            Référence commerciale
                        </p>
                        <h2 className="mt-1 text-h2 text-[color:var(--color-text-default)]">
                            Lecture métier du tunnel commercial
                        </h2>
                        <p className="mt-3 max-w-[980px] whitespace-pre-line text-body-small text-[color:var(--color-text-muted)]">
                            {reference.objective}
                        </p>
                    </div>

                    <div className="grid min-w-[240px] gap-2 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
                        <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                            À suivre en priorité
                        </p>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-body-small text-[color:var(--color-text-muted)]">
                                Prochaine action
                            </span>
                            <ArrowRight
                                className="size-4 text-[color:var(--color-action-default)]"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-body-small text-[color:var(--color-text-muted)]">
                                Relance
                            </span>
                            <Clock3
                                className="size-4 text-[color:var(--color-action-default)]"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-body-small text-[color:var(--color-text-muted)]">
                                Validation
                            </span>
                            <ShieldCheck
                                className="size-4 text-[color:var(--color-action-default)]"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 p-5 lg:grid-cols-3">
                    <CommercialReferenceList
                        icon={<Eye className="size-4" aria-hidden="true" />}
                        title="Ce que l'admin surveille"
                        items={reference.adminView}
                    />
                    <CommercialReferenceList
                        icon={<UserCheck className="size-4" aria-hidden="true" />}
                        title="Ce que le client voit"
                        items={reference.clientView}
                    />
                    <CommercialReferenceList
                        icon={<Clock3 className="size-4" aria-hidden="true" />}
                        title="Règles de relance"
                        items={reference.followUps}
                    />
                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,340px)]">
                <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
                    <div className="border-b border-[color:var(--color-border-subtle)] px-5 py-4">
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Étapes commerciales
                        </p>
                        <div className="mt-1 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <h3 className="text-h3 text-[color:var(--color-text-default)]">
                                Le parcours de la demande à la conversion
                            </h3>
                            <Badge tone="neutral">{reference.steps.length} étapes</Badge>
                        </div>
                    </div>

                    <div className="grid gap-4 p-4 sm:p-5">
                        {stepGroups.map((group) => (
                            <CommercialStepGroup
                                key={group.title}
                                description={group.description}
                                steps={group.steps}
                                title={group.title}
                            />
                        ))}
                    </div>
                </div>

                <aside className="grid gap-4 self-start xl:sticky xl:top-24">
                    <ConversionRulePanel reference={reference} />
                </aside>
            </div>
        </section>
    );
}

function CommercialStepGroup({
    description,
    steps,
    title,
}: {
    description: string;
    steps: CommercialStep[];
    title: string;
}) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-label text-[color:var(--color-text-default)]">
                        {title}
                    </p>
                    <p className="mt-1 max-w-[720px] text-caption text-[color:var(--color-text-muted)]">
                        {description}
                    </p>
                </div>
                <Badge tone="neutral" className="w-fit shrink-0 whitespace-nowrap px-4">
                    {steps.length} étape(s)
                </Badge>
            </div>

            <ol className="mt-4 grid gap-3">
                {steps.map((step) => (
                    <CommercialStepCard key={`${step.order}-${step.title}`} step={step} />
                ))}
            </ol>
        </section>
    );
}

function CommercialStepCard({ step }: { step: CommercialStep }) {
    return (
        <li className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-7 min-w-10 items-center justify-center rounded-full bg-[var(--color-action-default)] px-2 text-label text-[color:var(--color-text-inverse)]">
                            {step.order}
                        </span>
                        <h4 className="text-h3 text-[color:var(--color-text-default)]">
                            {step.title}
                        </h4>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-body-small text-[color:var(--color-text-muted)]">
                        {step.objective}
                    </p>
                </div>

                {step.validation ? (
                    <Badge tone="warning" className="w-fit lg:justify-self-end">
                        {step.validation}
                    </Badge>
                ) : null}
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-3">
                <CommercialStepInfo
                    label="Action clé"
                    value={formatCommercialItems(step.todos, "À définir")}
                />
                <CommercialStepInfo
                    label="Relance"
                    value={formatCommercialListItem(step.followUp || "Selon avancement")}
                />
                <CommercialStepInfo
                    label="Document"
                    value={formatCommercialItems(step.documents, "Aucun document")}
                />
            </div>

            {step.expectedOutput ? (
                <div className="mt-3 rounded-xl bg-[var(--color-surface-interactive)] px-3 py-2">
                    <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                        Sortie attendue
                    </p>
                    <CommercialInfoText value={formatCommercialListItem(step.expectedOutput)} />
                </div>
            ) : null}
        </li>
    );
}

function CommercialStepInfo({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3">
            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {label}
            </p>
            <CommercialInfoText value={value} />
        </div>
    );
}

function CommercialInfoText({ value }: { value: string }) {
    const lines = value
        .split(/\n+/)
        .map(formatCommercialListItem)
        .filter(Boolean);

    if (lines.length <= 1) {
        return (
            <p className="mt-1 text-caption leading-relaxed text-[color:var(--color-text-muted)]">
                {lines[0] ?? value}
            </p>
        );
    }

    return (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-caption leading-relaxed text-[color:var(--color-text-muted)]">
            {lines.map((line) => (
                <li key={line}>{line}</li>
            ))}
        </ul>
    );
}

function groupCommercialSteps(steps: CommercialStep[]) {
    return COMMERCIAL_STEP_GROUPS.map((group) => ({
        ...group,
        steps: steps.filter(
            (step) => step.order >= group.from && step.order <= group.to,
        ),
    })).filter((group) => group.steps.length > 0);
}

function formatCommercialListItem(value: string) {
    return value
        .trim()
        .replace(/^-\s+/u, "")
        .replace(/^#{1,6}\s+/u, "")
        .replace(/[.;:]+$/u, "");
}

function formatCommercialItems(items: string[], fallback: string) {
    const values = items.map(formatCommercialListItem).filter(Boolean);

    return values.length ? values.join("\n") : fallback;
}

function ConversionRulePanel({
    reference,
}: {
    reference: CommercialPlaybookReference;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="border-b border-[color:var(--color-border-subtle)] p-5">
                <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]">
                        <Target className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                            Conversion
                        </p>
                        <h3 className="text-h3 text-[color:var(--color-text-default)]">
                            Règle de passage en projet
                        </h3>
                    </div>
                </div>
            </div>
            <div className="grid gap-3 p-5">
                <CommercialReferenceList
                    compact
                    icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
                    title="Possible si"
                    items={reference.conversionRule.allowedWhen}
                />
                <CommercialReferenceList
                    compact
                    icon={<ArrowRight className="size-4" aria-hidden="true" />}
                    title="Crée"
                    items={reference.conversionRule.creates}
                />
                <CommercialReferenceList
                    compact
                    icon={<ShieldCheck className="size-4" aria-hidden="true" />}
                    title="Ne crée pas"
                    items={reference.conversionRule.doesNotCreate}
                />
            </div>
        </div>
    );
}

function CommercialReferenceList({
    compact = false,
    icon,
    items,
    title,
}: {
    compact?: boolean;
    icon?: ReactNode;
    items: string[];
    title: string;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
            <div className="flex items-center gap-2 text-label text-[color:var(--color-text-default)]">
                {icon ? (
                    <span className="text-[color:var(--color-action-default)]">
                        {icon}
                    </span>
                ) : null}
                {title}
            </div>
            <ul className={`mt-3 grid ${compact ? "gap-1.5" : "gap-2"}`}>
                {items.length ? (
                    items.map((item) => (
                        <li
                            key={item}
                            className="flex gap-2 text-body-small text-[color:var(--color-text-muted)]"
                        >
                            <CheckCircle2
                                className="mt-0.5 size-4 shrink-0 text-[color:var(--color-action-default)]"
                                aria-hidden="true"
                            />
                            <span>{item}</span>
                        </li>
                    ))
                ) : (
                    <li className="text-caption text-[color:var(--color-text-subtle)]">
                        Rien à afficher pour le moment.
                    </li>
                )}
            </ul>
        </div>
    );
}

function UnlinkedPanel({
    actions,
    deliverables,
    documents,
}: {
    actions: Action[];
    deliverables: Deliverable[];
    documents: DocumentTemplate[];
}) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-warning-border)] bg-[var(--color-surface-default)] p-5">
            <div className="flex items-start gap-3">
                <CircleDot
                    className="mt-0.5 size-5 shrink-0 text-[color:var(--color-warning-text)]"
                    aria-hidden="true"
                />
                <div>
                    <p className="text-label uppercase text-[color:var(--color-warning-text)]">
                        Éléments à rattacher
                    </p>
                    <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                        Certains éléments existent dans la méthode mais ne sont pas reliés à
                        une phase. Ce n’est pas bloquant pour lire le playbook, mais ça devra
                        être clarifié avant une génération de production plus fine.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge tone="warning">Tâches : {actions.length}</Badge>
                        <Badge tone="warning">Livrables : {deliverables.length}</Badge>
                        <Badge tone="warning">Documents : {documents.length}</Badge>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ModulesPanel({ playbook }: { playbook: Playbook }) {
    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Modules optionnels
                    </p>
                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                        Options activables ou non lors de la conversion d’une
                        opportunité. Un module vide est une coquille à compléter
                        avant d’être proposé.
                    </p>
                </div>
                <Badge tone="info">{playbook.modules.length} module(s)</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {playbook.modules.map((moduleTemplate) => {
                    const counts = getModuleContentCounts(
                        playbook,
                        moduleTemplate.key,
                    );
                    const isEmpty = counts.total === 0;

                    return (
                        <article
                            key={moduleTemplate.id}
                            className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-label text-[color:var(--color-text-default)]">
                                    {moduleTemplate.name}
                                </p>
                                <Badge tone={isEmpty ? "warning" : "success"}>
                                    {isEmpty ? "À compléter" : "Prêt"}
                                </Badge>
                            </div>
                            {moduleTemplate.description ? (
                                <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                                    {moduleTemplate.description}
                                </p>
                            ) : null}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {isEmpty ? (
                                    <p className="text-caption text-[color:var(--color-text-subtle)]">
                                        Aucun contenu rattaché — phases,
                                        livrables et tâches à définir dans le
                                        référentiel.
                                    </p>
                                ) : (
                                    <>
                                        <Badge tone="neutral">
                                            {counts.phases} phase(s)
                                        </Badge>
                                        <Badge tone="neutral">
                                            {counts.deliverables} livrable(s)
                                        </Badge>
                                        <Badge tone="neutral">
                                            {counts.actions} tâche(s)
                                        </Badge>
                                        <Badge tone="neutral">
                                            {counts.gates} validation(s)
                                        </Badge>
                                    </>
                                )}
                            </div>
                            <details className="group mt-3">
                                <summary className="focus-ring inline-flex min-h-11 cursor-pointer list-none items-center rounded-full text-label text-[color:var(--color-action-default)] underline-offset-4 hover:underline">
                                    <span className="group-open:hidden">
                                        Modifier le module
                                    </span>
                                    <span className="hidden group-open:inline">
                                        Fermer sans enregistrer
                                    </span>
                                </summary>
                                <form
                                    action={updatePlaybookModuleAction}
                                    className="mt-3 grid gap-3"
                                >
                                    <input
                                        type="hidden"
                                        name="moduleId"
                                        value={moduleTemplate.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="playbookId"
                                        value={playbook.id}
                                    />
                                    <TextField
                                        label="Nom du module"
                                        name="name"
                                        defaultValue={moduleTemplate.name}
                                        required
                                        maxLength={160}
                                    />
                                    <Textarea
                                        label="Description"
                                        helperText="Visible lors du choix des options à la conversion."
                                        name="description"
                                        defaultValue={
                                            moduleTemplate.description ?? ""
                                        }
                                        rows={3}
                                        maxLength={500}
                                        className="[&_textarea]:min-h-24"
                                    />
                                    <Button type="submit" size="sm">
                                        Enregistrer le module
                                    </Button>
                                </form>
                            </details>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

function getModuleContentCounts(playbook: Playbook, moduleKey: string) {
    const phases = playbook.phases.filter(
        (phase) => phase.moduleKey === moduleKey,
    ).length;
    const deliverables = playbook.deliverables.filter(
        (deliverable) => deliverable.moduleKey === moduleKey,
    ).length;
    const actions = playbook.actions.filter(
        (action) => action.moduleKey === moduleKey,
    ).length;
    const gates = playbook.gates.filter(
        (gate) => gate.moduleKey === moduleKey,
    ).length;

    return {
        actions,
        deliverables,
        gates,
        phases,
        total: phases + deliverables + actions + gates,
    };
}

function InfoBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
            <p className="text-caption uppercase text-[color:var(--color-text-subtle)]">
                {label}
            </p>
            <p className="mt-2 break-words text-label text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
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
                <span className="text-[color:var(--color-action-default)]">{icon}</span>
            </div>
            <p className="mt-3 text-h3 text-[color:var(--color-text-default)]">
                {value}
            </p>
        </div>
    );
}

function buildWorkflowLots(playbook: Playbook): PlaybookWorkflowLot[] {
    const lotDetailsById = getLotDetailsById(playbook.sourceSnapshot);
    const groupedPhases = new Map<string, Phase[]>();

    playbook.phases.forEach((phase) => {
        const lotId = phase.sourceLotKey ?? "lot_non_classe";
        const currentPhases = groupedPhases.get(lotId) ?? [];

        groupedPhases.set(lotId, [...currentPhases, phase]);
    });

    return Array.from(groupedPhases, ([lotId, lotPhases]) => {
        const lotDetail = lotDetailsById.get(lotId);

        return {
            id: lotId,
            name: lotDetail?.name ?? formatKeyLabel(lotId),
            objective: lotDetail?.objective ?? null,
            phases: lotPhases,
        };
    }).sort((left, right) => {
        const leftOrder = left.phases[0]?.sortOrder ?? 0;
        const rightOrder = right.phases[0]?.sortOrder ?? 0;

        return leftOrder - rightOrder;
    });
}

function getLotDetailsById(
    sourceSnapshot: Playbook["sourceSnapshot"],
): Map<string, { name: string; objective: string | null }> {
    const rawLots = isRecord(sourceSnapshot)
        ? Array.isArray(sourceSnapshot.lots)
            ? sourceSnapshot.lots
            : Array.isArray(sourceSnapshot.groups)
              ? sourceSnapshot.groups
              : []
        : [];
    const lotDetailsById = new Map<
        string,
        { name: string; objective: string | null }
    >();

    rawLots.forEach((lot) => {
        if (!isRecord(lot) || typeof lot.id !== "string") {
            return;
        }

        lotDetailsById.set(lot.id, {
            name: typeof lot.name === "string" ? lot.name : formatKeyLabel(lot.id),
            objective:
                typeof lot.objective === "string" ? lot.objective : null,
        });
    });

    return lotDetailsById;
}

function isRequestOsPlaybook(playbook: Playbook) {
    return (
        playbook.sourceTemplateId?.startsWith("request-os") ||
        getSnapshotKind(playbook.sourceSnapshot) === "request-os-playbook"
    );
}

function getSnapshotKind(sourceSnapshot: unknown) {
    return isRecord(sourceSnapshot) && typeof sourceSnapshot.kind === "string"
        ? sourceSnapshot.kind
        : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatKeyLabel(value: string) {
    return value
        .replace(/^template_/, "")
        .replace(/^lot_/, "")
        .replace(/^phase_/, "")
        .replace(/^validation_/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
