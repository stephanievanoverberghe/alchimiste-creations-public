import { HelpCircle } from "lucide-react";

import { Section } from "@/components/layout";
import type { OfferDetailPageContent } from "@/content/offers";

type OfferProblemSectionProps = {
    content: OfferDetailPageContent["purpose"];
};

/**
 * Le problème : la tension que l'offre vient résoudre, les questions
 * qu'elle règle, et la phrase-clé qui la résume. Ouvre le récit.
 */
export function OfferProblemSection({ content }: OfferProblemSectionProps) {
    return (
        <Section spacing="lg">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14">
                <div className="flex flex-col gap-4">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        01 — Le problème
                    </p>
                    <h2 className="text-balance">{content.title}</h2>
                    <p className="text-body text-[color:var(--color-text-muted)]">
                        {content.description}
                    </p>
                    <div className="mt-2 flex items-start gap-3 rounded-panel border border-[color:var(--color-decor-gold)]/40 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-5 md:p-6">
                        <span
                            className="mt-1 h-8 w-0.5 shrink-0 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                            aria-hidden="true"
                        />
                        <p className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                            {content.message}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                        {"Les questions qu'on pose"}
                    </p>
                    <ul className="flex flex-col gap-3">
                        {content.questions.map((question) => (
                            <li
                                key={question}
                                className="flex items-start gap-3 rounded-card border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-4 md:p-5"
                            >
                                <HelpCircle
                                    className="mt-0.5 size-4 shrink-0 text-[color:var(--color-decor-gold)]"
                                    aria-hidden="true"
                                />
                                <span className="text-body-small text-[color:var(--color-text-default)]">
                                    {question}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
}
