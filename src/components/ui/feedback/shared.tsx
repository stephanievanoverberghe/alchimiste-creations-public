import {
    AlertTriangle,
    Check,
    Info,
    Minus,
    X,
    type LucideIcon,
} from "lucide-react";

export type FeedbackTone = "neutral" | "info" | "success" | "warning" | "danger";

export const feedbackToneClasses: Record<
    FeedbackTone,
    {
        frame: string;
        icon: string;
        title: string;
        body: string;
        action: string;
    }
> = {
    neutral: {
        frame: "border-[color:var(--color-neutral-border)] bg-[var(--color-neutral-bg)]",
        icon: "border-[color:var(--color-neutral-border)] text-[color:var(--color-neutral-text)]",
        title: "text-[color:var(--color-neutral-text)]",
        body: "text-[color:var(--color-text-muted)]",
        action: "text-[color:var(--color-neutral-text)] hover:text-[color:var(--color-text-default)]",
    },
    info: {
        frame: "border-[color:var(--color-info-border)] bg-[var(--color-info-bg)]",
        icon: "border-[color:var(--color-info-border)] text-[color:var(--color-info-text)]",
        title: "text-[color:var(--color-info-text)]",
        body: "text-[color:var(--color-info-text)]",
        action: "text-[color:var(--color-info-text)] hover:text-[color:var(--color-text-default)]",
    },
    success: {
        frame: "border-[color:var(--color-success-border)] bg-[var(--color-success-bg)]",
        icon: "border-[color:var(--color-success-border)] text-[color:var(--color-success-text)]",
        title: "text-[color:var(--color-success-text)]",
        body: "text-[color:var(--color-success-text)]",
        action: "text-[color:var(--color-success-text)] hover:text-[color:var(--color-text-default)]",
    },
    warning: {
        frame: "border-[color:var(--color-warning-border)] bg-[var(--color-warning-bg)]",
        icon: "border-[color:var(--color-warning-border)] text-[color:var(--color-warning-text)]",
        title: "text-[color:var(--color-warning-text)]",
        body: "text-[color:var(--color-warning-text)]",
        action: "text-[color:var(--color-warning-text)] hover:text-[color:var(--color-text-default)]",
    },
    danger: {
        frame: "border-[color:var(--color-danger-border)] bg-[var(--color-danger-bg)]",
        icon: "border-[color:var(--color-danger-border)] text-[color:var(--color-danger-text)]",
        title: "text-[color:var(--color-danger-text)]",
        body: "text-[color:var(--color-danger-text)]",
        action: "text-[color:var(--color-danger-text)] hover:text-[color:var(--color-text-default)]",
    },
};

export const feedbackIcons: Record<FeedbackTone, LucideIcon> = {
    neutral: Minus,
    info: Info,
    success: Check,
    warning: AlertTriangle,
    danger: X,
};
