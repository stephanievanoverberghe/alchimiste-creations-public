import { Check } from "lucide-react";

import type { ProjectRequestPageContent } from "@/content/project-request";

import type {
    RequestFormState,
    UpdateRequestField,
} from "../projectRequestWizardTypes";
import { FieldError } from "./shared";

/** Étape « type de projet » : tuiles à sélection unique (auto-avancée au clic). */
export function ProjectTypeStep({
    content,
    error,
    form,
    isResponsive,
    updateField,
}: {
    content: ProjectRequestPageContent["wizard"];
    error?: string;
    form: RequestFormState;
    isResponsive: boolean;
    updateField: UpdateRequestField;
}) {
    return (
        <div className="flex flex-col gap-4">
            {error ? <FieldError message={error} /> : null}

            <div
                className={
                    isResponsive
                        ? "grid gap-2.5 md:grid-cols-2"
                        : "grid gap-2.5"
                }
            >
                {content.projectTypes.map((option) => (
                    <ProjectTypeButton
                        key={option.value}
                        isSelected={form.projectType === option.value}
                        label={option.label}
                        description={option.description}
                        onClick={() => updateField("projectType", option.value)}
                    />
                ))}
            </div>

            <p className="text-caption text-[color:var(--color-text-subtle)]">
                Choisir une option passe directement à la suite.
            </p>
        </div>
    );
}

function ProjectTypeButton({
    description,
    isSelected,
    label,
    onClick,
}: {
    description: string;
    isSelected: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={isSelected}
            className={`focus-ring group flex items-center gap-4 rounded-card border p-4 text-left transition-[background-color,border-color,box-shadow] duration-200 ease-standard ${
                isSelected
                    ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] shadow-elevation-1"
                    : "border-[color:var(--color-border-subtle)] bg-transparent hover:border-[color:var(--color-decor-gold)]/55 hover:bg-[var(--color-surface-default)]"
            }`}
            onClick={onClick}
        >
            <span
                className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-200 ${
                    isSelected
                        ? "border-[color:var(--color-action-default)] bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)]"
                        : "border-[color:var(--color-border-strong)] text-transparent group-hover:border-[color:var(--color-decor-gold)]/60"
                }`}
                aria-hidden="true"
            >
                <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="min-w-0">
                <span className="block text-body font-semibold text-[color:var(--color-text-default)]">
                    {label}
                </span>
                <span className="mt-0.5 block text-body-small text-[color:var(--color-text-muted)]">
                    {description}
                </span>
            </span>
        </button>
    );
}
