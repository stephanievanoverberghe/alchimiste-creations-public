"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { CheckCircle2, FileText, ListChecks, PackageCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Badge, Button, Checkbox, TextField, Textarea } from "@/components/ui";
import {
    updatePlaybookDeliverableAction,
    updatePlaybookDocumentAction,
    updatePlaybookPhaseAction,
} from "@/server/playbooks/actions";

export type PlaybookWorkflowPhase = {
    description: string | null;
    id: string;
    key: string;
    name: string;
    sortOrder: number;
    sourceLotKey: string | null;
    sourceSnapshot: unknown;
};

export type PlaybookWorkflowAction = {
    description: string | null;
    id: string;
    isBlocking: boolean;
    key: string;
    ownerRole: string | null;
    sourcePhaseKey: string | null;
    title: string;
};

export type PlaybookWorkflowDeliverable = {
    description: string | null;
    id: string;
    isClientVisible: boolean;
    isRequired: boolean;
    key: string;
    name: string;
    sourcePhaseKey: string | null;
};

export type PlaybookWorkflowDocument = {
    id: string;
    key: string;
    name: string;
    recommendedFormat: string | null;
    sourcePhaseKey: string | null;
    usage: string | null;
    visibility: string | null;
};

export type PlaybookWorkflowGate = {
    id: string;
    key: string;
    name: string;
    objectType: string | null;
    proofRequired: boolean;
    required: boolean;
    type: string | null;
    unblocks: unknown;
};

export type PlaybookWorkflowLot = {
    id: string;
    name: string;
    objective: string | null;
    phases: PlaybookWorkflowPhase[];
};

type PlaybookWorkflowTabsProps = {
    actions: PlaybookWorkflowAction[];
    deliverables: PlaybookWorkflowDeliverable[];
    documents: PlaybookWorkflowDocument[];
    gates: PlaybookWorkflowGate[];
    lots: PlaybookWorkflowLot[];
    mode?: "project" | "request";
    playbookId?: string;
};

