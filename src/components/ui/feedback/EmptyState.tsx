import type { ReactNode } from "react";

import { cn } from "@/components/ui/forms/shared";

export type EmptyStateProps = {
    /** Icône lucide (ou tout ReactNode) affichée dans le médaillon. */
    icon?: ReactNode;
    title: string;
    description?: string;
    /** Action de sortie (Button ou lien) — un état vide propose toujours une suite. */
    action?: ReactNode;
    className?: string;
};

/**
 * État vide standard : médaillon, message, action de sortie.
 * À utiliser partout où une liste peut être vide — jamais de zone muette.
 */
export function EmptyState({
    action,
    className,
    description,
    icon,
    title,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-4 rounded-panel border border-dashed border-[color:var(--color-border-strong)] bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] px-6 py-10 text-center md:py-12",
                className,
            )}
        >
            {icon ? (
                <span
                    className="inline-flex size-12 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-raised)] text-[color:var(--color-decor-gold)] shadow-elevation-1 [&>svg]:size-5"
                    aria-hidden="true"
                >
                    {icon}
                </span>
            ) : null}
            <div className="flex max-w-[420px] flex-col gap-1.5">
                <p className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                    {title}
                </p>
                {description ? (
                    <p className="text-body-small text-[color:var(--color-text-muted)]">
                        {description}
                    </p>
                ) : null}
            </div>
            {action ? <div className="mt-1">{action}</div> : null}
        </div>
    );
}
