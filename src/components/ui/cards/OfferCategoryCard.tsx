import Image from "next/image";
import Link from "next/link";

import { Badge, type BadgeTone } from "../primitives";
import { CardAction, clickableClasses } from "@/components/ui/cards/shared";

export type OfferCategory = "create" | "sell" | "improve" | "custom";
export type OfferCategoryCardViewport = "responsive" | "mobile" | "tablet" | "desktop";

export type OfferCategoryCardProps = {
    viewport?: OfferCategoryCardViewport;
    category: OfferCategory;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    href: string;
    actionLabel?: string;
    className?: string;
};

const categoryConfig: Record<
    OfferCategory,
    {
        label: string;
        tone: BadgeTone;
    }
> = {
    create: {
        label: "Creer",
        tone: "brand",
    },
    sell: {
        label: "Vendre",
        tone: "success",
    },
    improve: {
        label: "Ameliorer",
        tone: "info",
    },
    custom: {
        label: "Sur mesure",
        tone: "warning",
    },
};

export function OfferCategoryCard({
    viewport = "responsive",
    category,
    title,
    description,
    imageSrc,
    imageAlt = "",
    href,
    actionLabel = "Explorer",
    className,
}: OfferCategoryCardProps) {
    const config = categoryConfig[category];

    const viewportClasses: Record<OfferCategoryCardViewport, string> = {
        responsive:
            "min-h-[300px] gap-6 p-5 md:min-h-[340px] md:p-6 lg:min-h-[380px] lg:p-8",
        mobile:
            "min-h-[300px] gap-6 p-5",
        tablet:
            "min-h-[340px] gap-6 p-6",
        desktop:
            "min-h-[380px] gap-6 p-8",
    };

    const titleClasses: Record<OfferCategoryCardViewport, string> = {
        responsive:
            "font-[var(--text-h4-weight)] text-[length:var(--text-h4-size)] leading-[var(--text-h4-line-height)] tracking-[var(--text-h4-letter-spacing)] md:font-[var(--text-h3-weight)] md:text-[length:var(--text-h3-size)] md:leading-[var(--text-h3-line-height)] md:tracking-[var(--text-h3-letter-spacing)]",
        mobile:
            "text-h4",
        tablet:
            "text-h3",
        desktop:
            "text-h3",
    };

    return (
        <Link
            href={href}
            className={`focus-ring group relative isolate flex w-full self-start cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-[color:rgba(255,243,224,0.18)] bg-[var(--color-bg-deep)] no-underline shadow-lg shadow-black/25 ${clickableClasses} ${viewportClasses[viewport]} ${className ?? ""}`}
        >
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1280px) 280px, (min-width: 768px) 50vw, 100vw"
                className="z-0 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span
                className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0.18)_0%,rgba(15,14,11,0.52)_48%,rgba(15,14,11,0.94)_100%)]"
                aria-hidden="true"
            />

            <div className="relative z-20 flex w-full items-start justify-between gap-4">
                <Badge tone={config.tone} size="sm" className="backdrop-blur-sm">
                    {config.label}
                </Badge>
            </div>

            <div className="relative z-20 flex min-w-0 flex-col gap-3">
                <div className="flex min-w-0 flex-col gap-2">
                    <h2 className={`${titleClasses[viewport]} text-[var(--color-text-default)]`}>
                        {title}
                    </h2>
                    <p className="text-body-small text-[var(--color-text-muted)]">
                        {description}
                    </p>
                </div>

                <CardAction>{actionLabel}</CardAction>
            </div>
        </Link>
    );
}
