import Link from "next/link";

import { Badge } from "../primitives";
import { CardAction, CardImage, clickableClasses } from "@/components/ui/cards/shared";

export type CardVariant = "default" | "raised" | "interactive";
export type CardViewport = "responsive" | "mobile" | "tablet" | "desktop";

export type CardProps = {
    viewport?: CardViewport;
    variant?: CardVariant;
    badge?: string;
    title: string;
    description: string;
    actionLabel?: string;
    media?: boolean;
    imageSrc?: string;
    imageAlt?: string;
    href: string;
    className?: string;
};

export function Card({
    viewport = "responsive",
    variant = "default",
    badge,
    title,
    description,
    actionLabel,
    media = false,
    imageSrc,
    imageAlt = "",
    href,
    className,
}: CardProps) {
    const variantClasses: Record<CardVariant, string> = {
        default:
            "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]",
        raised:
            "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-raised)] shadow-lg shadow-black/25",
        interactive:
            "border-[color:var(--color-border-control)] bg-[linear-gradient(180deg,var(--color-surface-interactive),var(--color-surface-default))] shadow-lg shadow-black/25",
    };

    const viewportClasses: Record<CardViewport, string> = {
        responsive:
            "gap-4 p-5 md:gap-[18px] md:p-6 lg:p-8",
        mobile: "gap-4 p-5",
        tablet: "gap-[18px] p-6",
        desktop: "gap-[18px] p-8",
    };

    const titleClasses: Record<CardViewport, string> = {
        responsive:
            "font-[var(--text-h4-weight)] text-[length:var(--text-h4-size)] leading-[var(--text-h4-line-height)] tracking-[var(--text-h4-letter-spacing)] md:font-[var(--text-h3-weight)] md:text-[length:var(--text-h3-size)] md:leading-[var(--text-h3-line-height)] md:tracking-[var(--text-h3-letter-spacing)]",
        mobile: "text-h4",
        tablet: "text-h3",
        desktop: "text-h3",
    };

    const mediaClasses: Record<CardViewport, string> = {
        responsive:
            "aspect-[17/8] md:aspect-[16/7] lg:aspect-[21/8]",
        mobile: "aspect-[17/8]",
        tablet: "aspect-[16/7]",
        desktop: "aspect-[21/8]",
    };

    return (
        <Link
            href={href}
            className={`focus-ring group flex w-full self-start cursor-pointer flex-col items-start rounded-3xl border no-underline ${clickableClasses} ${variantClasses[variant]} ${viewportClasses[viewport]} ${className ?? ""}`}
        >
            {media ? (
                <CardImage
                    imageSrc={imageSrc}
                    imageAlt={imageAlt}
                    className={`relative flex w-full overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-interactive)] ${mediaClasses[viewport]}`}
                />
            ) : null}

            <div className="flex w-full items-center justify-between gap-4">
                {badge ? (
                    <Badge size="sm" className="shrink-0">
                        {badge}
                    </Badge>
                ) : null}

                {variant === "interactive" ? (
                    <span className="size-2 rounded-full bg-[var(--color-action-default)]" />
                ) : null}
            </div>

            <div className="flex w-full min-w-0 flex-col gap-2">
                <h2 className={`${titleClasses[viewport]} text-[var(--color-text-default)]`}>
                    {title}
                </h2>
                <p className="text-body-small text-[var(--color-text-muted)]">
                    {description}
                </p>
            </div>

            {actionLabel ? (
                <div className="w-full border-t border-[color:var(--color-border-subtle)] pt-3">
                    <CardAction>{actionLabel}</CardAction>
                </div>
            ) : null}
        </Link>
    );
}
