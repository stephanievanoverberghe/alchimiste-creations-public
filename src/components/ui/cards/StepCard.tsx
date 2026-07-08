import { MaybeLink, clickableClasses } from "@/components/ui/cards/shared";

export type StepCardState = "default" | "active";
export type StepCardViewport = "responsive" | "mobile" | "tablet" | "desktop";

export type StepCardProps = {
    viewport?: StepCardViewport;
    state?: StepCardState;
    number: string;
    title: string;
    description: string;
    href?: string;
    className?: string;
};

export function StepCard({
    viewport = "responsive",
    state = "default",
    number,
    title,
    description,
    href,
    className,
}: StepCardProps) {
    const isActive = state === "active";
    const isInteractive = Boolean(href) && !isActive;
    const surfaceClasses = isActive
        ? "border-2 border-[color:var(--color-action-default)] bg-[linear-gradient(180deg,var(--color-action-subtle),var(--color-surface-default))]"
        : "border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]";
    const numberClasses = isActive
        ? "bg-[var(--color-action-default)] text-[var(--color-text-inverse)]"
        : "bg-[var(--color-surface-interactive)] text-[var(--color-text-default)]";
    const lineClasses = isActive
        ? "bg-[var(--color-action-default)]"
        : "bg-[var(--color-border-subtle)]";
    const interactiveClasses = isInteractive
        ? `cursor-pointer no-underline ${clickableClasses}`
        : "";

    const viewportClasses: Record<StepCardViewport, string> = {
        responsive:
            "gap-4 p-5 md:p-6 lg:p-8",
        mobile: "gap-4 p-5",
        tablet: "gap-4 p-6",
        desktop: "gap-4 p-8",
    };

    const titleClasses: Record<StepCardViewport, string> = {
        responsive:
            "font-[var(--text-h4-weight)] text-[length:var(--text-h4-size)] leading-[var(--text-h4-line-height)] tracking-[var(--text-h4-letter-spacing)] md:font-[var(--text-h3-weight)] md:text-[length:var(--text-h3-size)] md:leading-[var(--text-h3-line-height)] md:tracking-[var(--text-h3-letter-spacing)]",
        mobile: "text-h4",
        tablet: "text-h3",
        desktop: "text-h3",
    };

    return (
        <MaybeLink
            href={isInteractive ? href : undefined}
            className={`focus-ring group flex w-full self-start flex-col items-start rounded-3xl ${surfaceClasses} ${interactiveClasses} ${viewportClasses[viewport]} ${className ?? ""}`}
        >
            <div className="flex w-full items-center gap-3">
                <span
                    className={`inline-flex h-6 min-w-[44px] items-center justify-center rounded-full px-2 text-label ${numberClasses}`}
                >
                    {number}
                </span>
                <span className={`h-px flex-1 ${lineClasses}`} aria-hidden="true" />
            </div>

            <div className="flex w-full min-w-0 flex-col gap-2">
                <h2 className={`${titleClasses[viewport]} text-[var(--color-text-default)]`}>
                    {title}
                </h2>
                <p className="text-body-small text-[var(--color-text-muted)]">
                    {description}
                </p>
            </div>
        </MaybeLink>
    );
}
