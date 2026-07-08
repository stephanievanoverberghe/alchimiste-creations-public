import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { MethodPageContent } from "@/content/method";

type MethodAdaptationSectionProps = {
    content: MethodPageContent["adaptation"];
};

/**
 * L'adaptation : la méthode reste stable, seule l'intensité du cadrage
 * change selon le type de projet. Le principe posé, puis les quatre
 * familles d'offres en index, et la passerelle vers les offres. Dernière
 * section avant la bande CTA du footer.
 */
export function MethodAdaptationSection({
    content,
}: MethodAdaptationSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
                <div className="flex max-w-[640px] flex-col gap-3">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        {content.eyebrow}
                    </p>
                    <h2 className="text-balance">{content.title}</h2>
                    <p className="max-w-[540px] text-body-small text-[color:var(--color-text-muted)]">
                        {content.description}
                    </p>
                </div>
                <Button
                    href={content.action.href}
                    variant="ghost"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    className="shrink-0 self-start md:self-end"
                >
                    {content.action.label}
                </Button>
            </div>

            <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-12">
                <div className="relative overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/45 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-6 shadow-elevation-2 md:p-8">
                    <span
                        className="absolute inset-y-6 left-0 w-0.5 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                        aria-hidden="true"
                    />
                    <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                        {content.principle.label}
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                        {content.principle.title}
                    </p>
                    <p className="mt-3 max-w-[460px] text-body-small text-[color:var(--color-text-muted)]">
                        {content.principle.description}
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    <ol className="grid gap-4 sm:grid-cols-2">
                        {content.families.map((family, index) => (
                            <li
                                key={family.group}
                                className="flex flex-col gap-3 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5"
                            >
                                <div className="flex items-baseline gap-2.5">
                                    <span
                                        className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                                        {family.group}
                                    </span>
                                </div>
                                <ul className="flex flex-wrap gap-2">
                                    {family.entries.map((entry) => (
                                        <li
                                            key={entry}
                                            className="inline-flex items-center rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(255,243,224,0.05)] px-3 py-1 text-caption text-[color:var(--color-text-muted)]"
                                        >
                                            {entry}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ol>

                    <div className="flex items-start gap-3">
                        <span
                            className="mt-1 h-8 w-0.5 shrink-0 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                            aria-hidden="true"
                        />
                        <p className="max-w-[560px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.note}
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
