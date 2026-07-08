import type { ReactNode } from "react";
import { CheckCircle2, Plus, SlidersHorizontal } from "lucide-react";

import { Section } from "@/components/layout";
import type { OfferDetailPageContent } from "@/content/offers";

type OfferPricingSectionProps = {
    content: OfferDetailPageContent["pricing"];
};

/**
 * Le prix : le repère de départ mis en avant, puis la transparence en trois
 * colonnes — la base incluse, ce qui peut faire varier le tarif, et les
 * options à n'ajouter que si elles servent le projet.
 */
export function OfferPricingSection({ content }: OfferPricingSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end lg:gap-12">
                <div className="flex max-w-[640px] flex-col gap-4">
                    <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        05 — Le prix
                    </p>
                    <h2 className="text-balance">{content.title}</h2>
                    <p className="text-body text-[color:var(--color-text-muted)]">
                        {content.description}
                    </p>
                </div>

                <div className="flex flex-col gap-2 rounded-panel border border-[color:var(--color-decor-gold)]/45 bg-[image:var(--gradient-hero)] bg-[var(--color-surface-default)] p-6 shadow-elevation-2">
                    <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                        Repère de départ
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                        {content.price}
                    </span>
                    <span className="text-body-small text-[color:var(--color-text-muted)]">
                        Le devis se construit après avoir cadré le vrai périmètre, pas avant.
                    </span>
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:mt-10 lg:grid-cols-3 lg:gap-6">
                <PricingColumn
                    icon={<CheckCircle2 className="size-5" aria-hidden="true" />}
                    title="La base"
                    description="Ce qui est généralement prévu dans le socle de départ."
                    items={content.included}
                    highlighted
                />
                <PricingColumn
                    icon={<SlidersHorizontal className="size-5" aria-hidden="true" />}
                    title="Ce qui peut varier"
                    description="Les éléments qui font évoluer le périmètre et le tarif."
                    items={content.factors}
                />
                <PricingColumn
                    icon={<Plus className="size-5" aria-hidden="true" />}
                    title="Options"
                    description="À ajouter seulement si elles servent vraiment le projet."
                    items={content.options}
                />
            </div>
        </Section>
    );
}

function PricingColumn({
    description,
    highlighted = false,
    icon,
    items,
    title,
}: {
    description: string;
    highlighted?: boolean;
    icon: ReactNode;
    items: readonly string[];
    title: string;
}) {
    return (
        <article
            className={`flex flex-col gap-4 rounded-panel border p-5 md:p-6 ${
                highlighted
                    ? "border-[color:var(--color-decor-gold)]/55 bg-[var(--color-surface-default)] shadow-elevation-1"
                    : "border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)]"
            }`}
        >
            <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-decor-gold)]">
                    {icon}
                </span>
                <span className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                    {title}
                </span>
            </div>
            <p className="text-body-small text-[color:var(--color-text-muted)]">
                {description}
            </p>
            <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                    <li
                        key={item}
                        className="flex items-start gap-2.5 text-body-small text-[color:var(--color-text-muted)]"
                    >
                        <span
                            className={`mt-2 size-1.5 shrink-0 rounded-full ${
                                highlighted
                                    ? "bg-[var(--color-decor-gold)]"
                                    : "bg-[color:var(--color-border-strong)]"
                            }`}
                            aria-hidden="true"
                        />
                        {item}
                    </li>
                ))}
            </ul>
        </article>
    );
}
