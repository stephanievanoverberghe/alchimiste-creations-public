import type { ReactNode } from "react";

import { cn } from "@/components/ui/forms/shared";

export type ActionRequiredCardTone = "action" | "warning";

export type ActionRequiredCardProps = {
    /** Sur-titre court, ex. « Votre décision est attendue ». */
    eyebrow?: string;
    title: string;
    description?: string;
    /** Métadonnée discrète (projet concerné, date de demande…). */
    meta?: string;
    /** Bouton ou lien d'action — la carte existe pour déclencher ce geste. */
    action: ReactNode;
    /** action = cuivre (demande normale), warning = ambre (en retard). */
    tone?: ActionRequiredCardTone;
    className?: string;
};

/**
 * LA carte prioritaire d'un écran : ce qu'on attend de la personne,
 * maintenant. Toujours placée en premier, jamais plus de deux à la fois.
 * Halo cuivre + liseré dégradé pour être magnétique sans crier.
 */
export function ActionRequiredCard({
    action,
    className,
    description,
    eyebrow = "Action attendue",
    meta,
    title,
    tone = "action",
}: ActionRequiredCardProps) {
    const isWarning = tone === "warning";

    return (
        <div
            className={cn(
                "relative isolate overflow-hidden rounded-panel border p-5 shadow-elevation-2 md:p-6",
                isWarning
                    ? "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)]"
                    : "border-[color:var(--color-action-default)] bg-[var(--color-surface-default)] shadow-[var(--glow-action)]",
                className,
            )}
        >
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-hero)]"
                aria-hidden="true"
            />
            <p
                className={cn(
                    "text-label uppercase",
                    isWarning
                        ? "text-[color:var(--color-warning-text)]"
                        : "text-[color:var(--color-action-default)]",
                )}
            >
                {eyebrow}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                {title}
            </p>
            {description ? (
                <p className="mt-1.5 max-w-[560px] text-body-small text-[color:var(--color-text-muted)]">
                    {description}
                </p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">{action}</div>
                {meta ? (
                    <p className="text-caption text-[color:var(--color-text-subtle)]">
                        {meta}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
