import { Plus } from "lucide-react";

import { Section } from "@/components/layout";
import type { OfferDetailPageContent } from "@/content/offers";

type OfferFaqSectionProps = {
    items: NonNullable<OfferDetailPageContent["faq"]>;
};

/**
 * FAQ courte : les questions concrètes qu'un prospect se pose avant de se
 * lancer, en accordéon natif `<details>` (accessible, sans JavaScript).
 */
export function OfferFaqSection({ items }: OfferFaqSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    06 — FAQ
                </p>
                <h2 className="text-balance">{"Les questions qu'on nous pose."}</h2>
            </div>

            <ul className="mt-8 flex flex-col gap-3 md:mt-12">
                {items.map((item) => (
                    <li key={item.question}>
                        <details className="group rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] transition-[border-color] duration-200 ease-standard open:border-[color:var(--color-decor-gold)]/45">
                            <summary className="focus-ring flex cursor-pointer items-center justify-between gap-4 rounded-panel px-5 py-4 md:px-6 md:py-5 [&::-webkit-details-marker]:hidden">
                                <span className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                                    {item.question}
                                </span>
                                <span
                                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] text-[color:var(--color-decor-gold)] transition-transform duration-200 ease-standard group-open:rotate-45"
                                    aria-hidden="true"
                                >
                                    <Plus className="size-4" />
                                </span>
                            </summary>
                            <p className="px-5 pb-5 text-body-small text-[color:var(--color-text-muted)] md:px-6 md:pb-6">
                                {item.answer}
                            </p>
                        </details>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
