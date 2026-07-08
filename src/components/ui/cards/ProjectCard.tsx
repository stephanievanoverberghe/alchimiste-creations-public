import Image from "next/image";
import Link from "next/link";

import { Badge, type BadgeTone } from "../primitives";
import { CardAction, clickableClasses } from "@/components/ui/cards/shared";

export type ProjectCardViewport = "responsive" | "mobile" | "tablet" | "desktop";

export type ProjectCardProps = {
    viewport?: ProjectCardViewport;
    badge?: string;
    badgeTone?: BadgeTone;
    meta?: string;
    title: string;
    description: string;
    actionLabel?: string;
    imageSrc?: string;
    imageAlt?: string;
    href: string;
    className?: string;
};

export function ProjectCard({
    viewport = "responsive",
    badge = "Projet",
    badgeTone = "success",
    meta,
    title,
    description,
    actionLabel = "Voir le projet",
    imageSrc,
    imageAlt = "",
    href,
    className,
}: ProjectCardProps) {
    const hasImage = Boolean(imageSrc);
    const surfaceClasses = hasImage
        ? "overflow-hidden border-[color:rgba(255,243,224,0.18)] bg-[var(--color-bg-deep)] shadow-lg shadow-black/25"
        : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]";
    const contentLayerClasses = hasImage ? "relative z-20" : "";

    const viewportClasses: Record<ProjectCardViewport, string> = {
        responsive:
            "min-h-[320px] gap-3 p-5 md:min-h-[360px] md:gap-4 md:p-6 lg:min-h-[420px] lg:gap-5 lg:p-8",
        mobile:
            "min-h-[320px] gap-3 p-5",
        tablet:
            "min-h-[360px] gap-4 p-6",
        desktop:
            "min-h-[420px] gap-5 p-8",
    };

    const contentClasses: Record<ProjectCardViewport, string> = {
        responsive: "w-full md:max-w-[520px] lg:max-w-[620px]",
        mobile: "w-full",
        tablet: "w-full max-w-[520px]",
        desktop: "w-full max-w-[620px]",
    };

    const titleClasses: Record<ProjectCardViewport, string> = {
        responsive:
            "font-[var(--text-h4-weight)] text-[length:var(--text-h4-size)] leading-[var(--text-h4-line-height)] tracking-[var(--text-h4-letter-spacing)] md:font-[var(--text-h3-weight)] md:text-[length:var(--text-h3-size)] md:leading-[var(--text-h3-line-height)] md:tracking-[var(--text-h3-letter-spacing)] lg:font-[var(--text-h2-weight)] lg:text-[length:var(--text-h2-size)] lg:leading-[var(--text-h2-line-height)] lg:tracking-[var(--text-h2-letter-spacing)]",
        mobile:
            "text-h4",
        tablet:
            "text-h3",
        desktop:
            "text-h2",
    };

    return (
        <Link
            href={href}
            className={`focus-ring group relative isolate flex w-full self-start cursor-pointer flex-col items-start rounded-3xl border no-underline ${clickableClasses} ${surfaceClasses} ${viewportClasses[viewport]} ${className ?? ""}`}
        >
            {imageSrc ? (
                <>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(min-width: 1024px) 760px, (min-width: 768px) 640px, 390px"
                        className="z-0 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span
                        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0.20)_0%,rgba(15,14,11,0.58)_48%,rgba(15,14,11,0.92)_100%)]"
                        aria-hidden="true"
                    />
                </>
            ) : null}

            <div
                className={`flex items-center gap-2 ${contentLayerClasses}`}
            >
                <Badge
                    tone={badgeTone}
                    size="sm"
                    className={hasImage ? "backdrop-blur-sm" : undefined}
                >
                    {badge}
                </Badge>
                {meta ? (
                    <span
                        className={`text-caption ${hasImage ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-subtle)]"}`}
                    >
                        {meta}
                    </span>
                ) : null}
            </div>

            <div
                className={`mt-auto flex min-w-0 flex-col gap-4 ${contentClasses[viewport]} ${contentLayerClasses}`}
            >
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
