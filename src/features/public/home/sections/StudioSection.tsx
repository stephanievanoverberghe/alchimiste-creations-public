import { ArrowRight } from "lucide-react";

import { ResponsiveFillImage, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { HomePageContent } from "@/content/home";

type StudioSectionProps = {
    content: HomePageContent["studio"];
};

/**
 * Le studio, à visage humain : le portrait grand format porte le
 * positionnement (« une interlocutrice, pas une agence en silos »),
 * puis l'énoncé de posture et les trois piliers du studio. La dernière
 * section de la home : après la preuve et la méthode, la personne.
 */
export function StudioSection({ content }: StudioSectionProps) {
    return (
        <Section
            className="border-t border-[color:var(--color-border-subtle)]"
            spacing="lg"
        >
            <div className="flex max-w-[640px] flex-col gap-3">
                <p className="text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                    {content.eyebrow}
                </p>
                <h2 className="text-balance">{content.title}</h2>
                <p className="max-w-[540px] text-body-small text-[color:var(--color-text-muted)]">
                    {content.description}
                </p>
            </div>

            <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-12">
                <div className="relative isolate min-h-[440px] overflow-hidden rounded-panel border border-[color:var(--color-decor-gold)]/50 shadow-elevation-2 md:min-h-[560px]">
                    <ResponsiveFillImage
                        image={content.image}
                        sizes="(min-width: 1024px) 44vw, 100vw"
                        className="z-0 object-cover object-[50%_45%]"
                    />
                    <span
                        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(15,14,11,0)_0%,rgba(15,14,11,0.12)_38%,rgba(15,14,11,0.72)_70%,rgba(15,14,11,0.95)_100%)]"
                        aria-hidden="true"
                    />
                    <span
                        className="absolute inset-x-7 top-0 z-20 h-px bg-[linear-gradient(90deg,transparent,var(--color-decor-gold),transparent)]"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2.5 p-6 md:p-8">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-decor-gold)]">
                            {content.portrait.label}
                        </span>
                        <p className="max-w-[380px] font-[family-name:var(--font-display)] text-h3 text-[color:var(--color-text-default)]">
                            {content.portrait.title}
                        </p>
                        <p className="max-w-[400px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.portrait.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <span className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                            {content.positioning.label}
                        </span>
                        <p className="font-[family-name:var(--font-display)] text-h2 text-balance text-[color:var(--color-text-default)]">
                            {content.positioning.title}
                        </p>
                        <p className="max-w-[520px] text-body-small text-[color:var(--color-text-muted)]">
                            {content.positioning.description}
                        </p>
                    </div>

                    <ol className="flex flex-col">
                        {content.pillars.map((pillar, index) => (
                            <li
                                key={pillar.title}
                                className="flex gap-4 border-t border-[color:var(--color-border-strong)] py-4 first:border-t-0 first:pt-0"
                            >
                                <span
                                    className="font-[family-name:var(--font-display)] text-h4 italic leading-none text-[color:var(--color-decor-gold)]"
                                    aria-hidden="true"
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="flex min-w-0 flex-col gap-1">
                                    <span className="text-body-small font-semibold text-[color:var(--color-text-default)]">
                                        {pillar.title}
                                    </span>
                                    <span className="text-body-small text-[color:var(--color-text-muted)]">
                                        {pillar.description}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ol>

                    <Button
                        href={content.action.href}
                        variant="secondary"
                        size="sm"
                        iconRight={
                            <ArrowRight className="size-4" aria-hidden="true" />
                        }
                        className="w-full sm:w-fit"
                    >
                        {content.action.label}
                    </Button>
                </div>
            </div>
        </Section>
    );
}
