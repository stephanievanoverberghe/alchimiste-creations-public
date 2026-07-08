import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "solid";
export type ButtonTone =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "draft";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonCommonProps = {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
};

type NativeButtonProps = ButtonCommonProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
        tone?: ButtonTone;
        loading?: boolean;
    };

type LinkButtonProps = Omit<ButtonCommonProps, "variant"> &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
        variant?: Exclude<ButtonVariant, "solid">;
    };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

const baseClasses =
    "focus-ring group relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full text-label transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out motion-reduce:enabled:hover:scale-100 motion-reduce:enabled:active:scale-100 motion-reduce:[&_.button-icon-left]:translate-x-0 motion-reduce:[&_.button-icon-right]:translate-x-0 [&>span]:relative [&>span]:z-10";

const buttonInteractionClasses =
    "enabled:hover:scale-[1.02] enabled:hover:[&_.button-icon-left]:-translate-x-0.5 enabled:hover:[&_.button-icon-right]:translate-x-0.5 enabled:active:translate-y-px enabled:active:scale-[0.98] enabled:active:[&_.button-icon-left]:-translate-x-1 enabled:active:[&_.button-icon-right]:translate-x-1";

const linkInteractionClasses =
    "hover:scale-[1.02] hover:[&_.button-icon-left]:-translate-x-0.5 hover:[&_.button-icon-right]:translate-x-0.5 active:translate-y-px active:scale-[0.98] active:[&_.button-icon-left]:-translate-x-1 active:[&_.button-icon-right]:translate-x-1 motion-reduce:hover:scale-100 motion-reduce:active:scale-100";

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-10 gap-2 px-4",
    md: "h-12 gap-2 px-5",
    lg: "h-14 gap-2.5 px-6",
};

const buttonVariantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)] shadow-lg shadow-black/25 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:-translate-x-[120%] before:bg-[linear-gradient(110deg,transparent_0%,transparent_34%,rgba(255,232,184,0.22)_44%,rgba(255,255,255,0.58)_50%,rgba(255,232,184,0.24)_56%,transparent_68%,transparent_100%)] before:transition-transform before:duration-700 before:ease-out enabled:hover:bg-[radial-gradient(circle_at_30%_20%,rgba(255,232,184,0.20),transparent_34%),linear-gradient(135deg,var(--color-action-hover),var(--color-action-default))] enabled:hover:shadow-xl enabled:hover:shadow-black/30 enabled:hover:before:translate-x-[120%] disabled:before:opacity-0 motion-reduce:before:hidden",
    secondary:
        "border border-[color:var(--color-action-default)] bg-transparent text-[color:var(--color-action-default)] enabled:hover:border-[color:var(--color-action-hover)] enabled:hover:bg-[var(--color-action-subtle)] enabled:hover:text-[color:var(--color-action-hover)]",
    ghost:
        "bg-transparent text-[color:var(--color-text-muted)] enabled:hover:text-[color:var(--color-text-default)]",
    solid: "",
};

const linkVariantClasses: Record<Exclude<ButtonVariant, "solid">, string> = {
    primary:
        "bg-[var(--color-action-default)] text-[color:var(--color-text-inverse)] shadow-lg shadow-black/25 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:-translate-x-[120%] before:bg-[linear-gradient(110deg,transparent_0%,transparent_34%,rgba(255,232,184,0.22)_44%,rgba(255,255,255,0.58)_50%,rgba(255,232,184,0.24)_56%,transparent_68%,transparent_100%)] before:transition-transform before:duration-700 before:ease-out hover:bg-[radial-gradient(circle_at_30%_20%,rgba(255,232,184,0.20),transparent_34%),linear-gradient(135deg,var(--color-action-hover),var(--color-action-default))] hover:shadow-xl hover:shadow-black/30 hover:before:translate-x-[120%] motion-reduce:before:hidden",
    secondary:
        "border border-[color:var(--color-action-default)] bg-transparent text-[color:var(--color-action-default)] hover:border-[color:var(--color-action-hover)] hover:bg-[var(--color-action-subtle)] hover:text-[color:var(--color-action-hover)]",
    ghost:
        "bg-transparent text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-default)]",
};

