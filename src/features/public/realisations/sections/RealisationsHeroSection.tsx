import { ArrowDown } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Button } from "@/components/ui";
import type { RealisationsPageContent } from "@/content/realisations";

type RealisationsHeroSectionProps = {
    content: RealisationsPageContent["hero"];
};

/**
 * Héros propre aux réalisations : titre display avec « sans survente » en
 * italique dégradé, puis — composition unique — la légende des trois
 * natures de projet (client / démonstration / refonte), qui pose d'emblée
 * la promesse d'honnêteté avant la galerie.
 */
export function RealisationsHeroSection({
    content,
}: RealisationsHeroSectionProps) {
    return (
        <PublicHero
            images={content.images}
            contentClassName="min-h-[74svh] content-end pb-8 md:min-h-[60svh] md:pb-10 lg:min-h-[62svh]"
        >
            <div className="flex max-w-[860px] flex-col gap-5 md:gap-6">
                <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>

                <h1 className="anim-rise-2 max-w-[15ch] text-balance text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.06] tracking-[-0.02em]">
                    {content.titleBefore}
                    <em className="bg-[linear-gradient(105deg,var(--color-decor-gold),var(--color-action-default))] bg-clip-text pr-1 italic text-transparent">
                        {content.titleAccent}
                    </em>
                    {content.titleAfter}
                </h1>

                <p className="anim-rise-3 max-w-[600px] text-body text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>

                <div className="anim-rise-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                        href={content.primaryAction.href}
                        variant="primary"
                        size="lg"
                        className="shadow-[var(--glow-action)]"
                    >
                        {content.primaryAction.label}
                    </Button>
                    <Button
                        href={content.galleryCta.href}
                        variant="ghost"
                        iconRight={<ArrowDown className="size-4" aria-hidden="true" />}
                    >
                        {content.galleryCta.label}
                    </Button>
                </div>
            </div>

            <div className="anim-rise-4 flex flex-col gap-3 border-t border-[color:var(--color-border-subtle)] pt-5">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.naturesLabel}
                </p>
                <ul className="flex flex-wrap gap-2.5">
                    {content.natures.map((nature) => (
                        <li
                            key={nature}
                            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(15,14,11,0.42)] px-3.5 py-1.5 text-body-small text-[color:var(--color-text-default)] backdrop-blur-sm"
                        >
                            <span
                                className="size-1.5 rounded-full bg-[var(--color-decor-gold)]"
                                aria-hidden="true"
                            />
                            {nature}
                        </li>
                    ))}
                </ul>
            </div>
        </PublicHero>
    );
}
