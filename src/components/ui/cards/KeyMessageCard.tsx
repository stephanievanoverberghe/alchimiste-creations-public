import type { ReactNode } from "react";

type KeyMessageCardVariant = "default" | "side";

type KeyMessageCardProps = {
    children: ReactNode;
    className?: string;
    label?: string;
    variant?: KeyMessageCardVariant;
};

export function KeyMessageCard({
    children,
    className = "",
    label,
    variant = "default",
}: KeyMessageCardProps) {
    if (variant === "side") {
        return (
            <div className={`rounded-3xl border-l-2 border-[color:var(--color-action-default)] bg-[rgba(255,243,224,0.03)] p-5 ${className}`}>
                {label ? (
                    <span className="text-xs font-medium leading-4 tracking-[0.02em] uppercase text-[color:var(--color-decor-gold)]">
                        {label}
                    </span>
                ) : null}
                <p className={`${label ? "mt-2" : ""} text-body-small text-[color:var(--color-text-muted)]`}>
                    {children}
                </p>
            </div>
        );
    }

    return (
        <div className={`rounded-3xl border border-[color:var(--color-decor-gold)] bg-[rgba(255,243,224,0.04)] p-5 md:p-6 ${className}`}>
            {label ? (
                <span className="text-xs font-medium leading-4 tracking-[0.02em] uppercase text-[color:var(--color-decor-gold)]">
                    {label}
                </span>
            ) : null}
            <p className={`${label ? "mt-3" : ""} text-base font-medium leading-7 text-[color:var(--color-text-default)]`}>
                {children}
            </p>
        </div>
    );
}
