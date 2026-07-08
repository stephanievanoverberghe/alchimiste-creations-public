export type MetricCardTone = "default" | "accent";
export type MetricCardViewport = "responsive" | "mobile" | "tablet" | "desktop";

export type MetricCardProps = {
    viewport?: MetricCardViewport;
    tone?: MetricCardTone;
    label: string;
    value: string;
    description: string;
    className?: string;
};

export function MetricCard({
    viewport = "responsive",
    tone = "default",
    label,
    value,
    description,
    className,
}: MetricCardProps) {
    const isAccent = tone === "accent";
    const surfaceClasses = isAccent
        ? "border border-[color:var(--color-action-default)] bg-[linear-gradient(180deg,var(--color-action-subtle),var(--color-surface-default))]"
        : "border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]";
    const accentTextClasses = isAccent
        ? "text-[var(--color-action-default)]"
        : "text-[var(--color-text-muted)]";
    const dotClasses = isAccent
        ? "bg-[var(--color-action-default)] shadow-[0_0_0_4px_var(--color-action-subtle)]"
        : "bg-[var(--color-border-control)]";

    const viewportClasses: Record<MetricCardViewport, string> = {
        responsive:
            "gap-4 p-5 md:p-6",
        mobile: "gap-4 p-5",
        tablet: "gap-4 p-6",
        desktop: "gap-4 p-6",
    };

    const valueClasses: Record<MetricCardViewport, string> = {
        responsive:
            "font-[var(--text-h2-weight)] text-[length:var(--text-h2-size)] leading-[var(--text-h2-line-height)] tracking-[var(--text-h2-letter-spacing)] md:font-[var(--text-h1-weight)] md:text-[length:var(--text-h1-size)] md:leading-[var(--text-h1-line-height)] md:tracking-[var(--text-h1-letter-spacing)]",
        mobile: "text-h2",
        tablet: "text-h1",
        desktop: "text-h1",
    };

    return (
        <article
            className={`flex w-full self-start rounded-3xl ${surfaceClasses} ${viewportClasses[viewport]} ${className ?? ""}`}
        >
            <div className="flex w-full flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`size-2 rounded-full ${dotClasses}`}
                        aria-hidden="true"
                    />
                    <span className={`text-label ${accentTextClasses}`}>
                        {label}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <p className={`${valueClasses[viewport]} text-[var(--color-text-default)]`}>
                        {value}
                    </p>
                    <p className={`text-caption ${accentTextClasses}`}>
                        {description}
                    </p>
                </div>
            </div>
        </article>
    );
}
