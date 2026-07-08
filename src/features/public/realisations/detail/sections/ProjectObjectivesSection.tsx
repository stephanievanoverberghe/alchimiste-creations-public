import { Target } from "lucide-react";

import { Section } from "@/components/layout";
import type { RealisationsProjectContent } from "@/content/realisations";

type ProjectObjectivesSectionProps = {
    content: RealisationsProjectContent["objectives"];
};

/**
 * Les objectifs : ce que le projet devait accomplir, en cibles claires,
 * puis la ligne directrice qui les relie.
 */
export function ProjectObjectivesSection({
    content,
}: ProjectObjectivesSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    04 — Les objectifs
                </p>
                <h2 className="text-balance">{content.title}</h2>
            </div>

            <ul className="mt-8 grid gap-3 md:mt-10 sm:grid-cols-2 lg:grid-cols-3">
                {content.items.map((item) => (
                    <li
                        key={item}
                        className="flex items-start gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4"
                    >
                        <span
                            className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                            aria-hidden="true"
                        >
                            <Target className="size-3.5" />
                        </span>
                        <span className="text-body-small text-[color:var(--color-text-default)]">
                            {item}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-6 flex items-start gap-3">
                <span
                    className="mt-1 h-8 w-0.5 shrink-0 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                    aria-hidden="true"
                />
                <p className="max-w-[620px] text-body-small text-[color:var(--color-text-muted)]">
                    {content.message}
                </p>
            </div>
        </Section>
    );
}
