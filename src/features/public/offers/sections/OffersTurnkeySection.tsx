import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout";
import type { OffersPageContent } from "@/content/offers";

type OffersTurnkeyContent = OffersPageContent["turnkey"];
type OfferFamily = OffersTurnkeyContent["families"][number];
type TurnkeyOffer = OfferFamily["offers"][number];

type OffersTurnkeySectionProps = {
    content: OffersTurnkeyContent;
};

/**
 * Les offres clé-en-main : le cœur commercial de la page. Deux familles
 * (Créer, Améliorer), chacune ancrée (`#creer`, `#ameliorer`) pour les
 * situations du héros, avec ses offres en cartes affichant un tarif
 * « à partir de » assumé et un lien vers la page dédiée.
 */
export function OffersTurnkeySection({ content }: OffersTurnkeySectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[720px] flex-col gap-4">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-10 flex flex-col gap-12 lg:mt-14 lg:gap-16">
                {content.families.map((family) => (
                    <OfferFamilyBlock key={family.id} family={family} />
                ))}
            </div>
        </Section>
    );
}

function OfferFamilyBlock({ family }: { family: OfferFamily }) {
    const gridClassName =
        family.offers.length >= 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2";

    return (
        <div id={family.id} className="scroll-mt-24">
            <div className="flex flex-col gap-2 border-l-2 border-[color:var(--color-decor-gold)] pl-5">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                    {family.eyebrow}
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-h2 text-[color:var(--color-text-default)]">
                    {family.label}
                </h3>
                <p className="max-w-[560px] text-body-small text-[color:var(--color-text-muted)]">
                    {family.description}
                </p>
            </div>

            <div className={`mt-6 grid gap-4 ${gridClassName}`}>
                {family.offers.map((offer) => (
                    <OfferCard key={offer.title} offer={offer} />
                ))}
            </div>
        </div>
    );
}

function OfferCard({ offer }: { offer: TurnkeyOffer }) {
    return (
        <Link
            href={offer.href}
            className="focus-ring group flex min-h-[200px] flex-col justify-between gap-4 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 no-underline shadow-elevation-1 transition-[border-color,box-shadow] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/55 hover:shadow-elevation-2 md:p-6"
        >
            <div className="flex flex-col gap-2">
                <h4 className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)] transition-colors duration-200 group-hover:text-[color:var(--color-action-default)]">
                    {offer.title}
                </h4>
                <p className="text-body-small text-[color:var(--color-text-muted)]">
                    {offer.description}
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border-strong)] pt-3">
                <span className="text-body-small font-semibold text-[color:var(--color-action-default)]">
                    {offer.price}
                </span>
                <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] text-[color:var(--color-text-muted)] transition-[color,border-color,transform] duration-200 ease-standard group-hover:border-[color:var(--color-decor-gold)]/60 group-hover:text-[color:var(--color-decor-gold)] group-hover:translate-x-0.5"
                    aria-hidden="true"
                >
                    <ArrowUpRight className="size-4" />
                </span>
            </div>
        </Link>
    );
}
