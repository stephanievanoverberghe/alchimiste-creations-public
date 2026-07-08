import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { HomePageContent } from "@/content/home";

type MethodSectionProps = {
    content: HomePageContent["method"];
};

/**
 * La méthode, scénographiée : les trois temps (Clarifier · Designer ·
 * Lancer) posés en mouvements monumentaux qui portent la promesse, puis
 * le déroulé détaillé en six étapes sur un fil de progression. La
 * méthode est l'argument — on la montre comme une preuve de cadre.
 */
export function MethodSection({ content }: MethodSectionProps) {
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
                    <p className="max-w-[520px] text-body-small text-[color:var(--color-text-muted)]">
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

            <div className="mt-10 lg:mt-14">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.phasesLabel}
                </p>
                <ol className="mt-4 grid gap-4 md:grid-cols-3 lg:gap-5">
                    {content.phases.map((phase, index) => (
                        <li
                            key={phase.title}
                            className="group relative flex flex-col gap-4 overflow-hidden rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-6 transition-[border-color,box-shadow] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/50 hover:shadow-elevation-2 md:min-h-[240px] md:p-7"
                        >
                            <span
                                className="pointer-events-none absolute -right-4 -top-6 font-[family-name:var(--font-display)] text-[7rem] italic leading-none text-[color:var(--color-text-default)] opacity-[0.06] transition-opacity duration-200 group-hover:opacity-[0.1]"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                                {`Temps ${String(index + 1).padStart(2, "0")}`}
                            </span>
                            <span className="mt-auto font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                                {phase.title}
                            </span>
                            <span className="text-body-small text-[color:var(--color-text-muted)]">
                                {phase.description}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="mt-10 lg:mt-14">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.stepsLabel}
                </p>
                <ol className="relative mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    {content.steps.map((step, index) => (
                        <li
                            key={step.title}
                            className="flex gap-4 border-t border-[color:var(--color-border-strong)] pt-4"
                        >
                            <span
                                className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="flex min-w-0 flex-col gap-1.5">
                                <span className="text-body-small font-semibold text-[color:var(--color-text-default)]">
                                    {step.title}
                                </span>
                                <span className="text-body-small text-[color:var(--color-text-muted)]">
                                    {step.description}
                                </span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
}
