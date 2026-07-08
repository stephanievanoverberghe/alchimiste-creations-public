import Link from "next/link";
import { ArrowUpRight, Wrench } from "lucide-react";

import { ResponsiveFillImage, Section } from "@/components/layout";
import type { OffersPageContent } from "@/content/offers";

type OffersOnQuoteContent = OffersPageContent["onQuote"];
type OnQuoteOffer = OffersOnQuoteContent["offers"][number];

type OffersOnQuoteSectionProps = {
    content: OffersOnQuoteContent;
};

/**
 * Les accompagnements sur devis : boutique, formation et projet sur mesure,
 * présentés honnêtement comme des projets chiffrés après un échange
 * (pas de prix ferme, une page dédiée allégée). En complément, la
 * maintenance réservée aux sites réalisés par le studio.
 */
export function OffersOnQuoteSection({ content }: OffersOnQuoteSectionProps) {
    return (
        <Section
            id="sur-devis"
            className="scroll-mt-24 border-t border-[color:var(--color-border-subtle)]"
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

            <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-12">
                <div className="relative isolate min-h-[280px] overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/45 shadow-elevation-2 lg:min-h-[420px]">
                    <ResponsiveFillImage
                        image={content.image}
                        sizes="(min-width: 1024px) 44vw, 100vw"
                        className="z-0 object-cover"
                    />
                    <span
                        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0.24)_0%,rgba(15,14,11,0.6)_54%,rgba(15,14,11,0.94)_100%)]"
                        aria-hidden="true"
                    />
                    <span
                        className="absolute inset-x-6 top-0 z-20 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)]"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 p-6 md:p-7">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.quoteLabel}
                        </span>
                        <p className="max-w-[360px] font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                            {content.imageCaption}
                        </p>
                    </div>
                </div>

                <ol className="flex flex-col gap-3">
                    {content.offers.map((offer) => (
                        <OnQuoteRow
                            key={offer.title}
                            offer={offer}
                            quoteLabel={content.quoteLabel}
                        />
                    ))}
                </ol>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
                <div className="flex items-start gap-3">
                    <span
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-subtle)] text-[color:var(--color-action-default)]"
                        aria-hidden="true"
                    >
                        <Wrench className="size-4" />
                    </span>
                    <div className="flex flex-col gap-1">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.maintenance.label}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                            {content.maintenance.title}
                        </span>
                        <span className="max-w-[520px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.maintenance.description}
                        </span>
                    </div>
                </div>
                <Link
                    href={content.maintenance.href}
                    className="focus-ring group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-[color:var(--color-border-strong)] px-4 py-2 text-body-small font-semibold text-[color:var(--color-action-default)] no-underline transition-[border-color] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/60 sm:self-center"
                >
                    {content.maintenance.price}
                    <ArrowUpRight
                        className="size-4 transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </Section>
    );
}

function OnQuoteRow({
    offer,
    quoteLabel,
}: {
    offer: OnQuoteOffer;
    quoteLabel: string;
}) {
    return (
        <li>
            <Link
                href={offer.href}
                className="focus-ring group flex items-center gap-4 rounded-panel border border-[color:var(--color-border-subtle)] bg-[var(--color-surface-default)] p-5 no-underline transition-[border-color,box-shadow] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/55 hover:shadow-elevation-1 md:p-6"
            >
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)] transition-colors duration-200 group-hover:text-[color:var(--color-action-default)]">
                            {offer.title}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-[color:var(--color-border-strong)] px-2.5 py-0.5 text-caption uppercase tracking-[0.08em] text-[color:var(--color-decor-gold)]">
                            {quoteLabel}
                        </span>
                    </span>
                    <span className="text-body-small text-[color:var(--color-text-muted)]">
                        {offer.description}
                    </span>
                </span>
                <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] text-[color:var(--color-text-muted)] transition-[color,border-color,transform] duration-200 ease-standard group-hover:border-[color:var(--color-decor-gold)]/60 group-hover:text-[color:var(--color-decor-gold)] group-hover:translate-x-0.5"
                    aria-hidden="true"
                >
                    <ArrowUpRight className="size-4" />
                </span>
            </Link>
        </li>
    );
}
