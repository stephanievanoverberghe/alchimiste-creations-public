import type { HTMLAttributes } from "react";

import { cn } from "@/components/ui/forms/shared";

export type StatusBadgeTone =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "draft"
    | "action";

export type StatusBadgeSize = "sm" | "md";

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
    /** Libellé déjà traduit pour l'audience (jamais un statut brut type PENDING). */
    label: string;
    tone?: StatusBadgeTone;
    size?: StatusBadgeSize;
    /** Pastille animée pour attirer l'œil (validations attendues, blocages). */
    pulse?: boolean;
};

const toneClasses: Record<StatusBadgeTone, string> = {
    success:
        "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)] text-[color:var(--color-success-text)]",
    warning:
        "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[color:var(--color-warning-text)]",
    danger:
        "border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[color:var(--color-danger-text)]",
    info: "border-[color:var(--color-info-border)] bg-[var(--color-info-bg)] text-[color:var(--color-info-text)]",
    neutral:
        "border-[color:var(--color-neutral-border)] bg-[var(--color-neutral-bg)] text-[color:var(--color-neutral-text)]",
    draft: "border-[color:var(--color-draft-border)] bg-[var(--color-draft-bg)] text-[color:var(--color-draft-text)]",
    action: "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]",
};

const dotClasses: Record<StatusBadgeTone, string> = {
    success: "bg-[var(--color-success-solid)]",
    warning: "bg-[var(--color-warning-solid)]",
    danger: "bg-[var(--color-danger-solid)]",
    info: "bg-[var(--color-info-solid)]",
    neutral: "bg-[var(--color-neutral-solid)]",
    draft: "bg-[var(--color-draft-solid)]",
    action: "bg-[var(--color-action-default)]",
};

const sizeClasses: Record<StatusBadgeSize, string> = {
    sm: "h-[22px] gap-1.5 px-2 text-caption",
    md: "h-7 gap-2 px-3 text-label",
};

/**
 * Badge de statut unifié : pastille + libellé traduit par audience.
 * Remplace les badges de statut ad hoc — le mapping statut interne →
 * libellé/ton vit dans src/lib/status-labels (sprint F4), jamais ici.
 */
export function StatusBadge({
    className,
    label,
    pulse = false,
    size = "md",
    tone = "neutral",
    ...props
}: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center rounded-full border font-medium",
                toneClasses[tone],
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            <span className="relative inline-flex size-1.5" aria-hidden="true">
                {pulse ? (
                    <span
                        className={cn(
                            "absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden",
                            dotClasses[tone],
                        )}
                    />
                ) : null}
                <span
                    className={cn(
                        "relative inline-flex size-1.5 rounded-full",
                        dotClasses[tone],
                    )}
                />
            </span>
            {label}
        </span>
    );
}
