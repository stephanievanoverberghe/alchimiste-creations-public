import type { ReactNode } from "react";

import { cn } from "@/components/ui/forms/shared";

export type ActivityFeedTone =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "action";

export type ActivityFeedItem = {
    id: string;
    /** Fait accompli, formulé pour l'audience (« Cahier des charges validé »). */
    title: string;
    description?: string;
    /** Horodatage déjà formaté (« il y a 2 h », « 6 juillet »). */
    timestamp: string;
    tone?: ActivityFeedTone;
    icon?: ReactNode;
};

export type ActivityFeedProps = {
    items: ActivityFeedItem[];
    className?: string;
};

const dotToneClasses: Record<ActivityFeedTone, string> = {
    success:
        "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]",
    warning:
        "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[color:var(--color-warning-text)]",
    danger: "border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[color:var(--color-danger-text)]",
    info: "border-[color:var(--color-info-border)] bg-[var(--color-info-bg)] text-[color:var(--color-info-text)]",
    neutral:
        "border-[color:var(--color-border-strong)] bg-[var(--color-surface-raised)] text-[color:var(--color-text-muted)]",
    action: "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]",
};

/**
 * Fil d'activité unifié (timeline admin et client) : événements datés
 * sur une ligne de vie, du plus récent au plus ancien. Présentation
 * pure — le tri, le filtrage par visibilité et le format des dates se
 * font côté serveur.
 */
export function ActivityFeed({ className, items }: ActivityFeedProps) {
    return (
        <ol className={cn("relative flex flex-col", className)}>
            <span
                className="pointer-events-none absolute inset-y-2 left-[15px] w-px bg-[linear-gradient(to_bottom,var(--color-decor-gold),var(--color-border-subtle)_30%,var(--color-border-subtle))]"
                aria-hidden="true"
            />
            {items.map((item) => (
                <li
                    key={item.id}
                    className="group relative flex gap-4 rounded-card py-3 pl-0 pr-2 transition-colors duration-150 ease-standard"
                >
                    <span
                        className={cn(
                            "relative z-10 mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border shadow-elevation-1 [&>svg]:size-3.5",
                            dotToneClasses[item.tone ?? "neutral"],
                        )}
                        aria-hidden="true"
                    >
                        {item.icon ?? (
                            <span className="size-1.5 rounded-full bg-current" />
                        )}
                    </span>
                    <div className="min-w-0 flex-1 pb-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                            <p className="text-body-small font-semibold text-[color:var(--color-text-default)]">
                                {item.title}
                            </p>
                            <time className="shrink-0 text-caption text-[color:var(--color-text-subtle)]">
                                {item.timestamp}
                            </time>
                        </div>
                        {item.description ? (
                            <p className="mt-0.5 text-body-small text-[color:var(--color-text-muted)]">
                                {item.description}
                            </p>
                        ) : null}
                    </div>
                </li>
            ))}
        </ol>
    );
}
