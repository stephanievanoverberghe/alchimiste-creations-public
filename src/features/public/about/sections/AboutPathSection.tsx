import { Section } from "@/components/layout";
import type { AboutPageContent } from "@/content/about";

type AboutPathSectionProps = {
    content: AboutPageContent["path"];
};

/**
 * Le parcours re-scénographié : les trois matières du studio (l'image,
 * le parcours, le code) numérotées et reliées en rail, puis leur
 * synthèse en bande pleine largeur — le studio comme point de
 * convergence, pas comme addition de prestations.
 */
export function AboutPathSection({ content }: AboutPathSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <ol className="relative mt-10 grid gap-7 sm:grid-cols-3 sm:gap-8 lg:mt-14">
                <span
                    className="pointer-events-none absolute left-[13px] right-[13px] top-[13px] hidden h-px bg-[linear-gradient(90deg,var(--color-decor-gold),transparent)] sm:block"
                    aria-hidden="true"
                />
                <span
                    className="pointer-events-none absolute bottom-3 left-[13px] top-3 w-px bg-[linear-gradient(180deg,var(--color-decor-gold),transparent)] sm:hidden"
                    aria-hidden="true"
                />
                {content.steps.map((step, index) => (
                    <li key={step.title} className="relative flex gap-4 sm:flex-col">
                        <span
                            className="relative z-10 inline-flex size-[26px] shrink-0 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/55 bg-[var(--color-bg-deep)] text-caption font-semibold text-[color:var(--color-decor-gold)]"
                            aria-hidden="true"
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex min-w-0 flex-col gap-1.5 pt-0.5 sm:pt-0">
                            <span className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                                {step.title}
                            </span>
                            <span className="max-w-[440px] text-body-small text-[color:var(--color-text-muted)]">
                                {step.description}
                            </span>
                        </span>
                    </li>
                ))}
            </ol>

            <div className="relative mt-8 overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/45 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-6 shadow-elevation-2 md:mt-12 md:p-8">
                <span
                    className="absolute inset-y-6 left-0 w-0.5 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                    aria-hidden="true"
                />
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                    {content.synthesis.label}
                </p>
                <p className="mt-3 max-w-[560px] font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                    {content.synthesis.title}
                </p>
                <p className="mt-3 max-w-[560px] text-body-small text-[color:var(--color-text-muted)]">
                    {content.synthesis.description}
                </p>
            </div>
        </Section>
    );
}
