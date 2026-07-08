import { Check } from "lucide-react";

import { Section } from "@/components/layout";
import type { RealisationsProjectContent } from "@/content/realisations";

type ProjectResultSectionProps = {
    content: RealisationsProjectContent["proof"];
};

/**
 * Le résultat : ce que le projet démontre concrètement — la preuve tirée de
 * l'étude de cas, sans survente.
 */
export function ProjectResultSection({ content }: ProjectResultSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    06 — Le résultat
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <ul className="mt-8 grid gap-3 md:mt-10 sm:grid-cols-2 lg:grid-cols-3">
                {content.items.map((item) => (
                    <li
                        key={item}
                        className="flex items-start gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4"
                    >
                        <span
                            className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                            aria-hidden="true"
                        >
                            <Check className="size-3" />
                        </span>
                        <span className="text-body-small text-[color:var(--color-text-default)]">
                            {item}
                        </span>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
