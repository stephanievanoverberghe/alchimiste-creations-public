import { ChevronRight } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Breadcrumb, Button } from "@/components/ui";
import { publicRoutes } from "@/config/navigation";
import type { OfferDetailPageContent } from "@/content/offers";

type OfferDetailHeroSectionProps = {
    content: OfferDetailPageContent;
};

/**
 * Héros commun des pages détail d'offre, volontairement compact : fil
 * d'Ariane, famille, titre display, prix en badge et actions. Il pose
 * l'offre en quelques lignes et laisse la place au récit — pas de plein
 * écran. Même composition pour les 9 offres, paramétrée par le contenu.
 */
export function OfferDetailHeroSection({
    content,
}: OfferDetailHeroSectionProps) {
    const { hero } = content;

    return (
        <PublicHero
            images={hero.images}
            className="lg:min-h-0"
            contentClassName="min-h-[56svh] content-end pb-8 md:min-h-[58svh] md:pb-10 lg:min-h-[60svh]"
        >
            <div className="flex max-w-[800px] flex-col gap-4 md:gap-5">
                <Breadcrumb
                    className="anim-rise"
                    items={[
                        { href: publicRoutes.home, label: "Accueil" },
                        { href: publicRoutes.offers, label: "Offres" },
                        { label: hero.eyebrow },
                    ]}
                />

                <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.family}
                </p>

                <h1 className="anim-rise-2 max-w-[18ch] text-balance text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08] tracking-[-0.02em]">
                    {hero.title}
                </h1>

                <p className="anim-rise-3 max-w-[600px] text-body text-[color:var(--color-text-muted)]">
                    {hero.description}
                </p>

                <div className="anim-rise-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                    <span className="inline-flex w-fit items-center rounded-full border border-[color:var(--color-decor-gold)] bg-[rgba(255,243,224,0.05)] px-4 py-2 text-body-small font-semibold text-[color:var(--color-decor-gold)]">
                        {hero.price}
                    </span>
                    <Button
                        href={hero.primaryAction.href}
                        variant="primary"
                        className="shadow-[var(--glow-action)]"
                        iconRight={
                            <ChevronRight className="size-4" aria-hidden="true" />
                        }
                    >
                        {hero.primaryAction.label}
                    </Button>
                </div>
            </div>
        </PublicHero>
    );
}
