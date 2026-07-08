import type { HTMLAttributes } from "react";

import { Badge, type BadgeTone } from "@/components/ui/primitives";
import { cn } from "@/components/ui/forms/shared";

import { Avatar } from "./Avatar";

export type ProjectSummaryTone = "default" | "highlight";

export type ProjectSummaryProps = HTMLAttributes<HTMLElement> & {
    description: string;
    initials: string;
    progressLabel: string;
    progressValue: number;
    statusLabel: string;
    statusTone?: BadgeTone;
    subtitle: string;
    title: string;
    tone?: ProjectSummaryTone;
};

export function ProjectSummary({
    className,
    description,
    initials,
    progressLabel,
    progressValue,
    statusLabel,
    statusTone = "neutral",
    subtitle,
    title,
    tone = "default",
    ...props
}: ProjectSummaryProps) {
    const safeProgress = Math.min(100, Math.max(0, progressValue));
    const isHighlight = tone === "highlight";

    return (
        <article
            className={cn(
                "rounded-3xl border p-5 shadow-lg shadow-black/10 md:p-6",
                isHighlight
                    ? "border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)]"
                    : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]",
                className,
            )}
            {...props}
        >
            <div className="flex items-start gap-3">
                <Avatar initials={initials} status="online" />
                <div className="min-w-0">
                    <h2 className="text-h3 text-[color:var(--color-text-default)]">
                        {title}
                    </h2>
                    <p className="mt-1 text-caption text-[color:var(--color-text-subtle)]">
                        {subtitle}
                    </p>
                </div>
            </div>

            <p className="mt-5 text-body-small text-[color:var(--color-text-muted)]">
                {description}
            </p>

            <div className="mt-5">
                <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                    <span
                        className="block h-full rounded-full bg-[var(--color-action-default)]"
                        style={{ width: `${safeProgress}%` }}
                    />
                </div>
                <p className="mt-2 text-caption text-[color:var(--color-text-subtle)]">
                    {progressLabel}
                </p>
            </div>

            <Badge tone={statusTone} className="mt-5">
                {statusLabel}
            </Badge>
        </article>
    );
}
