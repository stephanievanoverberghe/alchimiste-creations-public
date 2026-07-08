import type { HTMLAttributes } from "react";

import { cn } from "@/components/ui/forms/shared";

export type ProductMetricCardTone = "default" | "accent";

export type ProductMetricCardProps = HTMLAttributes<HTMLDivElement> & {
    delta?: string;
    label: string;
    tone?: ProductMetricCardTone;
    value: string;
};

export function ProductMetricCard({
    className,
    delta,
    label,
    tone = "default",
    value,
    ...props
}: ProductMetricCardProps) {
    const isAccent = tone === "accent";

    return (
        <div
            className={cn(
                "rounded-2xl border p-5",
                isAccent
                    ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)]"
                    : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]",
                className,
            )}
            {...props}
        >
            <div className="flex items-center gap-2">
                <span
                    className={cn(
                        "size-2 rounded-full",
                        isAccent
                            ? "bg-[var(--color-action-default)]"
                            : "bg-[var(--color-border-control)]",
                    )}
                    aria-hidden="true"
                />
                <p
                    className={cn(
                        "text-label",
                        isAccent
                            ? "text-[color:var(--color-action-default)]"
                            : "text-[color:var(--color-text-muted)]",
                    )}
                >
                    {label}
                </p>
            </div>
            <p className="mt-6 text-h2 text-[color:var(--color-text-default)]">
                {value}
            </p>
            {delta ? (
                <p
                    className={cn(
                        "mt-3 text-caption",
                        isAccent
                            ? "text-[color:var(--color-action-default)]"
                            : "text-[color:var(--color-text-subtle)]",
                    )}
                >
                    {delta}
                </p>
            ) : null}
        </div>
    );
}
