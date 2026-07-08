import { ArrowDown } from "lucide-react";

import { PublicHero } from "@/components/layout";
import { Button } from "@/components/ui";
import type { MethodPageContent } from "@/content/method";

type MethodHeroSectionProps = {
    content: MethodPageContent["hero"];
};

/**
 * Héros propre à la méthode : titre display avec le mot clé en italique
 * dégradé, puis — à la place du panneau de verre générique — un rail des
 * trois temps (Clarifier · Designer · Lancer) numérotés et reliés, qui
 * annonce la timeline du parcours plus bas. Une composition unique, du
 * 375 au desktop, sans reprise du gabarit partagé.
 */
export function MethodHeroSection({ content }: MethodHeroSectionProps) {
    return (
        <PublicHero
            images={content.images}
            contentClassName="min-h-[100svh] content-end pb-6 md:pb-8 lg:pb-10"
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
                        href={content.journeyCta.href}
                        variant="ghost"
                        iconRight={<ArrowDown className="size-4" aria-hidden="true" />}
                    >
                        {content.journeyCta.label}
                    </Button>
                </div>
            </div>

            <div className="anim-rise-4 flex flex-col gap-4 border-t border-[color:var(--color-border-subtle)] pt-5">
                <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                    {content.tempsLabel}
                </p>
                <ol className="relative grid gap-5 sm:grid-cols-3 sm:gap-8">
                    <span
                        className="pointer-events-none absolute left-[11px] right-[11px] top-[11px] hidden h-px bg-[linear-gradient(90deg,var(--color-decor-gold),transparent)] sm:block"
                        aria-hidden="true"
                    />
                    {content.temps.map((temps, index) => (
                        <li
                            key={temps.verb}
                            className="relative flex gap-3 sm:flex-col sm:gap-3"
                        >
                            <span
                                className="relative z-10 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border border-[color:var(--color-decor-gold)]/55 bg-[var(--color-bg-deep)] text-caption font-semibold text-[color:var(--color-decor-gold)]"
                                aria-hidden="true"
                            >
                                {index + 1}
                            </span>
                            <span className="flex min-w-0 flex-col gap-1">
                                <span className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                                    {temps.verb}
                                </span>
                                <span className="text-body-small text-[color:var(--color-text-muted)]">
                                    {temps.summary}
                                </span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
        </PublicHero>
    );
}
