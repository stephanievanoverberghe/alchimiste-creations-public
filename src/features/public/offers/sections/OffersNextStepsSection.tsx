import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { OffersPageContent } from "@/content/offers";

type OffersNextStepsSectionProps = {
    content: OffersPageContent["nextSteps"];
};

/**
 * La suite : rassurer sur le fait qu'on ne choisit pas seul. Les quatre
 * temps du premier échange en fil de progression, l'appel à présenter le
 * projet et la passerelle vers la méthode. Dernière section avant la bande
 * CTA du footer.
 */
export function OffersNextStepsSection({
    content,
}: OffersNextStepsSectionProps) {
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
                    href={content.methodLink.href}
                    variant="ghost"
                    iconRight={<ArrowRight className="size-4" aria-hidden="true" />}
                    className="shrink-0 self-start md:self-end"
                >
                    {content.methodLink.label}
                </Button>
            </div>

            <ol className="mt-8 grid gap-x-8 gap-y-6 md:mt-12 sm:grid-cols-2 lg:grid-cols-4">
                {content.steps.map((step, index) => (
                    <li
                        key={step.title}
                        className="flex flex-col gap-2 border-t border-[color:var(--color-border-strong)] pt-4"
                    >
                        <span
                            className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                            aria-hidden="true"
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-body-small font-semibold text-[color:var(--color-text-default)]">
                            {step.title}
                        </span>
                        <span className="text-body-small text-[color:var(--color-text-muted)]">
                            {step.description}
                        </span>
                    </li>
                ))}
            </ol>

            <div className="mt-8 md:mt-10">
                <Button
                    href={content.action.href}
                    variant="primary"
                    size="lg"
                    className="w-full shadow-[var(--glow-action)] sm:w-fit"
                >
                    {content.action.label}
                </Button>
            </div>
        </Section>
    );
}
