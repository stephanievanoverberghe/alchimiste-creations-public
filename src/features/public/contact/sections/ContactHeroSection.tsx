import { ArrowDown, ChevronRight } from "lucide-react";

import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import type { ContactPageContent } from "@/content/contact";

type ContactHeroSectionProps = {
    content: ContactPageContent["hero"];
};

/**
 * Héros du contact — typographique (aucune image de fond, PublicHero n'est
 * donc pas utilisé) : titre display avec « Écris-moi » en italique dégradé,
 * deux points d'entrée (message / demande de projet) et une bande d'attentes
 * claires (délai de réponse, interlocutrice unique, sans engagement) pour
 * rassurer avant d'écrire.
 */
export function ContactHeroSection({ content }: ContactHeroSectionProps) {
    return (
        <Section
            spacing="none"
            className="relative overflow-hidden border-b border-[color:var(--color-border-subtle)] bg-[radial-gradient(circle_at_18%_-12%,rgba(255,232,184,0.08),transparent_44%),var(--color-bg-main)]"
        >
            <Container className="pt-28 pb-12 md:pt-32 md:pb-14 lg:pt-36 lg:pb-16">
                <div className="flex max-w-[820px] flex-col gap-5 md:gap-7">
                    <p className="anim-rise text-label uppercase tracking-[0.18em] text-[color:var(--color-decor-gold)]">
                        {content.eyebrow}
                    </p>

                    <h1 className="anim-rise-2 max-w-[16ch] text-balance text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.06] tracking-[-0.02em]">
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
                            iconRight={<ArrowDown className="size-4" aria-hidden="true" />}
                        >
                            {content.primaryAction.label}
                        </Button>
                        <Button
                            href={content.secondaryAction.href}
                            variant="ghost"
                            iconRight={
                                <ChevronRight className="size-4" aria-hidden="true" />
                            }
                        >
                            {content.secondaryAction.label}
                        </Button>
                    </div>
                </div>

                <div className="anim-rise-4 mt-8 flex flex-col gap-4 border-t border-[color:var(--color-border-subtle)] pt-6 md:mt-12">
                    <p className="text-caption uppercase tracking-[0.14em] text-[color:var(--color-text-subtle)]">
                        {content.expectationsLabel}
                    </p>
                    <dl className="grid gap-4 sm:grid-cols-3 sm:gap-8">
                        {content.expectations.map((item) => (
                            <div
                                key={item.title}
                                className="flex min-w-0 flex-col gap-1 border-l-2 border-[color:var(--color-decor-gold)]/45 pl-4"
                            >
                                <dt className="font-[family-name:var(--font-display)] text-h4 text-[color:var(--color-text-default)]">
                                    {item.title}
                                </dt>
                                <dd className="text-body-small text-[color:var(--color-text-muted)]">
                                    {item.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Container>
        </Section>
    );
}
