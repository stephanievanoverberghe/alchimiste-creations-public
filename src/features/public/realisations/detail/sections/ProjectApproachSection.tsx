import { Section } from "@/components/layout";
import type { RealisationsProjectContent } from "@/content/realisations";

type ProjectApproachSectionProps = {
    method: RealisationsProjectContent["method"];
    work: RealisationsProjectContent["work"];
};

/**
 * L'approche : les choix de production, posés en fil (les temps de la
 * méthode appliqués au projet), et l'accompagnement qui les a portés. On
 * montre comment l'intention est devenue une décision à chaque étape.
 */
export function ProjectApproachSection({
    method,
    work,
}: ProjectApproachSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {"05 — L'approche"}
                </p>
                <h2 className="text-balance">{method.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {method.description}
                </p>
            </div>

            <div className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:gap-12">
                <ol className="relative flex flex-col gap-6">
                    <span
                        className="pointer-events-none absolute bottom-3 left-[15px] top-3 w-px bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))] opacity-70"
                        aria-hidden="true"
                    />
                    {method.steps.map((step, index) => (
                        <li key={step.title} className="relative flex gap-4">
                            <span
                                className="relative z-10 mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/50 bg-[var(--color-surface-default)] font-[family-name:var(--font-display)] text-body-small italic text-[color:var(--color-decor-gold)]"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="flex min-w-0 flex-1 flex-col gap-1 pb-1">
                                <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                                    {step.phase}
                                </span>
                                <h3 className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                                    {step.title}
                                </h3>
                                <p className="text-body-small text-[color:var(--color-text-muted)]">
                                    {step.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="flex flex-col gap-4 rounded-panel border border-[color:var(--color-decor-gold)]/40 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-5 lg:sticky lg:top-24 lg:self-start md:p-6">
                    <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                        {work.title}
                    </span>
                    <ul className="flex flex-col gap-2.5">
                        {work.items.map((item) => (
                            <li
                                key={item}
                                className="flex items-start gap-2.5 text-body-small text-[color:var(--color-text-muted)]"
                            >
                                <span
                                    className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-decor-gold)]"
                                    aria-hidden="true"
                                />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="border-t border-[color:var(--color-border-subtle)] pt-4 text-body-small text-[color:var(--color-text-default)]">
                        {work.message}
                    </p>
                </div>
            </div>
        </Section>
    );
}
