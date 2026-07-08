import { Quote } from "lucide-react";

import { Section } from "@/components/layout";
import type { HomePageContent } from "@/content/home";

type ProblemSectionProps = {
    content: HomePageContent["problem"];
};

/**
 * La tension du départ : les doutes réels des clients (citations), puis
 * le recadrage — « ce n'est pas encore un problème de design, c'est un
 * travail de clarté » — et ce que la clarté change concrètement.
 * Scénographie éditoriale, du flou vers la direction.
 */
export function ProblemSection({ content }: ProblemSectionProps) {
    return (
        <Section
            className="relative border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[760px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
                <div className="flex flex-col gap-4">
                    <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                        {content.signalsLabel}
                    </p>
                    <ul className="flex flex-col gap-3">
                        {content.signals.map((signal, index) => (
                            <li
                                key={signal}
                                className={`flex items-start gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 md:p-5 ${
                                    index % 2 === 1 ? "lg:ml-8" : "lg:mr-8"
                                }`}
                            >
                                <Quote
                                    className="mt-0.5 size-4 shrink-0 -scale-x-100 text-[color:var(--color-decor-gold)]"
                                    aria-hidden="true"
                                />
                                <span className="font-[family-name:var(--font-display)] text-body italic text-[color:var(--color-text-default)]">
                                    {signal}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-6 lg:pt-9">
                    <div className="relative overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/45 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-6 shadow-elevation-2 md:p-8">
                        <span
                            className="absolute inset-y-6 left-0 w-0.5 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                            aria-hidden="true"
                        />
                        <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.insight.label}
                        </p>
                        <p className="mt-3 font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                            {content.insight.title}
                        </p>
                        <p className="mt-3 max-w-[460px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.insight.description}
                        </p>
                    </div>

                    <div>
                        <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                            {content.takeawaysLabel}
                        </p>
                        <ol className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-3">
                            {content.takeaways.map((takeaway, index) => (
                                <li
                                    key={takeaway.title}
                                    className="flex flex-col gap-2 border-t border-[color:var(--color-border-strong)] pt-3"
                                >
                                    <span
                                        className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-body-small font-semibold text-[color:var(--color-text-default)]">
                                        {takeaway.title}
                                    </span>
                                    <span className="text-body-small text-[color:var(--color-text-muted)]">
                                        {takeaway.description}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </Section>
    );
}
