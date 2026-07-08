import type { HTMLAttributes } from "react";

import { Badge, type BadgeTone } from "@/components/ui/primitives";
import { cn } from "@/components/ui/forms/shared";

export type StatusRowProps = HTMLAttributes<HTMLDivElement> & {
    date?: string;
    description: string;
    statusLabel: string;
    statusTone?: BadgeTone;
    title: string;
};

export function StatusRow({
    className,
    date,
    description,
    statusLabel,
    statusTone = "neutral",
    title,
    ...props
}: StatusRowProps) {
    return (
        <div
            className={cn(
                "grid gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 md:grid-cols-[1fr_auto_auto] md:items-center md:px-6",
                className,
            )}
            {...props}
        >
            <div className="min-w-0">
                <p className="text-h3 text-[color:var(--color-text-default)]">
                    {title}
                </p>
                <p className="mt-2 text-body-small text-[color:var(--color-text-muted)]">
                    {description}
                </p>
            </div>
            <Badge tone={statusTone} className="w-fit">
                {statusLabel}
            </Badge>
            {date ? (
                <p className="text-caption text-[color:var(--color-text-subtle)]">
                    {date}
                </p>
            ) : null}
        </div>
    );
}
