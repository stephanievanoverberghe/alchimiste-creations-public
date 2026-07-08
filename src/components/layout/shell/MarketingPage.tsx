export type MarketingPageProps = {
    activeHref: string;
    description: string;
    eyebrow: string;
    title: string;
};

export function MarketingPage({
    description,
    eyebrow,
    title,
}: MarketingPageProps) {
    return (
        <section className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[960px] flex-col justify-center gap-4 px-5 py-80 md:min-h-[calc(100vh-64px)] md:px-8 lg:min-h-[calc(100vh-80px)] lg:px-12">
            <p className="text-label uppercase text-[color:var(--color-action-default)]">
                {eyebrow}
            </p>

            <div className="flex max-w-[720px] flex-col gap-4">
                <h1 className="text-h1 text-[color:var(--color-text-default)]">
                    {title}
                </h1>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {description}
                </p>
            </div>
        </section>
    );
}
