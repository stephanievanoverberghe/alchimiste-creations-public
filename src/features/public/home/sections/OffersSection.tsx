import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { HomePageContent } from "@/content/home";

type OffersSectionProps = {
    categories: HomePageContent["offerCategories"];
    content: HomePageContent["offers"];
};

/**
 * Les offres en index éditorial : quatre portes d'entrée (Créer, Vendre,
 * Améliorer, Sur mesure) posées en lignes plein cadre, le verbe en
 * display géant. Au survol desktop, l'image de la situation se révèle en
 * fond — un « menu » d'agence, pas une grille de cartes.
 */
export function OffersSection({ categories, content }: OffersSectionProps) {
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

            <ol className="mt-8 border-t border-[color:var(--color-border-subtle)] md:mt-12">
                {categories.map((category, index) => (
                    <li key={category.category}>
                        <Link
                            href={category.href}
                            className="focus-ring group relative isolate flex items-center gap-4 overflow-hidden border-b border-[color:var(--color-border-subtle)] px-1 py-6 no-underline transition-[padding] duration-200 ease-standard hover:lg:px-6 md:gap-8 md:py-8"
                        >
                            <Image
                                src={category.image.tablet}
                                alt=""
                                fill
                                sizes="(min-width: 1024px) 90vw, 1px"
                                className="z-0 hidden object-cover opacity-0 transition-opacity duration-300 ease-standard group-hover:opacity-100 lg:block motion-reduce:transition-none"
                            />
                            <span
                                className="absolute inset-0 z-0 hidden bg-[linear-gradient(90deg,rgba(15,14,11,0.94)_0%,rgba(15,14,11,0.82)_50%,rgba(15,14,11,0.72)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block"
                                aria-hidden="true"
                            />

                            <span
                                className="relative z-10 w-8 shrink-0 font-[family-name:var(--font-display)] text-body-small italic text-[color:var(--color-decor-gold)] md:w-10 md:text-body"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="relative z-10 flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                                <span className="shrink-0 font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)] transition-colors duration-200 group-hover:text-[color:var(--color-action-default)] md:w-52 lg:w-64">
                                    {category.label}
                                </span>
                                <span className="min-w-0 text-body-small text-[color:var(--color-text-muted)]">
                                    {category.description}
                                </span>
                            </span>

                            <span
                                className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] text-[color:var(--color-text-muted)] transition-[color,border-color,transform] duration-200 ease-standard group-hover:border-[color:var(--color-decor-gold)]/60 group-hover:text-[color:var(--color-decor-gold)] group-hover:md:translate-x-1"
                                aria-hidden="true"
                            >
                                <ArrowUpRight className="size-4" />
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>

            <div className="mt-6 flex max-w-[640px] items-start gap-3">
                <span
                    className="mt-1 h-8 w-0.5 shrink-0 rounded-full bg-[linear-gradient(180deg,var(--color-decor-gold),var(--color-action-default))]"
                    aria-hidden="true"
                />
                <p className="text-body-small text-[color:var(--color-text-muted)]">
                    <span className="font-medium text-[color:var(--color-text-default)]">
                        {content.guide.title}
                    </span>{" "}
                    {content.guide.description}
                </p>
            </div>
        </Section>
    );
}
