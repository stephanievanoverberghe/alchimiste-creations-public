import { Check, Pencil } from "lucide-react";

import type {
    RequestFormLabels,
    RequestFormState,
    ReviewStepTargets,
} from "../projectRequestWizardTypes";
import { eyebrowClass, mutedTextClass } from "./shared";

/** Récapitulatif compact et éditable de toutes les réponses avant envoi. */
export function ReviewStep({
    form,
    goToStep,
    labels,
    reviewStepTargets,
}: {
    form: RequestFormState;
    goToStep: (index: number) => void;
    labels: RequestFormLabels;
    reviewStepTargets: ReviewStepTargets;
}) {
    const rows: RecapRowData[] = [
        {
            label: "Type de projet",
            value: labels.projectType,
            stepIndex: reviewStepTargets.projectType,
        },
        {
            label: "Besoin",
            value: form.description,
            stepIndex: reviewStepTargets.need,
            long: true,
        },
        {
            label: "Objectif",
            value: form.objective,
            stepIndex: reviewStepTargets.objective,
            long: true,
        },
        {
            label: "Avancement",
            value: labels.maturity,
            stepIndex: reviewStepTargets.objective,
        },
        {
            label: "Nom",
            value: form.fullName,
            stepIndex: reviewStepTargets.identity,
        },
        {
            label: "E-mail",
            value: form.email,
            stepIndex: reviewStepTargets.identity,
        },
        {
            label: "Nom du projet",
            value: form.projectName,
            stepIndex: reviewStepTargets.context,
        },
        {
            label: "Site existant",
            value: form.website,
            stepIndex: reviewStepTargets.context,
        },
        {
            label: "Budget",
            value: labels.budget,
            stepIndex: reviewStepTargets.frame,
        },
        {
            label: "Délai",
            value: labels.deadline,
            stepIndex: reviewStepTargets.frame,
        },
        {
            label: "Précisions",
            value: form.constraints,
            stepIndex: reviewStepTargets.details,
            long: true,
        },
        {
            label: "Document joint",
            value: form.attachmentName,
            stepIndex: reviewStepTargets.details,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)] shadow-[var(--glow-action)]">
                    <Check className="size-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                    <span className={eyebrowClass}>Dernière relecture</span>
                    <h3 className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                        Un dernier regard avant l&apos;envoi.
                    </h3>
                    <p className={mutedTextClass}>
                        Tu peux corriger chaque réponse d&apos;un geste avant de
                        valider.
                    </p>
                </div>
            </div>

            <dl className="grid gap-x-8 gap-y-5 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 shadow-elevation-1 md:grid-cols-2 md:p-6">
                {rows.map((row) => (
                    <RecapRow key={row.label} goToStep={goToStep} row={row} />
                ))}
            </dl>
        </div>
    );
}

type RecapRowData = {
    label: string;
    value: string;
    stepIndex: number;
    long?: boolean;
};

/**
 * Ligne compacte du récapitulatif : libellé + bouton d'édition discret sur
 * la même ligne, valeur en dessous. Les champs longs occupent toute la
 * largeur et sont écourtés (3 lignes) ; un champ vide affiche un tiret.
 */
function RecapRow({
    goToStep,
    row,
}: {
    goToStep: (index: number) => void;
    row: RecapRowData;
}) {
    const filled = Boolean(row.value?.trim());

    return (
        <div className={`min-w-0 ${row.long ? "md:col-span-2" : ""}`}>
            <dt className="flex items-center justify-between gap-3">
                <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                    {row.label}
                </span>
                <button
                    type="button"
                    onClick={() => goToStep(row.stepIndex)}
                    aria-label={`Modifier ${row.label.toLowerCase()}`}
                    className="focus-ring inline-flex shrink-0 items-center gap-1 rounded-full text-caption font-medium text-[color:var(--color-text-subtle)] transition-colors hover:text-[color:var(--color-action-default)]"
                >
                    <Pencil className="size-3" aria-hidden="true" />
                    Modifier
                </button>
            </dt>
            <dd
                className={`mt-1.5 min-w-0 text-body-small ${
                    filled
                        ? "text-[color:var(--color-text-default)]"
                        : "text-[color:var(--color-text-subtle)]"
                } ${row.long ? "line-clamp-3 whitespace-pre-wrap" : "truncate"}`}
            >
                {filled ? row.value : "—"}
            </dd>
        </div>
    );
}
