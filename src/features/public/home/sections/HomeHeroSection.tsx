import { ChevronRight } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Button } from "@/components/ui";
import type { HomePageContent } from "@/content/home";

type HomeHeroSectionProps = {
    content: HomePageContent["hero"];
};

/**
 * Héros plein écran de la home : image en dé-zoom lent, titre display
 * massif avec le verbe clé en italique dégradé or → cuivre, actions en
 * zone du pouce, puis la bande de sol — les 3 temps de la méthode
 * numérotés et l'indice de scroll. Une seule composition, du 375 au
 * desktop.
 */
export function HomeHeroSection({ content }: HomeHeroSectionProps) {
    return (
        <PublicHero
            images={content.images}
            contentClassName="min-h-[100svh] content-end pb-6 md:pb-8 lg:pb-10"
        >
            <div className="flex max-w-[900px] flex-col gap-5 md:gap-7">
                <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>

                <h1 className="anim-rise-2 max-w-[14ch] text-balance text-[clamp(2.6rem,7.2vw,5.6rem)] leading-[1.04] tracking-[-0.02em]">
                    {content.titleBefore}
                    <em className="bg-[linear-gradient(105deg,var(--color-decor-gold),var(--color-action-default))] bg-clip-text pr-1 italic text-transparent">
                        {content.titleAccent}
                    </em>
                    {content.titleAfter}
                </h1>

                <p className="anim-rise-3 max-w-[520px] text-body text-[color:var(--color-text-muted)]">
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
                        href={content.secondaryAction.href}
                        variant="ghost"
                        iconRight={<ChevronRight />}
                    >
                        {content.secondaryAction.label}
                    </Button>
                </div>
            </div>

            <div className="anim-rise-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-[color:var(--color-border-subtle)] pt-5">
                <ol className="flex flex-wrap gap-x-8 gap-y-3">
                    {content.proofPoints.map((proofPoint, index) => (
                        <li
                            key={proofPoint}
                            className="flex items-baseline gap-2.5"
                        >
                            <span
                                className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-body-small text-[color:var(--color-text-muted)]">
                                {proofPoint}
                            </span>
                        </li>
                    ))}
                </ol>

                <div
                    className="hidden items-center gap-3 md:flex"
                    aria-hidden="true"
                >
                    <span className="text-caption uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">
                        {content.scrollCueLabel}
                    </span>
                    <span className="relative h-8 w-px overflow-hidden rounded-full bg-[rgba(255,243,224,0.16)]">
                        <span className="absolute left-0 top-0 h-3 w-px bg-[var(--color-decor-gold)] motion-safe:animate-[cue-drop_1.8s_var(--ease-standard)_infinite]" />
                    </span>
                </div>
            </div>
        </PublicHero>
    );
}
