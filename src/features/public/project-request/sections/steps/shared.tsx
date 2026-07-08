import { Check } from "lucide-react";
import type { ReactNode } from "react";

/** Classes typographiques partagées par les étapes du wizard. */
export const eyebrowClass =
    "text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]";
export const panelTitleClass =
    "font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]";
export const mutedTextClass = "text-body-small text-[color:var(--color-text-muted)]";

/**
 * Groupe de chips à choix unique : remplace les menus déroulants du wizard.
 * Toutes les options sont visibles d'un coup d'œil et sélectionnables en un
 * geste — `aria-pressed` porte l'état, la valeur remonte via `onSelect`.
 */
export function ChoiceChips({
    error,
    label,
    onSelect,
    options,
    required,
    value,
}: {
    error?: string;
    label: string;
    onSelect: (value: string) => void;
    options: readonly { label: string; value: string }[];
    required?: boolean;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-2.5" role="group" aria-label={label}>
            <span className="text-label font-medium text-[color:var(--color-text-default)]">
                {label}
                {required ? (
                    <span
                        className="ml-1 text-[color:var(--color-action-default)]"
                        aria-hidden="true"
                    >
                        *
                    </span>
                ) : null}
            </span>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => onSelect(option.value)}
                            className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-body-small font-medium transition-[background-color,border-color,color] duration-200 ease-standard ${
                                isSelected
                                    ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                                    : "border-[color:var(--color-border-strong)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-decor-gold)]/60 hover:text-[color:var(--color-text-default)]"
                            }`}
                        >
                            {isSelected ? (
                                <Check className="size-3.5" aria-hidden="true" />
                            ) : null}
                            {option.label}
                        </button>
                    );
                })}
            </div>

            {error ? <FieldError message={error} /> : null}
        </div>
    );
}

/**
 * Groupe de champs éditorial : un liseré doré et une hiérarchie typographique
 * remplacent les anciennes boîtes — le formulaire respire sur le fond.
 */
export function FieldGroup({
    children,
    description,
    eyebrow,
    title,
}: {
    children: ReactNode;
    description: string;
    eyebrow: string;
    title: string;
}) {
    return (
        <section className="grid content-start gap-4 border-l-2 border-[color:var(--color-decor-gold)]/40 pl-4 md:pl-5">
            <div className="flex flex-col gap-1">
                <span className={eyebrowClass}>{eyebrow}</span>
                <h3 className={panelTitleClass}>{title}</h3>
                <p className={mutedTextClass}>{description}</p>
            </div>

            <div className="grid gap-4">{children}</div>
        </section>
    );
}

export function FieldError({ message }: { message: string }) {
    return (
        <p
            className="rounded-card border border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] px-4 py-2.5 text-body-small font-medium text-[color:var(--color-danger-text)]"
            role="alert"
        >
            {message}
        </p>
    );
}
