import { ArrowDown } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Button } from "@/components/ui";
import type { ProjectRequestPageContent } from "@/content/project-request";

type ProjectRequestHeroSectionProps = {
    activeHref: string;
    content: ProjectRequestPageContent["hero"];
};

/**
 * Héros du tunnel de demande — table rase, le vrai site en fond plein cadre :
 * titre display avec « même encore flou » en italique dégradé, promesse
 * d'un parcours guidé sans cahier des charges, CTA d'ancrage vers le wizard
 * et une bande de réassurance (brief imparfait accepté, budget/délai
 * indicatifs, récapitulatif avant envoi). Hauteur bornée tablette/desktop.
 */
export function ProjectRequestHeroSection({
    activeHref,
    content,
}: ProjectRequestHeroSectionProps) {
    return (
        <PublicHero
            activeHref={activeHref}
            images={content.images}
            contentClassName="min-h-[86svh] content-end pb-10 md:min-h-[62svh] md:pb-14 lg:min-h-[66svh] lg:pb-16"
        >
            <div className="flex max-w-[820px] flex-col gap-5 md:gap-7">
                <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>

                <h1 className="anim-rise-2 max-w-[18ch] text-balance text-[clamp(2.3rem,5.6vw,4.4rem)] leading-[1.06] tracking-[-0.02em]">
                    {content.titleBefore}
                    <em className="bg-[linear-gradient(105deg,var(--color-decor-gold),var(--color-action-default))] bg-clip-text pr-1 italic text-transparent">
                        {content.titleAccent}
                    </em>
                    {content.titleAfter}
                </h1>

                <p className="anim-rise-3 max-w-[600px] text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>

                <div className="anim-rise-4">
                    <Button
                        href={content.primaryAction.href}
                        variant="primary"
                        size="lg"
                        className="w-full shadow-[var(--glow-action)] sm:w-fit"
                        iconRight={<ArrowDown className="size-4" aria-hidden="true" />}
                    >
                        {content.primaryAction.label}
                    </Button>
                </div>
            </div>

            <div className="anim-rise-4 mt-8 flex flex-col gap-4 border-t border-[color:var(--color-border-subtle)] pt-6 md:mt-12">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.reassuranceLabel}
                </p>
                <ul className="grid gap-4 sm:grid-cols-3 sm:gap-8">
                    {content.reassurance.map((point) => (
                        <li
                            key={point}
                            className="flex min-w-0 items-start border-l-2 border-[color:var(--color-decor-gold)]/45 pl-4 text-body-small text-[color:var(--color-text-default)]"
                        >
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
        </PublicHero>
    );
}
