import { ArrowDown } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Button } from "@/components/ui";
import type { AboutPageContent } from "@/content/about";

type AboutHeroSectionProps = {
    content: AboutPageContent["hero"];
};

/**
 * Héros propre à l'à-propos : titre display avec « une seule personne »
 * en italique dégradé, puis — à la place d'un panneau générique — la
 * carte d'identité du studio en trois repères (fondatrice, format,
 * fil conducteur). Une composition unique, du 375 au desktop.
 */
export function AboutHeroSection({ content }: AboutHeroSectionProps) {
    return (
        <PublicHero
            images={content.images}
            contentClassName="min-h-[94svh] content-end pb-6 md:min-h-[64svh] md:pb-8 lg:min-h-[66svh] lg:pb-10"
        >
            <div className="flex max-w-[860px] flex-col gap-5 md:gap-7">
                <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>

                <h1 className="anim-rise-2 max-w-[16ch] text-balance text-[clamp(2.4rem,6.2vw,4.8rem)] leading-[1.06] tracking-[-0.02em]">
                    {content.titleBefore}
                    <em className="bg-[linear-gradient(105deg,var(--color-decor-gold),var(--color-action-default))] bg-clip-text pr-1 italic text-transparent">
                        {content.titleAccent}
                    </em>
                    {content.titleAfter}
                </h1>

                <p className="anim-rise-3 max-w-[560px] text-body text-[color:var(--color-text-muted)]">
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
                        href={content.meetCta.href}
                        variant="ghost"
                        iconRight={<ArrowDown className="size-4" aria-hidden="true" />}
                    >
                        {content.meetCta.label}
                    </Button>
                </div>
            </div>

            <div className="anim-rise-4 flex flex-col gap-4 border-t border-[color:var(--color-border-subtle)] pt-5">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.reperesLabel}
                </p>
                <dl className="grid gap-4 sm:grid-cols-3 sm:gap-8">
                    {content.reperes.map((repere) => (
                        <div
                            key={repere.label}
                            className="flex min-w-0 flex-col gap-1 border-l-2 border-[color:var(--color-decor-gold)]/45 pl-4"
                        >
                            <dt className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                                {repere.label}
                            </dt>
                            <dd className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                                {repere.title}
                            </dd>
                            <dd className="text-body-small text-[color:var(--color-text-muted)]">
                                {repere.description}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </PublicHero>
    );
}
