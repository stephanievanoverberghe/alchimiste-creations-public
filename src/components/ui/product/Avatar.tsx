import type { HTMLAttributes } from "react";

import { cn } from "@/components/ui/forms/shared";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarStatus = "none" | "online" | "busy";

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
    initials: string;
    size?: AvatarSize;
    status?: AvatarStatus;
};

const sizeClasses: Record<AvatarSize, string> = {
    sm: "size-8 text-caption",
    md: "size-10 text-body-small",
    lg: "size-14 text-body",
};

const statusClasses: Record<Exclude<AvatarStatus, "none">, string> = {
    online: "bg-[var(--color-success-solid)]",
    busy: "bg-[var(--color-warning-solid)]",
};

export function Avatar({
    className,
    initials,
    size = "md",
    status = "none",
    ...props
}: AvatarProps) {
    return (
        <span
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center rounded-full border border-[color:var(--color-action-default)] bg-[var(--color-action-subtle)] text-[color:var(--color-decor-gold)]",
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            <span className="uppercase">{initials.slice(0, 2)}</span>
            {status !== "none" ? (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 size-2.5 rounded-full border border-[color:var(--color-bg-deep)]",
                        statusClasses[status],
                    )}
                    aria-hidden="true"
                />
            ) : null}
        </span>
    );
}