const toneClasses: Record<ButtonTone, string> = {
    success:
        "bg-[var(--color-success-solid)] text-[color:var(--color-text-inverse)] enabled:hover:bg-[var(--color-success-solid-hover)] enabled:hover:shadow-lg enabled:hover:shadow-black/25",
    warning:
        "bg-[var(--color-warning-solid)] text-[color:var(--color-text-inverse)] enabled:hover:bg-[var(--color-warning-solid-hover)] enabled:hover:shadow-lg enabled:hover:shadow-black/25",
    danger:
        "bg-[var(--color-danger-solid)] text-[color:var(--color-text-inverse)] enabled:hover:bg-[var(--color-danger-solid-hover)] enabled:hover:shadow-lg enabled:hover:shadow-black/25",
    info:
        "bg-[var(--color-info-solid)] text-[color:var(--color-text-inverse)] enabled:hover:bg-[var(--color-info-solid-hover)] enabled:hover:shadow-lg enabled:hover:shadow-black/25",
    neutral:
        "bg-[var(--color-neutral-solid)] text-[color:var(--color-text-inverse)] enabled:hover:bg-[var(--color-neutral-solid-hover)] enabled:hover:shadow-lg enabled:hover:shadow-black/25",
    draft:
        "bg-[var(--color-draft-solid)] text-[color:var(--color-text-inverse)] enabled:hover:bg-[var(--color-draft-solid-hover)] enabled:hover:shadow-lg enabled:hover:shadow-black/25",
};

const contentColorClasses: Record<ButtonVariant, string> = {
    primary: "text-[color:var(--color-text-inverse)]",
    secondary:
        "text-[color:var(--color-action-default)] group-hover:text-[color:var(--color-action-hover)]",
    ghost:
        "text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text-default)]",
    solid: "text-[color:var(--color-text-inverse)]",
};

const disabledClasses =
    "disabled:bg-[var(--color-surface-interactive)] disabled:text-[color:var(--color-text-disabled)] disabled:opacity-70 disabled:shadow-none";

function renderButtonContent({
    children,
    colorClasses,
    iconLeft,
    iconRight,
    loading = false,
}: {
    children: ReactNode;
    colorClasses: string;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    loading?: boolean;
}) {
    return (
        <>
            {loading ? (
                <span className={`inline-flex size-4 shrink-0 items-center justify-center ${colorClasses}`}>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                </span>
            ) : iconLeft ? (
                <span className={`button-icon-left inline-flex size-4 shrink-0 items-center justify-center transition-transform duration-150 ease-out ${colorClasses}`}>
                    {iconLeft}
                </span>
            ) : null}
            <span className={colorClasses}>{children}</span>
            {iconRight ? (
                <span className={`button-icon-right inline-flex size-4 shrink-0 items-center justify-center transition-transform duration-150 ease-out ${colorClasses}`}>
                    {iconRight}
                </span>
            ) : null}
        </>
    );
}

export function Button(props: ButtonProps) {
    if (props.href) {
        const {
            children,
            variant = "primary",
            size = "md",
            className,
            iconLeft,
            iconRight,
            href,
            ...linkProps
        } = props as LinkButtonProps;

        return (
            <Link
                href={href}
                className={`${baseClasses} ${linkInteractionClasses} ${sizeClasses[size]} ${linkVariantClasses[variant]} no-underline ${className ?? ""}`}
                {...linkProps}
            >
                {renderButtonContent({
                    children,
                    colorClasses: contentColorClasses[variant],
                    iconLeft,
                    iconRight,
                })}
            </Link>
        );
    }

    const {
        children,
        variant = "primary",
        tone = "neutral",
        size = "md",
        type = "button",
        className,
        iconLeft,
        iconRight,
        loading = false,
        ...buttonProps
    } = props as NativeButtonProps;
    const isDisabled = loading || buttonProps.disabled;
    const activeVariantClasses =
        variant === "solid"
            ? toneClasses[tone]
            : buttonVariantClasses[variant];
    const colorClasses = isDisabled
        ? "text-[color:var(--color-text-disabled)]"
        : contentColorClasses[variant];

    return (
        <button
            type={type}
            className={`${baseClasses} ${buttonInteractionClasses} ${sizeClasses[size]} ${activeVariantClasses} ${disabledClasses} ${className ?? ""}`}
            {...buttonProps}
            disabled={isDisabled}
            aria-busy={loading || undefined}
        >
            {renderButtonContent({
                children,
                colorClasses,
                iconLeft,
                iconRight,
                loading,
            })}
        </button>
    );
}