export function PlaybookWorkflowTabs({
    actions,
    deliverables,
    documents,
    gates,
    lots,
    mode = "project",
    playbookId,
}: PlaybookWorkflowTabsProps) {
    const defaultValue = lots[0]?.id ?? "";
    const phaseKeys = new Set(lots.flatMap((lot) => lot.phases.map((phase) => phase.key)));
    const orderedPhases = lots.flatMap((lot) => lot.phases);
    const transverseGates = gates.filter(
        (gate) =>
            !getPhaseForGate(gate, orderedPhases) ||
            !getGateUnblocks(gate).some((phaseKey) => phaseKeys.has(phaseKey)),
    );

    return (
        <section className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]">
            <div className="border-b border-[color:var(--color-border-subtle)] p-5">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Workflow
                </p>
                <h2 className="mt-1 text-h3 text-[color:var(--color-text-default)]">
                    {mode === "request" ? "Déroulé commercial" : "Déroulé par lot"}
                </h2>
                <p className="mt-2 max-w-[860px] text-body-small text-[color:var(--color-text-muted)]">
                    {mode === "request"
                        ? "Choisis un bloc commercial, puis lis les étapes dans l’ordre. Les délais et relances indiquent quand agir avant que l’opportunité devienne à risque."
                        : "Choisis un lot, puis lis ses phases dans l’ordre. Les validations sont intégrées directement dans les phases qu’elles débloquent."}
                </p>
            </div>

            {lots.length > 0 ? (
                <Tabs.Root defaultValue={defaultValue}>
                    <Tabs.List
                        aria-label={
                            mode === "request"
                                ? "Blocs du playbook commercial"
                                : "Lots du playbook"
                        }
                        className="flex gap-2 overflow-x-auto border-b border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3"
                    >
                        {lots.map((lot, index) => (
                            <Tabs.Trigger
                                key={lot.id}
                                value={lot.id}
                                className="focus-ring group flex min-w-[210px] items-center gap-3 rounded-2xl border border-transparent bg-[var(--color-surface-default)] px-3 py-2 text-left transition-[background-color,border-color] hover:border-[color:var(--color-action-hover)] hover:bg-[var(--color-action-subtle)] data-[state=active]:border-[color:var(--color-action-default)] data-[state=active]:bg-[var(--color-action-subtle)]"
                            >
                                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-interactive)] text-caption text-[color:var(--color-action-default)] group-data-[state=active]:bg-[var(--color-action-default)] group-data-[state=active]:text-[color:var(--color-text-inverse)]">
                                    {index + 1}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-label text-[color:var(--color-text-default)]">
                                        {lot.name}
                                    </span>
                                    <span className="block text-caption text-[color:var(--color-text-muted)]">
                                        {lot.phases.length} phase(s)
                                    </span>
                                </span>
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>

                    {lots.map((lot, lotIndex) => (
                        <Tabs.Content
                            key={lot.id}
                            value={lot.id}
                            className="outline-none data-[state=active]:animate-[tabs-panel-in_180ms_ease-out]"
                        >
                            <LotPanel
                                actions={actions}
                                deliverables={deliverables}
                                documents={documents}
                                gates={gates}
                                lot={lot}
                                lotIndex={lotIndex}
                                mode={mode}
                                orderedPhases={orderedPhases}
                                playbookId={playbookId}
                            />
                        </Tabs.Content>
                    ))}
                </Tabs.Root>
            ) : (
                <p className="p-5 text-body-small text-[color:var(--color-text-muted)]">
                    Aucune phase rattachée à ce playbook.
                </p>
            )}

            {transverseGates.length ? (
                <div className="border-t border-[color:var(--color-border-subtle)] p-5">
                    <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                        Validations transverses
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {transverseGates.map((gate) => (
                            <Badge key={gate.id} tone="warning" size="sm">
                                {gate.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            ) : null}
        </section>
    );
}

function LotPanel({
    actions,
    deliverables,
    documents,
    gates,
    lot,
    lotIndex,
    mode,
    orderedPhases,
    playbookId,
}: {
    actions: PlaybookWorkflowAction[];
    deliverables: PlaybookWorkflowDeliverable[];
    documents: PlaybookWorkflowDocument[];
    gates: PlaybookWorkflowGate[];
    lot: PlaybookWorkflowLot;
    lotIndex: number;
    mode: "project" | "request";
    orderedPhases: PlaybookWorkflowPhase[];
    playbookId?: string;
}) {
    return (
        <div className="grid gap-4 p-5">
            <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4">
                <div className="flex items-start gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-default)] text-label text-[color:var(--color-text-inverse)]">
                        {lotIndex + 1}
                    </span>
                    <div className="min-w-0">
                        <p className="text-h3 text-[color:var(--color-text-default)]">
                            {lot.name}
                        </p>
                        {lot.objective ? (
                            <p className="mt-2 max-w-[860px] text-body-small text-[color:var(--color-text-muted)]">
                                {lot.objective}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid gap-3">
                {lot.phases.map((phase, phaseIndex) => (
                    <PhaseCard
                        key={phase.id}
                        actions={actions.filter(
                            (action) => action.sourcePhaseKey === phase.key,
                        )}
                        deliverables={deliverables.filter(
                            (deliverable) => deliverable.sourcePhaseKey === phase.key,
                        )}
                        documents={documents.filter(
                            (document) => document.sourcePhaseKey === phase.key,
                        )}
                        gates={gates.filter(
                            (gate) =>
                                getPhaseForGate(gate, orderedPhases)?.key === phase.key,
                        )}
                        phase={phase}
                        phaseIndex={phaseIndex}
                        mode={mode}
                        playbookId={playbookId}
                    />
                ))}
            </div>
        </div>
    );
}

function PhaseCard({
    actions,
    deliverables,
    documents,
    gates,
    mode,
    phase,
    phaseIndex,
    playbookId,
}: {
    actions: PlaybookWorkflowAction[];
    deliverables: PlaybookWorkflowDeliverable[];
    documents: PlaybookWorkflowDocument[];
    gates: PlaybookWorkflowGate[];
    mode: "project" | "request";
    phase: PlaybookWorkflowPhase;
    phaseIndex: number;
    playbookId?: string;
}) {
    const timing = getCommercialTiming(phase.sourceSnapshot);

    return (
        <article className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="brand" size="sm">
                            {mode === "request" ? "Étape" : "Phase"} {phaseIndex + 1}
                        </Badge>
                        <span className="text-caption text-[color:var(--color-text-subtle)]">
                            {phase.key}
                        </span>
                    </div>
                    <h3 className="mt-2 text-h3 text-[color:var(--color-text-default)]">
                        {phase.name}
                    </h3>
                    {phase.description ? (
                        <p className="mt-2 max-w-[760px] text-body-small text-[color:var(--color-text-muted)]">
                            {phase.description}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                    {gates.length ? (
                        <Badge tone="warning" size="sm">
                            {gates.length} validation(s)
                        </Badge>
                    ) : null}
                    <Badge tone="neutral" size="sm">
                        {actions.length} tâche(s)
                    </Badge>
                    <Badge tone="success" size="sm">
                        {deliverables.length} livrable(s)
                    </Badge>
                    <Badge tone="info" size="sm">
                        {documents.length} document(s)
                    </Badge>
                </div>
            </div>

            {playbookId ? (
                <details className="group mt-3">
                    <summary className="focus-ring inline-flex min-h-11 cursor-pointer list-none items-center rounded-full text-label text-[color:var(--color-action-default)] underline-offset-4 hover:underline">
                        <span className="group-open:hidden">
                            Modifier la phase
                        </span>
                        <span className="hidden group-open:inline">
                            Fermer sans enregistrer
                        </span>
                    </summary>
                    <form
                        action={updatePlaybookPhaseAction}
                        className="mt-3 grid max-w-[760px] gap-3"
                    >
                        <input type="hidden" name="phaseId" value={phase.id} />
                        <input
                            type="hidden"
                            name="playbookId"
                            value={playbookId}
                        />
                        <TextField
                            label="Nom de la phase"
                            name="name"
                            defaultValue={phase.name}
                            required
                            maxLength={160}
                        />
                        <Textarea
                            label="Description / definition of done"
                            helperText="Ce que cette phase doit produire pour être considérée comme terminée."
                            name="description"
                            defaultValue={phase.description ?? ""}
                            rows={3}
                            maxLength={600}
                            className="[&_textarea]:min-h-24"
                        />
                        <Button type="submit" size="sm" className="justify-self-start">
                            Enregistrer la phase
                        </Button>
                    </form>
                </details>
            ) : null}

            {mode === "request" && timing ? (
                <CommercialTimingPanel timing={timing} />
            ) : null}

            {gates.length ? (
                <PhaseValidations gates={gates} />
            ) : null}

            <div className="mt-4 grid gap-3 xl:grid-cols-3">
                <PhaseList
                    emptyLabel="Aucune tâche."
                    icon={<ListChecks className="size-4" aria-hidden="true" />}
                    items={actions.map((action) => ({
                        id: action.id,
                        label: action.title,
                        meta: action.ownerRole ? formatKeyLabel(action.ownerRole) : null,
                        tone: action.isBlocking ? "warning" : "neutral",
                    }))}
                    title="À faire"
                />
                <PhaseList
                    emptyLabel={mode === "request" ? "Aucune sortie." : "Aucun livrable."}
                    icon={<PackageCheck className="size-4" aria-hidden="true" />}
                    items={deliverables.map((deliverable) => ({
                        id: deliverable.id,
                        label: deliverable.name,
                        meta: deliverable.isClientVisible
                            ? "Client"
                            : deliverable.isRequired
                              ? "Requis"
                              : null,
                        tone: deliverable.isClientVisible ? "info" : "success",
                    }))}
                    title={mode === "request" ? "Sortie attendue" : "À produire"}
                />
                <PhaseList
                    emptyLabel="Aucun document."
                    icon={<FileText className="size-4" aria-hidden="true" />}
                    items={documents.map((document) => ({
                        id: document.id,
                        label: document.name,
                        meta: document.visibility
                            ? formatKeyLabel(document.visibility)
                            : document.recommendedFormat,
                        tone: "info",
                    }))}
                    title="À préparer"
                />
            </div>

            {playbookId && deliverables.length ? (
                <details className="group mt-3">
                    <summary className="focus-ring inline-flex min-h-11 cursor-pointer list-none items-center rounded-full text-label text-[color:var(--color-action-default)] underline-offset-4 hover:underline">
                        <span className="group-open:hidden">
                            Modifier les livrables ({deliverables.length})
                        </span>
                        <span className="hidden group-open:inline">
                            Fermer sans enregistrer
                        </span>
                    </summary>
                    <div className="mt-3 grid gap-3">
                        {deliverables.map((deliverable) => (
                            <form
                                key={deliverable.id}
                                action={updatePlaybookDeliverableAction}
                                className="grid max-w-[760px] gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                            >
                                <input
                                    type="hidden"
                                    name="deliverableId"
                                    value={deliverable.id}
                                />
                                <input
                                    type="hidden"
                                    name="playbookId"
                                    value={playbookId}
                                />
                                <TextField
                                    label="Nom du livrable"
                                    name="name"
                                    defaultValue={deliverable.name}
                                    required
                                    maxLength={160}
                                />
                                <Textarea
                                    label="Description"
                                    name="description"
                                    defaultValue={deliverable.description ?? ""}
                                    rows={2}
                                    maxLength={600}
                                    className="[&_textarea]:min-h-20"
                                />
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Checkbox
                                        label="Obligatoire pour terminer la phase"
                                        name="isRequired"
                                        defaultChecked={deliverable.isRequired}
                                    />
                                    <Checkbox
                                        label="Visible par le client"
                                        name="isClientVisible"
                                        defaultChecked={
                                            deliverable.isClientVisible
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="justify-self-start"
                                >
                                    Enregistrer le livrable
                                </Button>
                            </form>
                        ))}
                    </div>
                </details>
            ) : null}

            {playbookId && documents.length ? (
                <details className="group mt-3">
                    <summary className="focus-ring inline-flex min-h-11 cursor-pointer list-none items-center rounded-full text-label text-[color:var(--color-action-default)] underline-offset-4 hover:underline">
                        <span className="group-open:hidden">
                            Modifier les documents ({documents.length})
                        </span>
                        <span className="hidden group-open:inline">
                            Fermer sans enregistrer
                        </span>
                    </summary>
                    <div className="mt-3 grid gap-3">
                        {documents.map((document) => (
                            <form
                                key={document.id}
                                action={updatePlaybookDocumentAction}
                                className="grid max-w-[760px] gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-4"
                            >
                                <input
                                    type="hidden"
                                    name="documentId"
                                    value={document.id}
                                />
                                <input
                                    type="hidden"
                                    name="playbookId"
                                    value={playbookId}
                                />
                                <TextField
                                    label="Nom du document"
                                    name="name"
                                    defaultValue={document.name}
                                    required
                                    maxLength={160}
                                />
                                <Textarea
                                    label="Usage"
                                    helperText="À quoi sert ce document et à quel moment l'utiliser."
                                    name="usage"
                                    defaultValue={document.usage ?? ""}
                                    rows={2}
                                    maxLength={600}
                                    className="[&_textarea]:min-h-20"
                                />
                                <TextField
                                    label="Format recommandé"
                                    name="recommendedFormat"
                                    defaultValue={
                                        document.recommendedFormat ?? ""
                                    }
                                    maxLength={120}
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="justify-self-start"
                                >
                                    Enregistrer le document
                                </Button>
                            </form>
                        ))}
                    </div>
                </details>
            ) : null}
        </article>
    );
}

function PhaseValidations({ gates }: { gates: PlaybookWorkflowGate[] }) {
    return (
        <div className="mt-4 rounded-xl border border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] p-3">
            <div className="flex items-center gap-2 text-label text-[color:var(--color-warning-text)]">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Validation de sortie
            </div>
            <p className="mt-1 text-caption text-[color:var(--color-warning-text)]">
                À valider avant d’ouvrir la phase ou le lot suivant.
            </p>
            <ul className="mt-3 grid gap-2">
                {gates.map((gate) => (
                    <li
                        key={gate.id}
                        className="flex flex-col gap-2 rounded-lg bg-[var(--color-surface-default)] px-3 py-2"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-body-small text-[color:var(--color-text-default)]">
                                {gate.name}
                            </span>
                            <span className="flex flex-wrap gap-2">
                                <Badge tone="warning" size="sm">
                                    {formatKeyLabel(gate.type ?? "gate")}
                                </Badge>
                                {gate.proofRequired ? (
                                    <Badge tone="info" size="sm">
                                        Preuve
                                    </Badge>
                                ) : null}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

type CommercialTiming = {
    followUpAfterHours: number | null;
    maxDurationHours: number | null;
    recommendedNextAction: string | null;
    riskLevelWhenOverdue: string | null;
    staleAfterHours: number | null;
    targetDurationHours: number | null;
};

function CommercialTimingPanel({ timing }: { timing: CommercialTiming }) {
    return (
        <div className="mt-4 rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3">
            <div className="flex flex-wrap gap-2">
                <Badge tone="info" size="sm">
                    Cible : {formatHours(timing.targetDurationHours)}
                </Badge>
                <Badge tone="warning" size="sm">
                    Alerte : {formatHours(timing.maxDurationHours)}
                </Badge>
                <Badge tone="neutral" size="sm">
                    Relance : {formatHours(timing.followUpAfterHours)}
                </Badge>
                <Badge tone="draft" size="sm">
                    Froid : {formatHours(timing.staleAfterHours)}
                </Badge>
                {timing.riskLevelWhenOverdue ? (
                    <Badge tone="warning" size="sm">
                        Risque : {timing.riskLevelWhenOverdue}
                    </Badge>
                ) : null}
            </div>
            {timing.recommendedNextAction ? (
                <p className="mt-3 text-caption text-[color:var(--color-text-muted)]">
                    Action si ça bloque : {timing.recommendedNextAction}
                </p>
            ) : null}
        </div>
    );
}

function getCommercialTiming(sourceSnapshot: unknown): CommercialTiming | null {
    if (!isRecord(sourceSnapshot)) return null;

    const timing = {
        followUpAfterHours: getNumber(sourceSnapshot.followUpAfterHours),
        maxDurationHours: getNumber(sourceSnapshot.maxDurationHours),
        recommendedNextAction: getString(sourceSnapshot.recommendedNextAction),
        riskLevelWhenOverdue: getString(sourceSnapshot.riskLevelWhenOverdue),
        staleAfterHours: getNumber(sourceSnapshot.staleAfterHours),
        targetDurationHours: getNumber(sourceSnapshot.targetDurationHours),
    };

    return Object.values(timing).some((value) => value !== null) ? timing : null;
}

function formatHours(value: number | null) {
    if (!value) return "non défini";
    if (value < 24) return `${value}h`;

    const days = value / 24;

    return Number.isInteger(days) ? `J+${days}` : `${value}h`;
}

function getNumber(value: unknown) {
    return typeof value === "number" ? value : null;
}

function getString(value: unknown) {
    return typeof value === "string" && value.trim() ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function PhaseList({
    emptyLabel,
    icon,
    items,
    title,
}: {
    emptyLabel: string;
    icon: ReactNode;
    items: Array<{
        id: string;
        label: string;
        meta: string | null;
        tone: "info" | "neutral" | "success" | "warning";
    }>;
    title: string;
}) {
    return (
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] p-3">
            <div className="flex items-center gap-2 text-label text-[color:var(--color-text-default)]">
                <span className="text-[color:var(--color-action-default)]">{icon}</span>
                {title}
            </div>
            <ul className="mt-3 grid gap-2">
                {items.length ? (
                    items.map((item) => (
                        <li
                            key={item.id}
                            className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-[var(--color-surface-default)] px-3 py-2"
                        >
                            <span className="min-w-0 truncate text-body-small text-[color:var(--color-text-default)]">
                                {item.label}
                            </span>
                            {item.meta ? (
                                <Badge tone={item.tone} size="sm" className="shrink-0">
                                    {item.meta}
                                </Badge>
                            ) : null}
                        </li>
                    ))
                ) : (
                    <li className="text-caption text-[color:var(--color-text-muted)]">
                        {emptyLabel}
                    </li>
                )}
            </ul>
        </div>
    );
}

function getGateUnblocks(gate: PlaybookWorkflowGate) {
    return Array.isArray(gate.unblocks)
        ? gate.unblocks.filter((item): item is string => typeof item === "string")
        : [];
}

function getPhaseForGate(
    gate: PlaybookWorkflowGate,
    orderedPhases: PlaybookWorkflowPhase[],
) {
    const directPhase = orderedPhases.find((phase) =>
        gate.key.startsWith(`${phase.key}_`),
    );

    if (directPhase) return directPhase;

    const unblockedPhaseIndexes = getGateUnblocks(gate)
        .map((phaseKey) =>
            orderedPhases.findIndex((phase) => phase.key === phaseKey),
        )
        .filter((index) => index > -1)
        .sort((left, right) => left - right);

    const firstUnblockedPhaseIndex = unblockedPhaseIndexes[0];

    if (firstUnblockedPhaseIndex === undefined) {
        return null;
    }

    return orderedPhases[firstUnblockedPhaseIndex - 1] ?? null;
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
