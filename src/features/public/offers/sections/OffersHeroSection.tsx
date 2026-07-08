import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Button } from "@/components/ui";
import type { OffersPageContent } from "@/content/offers";

type OffersHeroSectionProps = {
    content: OffersPageContent["hero"];
};

/**
 * Héros propre aux offres : titre display avec le verbe clé en italique
 * dégradé, puis — composition unique à cette page — un sélecteur de
 * situations (« Créer un site », « Améliorer l'existant », « Vendre en
 * ligne ») en ancres qui mènent directement au bon bloc plus bas. Oriente
 * sans enfermer, du 375 au desktop.
 */
export function OffersHeroSection({ content }: OffersHeroSectionProps) {
    return (
        <PublicHero
            images={content.images}
            contentClassName="min-h-[66svh] content-end pb-8 md:min-h-[60svh] md:pb-10 lg:min-h-[62svh]"
        >
            <div className="flex max-w-[820px] flex-col gap-4 md:gap-5">
                <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>

                <h1 className="anim-rise-2 max-w-[16ch] text-balance text-[clamp(2rem,4.8vw,3.6rem)] leading-[1.08] tracking-[-0.02em]">
                    {content.titleBefore}
                    <em className="bg-[linear-gradient(105deg,var(--color-decor-gold),var(--color-action-default))] bg-clip-text pr-1 italic text-transparent">
                        {content.titleAccent}
                    </em>
                    {content.titleAfter}
                </h1>

                <p className="anim-rise-3 max-w-[560px] text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>

                <div className="anim-rise-4">
                    <Button
                        href={content.primaryAction.href}
                        variant="primary"
                        size="lg"
                        className="shadow-[var(--glow-action)]"
                    >
                        {content.primaryAction.label}
                    </Button>
                </div>
            </div>

            <div className="anim-rise-4 flex flex-col gap-4 border-t border-[color:var(--color-border-subtle)] pt-5">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.situationsLabel}
                </p>
                <div className="flex flex-wrap gap-3">
                    {content.situations.map((situation) => (
                        <Link
                            key={situation.href}
                            href={situation.href}
                            className="focus-ring group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.42)] px-4 py-2.5 no-underline backdrop-blur-sm transition-[border-color,background-color] duration-200 ease-standard hover:border-[color:var(--color-decor-gold)]/60 hover:bg-[rgba(15,14,11,0.62)]"
                        >
                            <span className="text-body-small font-medium text-[color:var(--color-text-default)]">
                                {situation.label}
                            </span>
                            <ArrowUpRight
                                className="size-4 text-[color:var(--color-decor-gold)] transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                                aria-hidden="true"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </PublicHero>
    );
}
