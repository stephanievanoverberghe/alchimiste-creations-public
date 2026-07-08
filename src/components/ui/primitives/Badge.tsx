import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone =
    | "brand"
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "draft";

export type BadgeSize = "sm" | "md";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    tone?: BadgeTone;
    size?: BadgeSize;
};

export function Badge({
    children,
    tone = "brand",
    size = "md",
    className,
    ...props
}: BadgeProps) {
    const baseClasses =
        "inline-flex items-center justify-center rounded-full border text-label";

    const toneClasses: Record<BadgeTone, string> = {
        brand:
            "border-[var(--color-action-default)] bg-[var(--color-action-subtle)] text-[var(--color-action-default)]",
        neutral:
            "border-[var(--color-neutral-border)] bg-[var(--color-neutral-bg)] text-[var(--color-neutral-text)]",
        success:
            "border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]",
        warning:
            "border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]",
        danger:
            "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]",
        info:
            "border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info-text)]",
        draft:
            "border-[var(--color-draft-border)] bg-[var(--color-draft-bg)] text-[var(--color-draft-text)]",
    };

    const sizeClasses: Record<BadgeSize, string> = {
        sm: "h-[22px] px-2",
        md: "h-7 px-3",
    };

    return (
        <span
            className={`${baseClasses} ${toneClasses[tone]} ${sizeClasses[size]} ${className ?? ""}`}
            {...props}
        >
            {children}
        </span>
    );
}
