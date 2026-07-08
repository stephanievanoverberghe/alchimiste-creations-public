import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "../primitives";
import { CardAction, clickableClasses } from "@/components/ui/cards/shared";

export type OfferCardViewport = "responsive" | "mobile" | "tablet" | "desktop";

export type OfferCardProps = {
    viewport?: OfferCardViewport;
    highlight?: boolean;
    badge?: string;
    title: string;
    description: string;
    price: string;
    features: string[];
    actionLabel?: string;
    href: string;
    className?: string;
};

export function OfferCard({
    viewport = "responsive",
    highlight = false,
    badge,
    title,
    description,
    price,
    features,
    actionLabel = "Voir l'offre",
    href,
    className,
}: OfferCardProps) {
    const badgeLabel = badge ?? (highlight ? "Populaire" : "Offre");
    const surfaceClasses = highlight
        ? "border-2 border-[color:var(--color-action-default)] bg-[linear-gradient(180deg,var(--color-surface-interactive),var(--color-action-subtle))] shadow-lg shadow-black/25"
        : "border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]";

    const viewportClasses: Record<OfferCardViewport, string> = {
        responsive:
            "gap-4 p-5 md:gap-[18px] md:p-6 lg:gap-5 lg:p-8",
        mobile: "gap-4 p-5",
        tablet: "gap-[18px] p-6",
        desktop: "gap-5 p-8",
    };

    const titleClasses: Record<OfferCardViewport, string> = {
        responsive:
            "font-[var(--text-h4-weight)] text-[length:var(--text-h4-size)] leading-[var(--text-h4-line-height)] tracking-[var(--text-h4-letter-spacing)] md:font-[var(--text-h3-weight)] md:text-[length:var(--text-h3-size)] md:leading-[var(--text-h3-line-height)] md:tracking-[var(--text-h3-letter-spacing)]",
        mobile: "text-h4",
        tablet: "text-h3",
        desktop: "text-h3",
    };

    return (
        <Link
            href={href}
            className={`focus-ring group flex w-full self-start cursor-pointer flex-col items-start rounded-3xl no-underline ${clickableClasses} ${surfaceClasses} ${viewportClasses[viewport]} ${className ?? ""}`}
        >
            <div className="flex w-full items-center justify-between gap-4">
                <Badge tone={highlight ? "brand" : "draft"} size="sm">
                    {badgeLabel}
                </Badge>

                {highlight ? (
                    <span className="text-caption text-[var(--color-action-default)]">
                        Recommande
                    </span>
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

            <div className="w-full rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-deep)] px-4 py-3">
                <p className="text-caption text-[var(--color-text-subtle)]">
                    Investissement
                </p>
                <p className="text-h4 text-[var(--color-action-default)]">{price}</p>
            </div>

            <ul className="flex w-full flex-col gap-2">
                {features.map((feature) => (
                    <li
                        className="flex items-start gap-2 text-body-small text-[var(--color-text-muted)]"
                        key={feature}
                    >
                        <span className="mt-[2px] inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[var(--color-action-default)]">
                            <Check className="size-3.5" aria-hidden="true" />
                        </span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="w-full border-t border-[color:var(--color-border-subtle)] pt-3">
                <CardAction>{actionLabel}</CardAction>
            </div>
        </Link>
    );
}
