import { AlertTriangle, Check, Circle } from "lucide-react";
import type { HTMLAttributes } from "react";

import { Badge, type BadgeTone } from "@/components/ui/primitives";
import { cn } from "@/components/ui/forms/shared";

export type TaskItemState = "todo" | "progress" | "review" | "done" | "blocked";

export type TaskItemProps = HTMLAttributes<HTMLDivElement> & {
    description: string;
    state?: TaskItemState;
    statusLabel: string;
    statusTone?: BadgeTone;
    title: string;
};

const stateClasses: Record<
    TaskItemState,
    {
        frame: string;
        icon: string;
    }
> = {
    todo: {
        frame: "border-[color:var(--color-border-subtle)]",
        icon: "border-[color:var(--color-neutral-border)] text-[color:var(--color-neutral-text)]",
    },
    progress: {
        frame: "border-[color:var(--color-border-subtle)]",
        icon: "border-[color:var(--color-info-border)] text-[color:var(--color-info-text)]",
    },
    review: {
        frame: "border-[color:var(--color-warning-border)]",
        icon: "border-[color:var(--color-warning-border)] text-[color:var(--color-warning-text)]",
    },
    done: {
        frame: "border-[color:var(--color-border-subtle)]",
        icon: "border-[color:var(--color-success-border)] bg-[var(--color-success-solid)] text-[color:var(--color-text-inverse)]",
    },
    blocked: {
        frame: "border-[color:var(--color-danger-border)]",
        icon: "border-[color:var(--color-danger-border)] text-[color:var(--color-danger-text)]",
    },
};

export function TaskItem({
    className,
    description,
    state = "todo",
    statusLabel,
    statusTone = "neutral",
    title,
    ...props
}: TaskItemProps) {
    const classes = stateClasses[state];
    const Icon = state === "done" ? Check : state === "blocked" ? AlertTriangle : Circle;

    return (
        <div
            className={cn(
                "grid gap-4 rounded-2xl border bg-[var(--color-surface-default)] p-4 md:grid-cols-[auto_1fr_auto] md:items-center md:px-6",
                classes.frame,
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-full border [&>svg]:size-3.5",
                    classes.icon,
                )}
                aria-hidden="true"
            >
                <Icon />
            </span>
            <div className="min-w-0">
                <p className="text-h3 text-[color:var(--color-text-default)]">
                    {title}
                </p>
                <p className="mt-1 text-body-small text-[color:var(--color-text-muted)]">
                    {description}
                </p>
            </div>
            <Badge tone={statusTone} className="w-fit">
                {statusLabel}
            </Badge>
        </div>
    );
}
