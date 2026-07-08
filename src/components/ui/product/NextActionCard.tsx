import type { ReactNode } from "react";

import { cn } from "@/components/ui/forms/shared";

export type NextActionOwner = "moi" | "client";

export type NextActionCardProps = {
    /** La prochaine action, formulée à l'impératif court. */
    title: string;
    /** Contexte d'une ligne (phase courante, gate visé…). */
    context?: string;
    /** Qui doit agir — pilote l'étiquette « À moi » / « Côté client ». */
    owner?: NextActionOwner;
    /** Raccourci vers l'endroit où agir. */
    action?: ReactNode;
    className?: string;
};

/**
 * Boussole Scrum de l'écran : la prochaine action et qui la porte.
 * Compagne de l'ActionRequiredCard (cascade dit si on peut avancer,
 * ceci dit quoi faire maintenant).
 */
export function NextActionCard({
    action,
    className,
    context,
    owner,
    title,
}: NextActionCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 shadow-elevation-1 md:p-5",
                className,
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <p className="text-label uppercase text-[color:var(--color-decor-gold)]">
                    Prochaine action
                </p>
                {owner ? (
                    <span
                        className={cn(
                            "inline-flex h-6 items-center rounded-full border px-2.5 text-caption font-medium",
                            owner === "moi"
                                ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                                : "border-[color:var(--color-info-border)] bg-[var(--color-info-bg)] text-[color:var(--color-info-text)]",
                        )}
                    >
                        {owner === "moi" ? "À moi" : "Côté client"}
                    </span>
                ) : null}
            </div>
            <div className="min-w-0">
                <p className="text-body font-semibold text-[color:var(--color-text-default)]">
                    {title}
                </p>
                {context ? (
                    <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                        {context}
                    </p>
                ) : null}
            </div>
            {action ? <div>{action}</div> : null}
        </div>
    );
}
